const scriptName = "카링테스트";
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
  onMessage(room, msg, sender, isGroupChat, replier, imageDB, packageName);
  test(room, msg, sender, isGroupChat, replier, imageDB, packageName);
}


const { KakaoApiService, KakaoLinkClient } = require('kakaolink')

const Kakao = new KakaoLinkClient();

KakaoApiService.createService().login({
    email: 'rmsepskek02@gmail.com',
    password: 'wmrm13241423!',
    keepLogin: true,
    // twoFA: true
}).then(e => {
    Kakao.login(e, {
        apiKey: 'c0d2d5a6da78d03cc4667cec3b4756a9',
        url: 'https://open.kakao.com/o/ssdOPG0e'
    });
}).catch(e => {
    throw e;
});
function test(room, msg, sender, isGroupChat, replier, imageDB, packageName){
  if(msg === '!카카오링크') {
    replier.reply('테스트')
    Kakao.sendLink(
        room,
        TemplateBuilder.newDefaultBuilder()
            .setTypeAsText()
            .setText('카카오링크 테스트')
            .setLink(
                TemplateBuilder.newLinkBuilder()
                    .setWebUrl('https://example.com')
                    .build()
            )
            .addButton(
                new Button(
                    '버튼1',
                    TemplateBuilder.newLinkBuilder()
                        .setWebUrl('https://example.com')
                        .build()
                )
            )
            .build()
    ).then(e => {
        replier.reply('카링 보내기 성공!')
    }).catch(e => {
        replier.reply(e);
    })
}
}

function onMessage(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if(msg === '1234') {
      replier.reply('응답')
        Kakao.sendLink(room, {
          // 95682
          template_id: 89041,
          template_args: {
              header: '1',
              title1: '1',
              title2: '1',
              title3: '1',
              title4: '1',

              img1: '2',
              img2: '2',
              img3: '2',
              img4: '2',

              text1: '3',
              text2: '3',
              text3: '3',
              text4: '3',
            }
        }, 'custom').then(e => {
          replier.reply('카링 보내기 성공!')
            // Log.debug('카링 보내기 성공!')
        }).catch(e => {
          replier.reply(e + '\n' + e.lineNumber );
            // Log.debug('e=='+ e);
        })
    }
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
