# 아키텍처

## 폴더 구조

```
server/             → Cloudflare Worker
  worker.js         → 진입점 (라우팅)
  wrangler.toml     → 배포 설정
  src/
    response.js     → 응답 헬퍼 (rawJson, rawPlain 등)
    kakao.js        → 카카오 인증/세션
    kakao-crypto.js → CryptoJS 번들
    lostark-api.js  → 로아 API 호출
    lostark-build.js→ 로아 빌드 정보 파싱
    commands/
      index.js      → processMessage 디스패처
      lostark.js    → 캐릭터 조회 명령어
      market.js     → 시세/거래소 명령어
      fun.js        → 재미/랜덤 명령어
      info.js       → 정보성 명령어

msgbot/Bots/        → 메신저봇 앱 스크립트
  로고봇/           → 메인 봇 로직

docs/               → 프로젝트 문서
  api.md            → 서버 엔드포인트 및 외부 API 명세
  guide.md          → 로컬 개발 환경 설정, wrangler 사용법
  architecture.md   → 시스템 구조 및 데이터 흐름 (이 파일)
  task-template.md  → Plan.md 작성 템플릿
  log-template.md   → log.md 작성 템플릿
  task-history.md   → 작업 이력
  YYYY-MM-DD hh-mm-작업명/ → 작업별 계획 문서
    Plan.md

log/                → 작업별 로그
  YYYY-MM-DD hh-mm-작업명/ → 작업별 테스트 로그
    log.md
```

## 시스템 구조

```
카카오톡 사용자
      ↓ 메시지 전송
메신저봇 앱 (Android)
  msgbot/Bots/로고봇/로고봇.js
      ↓ HTTP 요청
Cloudflare Worker
  server/worker.js
      ├── 카카오 인증  (src/kakao.js)
      ├── 명령어 처리  (src/commands/index.js → lostark/market/fun/info)
      └── 로아 API    (src/lostark-*.js)
              ↓
      로스트아크 API
```

## 데이터 흐름

### 일반 명령어
1. 사용자 → 카카오톡 메시지 입력
2. 메신저봇 앱이 메시지 감지 → Worker로 POST
3. Worker가 명령어 파싱 → 응답 생성
4. 응답을 메신저봇 앱으로 반환 → 카카오톡으로 전송

### 이미지 전송 (카카오링크)
1. Worker가 이미지를 KV에 저장 → 키 발급
2. `/e/<key>` URL을 카카오링크로 전송
3. 카카오가 OG 태그 파싱 → 이미지 미리보기 표시
