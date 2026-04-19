const scriptName = "로고봇";

// 한용희 replier 캐시 — 에러 알림 및 !문의 명령어에 사용
var hanReplier = null;

// =====================================================
// 서버 설정
// BOT_SECRET은 Cloudflare Worker에서 설정한 값과 동일해야 함
// =====================================================
const SERVER_URL = "https://worker-green-meadow-d8c1.rmsepskek02.workers.dev/bot";
const SESSION_URL = "https://worker-green-meadow-d8c1.rmsepskek02.workers.dev/session";
const BOT_SECRET = "rogobot2024";

// =====================================================
// 카카오링크 클라이언트 + 세션 업로드
// signInWithKakaoTalk: 앱 네이티브 세션을 사용하므로 캡챠 없음
// =====================================================
var { KakaoApiService, KakaoShareClient } = require('kakaolink');
var kakaoClient = KakaoShareClient.createClient();

function uploadSession() {
  try {
    var service = KakaoApiService.createService();
    var rawCookies = service.login({
      signInWithKakaoTalk: true
    }).awaitResult();

    // 쿠키 직렬화: JS 객체이면 직접 사용, Java Map이면 변환
    var cookies = {};
    var cookieKeys = Object.keys(rawCookies);
    if (cookieKeys.length > 0) {
      // JS 객체인 경우
      for (var i = 0; i < cookieKeys.length; i++) {
        cookies[cookieKeys[i]] = String(rawCookies[cookieKeys[i]]);
      }
    } else {
      // java.util.LinkedHashMap인 경우 - forEach로 변환
      rawCookies.forEach(function(k, v) {
        cookies[String(k)] = String(v);
      });
    }

    Log.debug("[로고봇] 수집된 쿠키 수: " + Object.keys(cookies).length, true);

    if (Object.keys(cookies).length === 0) {
      Log.error("[로고봇] 쿠키가 비어있음", true);
      return false;
    }

    var body = JSON.stringify({ cookies: cookies });
    var res = org.jsoup.Jsoup.connect(SESSION_URL)
      .header("Content-Type", "application/json")
      .header("X-Bot-Secret", BOT_SECRET)
      .requestBody(body)
      .method(org.jsoup.Connection.Method.POST)
      .ignoreContentType(true)
      .ignoreHttpErrors(true)
      .timeout(15000)
      .execute();

    if (res.statusCode() == 200) {
      Log.debug("[로고봇] 세션 업로드 완료: " + res.body(), true);
      // 카카오링크 클라이언트에 쿠키 적용
      kakaoClient.init('c0d2d5a6da78d03cc4667cec3b4756a9', 'https://open.kakao.com/o/ssdOPG0e', rawCookies);
      return true;
    } else {
      Log.error("[로고봇] 세션 업로드 실패 " + res.statusCode() + ": " + res.body(), true);
      return false;
    }
  } catch (e) {
    Log.error("[로고봇] 세션 업로드 오류: " + e, true);
    return false;
  }
}

// =====================================================
// 서버에 메시지 전송 후 응답 처리
// 반환값: { reply: string|null, kakaolink: object|null }
// =====================================================
function sendToServer(room, msg, sender, isGroupChat) {
  try {
    var body = JSON.stringify({
      room: room,
      msg: msg,
      sender: sender,
      isGroupChat: isGroupChat
    });

    var res = org.jsoup.Jsoup.connect(SERVER_URL)
      .header("Content-Type", "application/json")
      .header("X-Bot-Secret", BOT_SECRET)
      .requestBody(body)
      .method(org.jsoup.Connection.Method.POST)
      .ignoreContentType(true)
      .ignoreHttpErrors(true)
      .timeout(30000)
      .execute()
      .body();

    return JSON.parse(res);

  } catch (e) {
    Log.error("[로고봇] 서버 통신 오류: " + e, true);
    return null;
  }
}

