const scriptName = "테스트";
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

    // if(room == "ㅁㅎㄷ"){
    //     Api.replyRoom("한용희", msg);
    // }
    if (msg == "1234") {
        if (Api.canReply("한용희")) {
            let result = Api.replyRoom("한용희", "1\n" + "e.lineNumber");
            Log.d('result: ' + result);
            Api.replyRoom("한용희", "2\n" + "e.lineNumber");
        }
    }

    if (msg == "!테스트") {
        // var api = getAPI();
        replier.reply("room= " + room + "\nsender= " + sender + "\nmsg= " + msg + "\nreplier= " + replier +
            "\nimageDB= " + imageDB + "\npackageName= " + packageName + "\nisG= " + isGroupChat
            // + "\napi= "+api
        );
    }
    if (msg == "!ㄱㅎ" || msg == "!공홈") {
        replier.reply("https://lostark.game.onstove.com/Main");
    }

    // if (msg == "!즐" || msg == "!ㅈ" || msg == "!ㅈㄹㅇ" || msg == "!즐로아" || msg == "!즐로") {
    //     replier.reply("https://zloa.net/");
    // }

    // if (msg == "!로펙" || msg == "!ㄹㅍ" || msg == "!ㄿ") {
    //     replier.reply("https://lopec.kr/");
    // }

    if (msg == "!머여려다자우!") { replier.reply("test= " + msg + typeof (msg)); }
    if (msg == "!고로") { replier.reply("쉿!!"); }
    if (msg == "!뱁새") { replier.reply("다싶고하스섹\n싶            스\n고            하\n하            고\n스            싶\n섹스하고싶다"); }
    if (msg == "!앙윽") { replier.reply("껄껄스껄"); }
    if (msg == "!cex") { replier.reply("뱁새!"); }
    if (msg == "!모자") { replier.reply("뱁새야 서버"); }
    if (msg == "!헨콘") { replier.reply("노콘노섹"); }
    if (msg == "!덜디") { replier.reply("덜..보검!!"); }
    if (msg == "!예니") { replier.reply("예으응... 동결건조파인애플.."); }
    if (msg == "!해찬") { replier.reply("째깍째깍 퇴근퇴근"); }
    if (msg == "!유진") { replier.reply("유르카나 하싈?"); }
    if (msg == "!출근") { replier.reply("ㅋㅋ 누가 출근"); }
    if (msg == "!야근") { replier.reply("ㅋㅋ 누가 야근"); }
    if (msg == "!퇴근") { replier.reply("ㅋㅋ 야근해야지"); }
    if (msg == "아멘") { replier.reply("할렐루야"); }
    if (msg == "할렐루야") { replier.reply("아멘"); }
    if (msg == "!로또") {
        var lotto = [];
        for (var n = 0; n < 7; n++) {
            var ran = Math.floor(Math.random() * 45) + 1;
            if (lotto.includes(ran)) n--;
            else lotto.push(ran);
        }
        var bonus = lotto.pop();
        replier.reply("로또 결과 : " + lotto.join(" ") + " + " + bonus);
    }
    if (msg == "!주사위") {
        var dice = Math.floor(Math.random() * 6) + 1;
        replier.reply("주사위 결과 : " + dice);
    }
    // !명령어
    Help(msg, replier);
    // vs
    VsText(msg, replier, room);
    // percnet
    PercentText(msg, replier, room);
    // !점메추 !저메추
    Menu(msg, replier, room);
    // !문의
    // Inquiry(msg, replier, room, sender)
    // !가격설명서
    marketKeyword(msg, replier, room);
    koreanMenu(msg, replier, room);
    chinaMenu(msg, replier, room);
    japanMenu(msg, replier, room);
    euMenu(msg, replier, room);
    desertMenu(msg, replier, room);
    Distribution(msg, replier, room);
    //IncorrectCommand(msg, replier, room);
    Damages(msg, replier);
    printSynergyInfo(synergyInfo, msg, replier, room)
    getWeekType(msg, replier);
    timeTable(msg, replier, room);
    evolution(msg, replier, room);
    realization(msg, replier, room);
    engravigsDictionary(msg, replier);
    BlackDesert(msg, replier, room);
    zloaSearch(msg, replier);
    lopecSearch(msg, replier);
}

