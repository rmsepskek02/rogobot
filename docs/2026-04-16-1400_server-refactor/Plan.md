# server-refactor

- **날짜**: 2026-04-16 14:00
- **담당**: developer / qa

## 목표

`server/` 폴더의 모놀리식 구조와 스파게티 코드를 도메인 단위로 분리하고, 반복 패턴을 정리하여 가독성과 유지보수성을 높인다.

---

## 현재 문제

### 구조 문제
| 파일 | 문제 |
|---|---|
| `src/commands.js` (411줄) | 로스트아크 조회 / 시세 / 재미 / 정보성 명령어가 한 파일에 if-else 체인으로 나열 |
| `worker.js` | 응답 헬퍼(`rawPlain`, `rawJson` 등)가 `fetch` 핸들러 내부에 인라인 정의 |
| `src/kakao.js` | CryptoJS 라이브러리 전체(약 500줄)가 비즈니스 로직 파일에 인라인으로 묻혀 있음 |

### 코드 품질 문제

**`commands.js`**
- 모든 명령어가 if-else 체인 하나에 순서대로 나열 — 명령어 추가/수정 시 전체 파일을 훑어야 함
- 동일한 보일러플레이트(`msg.startsWith`, `msg.slice(cmd.length+1).trim()`)가 수십 번 반복
- `WORKER_BASE` URL이 하드코딩

**`lostark-build.js`**
- `parsePolishing()`: 긴 스탯명을 15개 `.replace()` 체인으로 처리 → 맵 기반 루프로 대체 가능
- `buildCharacters()`: 아이템 레벨별 골드를 if-else 10단계로 계산 → 룩업 테이블로 대체 가능
- `parseAccePiece()`: `tips` 배열을 로직별로 3~4회 반복 순회 → 단일 패스로 개선 가능
- `buildCollectibles()`: 수집품 이름을 `.replace()` 10개 체인으로 처리 → 맵 기반 루프로 대체 가능
- `tooltipToJSON()`: `lostark-build.js`에 정의되어 있으나 `lostark-api.js`에서도 쓰이므로 위치 부적절

**`lostark-api.js`**
- `lostarkGet()`과 `lostarkPost()`가 헤더 구성, 에러 처리, JSON 파싱을 중복 구현
- `getCharacterImage()`(HTML 스크래핑)이 REST API 호출과 같은 파일에 혼재

**`kakao.js`**
- 미니파이된 CryptoJS 코드가 세션/링크 비즈니스 로직과 한 파일에 있어 실제 로직 파악이 어려움

---

## 작업 범위

### 신규 파일
| 파일 | 역할 |
|---|---|
| `src/response.js` | `rawPlain` / `rawJson` / `rawHtml` / `rawImage` 헬퍼 |
| `src/kakao-crypto.js` | CryptoJS 인라인 코드 분리 |
| `src/commands/index.js` | `processMessage` 디스패처 |
| `src/commands/lostark.js` | 캐릭터 조회 명령어 |
| `src/commands/market.js` | 시세/거래소 명령어 |
| `src/commands/fun.js` | 재미/랜덤 명령어 |
| `src/commands/info.js` | 정보성 명령어 |

### 수정 파일
| 파일 | 변경 내용 |
|---|---|
| `worker.js` | 헬퍼 인라인 제거 → `response.js` import |
| `src/kakao.js` | CryptoJS 인라인 제거 → `kakao-crypto.js` import |
| `src/commands.js` | 삭제 (내용을 commands/ 하위로 분산) |
| `src/lostark-api.js` | `lostarkGet`/`lostarkPost` 중복 제거 |
| `src/lostark-build.js` | `parsePolishing` / `buildCharacters` / `buildCollectibles` 코드 품질 개선 |

