// src/commands/index.js — 봇 명령어 디스패처

import { handleLostark } from './lostark.js';
import { handleMarket } from './market.js';
import { handleFun } from './fun.js';
import { handleInfo } from './info.js';

// 모든 명령어를 순서대로 처리하고 응답 반환 (null이면 처리 대상 없음)
export async function processMessage(room, msg, sender, isGroupChat, env) {
  return (
    await handleLostark(msg, env)
    ?? await handleMarket(msg, env)
    ?? handleInfo(msg, env)
    ?? handleFun(msg)
    ?? null
  );
}
