# Market Fix

- **날짜**: 2026-04-16
- **담당**: developer / qa

## 목표

`!ㅇㄱㄹ`, `!젬가격`, `!로펙` 명령어의 출력 오류를 수정한다.

---

## 작업 1 — `!ㅇㄱㄹ` 불필요 항목 제거

### 현재 문제
- `장인의 야금술/재봉술` 1단계, 2단계가 출력됨
- `야금술/재봉술 : 업화 [15-18]`이 출력됨

### 수정 파일
- `server/src/lostark-build.js` — `buildEgir()`

### 수정 내용
`buildEgir()` 내 각 항목에 필터 조건 추가:
```js
// 장인의 야금술/재봉술 1·2단계 제외
if ((i === 4 || i === 5) && (item.Name.includes('1단계') || item.Name.includes('2단계'))) continue;
// 업화 [15-18] 제외
if ((i === 6 || i === 7) && item.Name.includes('15-18')) continue;
```

> `i` 인덱스는 `handleEgir`의 queries 배열 순서 기준:
> - 4: 장인의 야금술, 5: 장인의 재봉술, 6: 야금술 : 업화, 7: 재봉술 : 업화

---

## 작업 2 — `!젬가격` 고급 등급 제외

### 현재 문제
- `고급` 등급 젬이 결과에 포함되어 출력됨

### 수정 파일
- `server/src/lostark-build.js` — `buildGemPrice()`

### 수정 내용
```js
for (const item of [...(data1.Items || []), ...(data2.Items || [])]) {
  if (item.Grade === '고급') continue; // 추가
  out += `${item.Grade} ${item.Name} / ${Math.round(item.YDayAvgPrice)} / ${item.CurrentMinPrice}\n`;
}
```

---

## 작업 3 — `!로펙` URL 수정

### 현재 문제
- `https://legacy.lopec.kr/search/search.html?headerCharacterName=이름` 형식 사용

### 수정 파일
- `server/src/commands/info.js`

### 수정 내용
```js
// 수정 전
return `https://legacy.lopec.kr/search/search.html?headerCharacterName=${encodeURIComponent(nick)}`;
// 수정 후
return `https://lopec.kr/character/specPoint/${encodeURIComponent(nick)}`;
```

---

## 완료 조건

- [ ] `!ㅇㄱㄹ` — 1단계, 2단계, [15-18] 업화 미출력
- [ ] `!젬가격` — 고급 등급 미출력
- [ ] `!로펙 캐릭터명` — `https://lopec.kr/character/specPoint/캐릭터명` 출력
- [ ] `wrangler deploy --dry-run` 에러 없음

## 이슈 및 메모

- `buildEgir`의 인덱스 기반 필터 로직은 `handleEgir`의 queries 배열 순서와 반드시 일치해야 함
- `!로펙` 단독 입력 시 기본 URL(`https://lopec.kr/`) 은 그대로 유지
