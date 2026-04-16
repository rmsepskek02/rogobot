const scriptName = "크롤링";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    // 출력
    // if(room != "한용희"){
    //   return;
    // }
    try{
      // !아바타
      useWeb(msg, replier);
      clearGold(msg, replier);
      polishingAccessories(msg, replier);
    }catch(e){
      Api.replyRoom("한용희", '에러:'+e);
      Log.debug('에러:'+e, true);
      Log.error(e, true);
    }
}

// !아바타
function useWeb(msg, replier){
  var input = msg.split(" ");
  var text = msg.substr(5,msg.length);
  
  if(input[0] == "!아바타" ){
    useOgimage(replier, getAPI(text))
  }
}

function useOgimage(replier, _url){
  importPackage(android.graphics);
  txt = "";
  size = 40
  url = _url;
  con = new java.net.URL(url).openConnection();
  con.setDoInput(true);
  con.setConnectTimeout(3000);
  con.setReadTimeout(5000);
  bmp = android.graphics.BitmapFactory.decodeStream(con.getInputStream());
  con.disconnect();
  img = bmp.copy(Bitmap.Config.ARGB_8888, true);
  can = new Canvas(img);
  bounds = new Rect();
  paint = new Paint();
  paint.setTextSize(size);
  paint.setAntiAlias(true);
  paint.getTextBounds(txt,0,txt.length,bounds);
  paint.setARGB(255,255,255,255); // 흰색
  paint2 = new Paint();
  paint2.setStyle(Paint.Style.STROKE);
  paint2.setStrokeWidth(3);
  paint2.setARGB(255,0,0,0);
  paint2.setTextSize(size);
  paint2.setAntiAlias(true);
  can.drawText(txt,(can.width-bounds.width())/2,(can.height-bounds.height())/2,paint2);
  can.drawText(txt,(can.width-bounds.width())/2,(can.height-bounds.height())/2,paint);
  bytearrayoutputstream = new java.io.ByteArrayOutputStream();
  img.compress(Bitmap.CompressFormat.JPEG, 100, bytearrayoutputstream);
  bytearray = bytearrayoutputstream.toByteArray();
  imgb64 = java.util.Base64.getEncoder().encodeToString(bytearray);
  d = {"image":imgb64,"title":"title"};
  r = org.jsoup.Jsoup.connect("https://worker-green-meadow-d8c1.rmsepskek02.workers.dev/s")
        .header("Content-Type", "application/json")
        .header("Accept", "text/plain")
        .followRedirects(true)
        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .method(org.jsoup.Connection.Method.POST)
        .maxBodySize(1000000*30)
        .requestBody(JSON.stringify(d))
        .timeout(0)
        .execute();
  res = 'https://worker-green-meadow-d8c1.rmsepskek02.workers.dev/e/' + r.body();
  replier.reply(res);
}
// getAPI
function getAPI(text){
  var doc = "https://lostark.game.onstove.com/Profile/Character/" + text;
  
  var response = org.jsoup.Jsoup.connect(doc)
  .ignoreContentType(true)
  .ignoreHttpErrors(true)
  .get().select("div.profile-equipment__character img").attr("src");

  return response;
}

// !클골 cloudflare
function clearGold(msg, replier){
  if(msg == "!클골" || msg == "!ㅋㄱ"){
    res = 'https://worker-green-meadow-d8c1.rmsepskek02.workers.dev/e/' + "CLEARGOLD";
    replier.reply(res)
  }
};

// !연마 cloudflare
function polishingAccessories(msg, replier){
  if(msg == "!연마" || msg == "!ㅇㅁ"){
    res = 'https://worker-green-meadow-d8c1.rmsepskek02.workers.dev/e/' + "POLISHINGACCESSORIES";
    replier.reply(res)
  }
};