### 최종 파일 구조
```
server/
├── worker.js
└── src/
    ├── response.js           # 응답 헬퍼
    ├── kakao.js              # 카카오 세션 + 링크 (비즈니스 로직만)
    ├── kakao-crypto.js       # CryptoJS (분리)
    ├── lostark-api.js        # API 호출 (중복 제거)
    ├── lostark-build.js      # 응답 빌더 (코드 품질 개선)
    └── commands/
        ├── index.js          # processMessage 디스패처
        ├── lostark.js        # 캐릭터 조회
        ├── market.js         # 시세/거래소
        ├── fun.js            # 재미/랜덤
        └── info.js           # 정보성
```

---

## 작업 계획

### Phase 1 — 구조 분리

1. **`src/response.js` 생성**
   - `rawPlain`, `rawJson`, `rawHtml`, `rawImage` 추출
   - `worker.js`에서 import

2. **`src/kakao-crypto.js` 생성**
   - `kakao.js` 상단의 CryptoJS 인라인 블록 분리
   - `kakao.js`에서 import

3. **`src/commands/` 분할**
   - `commands.js`의 명령어를 도메인별로 분리
     - `lostark.js`: `!정보`, `!배럭`, `!보석`, `!스킬`, `!장비`, `!악세`, `!각인`, `!앜패`, `!아크`, `!내실`, `!낙원력`, `!아바타`
     - `market.js`: `!유각`, `!서폿유각`, `!ㅇㄱㄹ`, `!젬가격`, `!보석가격`, `!가격`
     - `fun.js`: `!로또`, `!주사위`, `!점메추`/`!저메추`, `!한/중/일/양식`, `!간식`, `!분배금`, `vs`, `확률`, 간단응답 맵
     - `info.js`: `!시너지`, `!시간표`, `!공홈`, `!각인도감`, `!즐로아`, `!로펙`, `!명령어`, `!가격설명서`, `!클골`, `!연마`
   - `commands/index.js`: 각 핸들러를 순서대로 호출하는 디스패처

4. **`WORKER_BASE` 환경변수화**
   - `commands.js`의 하드코딩 URL → `env.WORKER_BASE`
   - `wrangler.toml`에 `[vars]` 섹션 추가

### Phase 2 — 코드 품질 개선

5. **`lostark-api.js` 중복 제거**
   - `lostarkGet`과 `lostarkPost`를 내부 `lostarkFetch(path, method, body)` 헬퍼로 통합

6. **`lostark-build.js` 개선**
   - `parsePolishing()`: 15개 `.replace()` 체인 → `[원본, 줄임말]` 맵 배열로 교체
   - `buildCharacters()`: 10단계 if-else 골드 계산 → `GOLD_TABLE` 배열(레벨 하한, 골드합) 룩업으로 교체
   - `buildCollectibles()`: 10개 `.replace()` 체인 → `COLLECTIBLE_NAMES` 맵 루프로 교체
   - `parseAccePiece()`: 3~4회 반복 순회 → 단일 패스로 구조 정리

---

## 완료 조건

### 기능
- [ ] 기존 모든 명령어가 리팩토링 후에도 동일하게 동작
- [ ] `wrangler deploy` 빌드 에러 없음

### 구조
- [ ] `src/commands.js` 파일 삭제, `src/commands/` 하위로 분산
- [ ] `worker.js` 내 인라인 헬퍼 제거
- [ ] `kakao.js`에 CryptoJS 인라인 코드 없음

### 코드 품질
- [ ] `parsePolishing()` replace 체인 제거
- [ ] `buildCharacters()` if-else 골드 계산 → 룩업 테이블
- [ ] `buildCollectibles()` replace 체인 제거
- [ ] `lostarkGet` / `lostarkPost` 중복 로직 통합

---

## 이슈 및 메모

- `KAKAO_API_KEY`(`kakao.js:107`)와 `KAKAO_ORIGIN_URL`은 카카오 JS SDK 공개 키/URL로 추정되어 이번 작업 범위에서 제외 (별도 논의 필요)
- `tooltipToJSON()`은 `lostark-build.js`에만 사용되므로 현재 위치 유지
- `parseAccePiece()`의 단일 패스 리팩토링은 기존 출력 형식을 변경하지 않는 방향으로 진행
