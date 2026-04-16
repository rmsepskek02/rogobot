# QA 에이전트 메모리

## 반복 확인 항목

### 시크릿 하드코딩 체크
- `로고봇.js` 라인 12: BOT_SECRET이 코드에 직접 기재되어 있음 (2026-04-16 확인)
- 메신저봇 앱 환경은 환경변수 사용 불가 — 매 QA마다 하드코딩 여부 확인 필수
- 관련 CLAUDE.md 규칙: "시크릿은 절대 코드에 하드코딩 금지"

### 조건 분기 순서 패턴
- `onNotificationPosted`에서 sender 체크와 명령어 체크가 독립 if로 구성될 경우
  이중 응답 발생 가능성 확인 필요 (continue/return 누락 여부)

## Rhino JS 환경 주의사항

- `e.message`는 Java 예외 객체에서 undefined일 수 있음 → `e.message || String(e)` 권장
- `e.lineNumber`는 항상 존재하지 않음 → null 체크 + fallback 필수
- let/const는 Rhino ES6+ 환경에서 허용되지만 var 사용이 안전
- Java Map(LinkedHashMap 등)은 `Object.keys()`로 키를 얻지 못할 수 있음 → forEach 분기 필요

## 자주 확인하는 파일

- `msgbot/Bots/로고봇/로고봇.js` — 메신저봇 메인 스크립트
- `server/worker.js` — Cloudflare Worker 라우팅
- `server/src/commands.js` — 명령어 파싱
- `server/src/lostark-api.js` — 로스트아크 API 호출
