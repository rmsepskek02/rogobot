// src/lostark-build.js — 로스트아크 데이터 가공

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

// API 응답 문자열에서 HTML 태그 제거 (<br> → \n 변환 후 나머지 태그 제거)
function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
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
  const description = `${className} / ${server}`;
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

// 아이템 레벨별 주급 골드 룩업 테이블 — [최소레벨, 골드] 내림차순 정렬
const GOLD_TABLE = [
  [1740, 52000 + 42000 + 54000],
  [1730, 52000 + 42000 + 44000],
  [1720, 42000 + 40000 + 35000],
  [1710, 40000 + 33000 + 35000],
  [1700, 27000 + 33000 + 23000],
  [1690, 23000 + 21000 + 18000],
  [1680, 21000 + 18000 + 16500],
  [1670, 16500 + 11500 + 8800],
  [1660, 11500 + 7200 + 6100],
  [1640, 7200 + 6100],
];

// ── !배럭/부캐 — 배럭 목록 + 주급 계산 ──
export function buildCharacters(data) {
  if (!data || !data.length) return '캐릭터를 찾을 수 없습니다.';

  const sorted = [...data].sort((a, b) => {
    const x = parseFloat(a.ItemAvgLevel.replace(/,/g, ''));
    const y = parseFloat(b.ItemAvgLevel.replace(/,/g, ''));
    return y - x;
  });

  const mainServer = sorted[0].ServerName;
  let gold = 0;
  let out = `[${mainServer}]\n`;
  let mainCount = 0;

  for (const ch of sorted) {
    if (ch.ServerName !== mainServer) continue;
    const lv = parseInt(ch.ItemAvgLevel.replace(/,/g, ''), 10);
    const entry = GOLD_TABLE.find(([min]) => lv >= min);
    if (entry) gold += entry[1];
    out += `Lv${ch.ItemAvgLevel.replace(/,/g, '')} [${ch.CharacterClassName.substring(0, 2)}] ${ch.CharacterName}\n`;
    mainCount++;
    if (mainCount === 6) out += `●주급 [${gold}G]\n` + '\u200b'.repeat(500) + '\n';
  }

  return out.trimEnd();
}

// ── !보석 — 보석 정보 ──
export function buildGems(data) {
  if (!data || !data.Gems || !data.Gems.length) return '쌀';

  const gems = data.Gems;
  const skills = data.Effects?.Skills || [];

  const pairs = gems.map(gem => {
    const effect = skills.find(s => s.GemSlot === gem.Slot);
    const name = stripHtml(gem.Name)
      .replace(/의 보석/g, '')
      .replace(/레벨\s*/g, '')
      .replace(/\(귀속\)/g, '')
      .replace(/10 /g, '10')
      .replace(/\s+/g, ' ')
      .trim();
    return { level: gem.Level, name, skill: effect?.Name || '' };
  });

  pairs.sort((a, b) => b.level - a.level);
  return pairs.map(p => [p.name, p.skill].filter(Boolean).join(' ')).join('\n');
}

// ── !스킬 — 스킬 정보 ──
export function buildSkills(data) {
  if (!data || !Array.isArray(data) || !data.length) return '평타맨';

  const runed = data.filter(s => s.Rune != null);
  runed.sort((a, b) => parseInt(b.Level) - parseInt(a.Level));

  let out = '';
  for (const sk of runed) {
    out += `Lv${sk.Level} [${sk.Rune.Grade}${sk.Rune.Name}] [${sk.Name}]\n   `;
    for (const tri of (sk.Tripods || [])) {
      if (tri.IsSelected) {
        const parts = tri.Name.split(' ');
        out += parts.length < 2 ? parts[0].slice(0, 2) : parts.map(p => p.slice(0, 1)).join('');
        out += ' ';
      }
    }
    out += '\n';
  }
  return out.slice(0, -2);
}

