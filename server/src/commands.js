// src/commands.js — 봇 명령어 처리

import { lostarkGet, lostarkPost, getCharacterImage } from './lostark-api.js';
import {
  buildCharacterInfo,
  buildCharacters, buildGems, buildSkills, buildEquipment,
  buildAccessories, buildEngravings, buildArkPassive, buildArkGrid,
  buildCollectibles, buildParadisePower, buildIsland,
  buildEngravis, buildEngravisForSupport, buildEgir,
  buildGemPrice, buildGemBuyPrice, buildMarket, makeMarketParam,
} from './lostark-build.js';

const WORKER_BASE = 'https://worker-green-meadow-d8c1.rmsepskek02.workers.dev';

const SYNERGY_INFO = {
  '전사 (슈샤이어)': [
    { class: '워로드', synergy: '방감12, 피증4, 백헤드5' },
    { class: '디트', synergy: '방감12' },
    { class: '버서커/슬레', synergy: '피증6' },
    { class: '발키리/딜홀나', synergy: '치피증 8' },
    { class: '가디언나이트', synergy: '피증 6' },
  ],
  '무도가 (애니츠)': [
    { class: '창술', synergy: '치명타 시 피증8' },
    { class: '배마', synergy: '치적10, 공속8, 이속16' },
    { class: '스커', synergy: '치적10, 공속8' },
    { class: '인파/브레', synergy: '피증6' },
    { class: '기공', synergy: '공증6' },
  ],
  '헌터 (아르데타인)': [
    { class: '데헌/건슬', synergy: '치적 10' },
    { class: '호크', synergy: '피증6, 이속4(두동)' },
    { class: '블래', synergy: '방감12' },
    { class: '스카', synergy: '공증6' },
  ],
  '마법사 (실린)': [
    { class: '서머너', synergy: '방감12, 마회40 (트포 선택)' },
    { class: '알카', synergy: '치적10' },
    { class: '소서', synergy: '피증6' },
  ],
  '암살자 (데런)': [
    { class: '리퍼', synergy: '방감12' },
    { class: '데모닉', synergy: '피증6' },
    { class: '소울', synergy: '피증6' },
    { class: '블레', synergy: '피증4, 백헤드5, 공속25, 이속20' },
  ],
  '스페셜리스트 (요즈)': [
    { class: '기상', synergy: '치적10, 공속12(질풍), 이속12(질풍), 공감10(이슬비)' },
    { class: '환수', synergy: '방감12' },
  ],
};

