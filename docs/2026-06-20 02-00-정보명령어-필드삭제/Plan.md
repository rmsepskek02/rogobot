# 정보명령어-필드삭제

- **날짜**: 2026-06-20
- **담당**: developer / qa

## 목표
> `!정보` 명령어 카카오링크 출력에서 불필요한 필드 2개를 삭제한다.

## 작업 범위
- 수정 파일: `server/src/lostark-build.js`
- 영향받는 함수: `buildCharacterInfo`

## 수정 내용

### 1. title에서 캐릭터 레벨(전) 삭제 (143번째 줄)
- 현재: `const title = \`${itemLevel} / ${weapon}\n${expLevel} / ${charLevel} / ${avgQuality}\``
- 변경: `const title = \`${itemLevel} / ${weapon}\n${expLevel} / ${avgQuality}\``
- 출력 변화: `렙/무강/원/전/품` → `렙/무강/원/품`

### 2. stats에서 진화/깨달음 포인트 삭제 (137번째 줄)
- 현재: `const stats = \`공: ${atk} 최생: ${maxHp}\n${evName}: ${evVal} ${rlName}: ${rlVal} \``
- 변경: `const stats = \`공: ${atk} 최생: ${maxHp} \``
- 출력 변화: `공: ... 최생: ...\n진: 140 깨: 101 공증:...` → `공: ... 최생: ... 공증:...`

## 완료 조건
- [ ] title에서 `/ ${charLevel}` 제거됨
- [ ] stats에서 `\n${evName}: ${evVal} ${rlName}: ${rlVal} ` 제거됨
- [ ] 나머지 코드 변경 없음
