// src/commands/fun.js — 재미/랜덤 명령어

// 간단 응답 맵
const SIMPLE_MAP = {
  '아멘': '할렐루야', '할렐루야': '아멘',
  '!고로': '쉿!!',
  '!뱁새': '다싶고하스섹\n싶            스\n고            하\n하            고\n스            싶\n섹스하고싶다',
  '!cex': '뱁새!', '!모자': '뱁새야 서버', '!헨콘': '노콘노섹',
  '!덜디': '덜..보검!!', '!예니': '예으응... 동결건조파인애플..',
  '!해찬': '째깍째깍 퇴근퇴근',
  '!출근': 'ㅋㅋ 누가 출근', '!야근': 'ㅋㅋ 누가 야근', '!퇴근': 'ㅋㅋ 야근해야지',
};

// 전체 메뉴 목록
const ALL_MENU = ['돈가스','쌀국수','피자','햄버거','보쌈','삼겹살','갈비','족발','치킨','국밥','라면','타코야키','김밥','근라탕','근볶이','짜장면','짬뽕','탕수육','소고기','닭갈비','닭볶음탕','우육면','서브웨이','장어','탕탕이','볶음밥','회','초밥','김치찌개','된장찌개','부대찌개','순대','튀김','김치찜','해물찜','아구찜','밥국김치','엄마밥','할미밥','막곱대창','파스타','팔보채','마파두부','분짜','간계밥','샐러드','도시락','밥버거','솔의눈','콩밥','마라샹궈','빵','커피','도넛','엿','말고기'];

// 음식 종류별 메뉴 맵
const FOOD_MAP = {
  '!한식': { list: ['김밥','비빔밥','김치찌개','된장찌개','부대찌개','삼겹살','갈비','닭갈비','냉면','국밥'], tmpl: (m) => `한식으로 ${m} 추천!!` },
  '!중식': { list: ['짜장면','짬뽕','탕수육','마라샹궈','마파두부','깐풍기','유린기','우육면'], tmpl: (m) => `中餐 ${m} 举荐!!` },
  '!일식': { list: ['초밥','라멘','우동','소바','돈가스','타코야키','덴푸라','오코노미야키'], tmpl: (m) => `和食 ${m} を お勧めします!!` },
  '!양식': { list: ['파스타','피자','스테이크','리조또','피시앤칩스','케밥'], tmpl: (m) => `I recommend ${m}!!` },
  '!간식': { list: ['도넛','케이크','아이스크림','탕후루','마카롱','에이드'], tmpl: (m) => `${m}!!` },
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 재미/랜덤 명령어 디스패처 (동기)
export function handleFun(msg) {
  // 간단 응답
  if (SIMPLE_MAP[msg]) return SIMPLE_MAP[msg];

  // !분배금
  if (msg.startsWith('!ㅂㅂㄱ ')) {
    const gold = parseInt(msg.slice(5));
    if (!isNaN(gold)) {
      const four = gold * 0.95 * 0.75;
      const eight = gold * 0.95 * 0.875;
      const sixteen = gold * 0.95 * 0.9375;
      return `< 사이 좃은 분배금 >\n4인 엔빵비 - ${parseInt(four)}\n4인 개이득 - ${parseInt(four/1.1)}\n8인 엔빵비 - ${parseInt(eight)}\n8인 개이득 - ${parseInt(eight/1.1)}\n16인 엔빵비 - ${parseInt(sixteen)}\n16인 개이득 - ${parseInt(sixteen/1.1)}`;
    }
  }

  // !로또
  if (msg === '!로또') {
    const nums = [];
    while (nums.length < 7) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    return `로또 결과 : ${nums.slice(0, 6).join(' ')} + ${nums[6]}`;
  }

  // !주사위
  if (msg === '!주사위') return `주사위 결과 : ${Math.floor(Math.random() * 6) + 1}`;

  // !점메추/저메추
  if (msg === '!점메추' || msg === '!저메추')
    return `${pickRandom(ALL_MENU)} 잡숴\n한중일양간/식`;

  // 음식 종류별 추천
  if (FOOD_MAP[msg]) {
    const { list, tmpl } = FOOD_MAP[msg];
    return tmpl(pickRandom(list));
  }

  // vs 투표
  if (msg.includes('vs') && !msg.includes('http')) {
    const parts = msg.split('vs');
    return `${parts[Math.floor(Math.random() * parts.length)]}!!`;
  }

  // 확률
  if (msg.includes('확률')) {
    const parts = msg.split('확률');
    return `${parts[0]}확률 ${Math.floor(Math.random() * 100)}% !!`;
  }

  return null;
}