// ── !장비 — 장비 정보 (엘릭서/초월 제거) ──
export function buildEquipment(data) {
  const equipment = data.ArmoryEquipment || [];
  const parts = ['무기', '투구', '상의', '하의', '장갑', '어깨'];
  let out = '';
  let totalQ = 0;

  for (const partType of parts) {
    const eq = equipment.find(e => e.Type === partType);
    if (!eq) { out += `${partType}: 없음\n`; continue; }

    const tips = tooltipToJSON(eq.Tooltip);
    let name2 = '', enhancement = '00', setName = '', quality = 0;

    for (const t of tips) {
      if (t.type === 'NameTagBox') {
        // "+23 운명의 전율 ..." 형식에서 강화 수치 추출 (+ 기호 제외)
        const clean = stripHtml(t.value || '');
        const m = clean.match(/^\+(\d+)/);
        if (m) name2 = m[1];
      }
      if (t.type === 'SingleTextBox') {
        // 상급 재련 수치 파싱
        const clean = stripHtml(t.value || '');
        const m = clean.match(/상급 재련\D*?(\d+)\s*단계/);
        if (m) enhancement = m[1].padStart(2, '0');
      }
      if (t.type === 'ItemPartBox' && t.value?.Element_000?.includes('세트')) {
        const set = stripHtml(t.value.Element_001 || '').substring(0, 2);
        setName = set === '장착' ? '짱쎔' : set;
      }
      if (t.type === 'ItemTitle' && t.value?.qualityValue !== undefined) {
        quality = t.value.qualityValue;
      }
    }

    totalQ += quality;
    out += `${partType}: ${name2}[${enhancement}] ${setName}(${quality})\n`;
  }

  const avgQ = Math.round(totalQ / 6 * 10) / 10;
  out += `평균 품질: ${avgQ}`;
  return out.trimEnd();
}

// 악세 연마 효과 약어 치환 맵 — [정규식 패턴, 치환 문자열] 순서 중요
const POLISHING_ABBR = [
  [/추가 피해 \+/g, '\n추피 '],
  [/적에게 주는 피해 \+/g, '\n적주피 '],
  [/무기 공격력 \+/g, '\n무공 '],
  [/세레나데, 신앙, 조화 게이지 획득량 \+/g, '\n아획량 '],
  [/최대 생명력 \+/g, '\n최생 '],
  [/최대 마나 \+/g, '\n최마 '],
  [/상태이상 공격 지속시간 \+/g, '\n상공지 '],
  [/전투 중 생명력 회복량 \+/g, '\n생회 '],
  [/파티원 회복 효과 \+/g, '\n파회 '],
  [/파티원 보호막 효과 \+/g, '\n파보 '],
  [/치명타 적중률 \+/g, '\n치적 '],
  [/치명타 피해 \+/g, '\n치피 '],
  [/아군 공격력 강화 효과 \+/g, '\n아공 '],
  [/아군 피해량 강화 효과 \+/g, '\n아피 '],
  [/공격력 \+/g, '\n공격력 '],
  [/낙인력 \+/g, '\n낙인력 '],
];

