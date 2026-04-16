const scriptName = "숫자야구";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

var list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var number = [];

var count = 0;
var leftCount = 0;
var strike = 0;
var ball = 0;

var isStart = false;
var selected = false;

//replier.reply("");

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  // 방 검사
  if(room == "한용희" 
//   || room == "랜타디 로열패밀리"
  )
  {
    // !숫자야구 시작
    if (isStart == false && msg == "!숫자야구") {
        replier.reply("숫자야구를 시작!!\n신 헬 하드 노말");
        isStart = true;
        // 정답 추출
        for (var i = 0; i < 4; i++) { 
            var select = Math.floor(Math.random() * list.length);
            number[i] = list.splice(select, 1)[0]; 
        }
    }
    // 난이도 선택
    if (isStart == true && selected == false ) {
        if( msg == "신" || msg == "헬" || msg == "하드" || msg == "노말" || msg == "예니" ){
            selected = true;
            switch (msg) {
                case "신":
                    leftCount = 1;
                    replier.reply("신 모드 기회는 " + leftCount + "번!! \n숫자를 입력해주세요");
                    break;
                case "헬":
                    leftCount = 2;
                    replier.reply("헬 모드 기회는 " + leftCount + "번!! \n숫자를 입력해주세요");
                    break;
                case "하드":
                    leftCount = 4;
                    replier.reply("하드 모드 기회는 " + leftCount + "번!! \n숫자를 입력해주세요");
                    break;
                case "노말":
                    leftCount = 8;
                    replier.reply("노말 모드 기회는 " + leftCount + "번!! \n숫자를 입력해주세요");
                    break;
                case "예니":
                    leftCount = 999;
                    replier.reply("예니 모드 기회는 " + leftCount + "번!! \n숫자를 입력해주세요");
                    break;
            }
        }
    }
    // 숫자야구 진행 중
    if (isStart == true) {
        // !포기
        giveUp(room, msg, sender, isGroupChat, replier, imageDB, packageName);
        num = parseInt(msg);
      
        // 숫자가 아닌 다른 문구
        if (isNaN(num)) {
            replier.reply(num);
            return;
        }
        // 숫자인 경우
        else if (!isNaN(num)) {
            // 숫자를 배열로
            replier.reply("Nan이 아닌데");
            replier.reply(num);
            numArr = Array.from(num);
            replier.reply(numArr);
            // 숫자가 4자리가 아닌경우 
            if (numArr.length != 4) {
                replier.reply("4자리가 아닌데");
                replier.reply(num);
                replier.reply(numArr);
                return;
            }
        }
            // 난이도를 선택한 경우
            if (selected == true){
                    // 숫자검사 알고리즘
                    while (count < leftCount) {
                        // S B 초기화
                        strike = 0;
                        ball = 0;
                        // 시도 횟수는 하나 증가
                        count++; 
                        // 숫자를 비교분석하는 부분
                        for (var j = 0; j < 4; j++) {
                            for (var k = 0; k < 4; k++) {
                                if (number[j] == msgArr[k]) {
                                    if (j === k) {
                                        strike++;
                                    } else {
                                        ball++;
                                    }
                                    break;
                                }
                            }
                        }
                        // 결과를 표시하는 부분
                        if (strike == 4) {
                            replier.reply('정..정답! ' + (count) + '번 만에 맞추셨습니다');
                            initBaseball();
                            break;
                        } else if (count >= leftCount) {
                            replier.reply('틀림ㅋ\n' + msgArr.join(''));
                            initBaseball();
                            break;
                        } else {
                            var _leftCount = leftCount - count;
                            replier.reply(msgArr.join('') + ': ' + strike + 'S ' + ball + 'B\n남은기회는 '+ _leftCount + "번!!");
                            break;
                        }
                    }
            }
            // 난이도를 선택하지 않은 경우
            else{ replier.reply("난이도를 먼저 선택해주세요"); }
        }
    }
  }
//   else if(room != "한용희" && msg == "!숫자야구"){
    // replier.reply("숫자야구불가능방");
//   }
    
function start(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    if (isStart == false && msg == "!숫자야구") {
        replier.reply("숫자야구를 시작!!\n신 헬 하드 노말");
        isStart = true;
        for (var i = 0; i < 4; i++) { number[i] = list.splice(select, 1)[0]; }
    }
}
function msgToInt(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    var num = parseInt(msg);
    replier.reply("num=" + num);
    var num2 = 3;
    var num3 = num + num2;
    replier.reply("num3=" + num3);
    return num3;
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

// !포기
function giveUp(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    if (msg == "!포기" && isStart == true) {
        isStart = false;
        selected = false;
        replier.reply("숫자야구를 종료합니다");
    }
    return;
}
// 초기화
function initBaseball(){
    isStart = false;
    selected = false;
    count = 0;
    leftCount = 0;
    strike = 0;
    ball = 0;
    number = [];
}

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