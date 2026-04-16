# Feature Migration & Cleanup 테스트 로그

- **날짜**: 2026-04-16 17:00
- **담당**: qa
- **연관 Plan**: [docs/2026-04-16-feature-migration/Plan.md](../../docs/2026-04-16-feature-migration/Plan.md)

## 테스트 결과 요약
- 전체: 10건 / 성공: 8건 / 실패: 0건 / 경고: 2건

## 테스트 항목

| 항목 | 결과 | 비고 |
|------|------|------|
| 폐기 명령어 제거 (!데미지, !카멘/하브, !검사, !깨달음, !진화) | ✅ | commands.js에서 완전히 제거됨 |
| buildEquipment — 엘릭서/초월 코드 없음 | ✅ | 주석도 "(엘릭서/초월 제거)"로 명시됨 |
| buildCharacterInfo — 엘릭서/초월 코드 잔존 | ✅ | !정보용이므로 의도적 잔존, 정상 |
| !아바타 핸들러 — btoa, Uint8Array Cloudflare 호환성 | ⚠️ | 아래 [WARN] 참조 |
| !낙원 핸들러 — Promise.all 병렬 fetch 및 메인 서버 탐색 | ✅ | 로직 정상, 이름 우선 → 레벨 최고 폴백 |
| !보석가격 — `/auctions/items` POST 경로 | ✅ | lostarkPost('/auctions/items', ...) 사용 확인 |
| lostarkPost — method/headers/body 형식 | ✅ | POST, accept/authorization/content-type, JSON.stringify 정상 |
| !명령어 목록 — 폐기 항목 없음, 신규 항목 반영 | ⚠️ | 아래 [WARN] 참조 |
| null/undefined 안전 처리 | ✅ | 각 핸들러에서 null 반환 시 조기 종료 처리됨 |
| Cloudflare Worker 제약 — Node.js 전용 API 사용 없음 | ✅ | fs, path, Buffer, require() 미사용 확인 |

## 로그 상세

```
[INFO] 폐기 확정 5개 명령어(!데미지, !카멘, !하브, !검사, !깨달음, !진화 계열) commands.js에서
       완전히 제거됨. grep 결과 해당 패턴 없음 확인.

[INFO] buildEquipment (commands.js:101~108, lostark-build.js:267~309) — 엘릭서/초월 코드
       완전 제거. 품질, 세트명, 강화 수치만 출력.

[INFO] buildCharacterInfo (lostark-build.js:16~186) — !정보 전용이므로 엘릭서(elixir)/초월
       (transTotal) 코드가 의도적으로 유지됨. Plan.md "buildCharacterInfo(기존) — 엘릭서/
       초월 코드가 여전히 있는가 (이건 !정보용이므로 남아있어도 됨)" 조건 충족.

[INFO] lostarkPost (lostark-api.js:17~31) — method: 'POST', headers에 accept/authorization/
       content-type 포함, body: JSON.stringify(body) 형식 정상.

[INFO] !낙원 핸들러 (commands.js:171~196) — siblings API 조회 후 이름 직접 매칭으로
       mainServer 탐색, 없으면 레벨 최고 캐릭터 서버 폴백. 같은 서버 캐릭터만 필터 후
       Promise.all 병렬 fetch 수행. 로직 이상 없음.

[INFO] !보석가격 핸들러 (commands.js:255~261) — lostarkPost('/auctions/items', ...) 경로 및
       AuctionInfo?.BuyPrice 참조 확인. 경매장 POST 경로 정상.

[WARN] !아바타 핸들러 (commands.js:285) — btoa(String.fromCharCode(...new Uint8Array(buf)))
       패턴 사용. 이미지 크기가 클 경우 spread 연산자 (...new Uint8Array)로 인해
       call stack 초과(Maximum call stack size exceeded) 위험. Cloudflare Workers에서는
       btoa와 Uint8Array 자체는 지원되나, 대용량 이미지(수백 KB 이상)에서 문제 발생 가능.
       권장 대안: TextDecoder 대신 Buffer.from 없이 분할 청크 방식 또는
       `btoa([...new Uint8Array(buf)].map(b => String.fromCharCode(b)).join(''))` 로 변경.
       단, 아바타 이미지가 소형(<50KB)이면 실운용상 문제없을 수 있음.

[WARN] !명령어 목록 (commands.js:326) — 목록에 '!각인 캐릭터이름' 항목이 없음.
       commands.js에는 !각인 핸들러(122~128)가 존재하나 !명령어 출력 문자열에서 누락됨.
       사용자가 !명령어 조회 시 !각인 존재를 알 수 없는 상태.
```

## 오류 내용

### [WARN-1] !아바타 — 대용량 이미지 btoa 스택 오버플로우 위험
- **위치**: `server/src/commands.js` 285행
- **코드**: `const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));`
- **내용**: 이미지 arrayBuffer를 spread로 펼쳐 String.fromCharCode에 전달하는 방식은
  JS 콜스택 제한으로 인해 대용량 이미지(약 512KB 이상)에서 런타임 에러 가능.
  Cloudflare Workers 환경은 Workers 런타임 V8 기준 기본 스택 512KB~1MB.
- **권장 수정**:
  ```js
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  ```

### [WARN-2] !명령어 목록 — !각인 항목 누락
- **위치**: `server/src/commands.js` 326행 (`!명령어` 응답 문자열)
- **내용**: `!각인 캐릭터이름` 항목이 출력 문자열에 포함되지 않음.
  핸들러 자체는 정상 구현되어 있으므로 기능 동작에는 문제없으나,
  사용자 안내 누락.

## developer 피드백

1. **[WARN-1] !아바타 btoa 스택 오버플로우 위험** — 로스트아크 캐릭터 이미지는 보통
   수십~수백 KB 수준이므로 소형 이미지에선 정상 동작할 수 있으나, 안전한 루프 방식으로
   수정 권장. (위 권장 수정 코드 참고)

2. **[WARN-2] !명령어 목록 !각인 누락** — commands.js 326행 명령어 문자열에
   `!각인 캐릭터이름` 라인 추가 필요.