// ── 악세 개별 파싱 헬퍼 ──
function parsePolishing(str) {
  let result = stripHtml(str);
  for (const [from, to] of POLISHING_ABBR) result = result.replace(from, to);

  const gradeMap = {
    '최생': ['6500', '3250', '1300'],
    '공격력': ['390', '195', '80'],
    '무공': ['960', '480', '195'],
    '최마': ['30', '15', '6'],
    '상공지': ['1.0', '0.5', '0.2'],
    '생회': ['50', '25', '10'],
    '추피': ['2.6', '1.6', '0.7'],
    '적주피': ['2.0', '1.2', '0.55'],
    '아획량': ['6.0', '3.6', '1.6'],
    '낙인력': ['8.0', '4.8', '2.15'],
    '치적': ['1.55', '0.9', '0.4'],
    '치피': ['4.0', '2.4', '1.1'],
    '아공': ['5.0', '3.0', '1.35'],
    '아피': ['7.5', '4.5', '2'],
    '파회': ['3.5', '2.1', '0.95'],
    '파보': ['3.5', '2.1', '0.95'],
  };

  let out = '';
  for (const line of result.split('\n')) {
    if (!line.trim()) continue;
    let matched = false;

    // 무기 공격력 % 특수 처리 — flat 기준값(960/480/195)과 별도로 등급 판별
    if (line.includes('무공') && line.includes('%')) {
      if (line.includes('3.00%') || line.includes('3.0%')) out += '\n[상] ' + line;
      else if (line.includes('1.80%') || line.includes('1.8%')) out += '\n[중] ' + line;
      else if (line.includes('0.80%') || line.includes('0.8%')) out += '\n[하] ' + line;
      else out += '\n' + line;
      matched = true;
    }

    if (!matched) {
      for (const [key, vals] of Object.entries(gradeMap)) {
        if (line.includes(key)) {
          if (line.includes(vals[0])) out += '\n[상] ' + line;
          else if (line.includes(vals[1])) out += '\n[중] ' + line;
          else if (line.includes(vals[2])) out += '\n[하] ' + line;
          else out += '\n' + line;
          matched = true;
          break;
        }
      }
    }
    if (!matched) out += '\n' + line;
  }
  return out;
}

function parseAccePiece(eq, type, isArkPassive) {
  const tips = tooltipToJSON(eq.Tooltip);
  let out = '';

  for (const t of tips) {
    if (t.type === 'ItemTitle' && t.value) {
      const lStr = stripHtml(t.value.leftStr0 || '');
      if (type === '팔찌') {
        out += '\n\n' + lStr; // 포인트 추가 후 Loop 4가 \n으로 시작하므로 trailing \n 없음
      } else {
        out += '\n - ' + lStr;
      }
    }
    if (t.type === 'IndentStringGroup' && t.value?.Element_000?.contentStr) {
      try {
        const cs = t.value.Element_000.contentStr;
        const e00 = stripHtml(cs.Element_000?.contentStr || '');
        const e01 = stripHtml(cs.Element_001?.contentStr || '');
        const e1 = e00.slice(1, 2);
        const e2 = e00.slice(e00.length - 3, e00.length - 1).trim();
        const e3 = e01.slice(1, 2);
        const e4 = e01.slice(e01.length - 3, e01.length - 1).trim();
        out += ` ${e1}${e2} ${e3}${e4} `;
      } catch {}
    }
  }

  if (!isArkPassive) {
    for (const t of tips) {
      if (t.type === 'ItemPartBox' && t.value?.Element_000 === '추가 효과') {
        let cha = stripHtml(t.value.Element_001 || '')
          .replace(/치명 /g, '치').replace(/특화 /g, '특').replace(/신속 /g, '신')
          .replace(/제압 /g, '제').replace(/인내 /g, '인').replace(/숙련 /g, '숙');
        out += cha;
      }
    }
  }

  // 품질값, 아크패시브 포인트 사전 수집
  let qVal = 0, ptName = '', ptVal = '';
  for (const t of tips) {
    if (t.type === 'ItemTitle') qVal = t.value?.qualityValue ?? 0;
    if (isArkPassive && t.type === 'ItemPartBox' && t.value?.Element_000?.includes('포인트')) {
      const m = stripHtml(t.value.Element_001 || '').match(/(\S+)\s+\+?(\d+)/);
      if (m) { ptName = m[1]; ptVal = m[2]; }
    }
  }

  if (type === '팔찌') {
    // 팔찌: 포인트를 이름 줄에 인라인 추가 (팔찌 효과는 Loop 4에서 \n으로 시작)
    if (ptVal) out += ` ${ptName}:${ptVal}`;
  } else if (type !== '어빌리티 스톤') {
    // 목걸이/귀걸이/반지: 품질 + 깨달음 포인트
    out += isArkPassive && ptVal ? `(${qVal}) 깨:${ptVal}` : `(${qVal})`;
    // 연마 효과
    for (const t of tips) {
      if (t.type === 'ItemPartBox' && t.value?.Element_000?.includes('연마')) {
        out += parsePolishing(t.value.Element_001 || '');
      }
    }
  }

  if (type === '팔찌') {
    for (const t of tips) {
      // Element_000이 HTML 태그로 감싸진 '팔찌 효과' 문자열일 수 있으므로 includes로 비교
      if (t.type === 'ItemPartBox' && t.value?.Element_000?.includes('팔찌 효과')) {
        // stripHtml이 <br> → \n 변환을 처리하므로, \n으로 줄을 나눠 빈 줄 제거 후 각 줄 앞에 \n 추가
        const lines = stripHtml(t.value.Element_001 || '').split('\n').filter(l => l.trim());
        for (const line of lines) out += '\n' + line;
      }
    }
  }

  return out;
}

