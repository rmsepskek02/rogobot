// src/kakao.js — 카카오 세션 관리 + 카카오링크 전송

import { CryptoJS } from './kakao-crypto.js';

// ─────────────────────────────────────────────────────────────
// 카카오 세션 관리 (KV 캐싱)
// ─────────────────────────────────────────────────────────────
const SESSION_KV_KEY = 'session:kakao';

export async function getSession(kv) {
  const raw = await kv.get(SESSION_KV_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function saveSession(kv, cookies) {
  await kv.put(SESSION_KV_KEY, JSON.stringify(cookies), { expirationTtl: 60 * 60 * 24 * 30 });
}

export function buildCookieHeader(cookies) {
  return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

export function parseCookies(setCookieHeaders, jar = {}) {
  for (const header of setCookieHeaders) {
    const [pair] = header.split(';');
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim();
    const val = pair.slice(eqIdx + 1).trim();
    jar[key] = val;
  }
  return jar;
}

// ─────────────────────────────────────────────────────────────
// 카카오 로그인 (fetch 기반)
// ─────────────────────────────────────────────────────────────
export const KAKAO_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0';

export async function kakaoLogin(email, password) {
  let jar = {};

  const loginUrl = 'https://accounts.kakao.com/login?app_type=web&continue=' +
    encodeURIComponent('https://accounts.kakao.com/weblogin/account/info');
  const loginRes = await fetch(loginUrl, {
    headers: { 'User-Agent': KAKAO_UA, 'Referer': 'https://accounts.kakao.com/' },
    redirect: 'follow',
  });
  parseCookies(loginRes.headers.getSetCookie(), jar);

  const html = await loginRes.text();
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!nextDataMatch) throw new Error('Kakao login page structure changed');

  const nextData = JSON.parse(nextDataMatch[1]);
  const ctx = nextData?.props?.pageProps?.pageContext?.commonContext;
  if (!ctx) throw new Error('Kakao commonContext not found');

  const cryptoKey = ctx.p;
  const csrfToken = String(ctx._csrf);
  const referer = loginRes.url;

  await fetch('https://stat.tiara.kakao.com/track?d=' + encodeURIComponent(JSON.stringify({
    sdk: { type: 'WEB', version: '1.1.17' },
    env: { screen: '1920x1080', tz: '+9', cke: 'Y' },
    common: { svcdomain: 'accounts.kakao.com', deployment: 'production', url: 'https://accounts.kakao.com/login' },
    action: { type: 'Pageview' },
  })), {
    headers: { 'User-Agent': KAKAO_UA, 'Referer': 'https://accounts.kakao.com/', 'Cookie': buildCookieHeader(jar) },
  });

  const encPw = CryptoJS.AES.encrypt(password, cryptoKey).toString();
  const authRes = await fetch('https://accounts.kakao.com/api/v2/login/authenticate.json', {
    method: 'POST',
    headers: {
      'User-Agent': KAKAO_UA,
      'Content-Type': 'application/json',
      'Referer': referer,
      'Cookie': buildCookieHeader(jar),
    },
    body: JSON.stringify({ _csrf: csrfToken, activeSso: true, loginKey: email, loginUrl: referer, password: encPw, staySignedIn: true }),
    redirect: 'follow',
  });
  parseCookies(authRes.headers.getSetCookie(), jar);

  const authData = await authRes.json();
  if (authData.status !== 0) throw new Error(`Kakao login failed: ${authData.status}`);

  return jar;
}

// ─────────────────────────────────────────────────────────────
// 카카오링크 전송 (fetch 기반)
// ─────────────────────────────────────────────────────────────
const KAKAO_API_KEY = 'c0d2d5a6da78d03cc4667cec3b4756a9';
const KAKAO_ORIGIN_URL = 'https://open.kakao.com/o/ssdOPG0e';
const KAKAO_KA = 'sdk/2.0.1 os/javascript sdk_type/javascript lang/en-US device/Win32 origin/' + encodeURIComponent(KAKAO_ORIGIN_URL);
const SHARER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0';

function b64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}

export async function sendKakaoLink(room, templateId, templateArgs, cookies) {
  const cookieHeader = buildCookieHeader(cookies);
  const data = { templateId, templateArgs, link_ver: '4.0' };

  const linkRes = await fetch('https://sharer.kakao.com/picker/link', {
    method: 'POST',
    headers: {
      'User-Agent': SHARER_UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader,
    },
    body: new URLSearchParams({
      app_key: KAKAO_API_KEY,
      validation_action: 'custom',
      validation_params: JSON.stringify(data),
      ka: KAKAO_KA,
    }).toString(),
    redirect: 'follow',
  });

  if (linkRes.status !== 200) {
    const errBody = await linkRes.text();
    throw new Error(`picker/link: ${linkRes.status} | ${errBody.slice(0, 300)}`);
  }

  const linkBody = await linkRes.text();
  const sdMatch = linkBody.match(/serverData\s*=\s*"([^"]+)"/);
  if (!sdMatch) throw new Error('serverData not found in picker/link response');

  const serverData = JSON.parse(atob(sdMatch[1]));
  const { shortKey, csrfToken, checksum } = serverData.data;
  const chats = serverData.data.chats || [];

  const channelData = chats.find(c => c.title === room);
  if (!channelData) throw new Error(`Room "${room}" not found in chat list`);

  const receiver = b64Encode(JSON.stringify(channelData));

  const sendRes = await fetch('https://sharer.kakao.com/picker/send', {
    method: 'POST',
    headers: {
      'User-Agent': SHARER_UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': linkRes.url,
      'Cookie': cookieHeader,
    },
    body: new URLSearchParams({
      app_key: KAKAO_API_KEY,
      short_key: shortKey,
      _csrf: csrfToken,
      checksum,
      receiver,
    }).toString(),
    redirect: 'follow',
  });

  if (sendRes.status !== 200) throw new Error(`picker/send: ${sendRes.status}`);
}

export async function sendKakaoLinkWithAuth(room, templateId, templateArgs, env) {
  const cookies = await getSession(env.KVKV);
  if (!cookies) {
    throw new Error('카카오 세션 없음. 모바일에서 !세션 입력하여 갱신해주세요.');
  }
  try {
    await sendKakaoLink(room, templateId, templateArgs, cookies);
  } catch (e) {
    throw new Error('카카오링크 전송 실패. 세션이 만료된 경우 !세션 으로 갱신해주세요. (' + e.message + ')');
  }
}
