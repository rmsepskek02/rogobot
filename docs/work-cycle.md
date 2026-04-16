# 작업 사이클 프로토콜

사용자와 작업 논의가 완료되면 아래 사이클을 자동으로 순서대로 진행한다.
사용자가 별도로 각 단계를 지시하지 않아도 된다.

에이전트 정의: [.claude/agents/](.claude/agents/)

## 1단계 — 문서화
- `docs/YYYY-MM-DD hh-mm-작업명/Plan.md` 생성
- [task-template.md](task-template.md) 양식에 따라 작성
- 사용자에게 Plan.md 내용 확인 요청 후 승인 받으면 다음 단계 진행

## 2단계 — 개발 (developer 에이전트)
- `.claude/agents/developer.md`에 정의된 **developer** 에이전트를 호출
- worktree 격리 모드(`isolation: "worktree"`)로 실행
- Plan.md를 컨텍스트로 전달하여 코드 작성 수행
- 작업 완료 후 변경 내용을 오케스트레이터(메인 Claude)에 보고

## 3단계 — 테스트 (qa 에이전트)
- `.claude/agents/qa.md`에 정의된 **qa** 에이전트를 호출
- developer 작업 결과물과 Plan.md를 컨텍스트로 전달
- 테스트 수행 후 `log/YYYY-MM-DD-hh:mm_작업명/log.md` 작성
- 오류 발견 시 → 2단계로 되돌아가 developer에 피드백 후 재작업
- 테스트 통과 시 → 다음 단계 진행

## 4단계 — 완료

### 코드 반영
- worktree 변경사항을 main 브랜치에 머지

### 문서 업데이트
- [task-history.md](task-history.md)에 날짜, 작업명, Plan.md 경로 추가
- 작업으로 인해 변경된 내용이 있으면 관련 문서 갱신
  - API 변경 → [api.md](api.md)
  - 폴더 구조 변경 → [architecture.md](architecture.md)
  - 배포 방식 변경 → CLAUDE.md
  - 새 문서 추가 → [AGENTS.md](../AGENTS.md) 인덱스

### 에이전트 메모리 업데이트
- **developer**: `.claude/agent-memory/developer/MEMORY.md`에 작업 중 발견한 패턴, 주의사항 기록
- **qa**: `.claude/agent-memory/qa/MEMORY.md`에 발견한 버그 패턴, 테스트 주의사항 기록

### 실수 기록
- 작업 사이클 중 잘못된 판단, 규칙 미준수, 반복된 오류가 있었다면 [docs/ai-mistakes.md](ai-mistakes.md)에 기록
- 작성 양식: 상황 / 실수 / 원인 / 방지책
- 사소한 실수도 반복될 가능성이 있으면 기록한다

### 완료 보고
- 사용자에게 작업 내용, 변경 파일, 업데이트된 문서 목록 보고