// ── !악세 — 악세 정보 ──
export function buildAccessories(data) {
  const equipment = data.ArmoryEquipment || [];
  const engraving = data.ArmoryEngraving;
  const isArkPassive = data.ArkPassive?.IsArkPassive || false;

  let out = '';
  let totalQ = 0, countQ = 0;

  for (const eq of equipment) {
    if (['목걸이', '귀걸이', '반지'].includes(eq.Type)) {
      for (const t of tooltipToJSON(eq.Tooltip)) {
        if (t.type === 'ItemTitle' && t.value?.qualityValue > 0) {
          totalQ += t.value.qualityValue; countQ++;
        }
      }
    }
  }
  out += ` ● 평균 품질: ${countQ ? Math.round(totalQ / countQ * 10) / 10 : 0}`;

  if (!isArkPassive && engraving?.Engravings) {
    out += '\n';
    try {
      for (const eng of engraving.Engravings) {
        for (const t of tooltipToJSON(eng.Tooltip)) {
          if (t.type === 'NameTagBox') out += t.value + ' ';
          if (t.type === 'EngraveSkillTitle') out += (t.value?.leftText?.split('+')[1] || '') + ' ';
        }
      }
    } catch {}
    out += '\n';
  }

  for (const partType of ['목걸이', '귀걸이', '반지', '어빌리티 스톤', '팔찌']) {
    for (const eq of equipment.filter(e => e.Type === partType)) {
      out += parseAccePiece(eq, partType, isArkPassive);
    }
  }

  return out.replace(/\+/g, '');
}

// ── !각인 — 각인 상세 ──
export function buildEngravings(data) {
  const engraving = data.ArmoryEngraving;
  const isArkPassive = data.ArkPassive?.IsArkPassive || false;
  if (!engraving) return '응애';

  let out = '';
  if (!isArkPassive) {
    for (const e of (engraving.Effects || [])) out += e.Name + '\n';
  } else {
    for (const e of (engraving.ArkPassiveEffects || [])) {
      out += `[${e.Grade}] ${e.Name}Lv.${e.Level}\n`;
    }
    out += '\n스톤\n';
    for (const e of (engraving.ArkPassiveEffects || [])) {
      if (e.AbilityStoneLevel != null) out += `${e.Name}Lv.${e.AbilityStoneLevel}\n`;
    }
  }
  return out.trimEnd();
}

// ── !앜패 — 아크패시브 ──
export function buildArkPassive(data) {
  const arkPassive = data.ArkPassive;
  if (!arkPassive?.IsArkPassive) return '3티어!!';

  const points = arkPassive.Points || [];
  const effects = arkPassive.Effects || [];

  let temp = '';
  for (const p of points) temp += `${p.Name}[${p.Value}] `;
  temp += '\n\n[진화]\n';
  for (const e of effects) { if (e.Name === '진화') temp += stripHtml(e.Description) + '\n'; }
  temp += '[깨달음]\n';
  for (const e of effects) { if (e.Name === '깨달음') temp += stripHtml(e.Description) + '\n'; }
  temp += '[도약]\n';
  for (const e of effects) { if (e.Name === '도약') temp += stripHtml(e.Description) + '\n'; }

  return temp
    .replace(/깨달음 /g, ' - ')
    .replace(/진화 /g, ' - ')
    .replace(/도약 /g, ' - ')
    .trimEnd();
}

