// src/kakao.js — 카카오 세션 관리

const SESSION_KV_KEY = 'session:kakao';

// 모바일 봇에서 /session 엔드포인트로 업로드한 쿠키를 KV에 저장
export async function saveSession(kv, cookies) {
  await kv.put(SESSION_KV_KEY, JSON.stringify(cookies), { expirationTtl: 60 * 60 * 24 * 30 });
}

// lostark-api.js의 getCharacterImage 스크래핑에서 사용
export const KAKAO_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0';
