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
- 명령어 처리: `server/src/commands/index.js` (리팩토링 후 commands/ 하위로 분산)

---

## 로스트아크 API 응답 파싱 주의사항

### HTML 태그 포함 필드 (2026-04-16)
- 로아 API 응답의 일부 문자열 필드에 `<FONT>`, `<img>`, `<br>` 등 HTML 태그가 포함됨
- 영향받는 파서: `buildGems`, `parsePolishing`, `parseAccePiece`, `buildArkPassive`, `buildArkGrid`, `buildEquipment`
- `lostark-build.js`에 `stripHtml()` 헬퍼 추가됨 — 문자열 파싱 전 반드시 적용할 것
  ```js
  function stripHtml(str) {
    if (!str) return '';
    return str.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
  }
  ```
- `parsePolishing()`은 함수 진입 시 제일 먼저 `stripHtml` 적용 — 미적용 시 POLISHING_ABBR 정규식 불일치로 등급 오판 발생

### `ItemPartBox` Element_000 HTML 태그 감싸짐 (2026-04-16)
- `ItemPartBox` 타입의 `Element_000` 값이 HTML 태그로 감싸진 형태일 수 있음
  - 예: `"<FONT COLOR='#A9D0F5'>팔찌 효과</FONT>"`
- 엄격 비교(`===`) 대신 `.includes()`로 비교해야 함
  - 수정 전: `t.value?.Element_000 === '팔찌 효과'`
  - 수정 후: `t.value?.Element_000?.includes('팔찌 효과')`
- `추가 효과` 조건에도 동일한 문제가 있을 수 있으나 미확인 (현재는 엄격 비교 유지 중)

### 팔찌 효과 출력 패턴 (2026-04-16)
- `stripHtml`이 `<br>` → `\n` 변환을 처리하므로 별도 replace 체인 불필요
- 각 줄을 `.split('\n').filter(l => l.trim())`으로 빈 줄 제거 후 각 줄 앞에 `\n` 추가
  ```js
  const lines = stripHtml(t.value.Element_001 || '').split('\n').filter(l => l.trim());
  for (const line of lines) out += '\n' + line;
  ```

### `parseAccePiece` 품질/포인트 출력 패턴 (2026-04-16)
- 품질값과 아크패시브 포인트를 사전 수집 후 한 줄에 출력: `(품질) 깨:포인트`
  ```js
  let qVal = 0, ptName = '', ptVal = '';
  for (const t of tips) {
    if (t.type === 'ItemTitle') qVal = t.value?.qualityValue ?? 0;
    if (isArkPassive && t.type === 'ItemPartBox' && t.value?.Element_000?.includes('포인트')) {
      const m = stripHtml(t.value.Element_001 || '').match(/(\S+)\s+\+?(\d+)/);
      if (m) { ptName = m[1]; ptVal = m[2]; }
    }
  }
  ```
- 팔찌는 `이름 포인트명:값` 형식, 연마는 별도 루프로 추가
- 무기공격력 `%` 연마 효과는 gradeMap과 별도 분기 필요 (티어4 기준: 상 3.00%, 중 1.80%, 하 0.80%)

### buildEgir() 인덱스 구조 (2026-04-16)
- `handleEgir`의 queries 배열 순서와 `buildEgir()`의 `i` 인덱스가 반드시 일치해야 함
  - 0: 운명, 1: 용암의 숨결, 2: 빙하의 숨결, 3: 아비도스
  - 4: 장인의 야금술, 5: 장인의 재봉술
  - 6: 야금술 업화, 7: 재봉술 업화
  - 8: 쫄깃한 꼬치구이, 9: 허브 스테이크, 10: 채끝 스테이크
- 인덱스 기반 필터는 queries 순서 변경 시 반드시 함께 수정해야 함

### `!장비` NameTagBox / SingleTextBox 파싱 (2026-04-16)
- 강화 수치: `NameTagBox` 타입의 value에서 `+NN` 패턴 추출, `+` 기호 제외한 숫자만 사용
  ```js
  const m = clean.match(/^\+(\d+)/);
  if (m) name2 = m[1];  // "23" (not "+23")
  ```
- 상급 재련: `SingleTextBox` 타입의 value에서 `상급 재련 N단계` 패턴 추출
  ```js
  const m = clean.match(/상급 재련\D*?(\d+)\s*단계/);
  if (m) enhancement = m[1].padStart(2, '0');
  ```
