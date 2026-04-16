# Developer Agent Memory

작업하면서 발견한 패턴, 결정사항, 주의사항을 여기에 기록한다.

---

## 메신저봇 스크립트 (`로고봇.js`) 패턴

### hanReplier 저장 패턴
- 특정 사람에게 능동적으로 메시지를 보내려면 전역 변수에 replier를 저장해야 함
- 스크립트 재컴파일 시 `NotificationListener.Companion.getSession(packageName, room)`으로 복원 가능
- 앱 재시작 시에는 복원 불가 — 해당 사람이 메시지를 보내야 갱신됨

### Thread 블록 보존 주의
- `new java.lang.Thread(...)` 자동 세션 초기화 블록은 절대 제거하지 말 것
- getSession IIFE는 Thread 블록 **다음**에 위치해야 함

### Rhino JS 주의사항
- `var` 사용 권장 (let/const는 환경에 따라 불안정)
- Java 예외 시 `e.message`가 undefined일 수 있음 → `e.message || String(e)` 사용
- `e.lineNumber`는 null일 수 있으므로 항상 null 체크 후 사용

### 에러 전송 중첩 방지
- catch 블록 안에서 에러 알림을 전송할 때 try-catch로 한 번 더 감싸야 함
- 에러 전송 자체가 실패해도 루프가 중단되면 안 됨

### 주요 파일 경로
- 메신저봇 스크립트: `msgbot/Bots/로고봇/로고봇.js`
- 서버 라우팅: `server/worker.js`
- 명령어 처리: `server/src/commands.js`
