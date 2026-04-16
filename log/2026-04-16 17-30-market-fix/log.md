# Market Fix 테스트 로그

- **날짜**: 2026-04-16 17:30
- **담당**: qa
- **연관 Plan**: [docs/2026-04-16 17-30-market-fix/Plan.md](../../docs/2026-04-16%2017-30-market-fix/Plan.md)

## 테스트 결과 요약
- 전체: 4건 / 성공: 1건 / 실패: 3건

## 테스트 항목

| 항목 | 결과 | 비고 |
|------|------|------|
| `buildEgir` 필터 추가 | ❌ | 장인 1·2단계, [15-18] 업화 필터 미적용 |
| `buildGemPrice` 고급 제외 | ❌ | `if (item.Grade === '고급') continue;` 미적용 |
| `!로펙` URL 변경 | ❌ | legacy.lopec.kr URL 그대로, 단독 입력 기본 URL은 정상 |
| `wrangler deploy --dry-run` | ✅ | 에러 없음 |

## 로그 상세

```
[ERROR] buildEgir: Plan.md의 두 필터 조건이 모두 누락됨
  - (i === 4 || i === 5) 장인 1·2단계 제외 필터 없음
  - (i === 6 || i === 7) && item.Name.includes('15-18') 업화 제외 필터 없음
  - 기존 includes('11') 필터만 존재 (lostark-build.js:713)

[ERROR] buildGemPrice: 고급 등급 제외 로직 누락
  - for loop 내 `if (item.Grade === '고급') continue;` 없음 (lostark-build.js:727-729)

[ERROR] handleInfo !로펙 URL 미변경
  - 현재: https://legacy.lopec.kr/search/search.html?headerCharacterName=${encodeURIComponent(nick)}
  - 기대: https://lopec.kr/character/specPoint/${encodeURIComponent(nick)}
  - 단독 입력 기본 URL(https://lopec.kr/)은 정상 유지됨 (info.js:67)

[INFO] wrangler deploy --dry-run 에러 없음 (57.67 KiB)
```

## 오류 내용

### [ERROR] buildEgir 필터 미적용
- **파일**: `server/src/lostark-build.js` 708~721행
- **현재 코드**: `if ((i === 6 || i === 7) && item.Name.includes('11')) continue;` 만 존재
- **누락된 코드**:
  ```js
  if ((i === 4 || i === 5) && (item.Name.includes('1단계') || item.Name.includes('2단계'))) continue;
  if ((i === 6 || i === 7) && item.Name.includes('15-18')) continue;
  ```

### [ERROR] buildGemPrice 고급 제외 미적용
- **파일**: `server/src/lostark-build.js` 724~731행
- **현재 코드**: 고급 등급 필터 없이 전체 아이템 출력
- **누락된 코드**:
  ```js
  if (item.Grade === '고급') continue;
  ```

### [ERROR] !로펙 URL 미변경
- **파일**: `server/src/commands/info.js` 65행
- **현재**: `https://legacy.lopec.kr/search/search.html?headerCharacterName=${encodeURIComponent(nick)}`
- **기대**: `https://lopec.kr/character/specPoint/${encodeURIComponent(nick)}`

## developer 피드백

Plan.md에 명시된 3개 수정 사항이 모두 worktree 파일에 반영되지 않았습니다.
재작업 요청:

1. `server/src/lostark-build.js` `buildEgir()` 함수 내 누락된 두 줄 추가
2. `server/src/lostark-build.js` `buildGemPrice()` 함수 내 고급 등급 제외 조건 추가
3. `server/src/commands/info.js` `!로펙` URL을 `https://lopec.kr/character/specPoint/` 형식으로 변경

---

## 재검증 결과 (2026-04-16)

- 전체: 4건 / 성공: 4건 / 실패: 0건

| 항목 | 결과 | 확인 위치 |
|------|------|-----------|
| `buildEgir` 1·2단계 필터 | OK | lostark-build.js 714행 |
| `buildEgir` 15-18 필터 | OK | lostark-build.js 715행 |
| `buildEgir` 기존 11 필터 유지 | OK | lostark-build.js 713행 |
| `buildGemPrice` 고급 제외 | OK | lostark-build.js 730행 |
| `!로펙` URL 변경 | OK | info.js 65행 |
| `!로펙` 단독 입력 기본 URL 유지 | OK | info.js 67행 |
| `wrangler deploy --dry-run` | OK | 에러 없음 (57.88 KiB) |

```
[INFO] 모든 수정 사항 정상 반영 확인. 오류 없음.
```

작업 완료.
