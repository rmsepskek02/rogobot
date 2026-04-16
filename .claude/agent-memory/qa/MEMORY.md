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
- `server/src/commands/index.js` — 명령어 파싱 디스패처 (리팩토링 후)
- `server/src/lostark-api.js` — 로스트아크 API 호출
- `server/src/lostark-build.js` — 응답 빌더 (HTML 파싱 주의)

## worktree 수정 미반영 주의 (2026-04-16)
- developer가 worktree에 수정을 전혀 적용하지 않고 완료로 표기하는 경우 있음
- QA 시 반드시 worktree 파일을 직접 Read해서 코드 변경 여부 줄 단위 확인 필수
- 발생 사례: market-fix — buildEgir 필터, buildGemPrice 고급 제외, !로펙 URL 등 3항목 모두 미적용

## 로스트아크 빌드 명령어 테스트 주의사항

### HTML 태그 노출 버그 패턴 (2026-04-16)
- `!보석`, `!악세`, `!앜패`, `!아크`, `!장비` 명령어 응답에 `<FONT color=...>`, `<img ...>`, `<br>` 등이 그대로 출력되는 경우
- 원인: API 응답 필드에 HTML 포함 + `stripHtml()` 미적용
- 확인 방법: 실제 응답 텍스트에 `<` 또는 `>` 문자 포함 여부 체크

### `!장비` 출력 형식
- 정상 형식: `부위: 강화수치[상급재련] 세트명(품질)`  예) `무기: 23[01] 운명(100)`
- 이상 징후: `A[00]` — NameTagBox 파싱 실패 또는 stripHtml 미적용

### `ItemPartBox` Element_000 조건 비교 패턴 (2026-04-16)
- API 응답의 `Element_000` 값이 HTML 태그로 감싸진 형태일 수 있음
  - 예: `"<FONT COLOR='#A9D0F5'>팔찌 효과</FONT>"`
- 엄격 비교(`===`) 사용 시 조건이 항상 false → 해당 블록 미실행
- QA 시 `===` 비교 대신 `.includes()` 사용 여부 확인 필수

### `!악세` 전체 출력 형식
- 목걸이/귀걸이/반지 정상 형식:
  ```
   - 고대 목걸이(81) 깨:13
  [중] 무공 480
  [상] 낙인력 8.00%
  [상] 아획량 6.00%
  ```
- 이상 징후: `(81) [` + 마지막 연마 줄에 `13]` 붙음 → 품질/포인트 사전 수집 미적용
- 무기공격력 `%` 연마 효과(`무공 3.00%` 등)에 등급 없음 → 퍼센트 무공 분기 미적용
- 어빌리티 스톤: `선.2 승.2` 형식 (각인명 첫 글자 + 레벨)

### `!악세` 팔찌 효과 출력 형식
- 정상 형식: 팔찌 이름 + 포인트 줄 아래에 각 효과가 `\n`으로 구분
  ```
  고대 팔찌 도약:18
   신속 83
   치명 119
  공격 및 이동 속도가 4% 증가한다.
  ```
- 이상 징후: 팔찌 이름만 나오고 효과 없음 → `includes('팔찌 효과')` 조건 미적용
