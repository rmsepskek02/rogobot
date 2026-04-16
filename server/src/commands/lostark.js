// src/commands/lostark.js — 캐릭터 조회 및 로아 콘텐츠 명령어

import { lostarkGet, lostarkPost, getCharacterImage } from '../lostark-api.js';
import {
  buildCharacterInfo,
  buildCharacters, buildGems, buildSkills, buildEquipment,
  buildAccessories, buildEngravings, buildArkPassive, buildArkGrid,
  buildCollectibles, buildParadisePower, buildIsland,
} from '../lostark-build.js';

// !정보 캐릭터이름 — 캐릭터 전체 정보 (카카오링크)
async function handleCharacterInfo(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
  if (!data) return '캐릭터를 찾을 수 없습니다.';
  if (!data['ArmoryProfile']) return `${name} 캐릭터를 찾을 수 없습니다.`;
  return await buildCharacterInfo(data);
}

// !배럭/부캐 캐릭터이름 — 원정대 목록 + 주급 계산
async function handleBarrak(name, env) {
  const data = await lostarkGet(`/characters/${encodeURIComponent(name)}/siblings`, env.LOSTARK_API_KEY);
  if (!data) return '캐릭터를 찾을 수 없습니다.';
  return buildCharacters(data);
}

// !보석 캐릭터이름 — 보석 정보
async function handleGems(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}/gems`, env.LOSTARK_API_KEY);
  if (!data) return '쌀';
  return buildGems(data);
}

// !스킬 캐릭터이름 — 스킬 정보
async function handleSkills(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}/combat-skills`, env.LOSTARK_API_KEY);
  if (!data) return '평타맨';
  return buildSkills(data);
}

// !장비 캐릭터이름 — 장비 정보
async function handleEquipment(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
  if (!data) return '알몸';
  return buildEquipment(data);
}

// !악세 캐릭터이름 — 악세 정보
async function handleAccessories(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
  if (!data) return '그지';
  return buildAccessories(data);
}

// !각인 캐릭터이름 — 각인 정보
async function handleEngravings(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
  if (!data) return '응애';
  return buildEngravings(data);
}

// !앜패/ㅇㅍ 캐릭터이름 — 아크패시브 정보
async function handleArkPassive(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
  if (!data) return '3티어!!';
  return buildArkPassive(data);
}

// !아크/ㅇㅋ 캐릭터이름 — 아크그리드 정보
async function handleArkGrid(name, env) {
  const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
  if (!data) return '조빱!!!';
  return buildArkGrid(data);
}

// !내실 캐릭터이름 — 수집품/성향/스포
async function handleCollectibles(name, env) {
  const enc = encodeURIComponent(name);
  const [profileData, collectiblesData] = await Promise.all([
    lostarkGet(`/armories/characters/${enc}/profiles`, env.LOSTARK_API_KEY),
    lostarkGet(`/armories/characters/${enc}/collectibles`, env.LOSTARK_API_KEY),
  ]);
  if (!profileData || !collectiblesData) return '응애';
  return buildCollectibles(profileData, collectiblesData);
}

// !낙원력/낙원/ㄴㅇㄹ/ㄴㅇ 캐릭터이름 — 원정대 낙원력
async function handleParadisePower(name, env) {
  const siblings = await lostarkGet(`/characters/${encodeURIComponent(name)}/siblings`, env.LOSTARK_API_KEY);
  if (!siblings) return '캐릭터를 찾을 수 없습니다.';

  // 메인 캐릭터 서버 확인
  const mainChar = siblings.find(c => c.CharacterName === name);
  const mainServer = mainChar
    ? mainChar.ServerName
    : siblings.sort((a, b) => parseFloat(b.ItemAvgLevel.replace(/,/g, '')) - parseFloat(a.ItemAvgLevel.replace(/,/g, '')))[0].ServerName;

  // 같은 서버 캐릭터 레벨 내림차순
  const sameServer = siblings
    .filter(c => c.ServerName === mainServer)
    .sort((a, b) => parseFloat(b.ItemAvgLevel.replace(/,/g, '')) - parseFloat(a.ItemAvgLevel.replace(/,/g, '')));

  // 메인 먼저, 나머지 순서로 병렬 fetch
  const names = [name, ...sameServer.filter(c => c.CharacterName !== name).map(c => c.CharacterName)];
  const results = await Promise.all(
    names.map(n => lostarkGet(`/armories/characters/${encodeURIComponent(n)}`, env.LOSTARK_API_KEY))
  );
  const charEquipMap = Object.fromEntries(names.map((n, i) => [n, results[i]]));
  return buildParadisePower(charEquipMap, name);
}

