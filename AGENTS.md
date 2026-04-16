# 에이전트 정의

## developer
- **역할**: 기능 구현 및 코드 작성
- **담당 범위**: server/, msgbot/Bots/
- **작업 완료 조건**: 코드 작성 후 QA 에이전트에 테스트 요청

## qa
- **역할**: 작성된 코드 테스트 및 오류 검증
- **담당 범위**: 전체 (서버 응답, 봇 로직, API 연동)
- **작업 완료 조건**: 테스트 결과를 log/에 기록, 오류 발견 시 developer에 피드백

---

# 문서 인덱스

## 프로젝트 관리
| 문서 | 경로 | 설명 |
|------|------|------|
| 프로젝트 규칙 | [CLAUDE.md](CLAUDE.md) | 개발 규칙, 폴더 구조, 배포 방법 |
| 에이전트/문서 인덱스 | [AGENTS.md](AGENTS.md) | 이 파일 |

## 기술 문서
| 문서 | 경로 | 설명 |
|------|------|------|
| API 명세 | [docs/api.md](docs/api.md) | 서버 엔드포인트 및 외부 API 정리 |
| 개발 가이드 | [docs/guide.md](docs/guide.md) | 로컬 개발 환경 설정, wrangler 사용법 |
| 아키텍처 | [docs/architecture.md](docs/architecture.md) | 시스템 구조 및 데이터 흐름 |
| 작업 사이클 | [docs/work-cycle.md](docs/work-cycle.md) | 작업 진행 프로토콜 (논의 → 개발 → QA → 완료) |
| 기능 현황 | [docs/feature-status.md](docs/feature-status.md) | msgbot → server 이전 현황 (완료/보류/폐기) |
| AI 실수 기록 | [docs/ai-mistakes.md](docs/ai-mistakes.md) | AI가 반복하지 말아야 할 실수 목록 |

## 템플릿
| 문서 | 경로 | 설명 |
|------|------|------|
| 작업 계획 양식 | [docs/task-template.md](docs/task-template.md) | Plan.md 작성 템플릿 |
| 테스트 로그 양식 | [docs/log-template.md](docs/log-template.md) | log.md 작성 템플릿 |

## 작업 이력
[docs/task-history.md](docs/task-history.md)

## 진행 중인 작업
| 작업명 | 경로 |
|--------|------|
| Feature Migration & Cleanup | [docs/2026-04-16-feature-migration/Plan.md](docs/2026-04-16-feature-migration/Plan.md) |

## 로그
| 경로 | 설명 |
|------|------|
| log/YYYY-MM-DD-hh:mm_작업명/log.md | 작업별 테스트 및 운영 로그 |
| msgbot/FATAL_ERROR_LOG.log | 봇 런타임 치명적 오류 |
| msgbot/GLOBAL_LOG.json | 봇 전체 로그 |
