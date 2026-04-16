// src/commands/info.js — 정보성 명령어

// 시너지 정보 데이터
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

// 정보성 명령어 디스패처 (env 포함 — WORKER_BASE 참조)
export function handleInfo(msg, env) {
  const workerBase = env.WORKER_BASE;

  // !클골/ㅋㄱ — 클리어 골드 이미지
  if (msg === '!클골' || msg === '!ㅋㄱ') return `${workerBase}/e/CLEARGOLD`;

  // !연마/ㅇㅁ — 연마 악세 이미지
  if (msg === '!연마' || msg === '!ㅇㅁ') return `${workerBase}/e/POLISHINGACCESSORIES`;

  // !즐/ㅈ/ㅈㄹㅇ/즐로아/즐로 — zloa 검색
  for (const cmd of ['!즐', '!ㅈ', '!ㅈㄹㅇ', '!즐로아', '!즐로']) {
    if (msg.startsWith(cmd + ' ')) {
      const nick = msg.slice(cmd.length + 1).trim();
      if (nick) return `https://zloa.net/char/${encodeURIComponent(nick)}`;
    }
    if (msg === cmd) return 'https://zloa.net/';
  }

  // !ㄿ/로펙/ㄹㅍ — lopec 검색
  for (const cmd of ['!ㄿ', '!로펙', '!ㄹㅍ']) {
    if (msg.startsWith(cmd + ' ')) {
      const nick = msg.slice(cmd.length + 1).trim();
      if (nick) return `https://lopec.kr/character/specPoint/${encodeURIComponent(nick)}`;
    }
    if (msg === cmd) return 'https://lopec.kr/';
  }

  // !각인도감/ㄱㅇㄷㄱ
  if (msg === '!각인도감' || msg === '!ㄱㅇㄷㄱ')
    return 'https://docs.google.com/spreadsheets/d/1tCtHi5GZh1p_1zCjJbNOam0-eVIqVHhSyV_W1_EOAGE/edit?usp=sharing';

  // !명령어/?
  if (msg === '!명령어' || msg === '!?')
    return '!정보 캐릭터이름\n!배럭(ㅂㄹ) 캐릭터이름\n!스킬 캐릭터이름\n!보석 캐릭터이름\n!장비 캐릭터이름\n!악세 캐릭터이름\n!앜패(ㅇㅍ) 캐릭터이름\n!아크(ㅇㅋ) 캐릭터이름\n!낙원(ㄴㅇ,ㄴㅇㄹ,낙원력) 캐릭터이름\n!각인 캐릭터이름\n!내실 캐릭터이름\n!아바타 캐릭터이름\n!섬(ㅅ,ㅆ)\n!유각(ㅇㄱ) / !서폿유각(ㅅㅍㅇㄱ)\n!젬가격(ㅈㄱㄱ) / !보석가격(ㅂㅅ,ㅄ)\n!ㅇㄱㄹ\n!클골(ㅋㄱ) / !연마(ㅇㅁ)\n!등급직업분류정렬가격 검색어\n!가격설명서\n!ㅂㅂㄱ 금액\n!시너지(ㅅㄵ) / !시간표(ㅅㄱㅍ)\n!공홈(ㄱㅎ) / !각인도감(ㄱㅇㄷㄱ)\n!즐(ㅈ) 캐릭터이름 / !로펙(ㄹㅍ) 캐릭터이름\n==========\n!로또 / !주사위\n!점메추 / !저메추\n어쩌구확률 / 어절씨구vs저절씨구';

  // !가격설명서
  if (msg === '!가격설명서')
    return '등급\n일반,고급,희귀,영웅,전설,유물,고대,에스더\n\n직업\n버서커,디트,인파,기공,창술,스커,블레,데모닉,리퍼,호크,데헌,블래,워로드,스카,건슬,도화가,기상,홀나,슬레,알카,서머너,바드,소서,배마\n\n분류\n아바타,각인,재료,배템,요리,생활,모험,항해,펫,탈것,기타\n\n정렬순\n높은순,낮은순';

  // !공홈/ㄱㅎ
  if (msg === '!공홈' || msg === '!ㄱㅎ') return 'https://lostark.game.onstove.com/Main';

  // !시너지/ㅅㄵ/ㅅㄴㅈ
  if (msg === '!시너지' || msg === '!ㅅㄵ' || msg === '!ㅅㄴㅈ') {
    let out = '';
    for (const cat in SYNERGY_INFO) {
      out += ` ✤ ${cat}\n`;
      SYNERGY_INFO[cat].forEach(e => { out += `${e.class} : ${e.synergy}\n`; });
    }
    return out.trimEnd();
  }

  // !시간표/ㅅㄱㅍ
  if (msg === '!시간표' || msg === '!ㅅㄱㅍ')
    return '로아 시간표\n 월 - 카게\n 화 - 필보, 태초\n 수 - 숙제나해\n 목 - 카게, 태초\n 금 - 필보\n 토 - 카게, 태초\n 일 - 카게, 필보';

  return null;
}
