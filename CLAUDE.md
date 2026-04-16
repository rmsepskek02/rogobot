# 로고봇 프로젝트

## 개요
카카오 메신저봇 + Cloudflare Worker 기반 챗봇 프로젝트.
카카오톡에서 명령어를 입력하면 로스트아크 API 조회, 이미지 전송 등의 기능을 수행한다.

## 기술 스택
- **서버**: Cloudflare Workers (JavaScript)
- **봇 런타임**: 카카오 메신저봇 앱 (Android, Rhino JS)
- **외부 API**: 로스트아크 API, 카카오링크
- **배포**: wrangler (서버), 수동 복사 (봇 스크립트)

## 폴더 구조
[docs/architecture.md](docs/architecture.md) 참고

## 개발 규칙
- 시크릿(API 키, BOT_SECRET 등)은 절대 코드에 하드코딩 금지 — wrangler secrets 또는 환경변수 사용
- 주석은 한국어로 작성
- 로그는 `log/YYYY-MM-DD hh-mm-작업명/log.md` 형식으로 작업별 폴더에 저장
- 모바일(메신저봇 앱) 직접 조작이 필요한 작업은 최소화
- 작업할 내용을 사용자와 논의하며 작업 전 문서화에 대하여 물어볼 것

## 배포
- **서버**: `wrangler deploy` (Cloudflare Workers)
- **봇 스크립트**: 메신저봇 앱에 수동 복사

## 작업 사이클 프로토콜
[docs/work-cycle.md](docs/work-cycle.md) 참고

## 작업 문서화 규칙
- 작업 시작 전 `docs/YYYY-MM-DD hh-mm-작업명/Plan.md` 형식으로 폴더와 파일 생성
- Plan.md 작성 양식은 [docs/task-template.md](docs/task-template.md) 참고
- 작업 완료 후 [docs/task-history.md](docs/task-history.md)에 날짜, 작업명, Plan.md 경로 추가
- docs/ 에 새 문서를 추가할 때마다 [AGENTS.md](../AGENTS.md) 문서 인덱스에 반드시 추가

## 로그 규칙 (QA 에이전트)
- developer 작업 완료 후 QA 에이전트가 테스트 수행
- 테스트 완료 후 `log/YYYY-MM-DD hh-mm-작업명/log.md` 작성
- log.md 작성 양식은 [docs/log-template.md](docs/log-template.md) 참고
- 오류 발견 시 심각도([INFO] / [WARN] / [ERROR])를 표시하고 developer에게 피드백
- 오류가 없으면 작업 완료로 간주

## AI 행동 규칙
- 세션 시작 또는 컨텍스트 재개 시 [docs/ai-mistakes.md](docs/ai-mistakes.md)를 확인하여 과거 실수를 반복하지 않도록 한다

## 금지사항
 - 사용자의 명시적인 지시가 없으면 파일 수정하지 말 것 (Read와 같은 것은 가능)
 - 사용자의 명시적인 지시가 없으면 git 수정하지 말 것 (Read와 같은 것은 가능)
