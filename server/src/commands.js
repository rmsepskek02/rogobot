// src/commands.js — 봇 명령어 처리

import { lostarkGet } from './lostark-api.js';
import { buildCharacterInfo } from './lostark-build.js';

const SYNERGY_INFO = {
  '전사 (슈샤이어)': [
    { class: '워로드', synergy: '방감12, 피증4, 백헤드5' },
    { class: '디트', synergy: '방감12' },
    { class: '버서커/슬레', synergy: '피증6' },
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

  // ── 데미지 ──
  if (msg.startsWith('!데미지 ')) return `https://lostbuilds.com/info/${msg.split(' ')[1]}`;

  // ── 명령어 목록 ──
  if (msg === '!명령어' || msg === '!?')
    return '!정보 캐릭터이름\n!배럭(ㅂㄹ) 캐릭터이름\n!스킬 캐릭터이름\n!보석 캐릭터이름\n!장비 캐릭터이름\n!악세 캐릭터이름\n!앜패(ㅇㅍ) 캐릭터이름\n!아크(ㅇㅋ) 캐릭터이름\n!낙원(ㄴㅇ,ㄴㅇㄹ,낙원력) 캐릭터이름\n!각인 캐릭터이름\n!내실 캐릭터이름\n!아바타 캐릭터이름\n!섬(ㅅ,ㅆ)\n!유각(ㅇㄱ,ㅅㅍㅇㄱ)\n!젬가격(ㅈㄱㄱ)\n!클골(ㅋㄱ)\n!시간표(ㅅㄱㅍ)\n!폿엘릭서(ㅍㅇㄽ)\n!ㅇㄱㄹ\n!ㅂㅂㄱ 금액\n!시너지(ㅅㄵ,ㅅㄴㅈㅈ)\n!공홈(ㄱㅎ)\n!즐(ㅈ) 캐릭터이름\n!로펙(ㄹㅍ) 캐릭터이름\n!깨달음,진화(ㄲㄷㅇ,ㅈㅎ)\n!등급직업분류정렬가격 검색어\n!가격설명서\n==========\n!로또\n!주사위\n!점메추\n!저메추\n어쩌구저쩌구확 률\n어절씨구v s저절씨구';

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

  // ── 카멘/하브 주차 ──
  if (['!카멘','!하브','!하멘','!아브','!ㅋㅁ','!ㅎㅂ','!ㅎㅁ','!ㅇㅂ'].includes(msg)) {
    const base = new Date(2023, 8, 13);
    const now = new Date();
    const baseDay = (base.getDay() + 4) % 7;
    const curDay = (now.getDay() + 4) % 7;
    const diffDays = Math.floor((now - base) / 86400000);
    const diffWeeks = Math.floor((diffDays - (curDay - baseDay)) / 7);
    return `오늘은 ${diffWeeks % 2 === 0 ? '4관' : '3관'}주!!`;
  }

  // ── 깨달음 / 진화 ──
  if (['!깨달음','!ㄲㄷㅇ'].some(c => msg.startsWith(c)))
    return '깨달음포인트\n(1)전투레벨\n전투레벨50부터 1당 1p,최대20p\n(2)내실\n에포나3p,모험의서3p,해도3p,필보5p\n(3)악세\n유물:목걸이10p,나머지9p\n고대:목걸이13p,나머지12p';
  if (['!진화','!ㅈㅎ'].some(c => msg.startsWith(c)))
    return '진화 포인트\n전투레벨 50부터 1당 +1, 최대 +20\n유물장비 부위당 +8\n고대장비 부위당 +20';

  // ── 시간표 ──
  if (msg === '!시간표' || msg === '!ㅅㄱㅍ')
    return '로아 시간표\n 월 - 카게\n 화 - 필보, 태초\n 수 - 숙제나해\n 목 - 카게, 태초\n 금 - 필보\n 토 - 카게, 태초\n 일 - 카게, 필보';

  // ── 검사 보스 ──
  if (['!검사','!㳅','!ㄱㅅ'].includes(msg)) {
    const days = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
    const d = new Date().getDay();
    const schedules = [
      '0200 : 금예니왕\n1100 : 산군\n1600 : 금예니왕\n2000 : 불가살 우투리\n2345 : 금예니왕 산군',
      '0200 : 불가살\n1100 : 우투리\n1600 : 금예니왕\n2000 : 산군 불가살\n2345 : 우투리 금예니왕',
      '0200 : 산군\n1100 : 금예니왕\n1600 : 불가살\n2000 : 금예니왕 우투리\n2345 : 산군 불가살',
      '0200 : 금예니왕\n1600 : 불가살\n2000 : 우투리 산군\n2345 : 산군 불가살',
      '0200 : 우투리\n1100 : 산군\n1600 : 우투리\n2000 : 산군 금예니왕\n2345 : 불가살 우투리',
      '0200 : 산군\n1100 : 불가살\n1600 : 우투리\n2000 : 금예니왕 불가살\n2345 : 우투리 산군',
      '0200 : 불가살\n1100 : 금예니왕\n1600 : 산군\n2345 : 불가살 우투리',
    ];
    return `< ${days[d]} 검사 보스 >\n${schedules[d]}`;
  }

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