// // getAPI
// function getAPI (){
//     try {
//       var res = org.jsoup.Jsoup.connect("https://pay.nicepay.co.kr/v1/receipt/")
//       .header("accept", "application/json") 
//       .header("authorization", "33F49GnCMS1mFYlGXisbUDzVf2ATWCl9k3R++d5hDd3Frmuos/XLx8XhXpe+LDYAbpGKZYSwtlyyLOtS/8aD7A==")
//       .ignoreHttpErrors(true)
//       .ignoreContentType(true)
//       .get().text();
//       // JSON 문자열을 객체로 반환
//       var data = JSON.parse(res);
//       return data;
//     } catch (e) {
//       return e;  
//     }
//   }

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
    var textView = new android.widget.TextView(activity);
    textView.setText("Hello, World!");
    textView.setTextColor(android.graphics.Color.DKGRAY);
    activity.setContentView(textView);
}

// !명령어
function Help(msg, replier) {
    if (msg == "!명령어" || msg == "!?") {
        replier.reply("!정보 캐릭터이름\n!배럭(ㅂㄹ) 캐릭터이름\n!스킬 캐릭터이름\n!보석 캐릭터이름\n!장비 캐릭터이름\n!악세 캐릭터이름\n!앜패(ㅇㅍ) 캐릭터이름\n!아크(ㅇㅋ) 캐릭터이름\n!낙원(ㄴㅇ,ㄴㅇㄹ,낙원력) 캐릭터이름\n!각인 캐릭터이름\n!내실 캐릭터이름\n!아바타 캐릭터이름\n!섬(ㅅ,ㅆ)\n!유각(ㅇㄱ,ㅅㅍㅇㄱ)\n!젬가격(ㅈㄱㄱ)\n!클골(ㅋㄱ)\n!시간표(ㅅㄱㅍ)\n!폿엘릭서(ㅍㅇㄽ)\n!ㅇㄱㄹ\n!ㅂㅂㄱ 금액\n!시너지(ㅅㄵ,ㅅㄴㅈㅈ)\n!공홈(ㄱㅎ)\n!즐(ㅈ) 캐릭터이름\n!로펙(ㄹㅍ) 캐릭터이름\n!깨달음,진화(ㄲㄷㅇ,ㅈㅎ)\n!등급직업분류정렬가격 검색어\n ex1)!영웅바드아바타낮은순가격 모래의 꿈\n ex2)!전설각인높은순가격 각인\n!가격설명서\n==========\n!로또\n!숫자야구\n!점메추 \n!저메추\n어쩌구저쩌구확 률 \n어절씨구v s저절씨구");
    }
}