// ── !아크 — 아크그리드 ──
function parseCoreInfo(coreName, corePoint, coreGrade) {
  try {
    const parts = coreName.split(' : ');
    if (parts.length >= 2) {
      return `[${coreGrade}]${parts[0].replace(' 코어', '')} : ${parts[1]} ${corePoint}P`;
    }
  } catch {}
  return `${coreName} ${corePoint}P`;
}

export function buildArkGrid(data) {
  const arkGrid = data.ArkGrid;
  if (!arkGrid) return '조빱!!!';

  let out = '[코어]\n';
  for (const slot of (arkGrid.Slots || [])) {
    out += parseCoreInfo(slot.Name, slot.Point, slot.Grade) + '\n';
  }
  out += '\n[젬]\n';
  for (const ef of (arkGrid.Effects || [])) {
    out += `Lv.${ef.Level} ${stripHtml(ef.Tooltip)}`
      .replace('아군 피해량 강화 효과', '아피강')
      .replace('아군 공격력 강화 효과', '아공강')
      .replace('보스 등급 이상 몬스터에게 주는 피해', '보스 피해') + '\n';
  }
  return out.trimEnd();
}

// 수집품 이름 약어 치환 맵
const COLLECTIBLE_NAMES = {
  '모코코 씨앗': '모코코',
  '섬의 마음': '섬마',
  '위대한 미술품': '\n미술품',
  '거인의 심장': '거심',
  '이그네아의 징표': '\n이그네아',
  '항해 모험물': '모험물',
  '세계수의 잎': '\n세계수',
  '오르페우스의 별': '별',
  '기억의 오르골': '\n오르골',
  '크림스네일의 해도': '해도',
};

// ── !내실 — 내실 (수집품/성향/스포) ──
export function buildCollectibles(profileData, collectiblesData) {
  if (!profileData || !collectiblesData) return '응애';

  let out = `템/원/전/영: ${profileData.ItemAvgLevel.slice(0, -3)}/${profileData.ExpeditionLevel}/${profileData.CharacterLevel}/${profileData.TownLevel}`;
  out += `\n스포: ${profileData.UsingSkillPoint} / ${profileData.TotalSkillPoint}\n`;
  out += '\n< 성향 >\n';
  for (let i = 0; i < (profileData.Tendencies || []).length; i++) {
    out += `${profileData.Tendencies[i].Type}: ${profileData.Tendencies[i].Point} `;
    if (i === 1) out += '\n';
  }
  out += '\n\n< 수집품 >\n';
  for (const c of (collectiblesData || [])) out += `${c.Type}: ${c.Point} `;

  for (const [from, to] of Object.entries(COLLECTIBLE_NAMES)) out = out.replace(from, to);
  return out.trimEnd();
}

// ── !낙원 — 낙원력 (charEquipMap: 삽입 순서 보장, mainName 첫 번째) ──
function getCharParadisePower(equipJSON) {
  const result = { hasBouju: false, paradisePower: '0' };
  if (!equipJSON) return result;

  for (const eq of (equipJSON.ArmoryEquipment || [])) {
    if (eq.Type !== '보주') continue;
    result.hasBouju = true;
    try {
      const obj = JSON.parse(eq.Tooltip);
      const el004 = obj['Element_004'];
      if (el004?.value?.Element_001) {
        const m = el004.value.Element_001.match(/낙원력\s*:\s*(\d+)/);
        if (m) result.paradisePower = parseInt(m[1]).toLocaleString('ko-KR');
      }
    } catch {}
    break;
  }
  return result;
}

