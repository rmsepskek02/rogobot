// src/lostark-api.js — 로스트아크 API 호출

import { KAKAO_UA } from './kakao.js';

const LOSTARK_BASE = 'https://developer-lostark.game.onstove.com';

// 공통 fetch 헬퍼 — GET/POST 중복 로직 통합
async function lostarkFetch(path, apiKey, options = {}) {
  const res = await fetch(LOSTARK_BASE + path, {
    ...options,
    headers: {
      'accept': 'application/json',
      'authorization': 'bearer ' + apiKey,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function lostarkGet(path, apiKey) {
  return lostarkFetch(path, apiKey);
}

export async function lostarkPost(path, body, apiKey) {
  return lostarkFetch(path, apiKey, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function getCharacterImage(name) {
  try {
    const res = await fetch(`https://lostark.game.onstove.com/Profile/Character/${encodeURIComponent(name)}`, {
      headers: { 'User-Agent': KAKAO_UA },
    });
    const html = await res.text();
    const m = html.match(/profile-equipment__character[\s\S]*?<img[^>]+src="([^"]+)"/);
    return m ? m[1] : '';
  } catch { return ''; }
}
