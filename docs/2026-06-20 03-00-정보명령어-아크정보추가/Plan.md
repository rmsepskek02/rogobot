# 정보명령어-아크정보추가

- **날짜**: 2026-06-20
- **담당**: developer / qa

## 목표
> `!정보` 카카오링크 출력에서 stat/character/description 필드를 재구성하고,
> 아크패시브(진화·깨달음) 및 아크그리드 코어 등급 정보를 추가한다.

## 작업 범위
- 수정 파일: `server/src/lostark-build.js`
- 영향받는 함수: `buildCharacterInfo`

---

## 수정 내용

### 1. stoneAtk 초기값 변경
- 현재: `let stoneAtk = '+'`
- 변경: `let stoneAtk = ''`
- 이유: 스톤 파싱 실패 시 불필요한 `+` 출력 방지

### 2. `stat` 필드 재구성
- 현재: `공: ${atk} 최생: ${maxHp} ` + gemsDesc
- 변경: `공: ${atk} ` + gemsDesc + ` 최생: ${maxHp} ` + 특화/신속
- 출력 예시: `공: 220262 공증:13.20% 최생: 416252 특화575 신속1837`
- 특성 중 특화/신속만 뽑아 뒤에 이어붙임 (값 >= 100인 Stats에서 Type이 특화 또는 신속인 것)

### 3. `character` 필드 → 진화 4·5티어 정보
- 현재: charStat (특성값 ≥ 100인 스탯들)
- 변경: `ArkPassive.Effects`에서 진화 4·5티어 노드 추출 후 축약
- 축약 규칙:
  - 진화 4티어: 스킬명 첫 글자 연결 (레벨 생략) → `회달`
  - 진화 5티어: 스킬명 단어별 첫 글자 + 레벨 → `음돌2` / 2개면 `음돌1 뭉가1`
  - 형식: `회달 / 음돌2`
- Description 파싱: HTML 제거 후 `"진화 N티어 스킬명 Lv.X"` 형태에서 추출

### 4. `description` 필드 재구성
- 현재: `${className} / ${server}`
- 변경: `${server} / ${className} / 깨달음1티어약어 / 코어등급집계`
- 깨달음 1티어 축약:
  - `ArkPassive.Effects`에서 Name==="깨달음", Description에 "1티어" 포함인 것 추출
  - 스킬명 단어별 첫 글자 연결 (레벨 생략) → `진용`
- 코어 등급 집계:
  - `ArkGrid.Slots[i].Grade` 카운트
  - 등급 약어: 고대→고, 전설→전, 유물→유, 영웅→영
  - 순서: 고대 > 전설 > 유물 > 영웅, 개수 0이면 생략
  - 출력 예시: `2고2전2유`
- 최종 예시: `루페온 / 바드 / 진용 / 2고2전2유`

---

## 헬퍼 함수

```js
// 스킬명 각 단어 첫 글자 연결
function abbrevSkill(name) {
  return name.split(' ').map(w => w[0]).join('');
}

// ArkPassive.Effects에서 티어별 스킬 추출
// Description HTML 제거 후: "진화 4티어 회심 Lv.1" 형태
function parseArkTier(effects, name, tier) {
  return effects
    .filter(e => e['Name'] === name && e['Description']?.includes(`${tier}티어`))
    .map(e => {
      const clean = e['Description'].replace(/<[^>]*>/g, '');
      const m = clean.match(/\d티어 (.+) Lv\.(\d+)/);
      return m ? { skill: m[1], lv: parseInt(m[2]) } : null;
    })
    .filter(Boolean);
}
```

## 완료 조건
- [ ] stoneAtk 초기값 `''`로 변경됨
- [ ] stat 필드: `공 공증 최생 특화신속` 순서
- [ ] character 필드: 진화 4티어 + 5티어 약어 (`회달 / 음돌2`)
- [ ] description 필드: `서버 / 직업 / 깨달음1티어 / 코어등급` 형식
- [ ] ArkGrid 없을 경우 코어등급 생략 처리 (null 체크)
