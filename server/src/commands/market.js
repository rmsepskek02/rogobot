// src/commands/market.js — 시세/거래소 명령어

import { lostarkPost } from '../lostark-api.js';
import {
  buildEngravis, buildEngravisForSupport, buildEgir,
  buildGemPrice, buildGemBuyPrice, buildMarket, makeMarketParam,
} from '../lostark-build.js';

// !유각/ㅇㄱ — 유각 가격
async function handleEngravis(env) {
  const body = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: 40000, CharacterClass: '', ItemTier: 0, ItemGrade: '유물', ItemName: '각인', PageNo: 1, SortCondition: 'DESC' };
  const body2 = { ...body, PageNo: 2 };
  const [d1, d2] = await Promise.all([
    lostarkPost('/markets/items', body, env.LOSTARK_API_KEY),
    lostarkPost('/markets/items', body2, env.LOSTARK_API_KEY),
  ]);
  return buildEngravis(d1, d2);
}

// !서폿유각/ㅅㅍㅇㄱ — 서폿 유각 가격
async function handleSupportEngravis(env) {
  const base = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: 40000, CharacterClass: '', ItemTier: 0, ItemGrade: '유물', PageNo: 0, SortCondition: 'DESC' };
  const names = ['각성', '마나의 흐름', '구슬', '전문의', '최대 마나', '중갑', '급소', '폭발'];
  const results = await Promise.all(names.map(n => lostarkPost('/markets/items', { ...base, ItemName: n }, env.LOSTARK_API_KEY)));
  return buildEngravisForSupport(results);
}

// !ㅇㄱㄹ — 에기르 재료 가격
async function handleEgir(env) {
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

// !젬가격/ㅈㄱㄱ — 젬 가격
async function handleGemPrice(env) {
  const base = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: 50000, CharacterClass: '', ItemTier: 0, ItemGrade: '', ItemName: '젬', SortCondition: 'DESC' };
  const [d1, d2] = await Promise.all([
    lostarkPost('/markets/items', { ...base, PageNo: 1 }, env.LOSTARK_API_KEY),
    lostarkPost('/markets/items', { ...base, PageNo: 2 }, env.LOSTARK_API_KEY),
  ]);
  return buildGemPrice(d1, d2);
}

// !보석가격/ㅂㅅ/ㅄ/ㅂㅅㄱㄱ/ㅄㄱㄱ — 보석 즉구 최저가
async function handleGemBuyPrice(env) {
  const base = { ItemLevelMin: 0, ItemLevelMax: 0, ItemGradeQuality: null, SkillOptions: [{ FirstOption: null, SecondOption: null, MinValue: null, MaxValue: null }], EtcOptions: [{ FirstOption: null, SecondOption: null, MinValue: null, MaxValue: null }], Sort: 'BUY_PRICE', CategoryCode: 210000, CharacterClass: '', ItemTier: null, ItemGrade: '', PageNo: 0, SortCondition: 'ASC' };
  const gemNames = ['10레벨 겁화', '10레벨 작열', '9레벨 겁화', '9레벨 작열', '8레벨 겁화', '8레벨 작열', '7레벨 겁화', '7레벨 작열'];
  const results = await Promise.all(gemNames.map(n => lostarkPost('/auctions/items', { ...base, ItemName: n }, env.LOSTARK_API_KEY)));
  return buildGemBuyPrice(results);
}

// !가격 — 거래소 검색
async function handleMarketSearch(msg, env) {
  const parts = msg.split(' ');
  const command = parts[0];
  const searchName = parts.slice(1).join(' ').trim();
  if (!searchName) return null;
  const { categoryCode, itemGrade, characterClass, sortCondition } = makeMarketParam(command);
  const body = { Sort: 'CURRENT_MIN_PRICE', CategoryCode: categoryCode, CharacterClass: characterClass, ItemTier: 0, ItemGrade: itemGrade, ItemName: searchName, PageNo: 0, SortCondition: sortCondition };
  const data = await lostarkPost('/markets/items', body, env.LOSTARK_API_KEY);
  return buildMarket(data);
}

// 시세/거래소 명령어 디스패처
export async function handleMarket(msg, env) {
  // !유각/ㅇㄱ
  if (['!유각', '!ㅇㄱ'].includes(msg)) return await handleEngravis(env);

  // !서폿유각/ㅅㅍㅇㄱ
  if (['!서폿유각', '!ㅅㅍㅇㄱ'].includes(msg)) return await handleSupportEngravis(env);

  // !ㅇㄱㄹ
  if (msg === '!ㅇㄱㄹ') return await handleEgir(env);

  // !젬가격/ㅈㄱㄱ
  if (['!젬가격', '!ㅈㄱㄱ'].includes(msg)) return await handleGemPrice(env);

  // !보석가격/ㅂㅅ/ㅄ/ㅂㅅㄱㄱ/ㅄㄱㄱ
  if (['!보석가격', '!ㅂㅅ', '!ㅄ', '!ㅂㅅㄱㄱ', '!ㅄㄱㄱ'].includes(msg)) return await handleGemBuyPrice(env);

  // !가격 (거래소 검색) — 보석가격/젬가격/가격설명서 제외
  if (msg.startsWith('!') && msg.includes('가격') && !msg.includes('보석가격') && !msg.includes('젬가격') && !msg.includes('가격설명서')) {
    return await handleMarketSearch(msg, env);
  }

  return null;
}
