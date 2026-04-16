const scriptName = "AI";
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
  try{
    // !질문
    useGPT(msg, replier);
  }catch(e){
    Api.replyRoom("한용희", '1'+e);
    Log.debug('1'+e, true);
    Log.error(e, true);
  }
}

// !질문
function useGPT(msg, replier){
  var input = msg.split(" ");
  var text = msg.substr(4,msg.length);

  if(input[0] == "!질문" ){
    replier.reply("기다려주세용");
    replier.reply(postAPI(text));
  }
}

// postAPI
function postAPI(text){
  try {
    let reqData = {
        "model": "gpt-3.5-turbo",
        "messages": [{
        "role": "system",
        "content": "당신은 모든 분야에서 최고의 전문가입니다. 친근하고 간결하게 한글로 답변해주세요"
    },{"role":"user","content":text}],
        "temperature": 0.4,
        "max_tokens": 4000,
        "top_p": 1,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
    };

    var response = org.jsoup.Jsoup.connect("https://api.openai.com/v1/chat/completions")
    .header("Authorization", "Bearer " + apiKey)
    .header("Content-Type", "application/json")
    .requestBody(JSON.stringify(reqData))
    .ignoreContentType(true)
    .ignoreHttpErrors(true)
    .timeout(200000)
    .post();
    
    // JSON 문자열을 객체로 반환
    json = JSON.parse(response.text());
    result = json.choices[0].message.content;
    return result;
  } catch (e) {
    return e;  
  }
}
// .ignoreHttpErrors(true)  
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