// !가격키워드
function marketKeyword(msg, replier) {
    if (msg == "!가격설명서") {
        replier.reply("등급\n일반,고급,희귀,영웅,전설,유물,고대,에스더\n\n직업\n버서커,디트,인파,기공,창술,스커,블레,데모닉,리퍼,호크,데헌,블래,워로드,스카,건슬,도화가,기상,홀나,슬레,알카,서머너,바드,소서,배마\n\n분류\n아바타,각인,재료,배템,요리,생활,모험,항해,펫,탈것,기타\n\n정렬순\n높은순,낮은순\n\n!등급직업분류정렬가격 검색어\n1) '분류'키워드는필수값\n2) 기본값(생략하는 경우)\n - '등급','직업' => 전체검색으로 진행\n - '정렬' => 낮은순\n3) '!'와 '가격'사이에 순서 상관없음\nex)비싼전각 검색하는법\n!각인전설높은순가격 각인");
    }
}
// vs
function VsText(msg, replier, room) {
    if (msg.indexOf("vs") != -1 && msg.indexOf("http") == -1) {
        var vsMsg = msg.split("vs");
        var ran = Math.floor(Math.random() * vsMsg.length);
        replier.reply(vsMsg[ran] + "!!");
    }
}
// percent
function PercentText(msg, replier, room) {
    if (msg.indexOf("확률") != -1) {
        var percentMsg = msg.split("확률");
        var ran = Math.floor(Math.random() * 100);
        replier.reply(percentMsg[0] + "확률 " + ran + "% !!");
    }
}
// 점저메추
function Menu(msg, replier, room) {
    var menu = ["돈가스", "쌀국수", "피자", "햄버거", "보쌈", "삼겹살", "갈비", "족발", "치킨", "국밥", "라면", "타코야키", "김밥",
        "근라탕", "근볶이", "짜장면", "짬뽕", "탕수육", "소고기", "닭갈비", "닭볶음탕", "우육면", "서브웨이", "장어", "탕탕이",
        "볶음밥", "회", "초밥", "김치찌개", "된장찌개", "부대찌개", "순대", "튀김", "김치찜", "해물찜", "아구찜", "밥국김치",
        "엄마밥", "할미밥", "막곱대창", "파스타", "팔보채", "마파두부", "분짜", "간계밥", "샐러드", "도시락", "밥버거", "솔의눈",
        "콩밥", "마라샹궈", "빵", "커피", "도넛", "엿", "말고기"];
    if (msg == "!점메추" || msg == "!저메추") {
        var ran = Math.floor(Math.random() * menu.length);
        replier.reply(menu[ran] + " 잡숴\n한중일양간/식");
    }
}
// !한식
function koreanMenu(msg, replier, room) {
    var menu = ["김밥", "김치볶음밥", "새우볶음밥", "밥버거", "비빔밥", "팥죽", "호박죽", "엿", "전복죽", "김치말이국수", "고기국수", "메밀국수", "콩국수", "잔치국수", "칼국수", "물냉면", "비빔냉면", "평양냉면", "밀면", "떡볶이", "쫄면",
        "잡채", "골뱅이소면", "떡", "묵밥", "메밀묵", "도토리묵", "감자", "옥수수", "고구마", "장아찌", "밥국김치", "돼지갈비", "떡갈비", "소갈비", "곱창", "갈비찜", "육회", "돼지불고기", "소불고기", "제육볶음", "두루치기",
        "수육", "편육", "족발", "보쌈", "순대", "삼합", "닭갈비", "두루치기", "막창", "대창", "닭도리탕", "닭강정", "백숙", "삼계탕", "찜닭", "고등어구이", "고등어조림", "간장게장", "양념게장", "꽁치조림", "꽁치구이", "낙지볶음",
        "매운탕", "물회", "삼치구이", "장어구이", "숙회", "회덮밥", "해물찜", "계란말이", "계란찜", "간계밥", "두부조림", "상추튀김", "쌈밥", "호박전", "육전", "생선전", "김치전", "파전", "빈대떡", "감자전", "부추전", "장조림",
        "돼지국밥", "뼈해장국", "선지국", "순대국밥", "콩나물국밥", "수제비", "된장국", "청국장", "토란국", "재첩국", "우거짓국", "갈비탕", "감자탕", "꽃게탕", "닭개장", "닭곰탕", "도가니탕", "삼계탕", "새우탕", "보신탕", "알탕",
        "육개장", "추어탕", "연포탕", "초계탕", "곱창전골", "김치전골", "국수전골", "두부전골", "김치전골", "버섯전골", "소고기전골", "김치찌개", "갈치찌개", "된장찌개", "고추장찌개", "순두부찌개", "부대찌개", "젓갈", "한과"];
    if (msg == "!한식") {
        var ran = Math.floor(Math.random() * menu.length);
        replier.reply("한식으로 " + menu[ran] + " 추천!!");
    }
}
// !중식
function chinaMenu(msg, replier, room) {
    var menu = ["간짜장", "물짜장", "사천짜장", "삼선짜장", "유니짜장", "짬짜면", "짬짜장", "기스면", "짬뽕", "굴짬뽕", "볶음짬뽕", "우동", "울면", "중국냉면", "볶짜면", "볶짬면", "탕짜면", "탕짬면", "우짜면", "탕우면", "마라샹궈", "근라탕",
        "삼선볶음밥", "잡채밥", "짜장밥", "짬뽕밥", "중화비빔밥", "탕볶밥", "김치피자탕수육", "깐풍기", "유산슬", "유린기", "마라탕", "군만두", "물만두", "꽈배기", "호떡", "찹쌀도넛", "우육면", "깐쇼새우", "난자완스", "샤오룽샤",
        "유린기", "취두부", "팔보채", "북경오리구이", "기스면", "깐풍기", "유산슬", "마파두부", "지삼선"];
    if (msg == "!중식") {
        var ran = Math.floor(Math.random() * menu.length);
        replier.reply("中餐 " + menu[ran] + " 举荐!!");
    }
}
// !일식
function japanMenu(msg, replier, room) {
    var menu = ["초밥", "사케동", "가츠동", "규동", "오나쥬", "오야코동", "카이센동", "텐동", "산마이니쿠동", "오차즈케", "우동", "소바", "모찌", "당고", "라멘", "오코노미야키", "타코야키", "덴푸라", "가라아케", "돈가스", "유부",
        "오뎅나베", "스키야키", "부타나베", "야미나베", "타코와사비", "타마코야키", "챠완무시", "야키토리", "니쿠쟈가", "라후테", "징기스칸", "양갱"];
    if (msg == "!일식") {
        var ran = Math.floor(Math.random() * menu.length);
        replier.reply("和食 " + menu[ran] + " を お勧めします!!");
    }
}
// !양식
function euMenu(msg, replier, room) {
    var menu = ["케밥", "파스타", "피자", "피시앤칩스", "스테이크", "빵", "리조또",
        "또 뭐 있어 추가 좀 하게 추천 좀"];
    if (msg == "!양식") {
        var ran = Math.floor(Math.random() * menu.length);
        replier.reply("I recommend " + menu[ran] + "!!");
    }
}
// !간식
function desertMenu(msg, replier, room) {
    var menu = ["도넛", "케이크", "아이스크림", "동결건조딸기", "마카롱", "뚱카롱", "탕후루", "스무디", "에이드", "라떼",
        "또 뭐 있어 추가 좀 하게 추천 좀"];
    if (msg == "!간식") {
        var ran = Math.floor(Math.random() * menu.length);
        replier.reply(menu[ran] + "!!");
    }
}
// 문의
function Inquiry(msg, replier, room, sender) {
    var input = msg.split(" ");

    if (!msg.includes("!") || msg[0] != "!" || input[1] == "" || input[1] == null) { return; }

    if (input[0] == "!문의") {
        replier.reply("전달해따")
        Api.replyRoom("한용희", room + "의 " + sender + ": " + msg.slice(4, msg.length));
    }
}