// getAPI
function testAPI(text){
  var doc = "https://developer-lostark.game.onstove.com/characters/고로바드/equipment" ;
  var apiKey = "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAxMDQyNDYifQ.LbWRJAb502GgmlQfzaTtjBimxBGYmIWfE9v4zemt7AVSAbZoKTKt6FsaP2sKtO8jAbgFnyfh5RM9YmnQg2hAA0K3jXMUCOkdMKnhjuH4bnVn0LXCWfRFJUWZrEpWvgyfNyCs_ZjrdzFzPMLtptOkGWIIP_BhEcZFRXQcVvGPzvW-GI_o4AZR5BSIPUv9Yg7RgD5NrGoQlxo1B_nwty7NXZ7Lxjrt-Ck2LOLjZVu3WNDTVjaymhDBR6hZEaaQdMCrCZLdz0eO2APrTwQJOCcfDYtIGOHYwBmepRAQCiASBKq3bGt65T2J6-1pnDNa9qkpMPh-QwahSagEWtIbmp3ybw";
  var data = "";
  var response = org.jsoup.Jsoup.connect(doc)
  .header("accept", "application/json") 
  .header("authorization", apiKey)
  .ignoreContentType(true)
  .ignoreHttpErrors(true)
  .get().text();
  if(response == "" || response == null){
    data = response;
  }
  else {
    //data = JSON.parse(response);
  }

  // for(let i=0; i< results.length; i++){
  //   tooltip = JSON.parse(results[i]["Tooltip"]);
  //   if(results[i]["Type"] == "무기"){
  //     wqv = tooltip["Element_001"]["value"]["qualitValue"];
  //   }
  // }
  return JSON.stringify(data.slice(0,600));
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}

function onNotificationPosted(sbn, sm) {
  var packageName = sbn.getPackageName();
  if (!packageName.startsWith("com.kakao.tal")) return;
  var actions = sbn.getNotification().actions;
  if (actions == null) return;
  var userId = sbn.getUser().hashCode();
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
      var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
      var image = bundle.getBundle("android.wearable.EXTENSIONS");
      if (image != null) image = image.getParcelable("background");
      var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
      com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
      if (this.hasOwnProperty("responseFix")) {
          responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
      }
  }
}

// 3막 하드(1700) 7000/2700, 11000/4100, 20000/5800 뇌옥3/5/10 경매10
// 3막 노말(1680) 6000/2400, 9500/3200, 12500/4200 뿔3/5/10 경매10
// 2막 하드(1690) 10000/4500, 20500/7200 카르마8/12 경매10
// 2막 노말(1670) 8500/3800, 16500/5200 카르마4/6 경매5
// 1막 하드(1680) 9000/4100, 18500/6600 돌8/12 경매10
// 1막 노말(1660) 7500/3200, 15500/5300 돌4/6 경매5
// 서막 하드(1640) 6000/2200, 12500/4100 눈3/6 경매5
// 서막 노말(1620) 5000/2200, 9500/3400 비늘3/6 경매5
// 서막 싱글(1620) 4000, 7600
// 베히 노말(1640) 6000/2200, 12500/4100 비늘 10/20 경매20
// 카멘 하드(1630) 3500/1100, 4500/1500, 7500/2400, 8000,2400 어불12/16/24/24 경매10
// 카멘 노말(1610) 2500/800, 3000/1000, 4500/1500 어불6/8/12 경매5
// 카멘 싱글(1610) 2000, 2400, 3600

// 1.레이드 난이도 클리어골드보상/더보기소모골드
// 2.클리어골드보상/더보기소모골드가 여러개인경우 각 관문별 보상 
// 3.골드보상 다음 내용은 해당 레이드의 재료보상
// 4.싱글은 재료보상과 경매보상을 적지 않을것

// 예를들어
// 3막 하드 7000/2700, 11000/4100, 20000/5800 뇌옥3/5/10
// 1관문 7000골드 보상 2700골 더보기소모 뇌옥3개
// 2관문 11000골드 보상 4100골 더보기소모 뇌옥5개
// 3관문 20000골드 보상 5800골 더보기소모 뇌옥10개
// 3관문 경매 뇌옥 10개

// 1열 레이드
// 2열부터 관문별 클리어보상으로하고
// 마지막열은 비고로 경매보상

// 각행은 레이드이름으로 시작하고 그것을 2개의 행으로 나누어 하드와 노말 표로 만들기

// 이것을 기반으로 예쁘게 꾸며서 가독성좋게 표를 만들어서 이미지를 보내줘