// !섬/ㅅ/ㅆ — 쌀 섬 일정
async function handleIsland(env) {
  const data = await lostarkGet('/gamecontents/calendar', env.LOSTARK_API_KEY);
  if (!data) return '없음';
  return buildIsland(data);
}

// !아바타 캐릭터이름 — 아바타 이미지 (WORKER_BASE 환경변수 사용)
async function handleAvatar(name, env) {
  const imgUrl = await getCharacterImage(name);
  if (!imgUrl) return '캐릭터를 찾을 수 없습니다.';
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) return '이미지를 불러올 수 없습니다.';
  const buf = await imgRes.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  const uploadRes = await fetch(`${env.WORKER_BASE}/s`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/plain' },
    body: JSON.stringify({ image: b64, title: name }),
  });
  if (!uploadRes.ok) return '업로드 실패';
  return `${env.WORKER_BASE}/e/${await uploadRes.text()}`;
}

// 로스트아크 캐릭터/콘텐츠 명령어 디스패처
export async function handleLostark(msg, env) {
  // !정보
  if (msg.startsWith('!정보 ')) {
    const name = msg.slice(4).trim();
    if (name) return await handleCharacterInfo(name, env);
  }

  // !배럭/부캐/ㅂㅋ/ㅂㄹ/원정대/ㅇㅈㄷ
  for (const cmd of ['!배럭', '!부캐', '!ㅂㅋ', '!ㅂㄹ', '!원정대', '!ㅇㅈㄷ']) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) return await handleBarrak(name, env);
    }
  }

  // !보석
  if (msg.startsWith('!보석 ')) {
    const name = msg.slice(4).trim();
    if (name) return await handleGems(name, env);
  }

  // !스킬
  if (msg.startsWith('!스킬 ')) {
    const name = msg.slice(4).trim();
    if (name) return await handleSkills(name, env);
  }

  // !장비
  if (msg.startsWith('!장비 ')) {
    const name = msg.slice(4).trim();
    if (name) return await handleEquipment(name, env);
  }

  // !악세
  if (msg.startsWith('!악세 ')) {
    const name = msg.slice(4).trim();
    if (name) return await handleAccessories(name, env);
  }

  // !각인
  if (msg.startsWith('!각인 ')) {
    const name = msg.slice(4).trim();
    if (name) return await handleEngravings(name, env);
  }

  // !앜패/ㅇㅍ
  for (const cmd of ['!앜패', '!ㅇㅍ']) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) return await handleArkPassive(name, env);
    }
  }

  // !아크/ㅇㅋ
  for (const cmd of ['!아크', '!ㅇㅋ']) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) return await handleArkGrid(name, env);
    }
  }

  // !내실
  if (msg.startsWith('!내실 ')) {
    const name = msg.slice(4).trim();
    if (name) return await handleCollectibles(name, env);
  }

  // !낙원력/낙원/ㄴㅇㄹ/ㄴㅇ
  for (const cmd of ['!낙원력', '!낙원', '!ㄴㅇㄹ', '!ㄴㅇ']) {
    if (msg.startsWith(cmd + ' ')) {
      const name = msg.slice(cmd.length + 1).trim();
      if (name) return await handleParadisePower(name, env);
    }
  }

  // !섬/ㅅ/ㅆ
  if (['!섬', '!ㅅ', '!ㅆ'].includes(msg)) {
    return await handleIsland(env);
  }

  // !아바타
  if (msg.startsWith('!아바타 ')) {
    const name = msg.slice(5).trim();
    if (name) return await handleAvatar(name, env);
  }

  return null;
}
