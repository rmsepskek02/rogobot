# Msgbot Debug Features 테스트 로그

- **날짜**: 2026-04-16 15:30
- **담당**: qa
- **연관 Plan**: [docs/2026-04-16-msgbot-debug-features/Plan.md](../../docs/2026-04-16-msgbot-debug-features/Plan.md)

## 테스트 결과 요약
- 전체: 11건 / 성공: 9건 / 실패: 2건

## 테스트 항목

| 항목 | 결과 | 비고 |
|------|------|------|
| sender가 '한용희'이면 'test' 자동 응답 | ✅ | 라인 148-151 |
| 에러 발생 시 한용희에게 에러 메시지/줄번호 전송 (hanReplier 있을 때) | ✅ | 라인 189-201 |
| `!전달 할말` 명령어 — 누구나 사용 가능, 한용희에게 전달 | ✅ | 라인 161-172 |
| 앱 재시작 후 getSession 복원 경로 코드 포함 | ✅ | 라인 109-119 IIFE |
| hanReplier가 null인 경우 처리 | ✅ | 라인 165, 194 null 체크 |
| `!전달`만 입력한 경우 (내용 없음) 안내 메시지 | ✅ | 라인 163-164 |
| e.lineNumber가 없는 경우 fallback 처리 | ✅ | 라인 195 null 체크 + fallback |
| 에러 전송 중 이중 예외 방지 (중첩 catch) | ✅ | 라인 193-200 |
| Rhino JS 호환성 (var 사용) | ✅ | 전체 스크립트 var 사용 |
| BOT_SECRET 시크릿 관리 | ❌ | 라인 12 하드코딩 |
| 한용희가 !세션/!전달 명령어 입력 시 동작 명확성 | ❌ | test 응답 + 명령어 처리 이중 응답 |

## 로그 상세

```
[INFO] 완료 조건 1 — sender === "한용희" 분기 (라인 148)에서 hanReplier 갱신 후
       replier.reply("test") 실행. 구현 정상.

[INFO] 완료 조건 2 — onNotificationPosted 전체 try-catch (라인 146/189),
       catch 내부 중첩 try-catch (라인 193)로 에러 전송 실패 방어.
       e.lineNumber null 체크 후 "줄: 알 수 없음" fallback. 구현 정상.

[INFO] 완료 조건 3 — msg.startsWith("!전달") 분기, msg.length > 3으로 내용 추출,
       trim()으로 공백만 입력한 경우도 빈 문자열 처리. hanReplier null 체크 안내 포함.

[INFO] 완료 조건 4 — 스크립트 로드 시 IIFE(라인 109-119)로 getSession 호출 후
       null이 아니면 SessionCacheReplier 생성. null이면 복원 건너뜀. catch로 예외 처리.

[INFO] Rhino JS 호환성 — 신규 추가 코드 포함 전체 스크립트에 let/const 미사용
       (const는 상수 선언 4곳만 사용, Rhino ES6+ 환경에서 허용됨). 정상.

[ERROR] BOT_SECRET 하드코딩 — 라인 12: const BOT_SECRET = "rogobot2024"
        CLAUDE.md 개발 규칙 "시크릿은 절대 하드코딩 금지" 위반.
        메신저봇 앱 환경은 환경변수/wrangler secrets 사용 불가하므로
        별도 설정 파일(예: config.js)로 분리하거나, 빌드 시 치환하는 방식 필요.
        현재 코드 그대로 저장소에 커밋되면 시크릿이 노출됨.

[WARN] 한용희가 !세션 명령어를 입력하면 — 라인 148-151에서 'test' 응답이 먼저 나간 뒤,
       continue 없이 라인 154의 !세션 분기로도 진입하여 "세션 갱신 완료/실패"까지
       두 번 응답이 전송됨. !전달의 경우도 동일. Plan.md에 이 케이스 명시 없음.
       의도적 동작인지 확인 필요.

[WARN] e.message undefined 가능성 — 라인 196에서 에러 전송 시 e.message를 사용.
       Rhino JS 환경에서 Java 예외가 throw되면 e.message가 undefined일 수 있음.
       (sendToServer, uploadSession의 org.jsoup 관련 예외 등)
       String(e)는 이미 라인 191에서 사용하고 있으므로 에러 전송 시도
       String(e)를 fallback으로 추가하는 것이 안전함.
```

## 오류 내용

### [ERROR] BOT_SECRET 하드코딩 (라인 12)
```js
const BOT_SECRET = "rogobot2024";
```
- 위치: `로고봇.js` 라인 12
- CLAUDE.md 개발 규칙 위반 사항
- 이 파일이 git에 커밋되면 시크릿이 저장소에 노출됨

### [WARN] 한용희가 !세션/!전달 입력 시 이중 응답 (라인 148-172)
```js
if (sender === "한용희") {
  hanReplier = replier;
  replier.reply("test");       // 응답 1
}
if (msg === "!세션") {
  var ok = uploadSession();
  replier.reply(ok ? "세션 갱신 완료" : "세션 갱신 실패 - 로그 확인");  // 응답 2
  continue;
}
```
- 한용희가 `!세션`을 입력하면 "test" + "세션 갱신 완료/실패" 두 응답이 나감
- `!전달`도 동일한 문제 발생
- Plan.md에 이 케이스에 대한 정책 없음 — 의도 확인 필요

### [WARN] e.message undefined 가능성 (라인 196)
```js
hanReplier.reply("[ERROR] " + scriptName + ".js\n오류: " + e.message + "\n" + lineInfo);
```
- Java 예외 객체의 경우 e.message가 undefined일 수 있음
- 제안: `(e.message || String(e))` 로 fallback 추가

## developer 피드백

수정 요청 사항 (우선순위 순):

1. **[ERROR] BOT_SECRET 하드코딩 해결 필요**
   - `rogobot2024` 값이 코드에 직접 기재되어 있음
   - 메신저봇 앱 환경에서 환경변수 사용이 불가한 경우, 별도 `config.js` 파일로 분리하고 `.gitignore`에 추가하거나 빌드 시 치환하는 파이프라인 필요
   - 최소한 현재 값이 저장소에 커밋되지 않도록 조치 필요

2. **[WARN] 한용희가 !세션/!전달 입력 시 이중 응답 처리 정책 결정**
   - 현재 구조상 sender === "한용희" 블록과 명령어 분기가 독립적으로 실행됨
   - 의도적 동작이라면 Plan.md에 명시 요청
   - 의도적 동작이 아니라면 sender === "한용희" 블록 내에서 명령어 분기 처리 후 `continue`로 조기 탈출 또는 명령어 처리 후 test 응답 제외 로직 추가 필요

3. **[WARN] e.message undefined fallback 추가**
   - 라인 196을 `e.message || String(e)` 로 변경 권장