// 모든 명령어를 처리하고 텍스트 응답 반환 (null이면 카카오링크로 처리됨)
export async function processMessage(room, msg, sender, isGroupChat, env) {

  // ── 로스트아크 API 명령어 (카카오링크) ──
  if (msg.startsWith('!정보 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
      if (!data) return '캐릭터를 찾을 수 없습니다.';
      if (!data['ArmoryProfile']) return `${name} 캐릭터를 찾을 수 없습니다.`;
      return await buildCharacterInfo(data);
    }
  }

  // ── 배럭/부캐 ──
  const barrakCmds = ['!배럭', '!부캐', '!ㅂㅋ', '!ㅂㄹ', '!원정대', '!ㅇㅈㄷ'];
  for (const cmd of barrakCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) {
        const data = await lostarkGet(`/characters/${encodeURIComponent(name)}/siblings`, env.LOSTARK_API_KEY);
        if (!data) return '캐릭터를 찾을 수 없습니다.';
        return buildCharacters(data);
      }
    }
  }

  // ── 보석 ──
  if (msg.startsWith('!보석 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}/gems`, env.LOSTARK_API_KEY);
      if (!data) return '쌀';
      return buildGems(data);
    }
  }

  // ── 스킬 ──
  if (msg.startsWith('!스킬 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}/combat-skills`, env.LOSTARK_API_KEY);
      if (!data) return '평타맨';
      return buildSkills(data);
    }
  }

  // ── 장비 ──
  if (msg.startsWith('!장비 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
      if (!data) return '알몸';
      return buildEquipment(data);
    }
  }

  // ── 악세 ──
  if (msg.startsWith('!악세 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
      if (!data) return '그지';
      return buildAccessories(data);
    }
  }

  // ── 각인 ──
  if (msg.startsWith('!각인 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
      if (!data) return '응애';
      return buildEngravings(data);
    }
  }

  // ── 앜패 ──
  const arkPassiveCmds = ['!앜패', '!ㅇㅍ'];
  for (const cmd of arkPassiveCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) {
        const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
        if (!data) return '3티어!!';
        return buildArkPassive(data);
      }
    }
  }

  // ── 아크그리드 ──
  const arkGridCmds = ['!아크', '!ㅇㅋ'];
  for (const cmd of arkGridCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) {
        const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
        if (!data) return '조빱!!!';
        return buildArkGrid(data);
      }
    }
  }

  // ── 내실 ──
  if (msg.startsWith('!내실 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const enc = encodeURIComponent(name);
      const [profileData, collectiblesData] = await Promise.all([
        lostarkGet(`/armories/characters/${enc}/profiles`, env.LOSTARK_API_KEY),
        lostarkGet(`/armories/characters/${enc}/collectibles`, env.LOSTARK_API_KEY),
      ]);
      if (!profileData || !collectiblesData) return '응애';
      return buildCollectibles(profileData, collectiblesData);
    }
  }

  // ── 낙원력 ──
  const paradiseCmds = ['!낙원력', '!낙원', '!ㄴㅇㄹ', '!ㄴㅇ'];
  for (const cmd of paradiseCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) {
        const siblings = await lostarkGet(`/characters/${encodeURIComponent(name)}/siblings`, env.LOSTARK_API_KEY);
        if (!siblings) return '캐릭터를 찾을 수 없습니다.';
        // 메인 캐릭터 서버 확인
        const mainChar = siblings.find(c => c.CharacterName === name);
        const mainServer = mainChar
          ? mainChar.ServerName
          : siblings.sort((a, b) => parseFloat(b.ItemAvgLevel.replace(/,/g, '')) - parseFloat(a.ItemAvgLevel.replace(/,/g, '')))[0].ServerName;
        // 같은 서버 캐릭터 레벨 내림차순
        const sameServer = siblings
          .filter(c => c.ServerName === mainServer)
          .sort((a, b) => parseFloat(b.ItemAvgLevel.replace(/,/g, '')) - parseFloat(a.ItemAvgLevel.replace(/,/g, '')));
        // 메인 먼저, 나머지 순서로 병렬 fetch
        const names = [name, ...sameServer.filter(c => c.CharacterName !== name).map(c => c.CharacterName)];
        const results = await Promise.all(
          names.map(n => lostarkGet(`/armories/characters/${encodeURIComponent(n)}`, env.LOSTARK_API_KEY))
        );
        const charEquipMap = Object.fromEntries(names.map((n, i) => [n, results[i]]));
        return buildParadisePower(charEquipMap, name);
      }
    }
  }

  // ── 쌀 섬 일정 ──
  if (['!섬', '!ㅅ', '!ㅆ'].includes(msg)) {
    const data = await lostarkGet('/gamecontents/calendar', env.LOSTARK_API_KEY);
    if (!data) return '없음';
    return buildIsland(data);
  }

  // ── 유각 가격 ──
  const engravisCmds = ['!유각', '!ㅇㄱ'];
  if (engravisCmds.some(c => msg === c)) {
    const body = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: 40000, CharacterClass: '', ItemTier: 0, ItemGrade: '유물', ItemName: '각인', PageNo: 1, SortCondition: 'DESC' };
    const body2 = { ...body, PageNo: 2 };
    const [d1, d2] = await Promise.all([
      lostarkPost('/markets/items', body, env.LOSTARK_API_KEY),
      lostarkPost('/markets/items', body2, env.LOSTARK_API_KEY),
    ]);
    return buildEngravis(d1, d2);
  }

  // ── 서폿 유각 가격 ──
  const suppEngravisCmds = ['!서폿유각', '!ㅅㅍㅇㄱ'];
  if (suppEngravisCmds.some(c => msg === c)) {
    const base = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: 40000, CharacterClass: '', ItemTier: 0, ItemGrade: '유물', PageNo: 0, SortCondition: 'DESC' };
    const names = ['각성', '마나의 흐름', '구슬', '전문의', '최대 마나', '중갑', '급소', '폭발'];
    const results = await Promise.all(names.map(n => lostarkPost('/markets/items', { ...base, ItemName: n }, env.LOSTARK_API_KEY)));
    return buildEngravisForSupport(results);
  }

  // ── 에기르 재료 가격 ──
  if (msg === '!ㅇㄱㄹ') {
    const base50 = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: 50000, CharacterClass: '', ItemTier: 0, ItemGrade: '', PageNo: 0, SortCondition: 'DESC' };
    const base50t4 = { ...base50, ItemTier: 4 };
    const base70 = { ...base50, CategoryCode: 70000 };
    const queries = [
      { ...base50, ItemName: '운명' }, { ...base50, ItemName: '용암의 숨결' },
      { ...base50, ItemName: '빙하의 숨결' }, { ...base50, ItemName: '아비도스' },
      { ...base50t4, ItemName: '장인의 야금술' }, { ...base50t4, ItemName: '장인의 재봉술' },
      { ...base50t4, ItemName: '야금술 : 업화' }, { ...base50t4, ItemName: '재봉술 : 업화' },
      { ...base70, ItemName: '쫄깃한 꼬치구이' }, { ...base70, ItemName: '허브 스테이크' },
      { ...base70, ItemName: '채끝 스테이크' },
    ];
    const results = await Promise.all(queries.map(q => lostarkPost('/markets/items', q, env.LOSTARK_API_KEY)));
    return buildEgir(results);
  }

  // ── 젬 가격 ──
  const gemPriceCmds = ['!젬가격', '!ㅈㄱㄱ'];
  if (gemPriceCmds.some(c => msg === c)) {
    const base = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: 50000, CharacterClass: '', ItemTier: 0, ItemGrade: '', ItemName: '젬', SortCondition: 'DESC' };
    const [d1, d2] = await Promise.all([
      lostarkPost('/markets/items', { ...base, PageNo: 1 }, env.LOSTARK_API_KEY),
      lostarkPost('/markets/items', { ...base, PageNo: 2 }, env.LOSTARK_API_KEY),
    ]);
    return buildGemPrice(d1, d2);
  }

  // ── 보석 즉구 최저가 ──
  const gemBuyCmds = ['!보석가격', '!ㅂㅅ', '!ㅄ', '!ㅂㅅㄱㄱ', '!ㅄㄱㄱ'];
  if (gemBuyCmds.some(c => msg === c)) {
    const base = { ItemLevelMin: 0, ItemLevelMax: 0, ItemGradeQuality: null, SkillOptions: [{ FirstOption: null, SecondOption: null, MinValue: null, MaxValue: null }], EtcOptions: [{ FirstOption: null, SecondOption: null, MinValue: null, MaxValue: null }], Sort: 'BUY_PRICE', CategoryCode: 210000, CharacterClass: '', ItemTier: null, ItemGrade: '', PageNo: 0, SortCondition: 'ASC' };
    const gemNames = ['10레벨 겁화', '10레벨 작열', '9레벨 겁화', '9레벨 작열', '8레벨 겁화', '8레벨 작열', '7레벨 겁화', '7레벨 작열'];
    const results = await Promise.all(gemNames.map(n => lostarkPost('/auctions/items', { ...base, ItemName: n }, env.LOSTARK_API_KEY)));
    return buildGemBuyPrice(results);
  }

  // ── 거래소 가격 검색 ──
  if (msg.startsWith('!') && msg.includes('가격') && !msg.includes('보석가격') && !msg.includes('젬가격') && !msg.includes('가격설명서')) {
    const parts = msg.split(' ');
    const command = parts[0];
    const searchName = parts.slice(1).join(' ').trim();
    if (searchName) {
      const { categoryCode, itemGrade, characterClass, sortCondition } = makeMarketParam(command);
      const body = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: categoryCode, CharacterClass: characterClass, ItemTier: 0, ItemGrade: itemGrade, ItemName: searchName, PageNo: 0, SortCondition: sortCondition };
      const data = await lostarkPost('/markets/items', body, env.LOSTARK_API_KEY);
      return buildMarket(data);
    }
  }

  // ── 아바타 이미지 ──
  if (msg.startsWith('!아바타 ')) {
    const name = msg.slice(5).trim();
    if (name) {
      const imgUrl = await getCharacterImage(name);
      if (!imgUrl) return '캐릭터를 찾을 수 없습니다.';
      const imgRes = await fetch(imgUrl);
      if (!imgRes.ok) return '이미지를 불러올 수 없습니다.';
      const buf = await imgRes.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const b64 = btoa(binary);
      const uploadRes = await fetch(`${WORKER_BASE}/s`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/plain' },
        body: JSON.stringify({ image: b64, title: name }),
      });
      if (!uploadRes.ok) return '업로드 실패';
      return `${WORKER_BASE}/e/${await uploadRes.text()}`;
    }
  }

  // ── 클리어 골드 / 연마 ──
  if (msg === '!클골' || msg === '!ㅋㄱ') return `${WORKER_BASE}/e/CLEARGOLD`;
  if (msg === '!연마' || msg === '!ㅇㅁ') return `${WORKER_BASE}/e/POLISHINGACCESSORIES`;

  // ── 즐로아 검색 ──
  const zloaCmds = ['!즐', '!ㅈ', '!ㅈㄹㅇ', '!즐로아', '!즐로'];
  for (const cmd of zloaCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const nick = msg.slice(cmd.length + 1).trim();
      if (nick) return `https://zloa.net/char/${encodeURIComponent(nick)}`;
    }
    if (msg === cmd) return 'https://zloa.net/';
  }

  // ── 로펙 검색 ──
  const lopecCmds = ['!ㄿ', '!로펙', '!ㄹㅍ'];
  for (const cmd of lopecCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const nick = msg.slice(cmd.length + 1).trim();
      if (nick) return `https://legacy.lopec.kr/search/search.html?headerCharacterName=${encodeURIComponent(nick)}`;
    }
    if (msg === cmd) return 'https://lopec.kr/';
  }

  // ── 각인도감 ──
  if (msg === '!각인도감' || msg === '!ㄱㅇㄷㄱ')
    return 'https://docs.google.com/spreadsheets/d/1tCtHi5GZh1p_1zCjJbNOam0-eVIqVHhSyV_W1_EOAGE/edit?usp=sharing';

  // ── 명령어 목록 ──
  if (msg === '!명령어' || msg === '!?')
    return '!정보 캐릭터이름\n!배럭(ㅂㄹ) 캐릭터이름\n!스킬 캐릭터이름\n!보석 캐릭터이름\n!장비 캐릭터이름\n!악세 캐릭터이름\n!앜패(ㅇㅍ) 캐릭터이름\n!아크(ㅇㅋ) 캐릭터이름\n!낙원(ㄴㅇ,ㄴㅇㄹ,낙원력) 캐릭터이름\n!각인 캐릭터이름\n!내실 캐릭터이름\n!아바타 캐릭터이름\n!섬(ㅅ,ㅆ)\n!유각(ㅇㄱ) / !서폿유각(ㅅㅍㅇㄱ)\n!젬가격(ㅈㄱㄱ) / !보석가격(ㅂㅅ,ㅄ)\n!ㅇㄱㄹ\n!클골(ㅋㄱ) / !연마(ㅇㅁ)\n!등급직업분류정렬가격 검색어\n!가격설명서\n!ㅂㅂㄱ 금액\n!시너지(ㅅㄵ) / !시간표(ㅅㄱㅍ)\n!공홈(ㄱㅎ) / !각인도감(ㄱㅇㄷㄱ)\n!즐(ㅈ) 캐릭터이름 / !로펙(ㄹㅍ) 캐릭터이름\n==========\n!로또 / !주사위\n!점메추 / !저메추\n어쩌구확률 / 어절씨구vs저절씨구';

  // ── 가격 설명서 ──
  if (msg === '!가격설명서')
    return '등급\n일반,고급,희귀,영웅,전설,유물,고대,에스더\n\n직업\n버서커,디트,인파,기공,창술,스커,블레,데모닉,리퍼,호크,데헌,블래,워로드,스카,건슬,도화가,기상,홀나,슬레,알카,서머너,바드,소서,배마\n\n분류\n아바타,각인,재료,배템,요리,생활,모험,항해,펫,탈것,기타\n\n정렬순\n높은순,낮은순';

  // ── 공홈 ──
  if (msg === '!공홈' || msg === '!ㄱㅎ') return 'https://lostark.game.onstove.com/Main';

  // ── 시너지 ──
  if (msg === '!시너지' || msg === '!ㅅㄵ' || msg === '!ㅅㄴㅈ') {
    let out = '';
    for (const cat in SYNERGY_INFO) {
      out += ` ✤ ${cat}\n`;
      SYNERGY_INFO[cat].forEach(e => { out += `${e.class} : ${e.synergy}\n`; });
    }
    return out.trimEnd();
  }

  // ── 시간표 ──
  if (msg === '!시간표' || msg === '!ㅅㄱㅍ')
    return '로아 시간표\n 월 - 카게\n 화 - 필보, 태초\n 수 - 숙제나해\n 목 - 카게, 태초\n 금 - 필보\n 토 - 카게, 태초\n 일 - 카게, 필보';

  // ── 분배금 ──
  if (msg.startsWith('!ㅂㅂㄱ ')) {
    const gold = parseInt(msg.slice(5));
    if (!isNaN(gold)) {
      const four = gold * 0.95 * 0.75;
      const eight = gold * 0.95 * 0.875;
      const sixteen = gold * 0.95 * 0.9375;
      return `< 사이 좃은 분배금 >\n4인 엔빵비 - ${parseInt(four)}\n4인 개이득 - ${parseInt(four/1.1)}\n8인 엔빵비 - ${parseInt(eight)}\n8인 개이득 - ${parseInt(eight/1.1)}\n16인 엔빵비 - ${parseInt(sixteen)}\n16인 개이득 - ${parseInt(sixteen/1.1)}`;
    }
  }

  // ── 로또 ──
  if (msg === '!로또') {
    const nums = [];
    while (nums.length < 7) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    return `로또 결과 : ${nums.slice(0, 6).join(' ')} + ${nums[6]}`;
  }

  // ── 주사위 ──
  if (msg === '!주사위') return `주사위 결과 : ${Math.floor(Math.random() * 6) + 1}`;

  // ── 간단 응답 ──
  const simpleMap = {
    '아멘': '할렐루야', '할렐루야': '아멘',
    '!고로': '쉿!!',
    '!뱁새': '다싶고하스섹\n싶            스\n고            하\n하            고\n스            싶\n섹스하고싶다',
    '!cex': '뱁새!', '!모자': '뱁새야 서버', '!헨콘': '노콘노섹',
    '!덜디': '덜..보검!!', '!예니': '예으응... 동결건조파인애플..',
    '!해찬': '째깍째깍 퇴근퇴근',
    '!출근': 'ㅋㅋ 누가 출근', '!야근': 'ㅋㅋ 누가 야근', '!퇴근': 'ㅋㅋ 야근해야지',
  };
  if (simpleMap[msg]) return simpleMap[msg];

  // ── 메뉴 추천 ──
  const allMenu = ['돈가스','쌀국수','피자','햄버거','보쌈','삼겹살','갈비','족발','치킨','국밥','라면','타코야키','김밥','근라탕','근볶이','짜장면','짬뽕','탕수육','소고기','닭갈비','닭볶음탕','우육면','서브웨이','장어','탕탕이','볶음밥','회','초밥','김치찌개','된장찌개','부대찌개','순대','튀김','김치찜','해물찜','아구찜','밥국김치','엄마밥','할미밥','막곱대창','파스타','팔보채','마파두부','분짜','간계밥','샐러드','도시락','밥버거','솔의눈','콩밥','마라샹궈','빵','커피','도넛','엿','말고기'];
  if (msg === '!점메추' || msg === '!저메추')
    return `${allMenu[Math.floor(Math.random() * allMenu.length)]} 잡숴\n한중일양간/식`;
  if (msg === '!한식') { const m = ['김밥','비빔밥','김치찌개','된장찌개','부대찌개','삼겹살','갈비','닭갈비','냉면','국밥']; return `한식으로 ${m[Math.floor(Math.random()*m.length)]} 추천!!`; }
  if (msg === '!중식') { const m = ['짜장면','짬뽕','탕수육','마라샹궈','마파두부','깐풍기','유린기','우육면']; return `中餐 ${m[Math.floor(Math.random()*m.length)]} 举荐!!`; }
  if (msg === '!일식') { const m = ['초밥','라멘','우동','소바','돈가스','타코야키','덴푸라','오코노미야키']; return `和食 ${m[Math.floor(Math.random()*m.length)]} を お勧めします!!`; }
  if (msg === '!양식') { const m = ['파스타','피자','스테이크','리조또','피시앤칩스','케밥']; return `I recommend ${m[Math.floor(Math.random()*m.length)]}!!`; }
  if (msg === '!간식') { const m = ['도넛','케이크','아이스크림','탕후루','마카롱','에이드']; return `${m[Math.floor(Math.random()*m.length)]}!!`; }

  // ── vs 투표 ──
  if (msg.includes('vs') && !msg.includes('http')) {
    const parts = msg.split('vs');
    return `${parts[Math.floor(Math.random() * parts.length)]}!!`;
  }

  // ── 확률 ──
  if (msg.includes('확률')) {
    const parts = msg.split('확률');
    return `${parts[0]}확률 ${Math.floor(Math.random() * 100)}% !!`;
  }

  return null;
}
