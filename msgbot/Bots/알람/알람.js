const scriptName = "알람";
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

}

/**
 *
 * Deep Dark License - Type A
 *
 * Copyright `2023` `saroro`, All rights reserved.
 *
 * 1. To use a work including software that the `Deep Dark License` has been applied, retaining the above copyright notice, this list of conditions and the following notice, the contents of the `Deep Dark License` must be distributed together.
 *
 * 2. The copyright holder cannot be held responsible for any problems arising from the use of a work including software that the `Deep Dark License` has been applied.
 *
 * 3. Works including software that the `Deep Dark License` has been applied cannot be used commercially.
 *
 * 4. For works including software that the `Deep Dark License` has been applied, the guidelines set by the copyright holder take precedence over the license and Non-copyright person(s) or equivalents cannot interfere with the guidelines set by the copyright holder.
 */

let Cronjob = require("cronjob").CronJob;
const PARSE_ORDER = ["second", "minute", "hour", "date", "month", "day"]
Cronjob.setWakeLock(true);
/**
 * 여기에 방 이름
 * @type {string[]}
 */
let rooms = ["랜타디 로열패밀리"];
let yeni = ["예은"];
let test = ["한용희"];
/**
 * @typedef {number[]|"*" } CronString
 */
/**
 *
 * @param {CronString}c
 */
function convertString(c) {
  if (c === "*") {
    return c
  }
  if (Array.isArray(c)) {
    return c.join(",");
  }
  return c;
}
// 0 30 22 * * 2
let opt = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [22],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "2",
}
// Test Time
let testDateTime = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [19],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [13],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "5",
}
// 0 30 19 * * 1
let optMonday2000 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [19],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "1",
}
// 0 30 19 * * 2
let optTuesday2000 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [19],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "2",
}
// 0 30 19 * * 3
let optWednesday2000 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [19],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "3",
}
// 0 30 19 * * 4
let optThursday2000 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [19],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "4",
}
// 0 30 19 * * 5
let optFriday2000 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [19],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "5",
}
// 0 30 19 * * 6
let optSaturday2000 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [19],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "6",
}
// 0 30 19 * * 0
let optSunday2000 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [19],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "0",
}
// 0 30 01 * * 1
let optMonday0200 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [1],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "1",
}
// 0 30 01 * * 2
let optTuesday0200 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [1],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "2",
}
// 0 30 01 * * 3
let optWednesday0200 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [1],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "3",
}
// 0 30 01 * * 4
let optThursday0200 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [1],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "4",
}
// 0 30 01 * * 5
let optFriday0200 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [1],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "5",
}
// 0 30 01 * * 6
let optSaturday0200 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [1],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "6",
}
// 0 30 1 * * 0
let optSunday0200 = {
  /**
   * 원하는 초
   * *는 모든 초
   * 0초
   * @type {CronString}
   */
  second: [0],

  /**
   * 원하는 분
   * *는 모든 분
   * 0분
   * @type {CronString}
   */
  minute: [30],
  /**
   * *는 모든 시
   * 원하는 시
   * @type {CronString }
   * 0시
   */
  hour: [1],
  /**
   * *는 모든 일
   * 원하는 일
   * @type {CronString}
   * 모든 일
   */
  date: "*",
  /**
   * *는 모든 월
   * 원하는 월
   * @type {CronString}
   * 모든 월
   */
  month: "*",
  /**
   * *는 모든 요일
   * 원하는 요일
   * @type {CronString}
   * 모든 요일
   * 0부터 시작 0은 일요일
   */
  day: "0",
}

let cronString1 = "";
let cronBlackDesert = "";

for (let i of PARSE_ORDER) {
  cronString1 += convertString(testDateTime[i]) + " ";
}
for (let i of PARSE_ORDER) {
  cronBlackDesert += convertString(optSunday0200[i]) + " ";
}
// Api.replyRoom(i, '로스트아크 - 상점교환, 경험치교환, 이벤트교환, 더보기\n검은사막 - 몽상의깃털, 가모스');
// let cron = Cronjob.add(cronString1.trim(), () => {
//   // for (let i of test) {
//     let r = Api.replyRoom("한용희", '시끌시끌시끌시끌시끌시끌 시끄럽지');
//     Api.replyRoom(i, r);
//   // }
// })

// let cronYeni = Cronjob.add(cronBlackDesert.trim(), () => {
//   const today = new Date().getDay();
//   var msgText = "검사 보스 알람\n";
//   switch (today) {
//     case 0:
//       msgText += "2000 : 불가살 우투리\n0200 : 금예니왕";
//       break;
//     case 1:
//       msgText += "2000 : 산군 불가살\n0200 : 불가살";
//       break;
//     case 2:
//       msgText += "2000 : 금예니왕 우투리\n0200 : 산군";
//       break;
//     case 3:
//       msgText += "2000 : 우투리 산군\n0200 : 금예니왕";
//       break;
//     case 4:
//       msgText += "2000 : 산군 금예니왕\n0200 : 우투리";
//       break;
//     case 5:
//       msgText += "2000 : 금예니왕 불가살\n0200 : 산군";
//       break;
//     case 6:
//       msgText += "2000 : 안알랴줌\n0200 : 불가살";
//       break;
//     default:
//       msgText += "알 수 없는 요일";
//   }

//   for (let i of yeni) {
//     Api.replyRoom(i, msgText);
//   }
// })

/**
 * 필수로 넣어줘야 함
 */
function onStartCompile() {
  Cronjob.setWakeLock(false);
  Cronjob.off();
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) { }

function onResume(activity) { }

function onPause(activity) { }

function onStop(activity) { }

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