// !분배금
function Distribution(msg, replier, room) {
    var _msg = msg.substring(0, 4);
    var gold = msg.substring(5, msg.length);
    var four;
    var eight;
    var sixteen;
    if (_msg == "!ㅂㅂㄱ") {
        four = parseInt(gold) * 0.95 * 0.75;
        eight = parseInt(gold) * 0.95 * 0.875;
        sixteen = parseInt(gold) * 0.95 * 0.9375;
        replier.reply("< 사이 좃은 분배금 >\n" + "4인 엔빵비 - " + parseInt(four) + "\n4인 개이득 - " + parseInt(four / 1.1) + "\n8인 엔빵비 - " + parseInt(eight) + "\n8인 개이득 - " + parseInt(eight / 1.1) + "\n16인 엔빵비 - " + parseInt(sixteen) + "\n16인 개이득 - " + parseInt(sixteen / 1.1));
    }
}

// !깨달음
function realization(msg, replier, room) {
    var _msg = msg.substring(0, 4);
    if (_msg == "!깨달음" || _msg == "!ㄲㄷㅇ") {
        replier.reply("깨달음포인트\n(1)전투레벨\n전투레벨50부터 1당 1p,최대20p\n(2)내실\n에포나3p,모험의서3p,해도3p,필보5p\n(3)악세\n유물:목걸이10p,나머지9p\n고대:목걸이13p,나머지12p");
    }
}
// !진화
function evolution(msg, replier, room) {
    var _msg = msg.substring(0, 4);
    if (_msg == "!진화" || _msg == "!ㅈㅎ") {
        replier.reply("진화 포인트\n전투레벨 50부터 1당 +1, 최대 +20\n유물장비 부위당 +8\n고대장비 부위당 +20");
    }
}

