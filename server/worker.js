// worker.js — 클라우드플레어 Worker 진입점
// KV 바인딩: KVKV
// 시크릿:    BOT_SECRET, LOSTARK_API_KEY
// 환경변수:  WORKER_BASE

import { saveSession } from './src/kakao.js';
import { processMessage } from './src/commands/index.js';
import { rawPlain, rawHtml, rawImage, rawJson, getKey } from './src/response.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    try {
      // ── 기존: 이미지 저장 ──
      if (pathname === '/s') {
        const body = await request.json();
        let key = getKey();
        while (null != await env.KVKV.get(key)) key = getKey();
        await env.KVKV.put(key, body.image, { expirationTtl: 3600 });
        return rawPlain(key);
      }

      // ── 기존: 이미지 조회 ──
      if (pathname.startsWith('/g')) {
        const query = pathname.split('/')[2];
        let image = await env.KVKV.get(query);
        if (!image) return new Response('Server Error', { status: 500 });
        image = Uint8Array.from(atob(image), c => c.charCodeAt(0));
        return rawImage(image);
      }

      // ── 기존: OG 래퍼 ──
      if (pathname.startsWith('/e')) {
        const query = pathname.split('/')[2];
        const url = `${env.WORKER_BASE}/g/${query}`;
        return rawHtml(`<html><head><meta property="og:image" content="${url}"><title>사진</title></head><body><img src="${url}" alt="img"/></body></html>`);
      }

      // ── 카카오 세션 업로드 (모바일 로고봇에서 호출) ──
      if (pathname === '/session' && request.method === 'POST') {
        if (request.headers.get('X-Bot-Secret') !== env.BOT_SECRET) {
          return rawJson({ error: 'Unauthorized' }, 401);
        }
        const { cookies } = await request.json();
        if (!cookies || typeof cookies !== 'object') {
          return rawJson({ error: 'cookies 필드가 필요합니다' }, 400);
        }
        await saveSession(env.KVKV, cookies);
        return rawJson({ ok: true });
      }

      // ── 봇 처리 ──
      if (pathname === '/bot' && request.method === 'POST') {
        if (request.headers.get('X-Bot-Secret') !== env.BOT_SECRET) {
          return rawJson({ error: 'Unauthorized' }, 401);
        }

        const { room, msg, sender, isGroupChat } = await request.json();
        const result = await processMessage(room, msg, sender, isGroupChat, env);
        if (result && typeof result === 'object' && result.__kakaolink) {
          return rawJson({ reply: null, kakaolink: result.__kakaolink });
        }
        return rawJson({ reply: result });
      }

    } catch (e) {
      console.error(e);
      if (pathname === '/bot') {
        return rawJson({ reply: '삐빅! 서버 에러: ' + String(e) }, 500);
      }
      return new Response(String(e), { status: 500 });
    }

    return new Response('Not Found', { status: 404 });
  },
};
