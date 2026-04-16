// src/response.js — HTTP 응답 헬퍼

// 텍스트 응답
export const rawPlain = (t) =>
  new Response(t, { headers: { 'content-type': 'text/plain;charset=UTF-8' } });

// HTML 응답
export const rawHtml = (h) =>
  new Response(h, { headers: { 'content-type': 'text/html;charset=UTF-8' } });

// JPEG 이미지 응답
export const rawImage = (i) =>
  new Response(i, { headers: { 'content-type': 'image/jpeg' } });

// JSON 응답 (기본 200)
export const rawJson = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });

// KV 저장용 랜덤 키 생성 (6자리 영숫자)
export function getKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let r = '';
  for (let i = 0; i < 6; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
  return r;
}