function IncorrectCommand(msg, replier, room) {
    var _msg = msg.substring(0, 3);
    if (_msg == ".정보" || _msg == ".배럭" || _msg == ".부캐" || _msg == ".스킬" || _msg == ".보석" || _msg == ".장비" || _msg == ".악세" || _msg == ".각인" || _msg == ".ㅂㅂ") {
        replier.reply("퉤");
        replier.reply("!를 쓰거라");
    }
}
// !시간표
function timeTable(msg, replier, room) {
    var _msg = msg.substring(0, 4);
    if (_msg == "!시간표" || _msg == "!ㅅㄱㅍ") {
        replier.reply("로아 시간표\n 월 - 카게\n 화 - 필보, 태초\n 수 - 숙제나해\n 목 - 카게, 태초\n 금 - 필보\n 토 - 카게, 태초\n 일 - 카게, 필보");
    }
}

// !검사
function BlackDesert(msg, replier, room) {
    var _msg = msg.substring(0, 3);
    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const todayString = days[new Date().getDay()];
    const today = new Date().getDay();
    var msgText = "< " + todayString + " 검사 보스 >\n";
    switch (today) {
        // 일
        case 0:
            msgText += "0200 : 금예니왕\n1100 : 산군\n1600 : 금예니왕\n2000 : 불가살 우투리\n2345 : 금예니왕 산군";
            break;
        // 월
        case 1:
            msgText += "0200 : 불가살\n1100 : 우투리\n1600 : 금예니왕\n2000 : 산군 불가살\n2345 : 우투리 금예니왕";
            break;
        // 화
        case 2:
            msgText += "0200 : 산군\n1100 : 금예니왕\n1600 : 불가살\n2000 : 금예니왕 우투리\n2345 : 산군 불가살";
            break;
        // 수
        case 3:
            msgText += "0200 : 금예니왕\n1600 : 불가살\n2000 : 우투리 산군\n2345 : 산군 불가살";
            break;
        // 목
        case 4:
            msgText += "0200 : 우투리\n1100 : 산군\n1600 : 우투리\n2000 : 산군 금예니왕\n2345 : 불가살 우투리";
            break;
        // 금
        case 5:
            msgText += "0200 : 산군\n1100 : 불가살\n1600 : 우투리\n2000 : 금예니왕 불가살\n2345 : 우투리 산군";
            break;
        // 토
        case 6:
            msgText += "0200 : 불가살\n1100 : 금예니왕\n1600 : 산군\n2345 : 불가살 우투리";
            break;
        default:
            msgText += "알 수 없는 요일 🤔";
    }
    if (_msg == "!검사" || _msg == "!ㄳ" || _msg == "!ㄱㅅ") {
        replier.reply(msgText);
    }
}

// !데미지
function Damages(msg, replier) {
    var input = msg.split(" ");

    if (input[0] == "!데미지") {
        var damagesSite = "";
        damagesSite += "https://lostbuilds.com/info/" + input[1];
        replier.reply(damagesSite);
    }
}

