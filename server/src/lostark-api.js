// src/lostark-api.js — 로스트아크 API 호출

import { KAKAO_UA } from './kakao.js';

const LOSTARK_BASE = 'https://developer-lostark.game.onstove.com';

export async function lostarkGet(path, apiKey) {
  const res = await fetch(LOSTARK_BASE + path, {
    headers: { 'accept': 'application/json', 'authorization': 'bearer ' + apiKey },
  });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function lostarkPost(path, body, apiKey) {
  const res = await fetch(LOSTARK_BASE + path, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': 'bearer ' + apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
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
