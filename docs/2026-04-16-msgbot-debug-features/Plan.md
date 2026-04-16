# Msgbot Debug Features

- **날짜**: 2026-04-16
- **담당**: developer / qa

## 목표
> 메신저봇 스크립트(`로고봇.js`)에 디버그/알림 편의 기능 3가지를 추가한다.
> - 한용희 수신 시 봇 동작 확인용 'test' 자동 응답
> - 전역 에러를 한용희에게 카카오톡으로 전송
> - `!문의` 명령어로 한용희에게 메시지 전달

## 작업 범위

### 수정/추가할 파일
- `msgbot/Bots/로고봇/로고봇.js` — 기능 3가지 추가

### 영향받는 기능
- `onNotificationPosted` — 한용희 감지, `!문의` 명령어, 에러 처리

## 작업 계획

### 1단계 — 한용희 replier 저장 로직
- 전역 변수 `hanReplier` 선언
- 스크립트 로드 시 `NotificationListener.Companion.getSession`으로 캐시 복원 시도
- `onNotificationPosted`에서 sender가 `'한용희'`이면 `hanReplier` 갱신

### 2단계 — 기능 1: 한용희 수신 시 'test' 응답
- sender가 `'한용희'`이면 서버 전송 전에 `replier.reply('test')` 실행

### 3단계 — 기능 2: 전역 에러 → 한용희 전송
- `onNotificationPosted` 전체를 `try-catch`로 감싸기
- catch 블록에서 `hanReplier`가 존재하면 아래 형식으로 전송:
  ```
  [ERROR] 로고봇.js
  오류: <e.message>
  줄: <e.lineNumber>
  ```
- `hanReplier`가 없으면 `Log.error`로만 기록

### 4단계 — 기능 3: `!문의 할말` 명령어
- 누구든 `!문의 ` 으로 시작하는 메시지를 보내면 `할말` 부분을 추출
- `hanReplier`가 있으면 한용희에게 전달, 없으면 발신자에게 "한용희 세션 없음" 안내

## 완료 조건
- [ ] sender가 '한용희'이면 'test' 자동 응답
- [ ] 에러 발생 시 한용희에게 에러 메시지/줄번호 전송 (hanReplier 있을 때)
- [ ] `!문의 할말` 명령어 동작 확인
- [ ] 앱 재시작 후 getSession 복원 경로 코드 포함

## 이슈 및 메모
- `getSession` 반환값이 null일 수 있으므로 null 체크 필수
- 에러 전송 실패 자체가 에러를 유발할 수 있으므로 catch 안에서 에러 전송 시 try-catch 중첩
- Rhino JS에서 `e.lineNumber`는 항상 존재하지 않을 수 있으므로 fallback 처리
- `!문의` 뒤에 공백 없이 입력한 경우(`!문의`만) 안내 메시지 출력
