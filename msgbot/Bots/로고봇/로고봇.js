const scriptName = "로고봇";

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

    // !세션 명령어: 모바일에서 직접 처리 (서버 세션 갱신)
    if (msg === "!세션") {
      var ok = uploadSession();
      replier.reply(ok ? "세션 갱신 완료" : "세션 갱신 실패 - 로그 확인");
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
