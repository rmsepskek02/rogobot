# 개발 가이드

## 로컬 개발 환경 설정

### 필수 도구
- Node.js
- Wrangler CLI: `npm install -g wrangler`

### 서버 로컬 실행
```bash
cd server
wrangler dev
```

### 시크릿 설정 (최초 1회)
```bash
wrangler secret put BOT_SECRET
wrangler secret put LOSTARK_API_KEY
```

---

## 배포

### 서버 배포
```bash
cd server
wrangler deploy
```

### 봇 스크립트 배포
1. `msgbot/Bots/로고봇/로고봇.js` 내용 복사
2. 메신저봇 앱에 붙여넣기 후 저장

---

## 로그 관리

- 로그 저장 위치: `log/YYYY-MM-DD/`
- 봇 런타임 오류: `msgbot/FATAL_ERROR_LOG.log`
- 봇 전체 로그: `msgbot/GLOBAL_LOG.json`
