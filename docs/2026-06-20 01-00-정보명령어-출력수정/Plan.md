# 정보명령어-출력수정

- **날짜**: 2026-06-20
- **담당**: developer / qa

## 목표
> `!정보` 명령어 카카오링크 출력의 3가지 포맷 문제를 수정한다.

## 작업 범위
- 수정 파일: `server/src/lostark-build.js`
- 영향받는 기능: `buildCharacterInfo` 함수

## 수정 내용

### 1. 겁작(보석) 쉼표 뒤 공백 제거
- 위치: 123번째 줄
- 현재: `dmg.join(', ')` / `cool.join(', ')`
- 변경: `dmg.join(',')` / `cool.join(',')`
- 출력 변화: `10, 10` → `10,10`

### 2. 각인 사이 공백 제거
- 위치: 80번째 줄 (아크패시브 각인), 81번째 줄 (스톤)
- 현재: `` engravings += `${n}${gr}${lv} ` ``  /  `` stone += `${n}${e['AbilityStoneLevel']} ` ``
- 변경: 뒤 공백 제거 → `` `${n}${gr}${lv}` `` / `` `${n}${e['AbilityStoneLevel']}` ``
- 출력 변화: `각4 마4` → `각4마4`

### 3. gemsDesc `/FON` 버그 수정
- 위치: 113번째 줄
- 원인: `gDesc.slice(-6, -2)`가 API 응답 HTML 태그 `</FONT>`의 일부를 잘라내어 `/FON` 출력
  - API 응답 원문: `"<FONT COLOR='#B7FB00'>기본 공격력 총합 : 4.95%</FONT>"`
  - `slice(-6, -2)` = `/FON`
- 현재: `gemsDesc += gDesc.slice(-6, -2) + stoneAtk`
- 변경: HTML 제거 후 정규식으로 퍼센트 값 추출
  ```js
  const pct = gDesc.replace(/<[^>]*>/g, '').match(/[\d.]+%/);
  gemsDesc += (pct ? pct[0] : '') + stoneAtk;
  ```
- 출력 변화: `공증:/FON+` → `공증:4.95%+`

## 완료 조건
- [ ] 겁작 출력에서 쉼표 뒤 공백 없음
- [ ] 각인 출력에서 항목 사이 공백 없음
- [ ] gemsDesc가 `공증:4.95%+...` 형태로 올바르게 출력됨
