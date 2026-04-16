// src/lostark-build.js — 로스트아크 데이터 가공 (카카오링크 templateArgs 빌드)

import { getCharacterImage } from './lostark-api.js';

function tooltipToJSON(s) {
  try {
    const obj = JSON.parse(s);
    return Object.keys(obj).sort()
      .filter(k => k.startsWith('Element_'))
      .map(k => obj[k])
      .filter(Boolean);
  } catch { return []; }
}

// 카카오링크 templateArgs 빌드 (전송은 모바일에서 담당)
export async function buildCharacterInfo(data) {
  const profile = data['ArmoryProfile'];
  const equipment = data['ArmoryEquipment'] || [];
  const engraving = data['ArmoryEngraving'];
  const gem = data['ArmoryGem'];
  const card = data['ArmoryCard'];
  const arkPassive = data['ArkPassive'];

  const name = profile['CharacterName'];
  const itemLevel = profile['ItemAvgLevel'];
  const expLevel = profile['ExpeditionLevel'];
  const charLevel = profile['CharacterLevel'];
  const className = profile['CharacterClassName'];
  const server = profile['ServerName'];
  const combatPower = profile['CombatPower'];
  const isArkPassive = arkPassive['IsArkPassive'];
  const templateId = isArkPassive ? 110730 : 110687;

  // 무기 강화
  let weapon = '';
  for (const eq of equipment) {
    if (eq['Type'] === '무기') {
      weapon += eq['Name'].slice(1, 3);
      const tips = tooltipToJSON(eq['Tooltip']);
      for (const t of tips) {
        if (t['type']?.includes('SingleTextBox') && t['value']?.includes('상급 재련')) {
          const v = t['value'].replace(/[^\d]*(\d+)[^\d]*/g, '$1').slice(0, 2);
          weapon += `(${v})`;
        }
      }
      break;
    }
  }

  // 평균 품질
  let totalQ = 0, countQ = 0;
  for (const eq of equipment) {
    for (const t of tooltipToJSON(eq['Tooltip'])) {
      if (t['type']?.includes('ItemTitle') && t['value']?.qualityValue >= 0) {
        totalQ += t['value']['qualityValue']; countQ++;
      }
    }
  }
  const avgQuality = countQ ? Math.round(totalQ / countQ * 10) / 10 : 0;

  // 초월
  let transTotal = 0;
  for (const eq of equipment) {
    for (const t of tooltipToJSON(eq['Tooltip'])) {
      if (t['type']?.includes('IndentStringGroup') && t['value']) {
        const top = t['value']['Element_000']?.topStr;
        if (top?.includes('초월')) transTotal += parseInt(top.replace(/.*?(\d+)\D*$/, '$1')) || 0;
      }
    }
  }

  // 엘릭서
  let elixir = '';
  for (const eq of equipment) {
    if (eq['Type'] === '투구') {
      for (const t of tooltipToJSON(eq['Tooltip'])) {
        if (t['type']?.includes('IndentStringGroup') && t['value']) {
          const top = t['value']['Element_000']?.topStr;
          if (top?.includes('연성')) {
            elixir += top.replace(/연성 추가 효과\s*/g, '').replace(/\((\d+)단계\)/g, 'Lv.$1');
          }
        }
      }
    }
  }

  // 각인
  let engravings = '';
  if (isArkPassive) {
    const effects = engraving?.['ArkPassiveEffects'];
    if (!effects) {
      engravings = '미설정';
    } else {
      let stone = '/ ';
      for (const e of effects) {
        const n = e['Name'].slice(0, 1);
        const lv = e['Level'];
        let gr = e['Grade'] === '전설' ? '전' : e['Grade'] === '영웅' ? '영' : '';
        engravings += `${n}${gr}${lv} `;
        if (e['AbilityStoneLevel'] != null) stone += `${n}${e['AbilityStoneLevel']} `;
      }
      engravings += stone;
    }
  } else {
    for (const e of (engraving?.['Effects'] || [])) {
      engravings += e['Name'].slice(0, 1) + e['Name'].slice(-1) + ' ';
    }
  }

  // 스톤 공증
  let stoneAtk = '+';
  for (const eq of equipment) {
    if (eq['Type'] === '어빌리티 스톤') {
      for (const t of tooltipToJSON(eq['Tooltip'])) {
        if (t['type']?.includes('IndentStringGroup') && typeof t['value'] === 'object' && t['value']?.['Element_001']) {
          const c = t['value']['Element_001']['contentStr'];
          if (c?.['Element_003']) stoneAtk += c['Element_003']['contentStr'].slice(-6);
          else stoneAtk = '%';
        }
      }
    }
  }

  // 보석
  let gems4 = '', gemsDesc = '공증:';
  const gemList = gem?.['Gems'];
  if (!gemList) {
    gems4 = '쌀';
    gemsDesc = stoneAtk.length > 2 ? `공증:${stoneAtk.slice(1)}` : '';
  } else {
    const gDesc = gem?.['Effects']?.['Description'] || '';
    gemsDesc += gDesc.slice(-6, -2) + stoneAtk;
    const dmg = [], cool = [];
    for (const g of gemList) {
      const n = g['Name'], lv = g['Level'];
      if (n.includes('광휘') || n.includes('겁화')) dmg.push(lv);
      else if (n.includes('멸화')) dmg.push(lv - 2);
      else if (n.includes('작열')) cool.push(lv);
      else if (n.includes('홍염')) cool.push(lv - 2);
    }
    dmg.sort((a, b) => b - a); cool.sort((a, b) => b - a);
    gems4 = `${dmg.join(', ')} / ${cool.join(', ')}`;
  }

  // 스탯
  let maxHp = '', atk = '', charStat = '';
  for (const s of (profile['Stats'] || [])) {
    if (s['Type'] === '최대 생명력') maxHp = s['Value'];
    else if (s['Type'] === '공격력') atk = s['Value'];
    else if (parseInt(s['Value']) >= 100) charStat += `${s['Type']} ${s['Value']} `;
  }
  const evName = arkPassive['Points'][0]['Name'].slice(0, 1);
  const evVal = arkPassive['Points'][0]['Value'];
  const rlName = arkPassive['Points'][1]['Name'].slice(0, 1);
  const rlVal = arkPassive['Points'][1]['Value'];
  const stats = `공: ${atk} 최생: ${maxHp}\n${evName}: ${evVal} ${rlName}: ${rlVal} `;

  // 카드
  const cardItems = card?.['Effects']?.[0]?.['Items'] || [];
  const cardEffect = cardItems.length ? cardItems[cardItems.length - 1]['Name'] : '';

  const title = `${itemLevel} / ${weapon}\n${expLevel} / ${charLevel} / ${avgQuality}`;
  const description = `${className} / ${server} / ${elixir} / 초월(${transTotal})`;
  const imageUrl = await getCharacterImage(name);
  const imageString = imageUrl.replace('https://img.lostark.co.kr/armory/', '');

  return {
    __kakaolink: {
      templateId,
      templateArgs: {
        header: name,
        title,
        engravings,
        gems4,
        combatPower,
        stat: stats + gemsDesc,
        character: charStat,
        description,
        card: cardEffect,
        illoa: name,
        image: imageUrl,
        imageurl: imageString,
      },
    },
  };
}