export function buildParadisePower(charEquipMap, mainName) {
  let result = '';
  let i = 0;

  for (const [name, equipData] of Object.entries(charEquipMap)) {
    const p = getCharParadisePower(equipData);
    const line = p.hasBouju ? `${name}: ${p.paradisePower}\n` : `${name}: 보주 미착용\n`;

    if (name === mainName) {
      result += line + '\n▼ 원정대 전체보기\n';
    } else {
      if (i === 5) result += '\u200b'.repeat(500);
      result += line;
      i++;
    }
  }

  return result.trimEnd();
}

// ── !섬 — 쌀 섬 일정 ──
export function buildIsland(data) {
  if (!data || !Array.isArray(data)) return '없음';

  const goldIslands = [];
  const processed = {};

  for (const item of data) {
    if (item.CategoryName !== '모험 섬') continue;
    const items = item.RewardItems?.[0]?.Items || [];
    for (const ri of items) {
      if (!ri.Name?.includes('골드')) continue;
      for (const st of (ri.StartTimes || [])) {
        const [datePart, timePart] = st.split('T');
        const startHour = parseInt(timePart.split(':')[0], 10);
        const dateObj = new Date(datePart);
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const uniqueKey = `${item.ContentsName}_${datePart}`;
        if (!processed[uniqueKey]) {
          goldIslands.push({
            displayDate: `${month}.${day}`,
            timeLabel: isWeekend ? (startHour < 15 ? '오전' : '오후') : 'ㅡㅡ',
            islandName: item.ContentsName,
            sortKey: `${datePart}_${isWeekend ? (startHour < 15 ? '1' : '2') : '0'}`,
          });
          processed[uniqueKey] = true;
        }
      }
    }
  }

  if (!goldIslands.length) return '없음';
  goldIslands.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return '<쌀 섬 일정표>\n' + goldIslands.map(i => `${i.displayDate} ${i.timeLabel} ${i.islandName}`).join('\n');
}

// ── !유각 — 유각 가격 ──
export function buildEngravis(data1, data2) {
  if (!data1 || !data2) return '장사안함';
  let out = '전날평균가 / 최저가 / 이름\n';
  for (const item of (data1.Items || [])) {
    out += `${Math.round(item.YDayAvgPrice)} / ${item.CurrentMinPrice} / ${item.Name}\n`;
  }
  const items2 = data2.Items || [];
  for (let i = 0; i < Math.ceil(items2.length / 2); i++) {
    out += `${Math.round(items2[i].YDayAvgPrice)} / ${items2[i].CurrentMinPrice} / ${items2[i].Name}\n`;
  }
  return out.trimEnd().replace(/ 각인서/g, '').replace(/유물 /g, '');
}

// ── !서폿유각 — 서폿 유각 가격 ──
export function buildEngravisForSupport(dataArr) {
  if (!dataArr || dataArr.some(d => !d)) return '장사안함';
  let out = '전날평균가 / 최저가 / 이름\n';
  for (const d of dataArr) {
    for (const item of (d.Items || [])) {
      out += `${Math.round(item.YDayAvgPrice)} / ${item.CurrentMinPrice} / ${item.Name}\n`;
    }
  }
  return out.trimEnd().replace(/ 각인서/g, '').replace(/유물 /g, '');
}

// ── !ㅇㄱㄹ — 에기르 재료 가격 ──
export function buildEgir(dataArr) {
  if (!dataArr || dataArr.some(d => !d)) return '장사안함';
  let out = '전날평균가 / 최저가 / 이름\n';
  for (let i = 0; i < dataArr.length; i++) {
    for (const item of (dataArr[i].Items || [])) {
      if ((i === 6 || i === 7) && item.Name.includes('11')) continue;
      // 장인의 야금술/재봉술 1·2단계 제외
      if ((i === 4 || i === 5) && (item.Name.includes('1단계') || item.Name.includes('2단계'))) continue;
      // 업화 [15-18] 제외
      if ((i === 6 || i === 7) && item.Name.includes('15-18')) continue;
      let name = item.Name;
      if (i === 8 || i === 9) name = name.replace(/\[일품\] 명인의 /g, '');
      if (i === 10) name = name.replace(/\[일품\] 거장의 /g, '');
      out += `${Math.round(item.YDayAvgPrice)} / ${item.CurrentMinPrice} / ${name}\n`;
    }
  }
  return out.trimEnd();
}