// !각인도감감
function engravigsDictionary(msg, replier) {
    var input = msg.split(" ");

    if (input[0] == "!각인도감" || input[0] == "!ㄱㅇㄷㄱ") {
        var seetStie = "";
        seetStie = "https://docs.google.com/spreadsheets/d/1tCtHi5GZh1p_1zCjJbNOam0-eVIqVHhSyV_W1_EOAGE/edit?usp=sharing";
        replier.reply(seetStie);
    }
}
// !ㅋㅁ 4관 3관주
function getWeekType(msg, replier) {
    var result = "";
    if (msg == "!카멘" || msg == "!하브" || msg == "!하멘" || msg == "!아브" || msg == "!ㅋㅁ" || msg == "!ㅎㅂ" || msg == "!ㅎㅁ" || msg == "!ㅇㅂ") {
        // 2023년 9월 13일을 기준 날짜로 설정
        var date = new Date();
        var baseDate = new Date(2023, 8, 13); // 월은 0부터 시작하므로 9월은 8로 설정
        // 주차는 수요일 기준으로 계산하기 위해 요일을 조정
        var baseDay = (baseDate.getDay() + 4) % 7; // 0: 월, 1: 화, 2: 수, ...

        // 현재 날짜의 요일을 계산
        var currentDay = (date.getDay() + 4) % 7;

        // 기준 날짜와 현재 날짜의 차이를 일수로 계산
        var diffInDays = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

        // 주차를 계산
        var diffInWeeks = Math.floor((diffInDays - (currentDay - baseDay)) / 7);
        // 주차를 격주로 나누어 1 또는 2를 반환
        result = (diffInWeeks % 2) === 0 ? '4관' : '3관';
        replier.reply("오늘은 " + result + "주!!");
    }
}

// 시너지 정보를 객체로 구조화
const synergyInfo = {
    "전사 (슈샤이어)": [
        { class: "워로드", synergy: "방감12, 피증4, 백헤드5" },
        { class: "디트", synergy: "방감12" },
        { class: "버서커/슬레", synergy: "피증6" }
    ],
    "무도가 (애니츠)": [
        { class: "창술", synergy: "치명타 시 피증8" },
        { class: "배마", synergy: "치적10, 공속8, 이속16" },
        { class: "스커", synergy: "치적10, 공속8" },
        { class: "인파/브레", synergy: "피증6" },
        { class: "기공", synergy: "공증6" }
    ],
    "헌터 (아르데타인)": [
        { class: "데헌/건슬", synergy: "치적 10" },
        { class: "호크", synergy: "피증6, 이속4(두동)" },
        { class: "블래", synergy: "방감12" },
        { class: "스카", synergy: "공증6" }
    ],
    "마법사 (실린)": [
        { class: "서머너", synergy: "방감12, 마회40 (트포 선택)" },
        { class: "알카", synergy: "치적10" },
        { class: "소서", synergy: "피증6" }
    ],
    "암살자 (데런)": [
        { class: "리퍼", synergy: "방감12" },
        { class: "데모닉", synergy: "피증6" },
        { class: "소울", synergy: "피증6" },
        { class: "블레", synergy: "피증4, 백헤드5, 공속25, 이속20" }
    ],
    "스페셜리스트 (요즈)": [
        { class: "기상", synergy: "치적10, 공속12(질풍), 이속12(질풍), 공감10(이슬비)" },
        { class: "환수", synergy: "방감12" }
    ]
};

// 출력 함수
function printSynergyInfo(info, msg, replier, room) {
    var data = "";
    if (msg == "!ㅅㄴㅈ" || msg == "!시너지" || msg == "!ㅅㄵ") {
        for (let category in info) {
            data += (" ✤ " + category + '\n');
            info[category].forEach(entry => {
                data += (entry.class + " : " + entry.synergy + '\n');
            });
        }
        data = data.trimEnd();
        replier.reply(data);
    }
}