// =====================================================
// 봇 시작 시 자동 세션 초기화 (백그라운드 스레드)
// 앱이 완전히 로드된 후 실행되도록 3초 대기
// =====================================================
new java.lang.Thread(function() {
  var delays = [3000, 5000, 10000, 20000];
  for (var i = 0; i < delays.length; i++) {
    try {
      java.lang.Thread.sleep(delays[i]);
      Log.debug("[로고봇] 자동 세션 초기화 시도 " + (i + 1), true);
      if (uploadSession()) {
        Log.debug("[로고봇] 자동 세션 초기화 완료", true);
        break;
      }
    } catch (e) {
      Log.error("[로고봇] 자동 세션 초기화 오류: " + e, true);
    }
  }
}).start();

// 스크립트 재컴파일 시 한용희 세션 복원 시도
(function() {
  try {
    var cachedAction = com.xfl.msgbot.application.service.NotificationListener.Companion.getSession("com.kakao.talk", "한용희");
    if (cachedAction != null) {
      hanReplier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier("com.kakao.talk", cachedAction, "한용희", false, "");
      Log.debug("[로고봇] 한용희 세션 복원 완료", true);
    }
  } catch (e) {
    Log.debug("[로고봇] 한용희 세션 복원 실패: " + e, true);
  }
})();

// =====================================================
// 카카오톡 알림 수신 → 서버 전달 → 답장
// =====================================================
function onNotificationPosted(sbn, sm) {
  var packageName = sbn.getPackageName();
  if (!packageName.startsWith("com.kakao.tal")) return;

  var actions = sbn.getNotification().actions;
  if (actions == null) return;

  for (var n = 0; n < actions.length; n++) {
    var action = actions[n];
    if (action.getRemoteInputs() == null) continue;

    var bundle = sbn.getNotification().extras;
    var msg = bundle.get("android.text").toString();
    var sender = bundle.getString("android.title");
    var room = bundle.getString("android.subText");
    if (room == null) room = bundle.getString("android.summaryText");
    var isGroupChat = room != null;
    if (room == null) room = sender;

    var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
    com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);

    try {
      // 한용희 1:1방이면 replier 갱신 후 'test' 응답
      if (room === "한용희") {
        hanReplier = replier;
        replier.reply("test");
      }

      // !세션 명령어: 모바일에서 직접 처리 (서버 세션 갱신)
      if (msg === "!세션") {
        var ok = uploadSession();
        replier.reply(ok ? "세션 갱신 완료" : "세션 갱신 실패 - 로그 확인");
        continue;
      }

      // !문의 명령어: 누구나 사용 가능, 한용희에게 메시지 전달
      if (msg.startsWith("!문의")) {
        var content = msg.length > 3 ? msg.substring(3).trim() : "";
        if (content === "") {
          replier.reply("사용법: !문의 전달할내용");
        } else if (hanReplier == null) {
          replier.reply("한용희 세션 없음 — 한용희가 먼저 메시지를 보내야 합니다");
        } else {
          hanReplier.reply("[전달] " + sender + ": " + content);
          replier.reply("전달 완료");
        }
        continue;
      }

      var data = sendToServer(room, msg, sender, isGroupChat);
      if (!data) continue;

      if (data.kakaolink) {
        // 서버에서 카카오링크 데이터 반환 → 모바일에서 전송
        try {
          kakaoClient.sendLink(room, data.kakaolink, 'custom').awaitResult();
        } catch (e) {
          replier.reply("카카오링크 전송 실패: " + e);
          Log.error("[로고봇] 카카오링크 오류: " + e, true);
        }
      } else if (data.reply != null) {
        replier.reply(data.reply);
      }

    } catch (e) {
      // 루프 내부 에러 로그
      Log.error("[로고봇] 오류: " + e, true);
      // 한용희에게 에러 내용 전송
      try {
        if (hanReplier != null) {
          var lineInfo = (e.lineNumber != null) ? ("줄: " + e.lineNumber) : "줄: 알 수 없음";
          hanReplier.reply("[ERROR] " + scriptName + ".js\n오류: " + (e.message || String(e)) + "\n" + lineInfo);
        }
      } catch (e2) {
        Log.error("[로고봇] 에러 전송 실패: " + e2, true);
      }
    }
  }
}

// 메신저봇 액티비티 화면 (기본값 유지)
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("로고봇 - 서버 연동 중");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}
function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {}