// ── !젬가격 — 젬 가격 ──
export function buildGemPrice(data1, data2) {
  if (!data1 || !data2) return '장사안함';
  let out = '등급 이름 / 전날평균가 / 최저가\n';
  for (const item of [...(data1.Items || []), ...(data2.Items || [])]) {
    if (item.Grade === '고급') continue; // 고급 등급 제외
    out += `${item.Grade} ${item.Name} / ${Math.round(item.YDayAvgPrice)} / ${item.CurrentMinPrice}\n`;
  }
  return out.trimEnd().replace(/의 젬/g, '');
}

// ── !보석가격 — 보석 즉구 최저가 ──
export function buildGemBuyPrice(dataArr) {
  if (!dataArr || dataArr.some(d => !d)) return '장사안함';
  let out = '<보석 즉구 최저가>\n';
  for (const d of dataArr) {
    const items = d.Items || [];
    if (!items.length) continue;
    out += `${items[0].Name} : ${items[0].AuctionInfo?.BuyPrice}\n`;
  }
  return out.trimEnd().replace(/의 보석/g, '');
}

// ── !가격 — 거래소 검색 파라미터 생성 ──
export function makeMarketParam(command) {
  let categoryCode = 40000, itemGrade = '', characterClass = '', sortCondition = '';

  const catMap = [
    ['아바타', 20000], ['각인', 40000], ['재료', 50000], ['배템', 60000],
    ['요리', 70000], ['생활', 90000], ['모험', 100000], ['항해', 110000],
    ['펫', 140000], ['탈것', 160000], ['기타', 170000],
  ];
  for (const [k, v] of catMap) { if (command.includes(k)) { categoryCode = v; break; } }

  for (const g of ['일반', '고급', '희귀', '영웅', '전설', '유물', '고대', '에스더']) {
    if (command.includes(g)) { itemGrade = g; break; }
  }

  const classMap = [
    ['버서커', '버서커'], ['디트', '디스트로이어'], ['인파', '인파이터'],
    ['기공', '기공사'], ['창술', '창술사'], ['스커', '스트라이커'],
    ['블레', '블레이드'], ['데모닉', '데모닉'], ['리퍼', '리퍼'],
    ['호크', '호크아이'], ['데헌', '데빌헌터'], ['블래', '블래스터'],
    ['워로드', '워로드'], ['스카', '스카우터'], ['건슬', '건슬링어'],
    ['도화가', '도화가'], ['기상', '기상술사'], ['홀나', '홀리나이트'],
    ['슬레', '슬레이어'], ['알카', '아르카나'], ['서머너', '서머너'],
    ['바드', '바드'], ['소서', '소서리스'], ['배마', '배틀마스터'],
  ];
  for (const [k, v] of classMap) { if (command.includes(k)) { characterClass = v; break; } }

  if (command.includes('높은순')) sortCondition = 'DESC';
  else if (command.includes('낮은순')) sortCondition = 'ASC';

  return { categoryCode, itemGrade, characterClass, sortCondition };
}

// ── !가격 — 거래소 검색 결과 포맷 ──
export function buildMarket(data) {
  if (!data) return '장사안함';
  let out = '등급 / 전날평균가 / 최저가 / 이름\n';
  for (const item of (data.Items || [])) {
    out += `${item.Grade} / ${item.YDayAvgPrice} / ${item.CurrentMinPrice} / ${item.Name}\n`;
  }
  return out.trimEnd();
}