function zloaSearch(msg, replier) {
    // !즐 관련 명령어 처리 (닉네임 포함 또는 미포함)
    const zloaCommands = ["!즐", "!ㅈ", "!ㅈㄹㅇ", "!즐로아", "!즐로"];
    let handledByNicknameZ = false; // 닉네임 검색으로 처리되었는지 확인하는 플래그
    for (let i = 0; i < zloaCommands.length; i++) {
        // 명령어 뒤에 공백과 닉네임이 오는 경우
        if (msg.startsWith(zloaCommands[i] + " ")) {
            const nickname = msg.substring(zloaCommands[i].length + 1).trim(); // 명령어와 공백 뒤의 닉네임 추출

            if (nickname.length > 0) {
                // 닉네임이 있는 경우, 캐릭터 정보 URL 생성 및 응답
                const characterUrl = "https://zloa.net/char/" + encodeURIComponent(nickname); // 닉네임에 특수 문자가 포함될 수 있으므로 인코딩 처리
                replier.reply(characterUrl);
                handledByNicknameZ = true; // 닉네임 검색으로 처리되었음을 표시
                break; // 해당 메시지 처리를 중단 (더 이상 다른 즐로아 명령어를 확인할 필요 없음)
            }
        }
    }

    // 닉네임 검색으로 처리되지 않았고, 메시지가 정확히 즐로아 기본 명령어인 경우
    if (!handledByNicknameZ && zloaCommands.includes(msg)) {
        // 즐로아 기본 홈페이지 링크 응답
        replier.reply("https://zloa.net/");
    }
}

function lopecSearch(msg, replier) {
    // !ㄿ 관련 명령어 처리 (닉네임 포함 또는 미포함)
    const lopecSearchCommands = ["!ㄿ", "!로펙", "!ㄹㅍ"];
    let handledByNicknameL = false; // 닉네임 검색으로 처리되었는지 확인하는 플래그
    for (let i = 0; i < lopecSearchCommands.length; i++) {
        // 명령어 뒤에 공백과 닉네임이 오는 경우
        if (msg.startsWith(lopecSearchCommands[i] + " ")) {
            const nickname = msg.substring(lopecSearchCommands[i].length + 1).trim(); // 명령어와 공백 뒤의 닉네임 추출

            if (nickname.length > 0) {
                // 닉네임이 있는 경우, 캐릭터 정보 URL 생성 및 응답
                const characterUrl = "https://legacy.lopec.kr/search/search.html?headerCharacterName=" + encodeURIComponent(nickname); // 닉네임에 특수 문자가 포함될 수 있으므로 인코딩 처리
                replier.reply(characterUrl);
                handledByNicknameL = true; // 닉네임 검색으로 처리되었음을 표시
                break; // 해당 메시지 처리를 중단 (더 이상 다른 로펙 명령어를 확인할 필요 없음)
            }
        }
    }

    // 닉네임 검색으로 처리되지 않았고, 메시지가 정확히 로펙 기본 명령어인 경우
    if (!handledByNicknameL && lopecSearchCommands.includes(msg)) {
        // 로펙 기본 홈페이지 링크 응답
        replier.reply("https://lopec.kr/");
    }

    // !ㄿ [닉네임] 명령어 처리
    // if (msg.startsWith("!ㄿ ") || msg.startsWith("!로펙 ") || msg.startsWith("!ㄹㅍ ")) {
    //     // 메시지에서 "!ㄿ " 뒤에 오는 닉네임 추출
    //     var nickname = msg.substring("!ㄿ ".length).trim();

    //     // 닉네임이 비어있지 않은 경우에만 처리
    //     if (nickname.length > 0) {
    //         // 추출한 닉네임을 이용하여 URL 생성
    //         var characterUrl = "https://lopec.kr/search/search.html?headerCharacterName=" + encodeURIComponent(nickname); // 닉네임에 특수 문자가 포함될 경우를 대비하여 인코딩
    //         // 생성된 URL로 응답
    //         replier.reply(characterUrl);
    //     } else {
    //         // 닉네임이 입력되지 않은 경우 안내 메시지 응답 (선택 사항)
    //         // replier.reply("검색할 캐릭터 닉네임을 입력해주세요. 예: !ㄿ 고로");
    //     }
    // }
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