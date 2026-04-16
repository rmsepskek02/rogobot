const scriptName = "로아API";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

apiKey = "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAxMDQyNDYifQ.LbWRJAb502GgmlQfzaTtjBimxBGYmIWfE9v4zemt7AVSAbZoKTKt6FsaP2sKtO8jAbgFnyfh5RM9YmnQg2hAA0K3jXMUCOkdMKnhjuH4bnVn0LXCWfRFJUWZrEpWvgyfNyCs_ZjrdzFzPMLtptOkGWIIP_BhEcZFRXQcVvGPzvW-GI_o4AZR5BSIPUv9Yg7RgD5NrGoQlxo1B_nwty7NXZ7Lxjrt-Ck2LOLjZVu3WNDTVjaymhDBR6hZEaaQdMCrCZLdz0eO2APrTwQJOCcfDYtIGOHYwBmepRAQCiASBKq3bGt65T2J6-1pnDNa9qkpMPh-QwahSagEWtIbmp3ybw";
apiBaseURL = "https://developer-lostark.game.onstove.com";
apiURLF = ["/characters/", "/armories/characters/", "/auctions", "/guilds/rankings", "/markets", "/gamecontents"];
apiURLB = ["/siblings", "/profiles", "/equipment", "/avatars", "/combat-skills", "/engravings", "/cards", "/gems", "/colosseums", "/collectibles", "/options", "/items/", "/items", "/calendar", ""];

var lostArkServerNameArr = ["루페온", "카마인", "카단", "실리안", "아만", "니나브", "아브렐슈드", "카제로스"];

var output = "";
var url = "";

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

  // if(room != "한용희"){
  //   return;
  // }

  // if(msg == "123"){
  //   replier.reply("room: " + room + "\n" + 
  //   "msg: " + msg + "\n" + 
  //   "sender: " + sender + "\n" + 
  //   "isGroupChat: " + isGroupChat + "\n" + 
  //   "replier: " + replier + "\n" + 
  //   "imageDB: " + imageDB + "\n" + 
  //   "packageName: " + packageName + "\n" + 
  //   "TEST: " + getAPI("/armories/characters/"+"고로바드"+"/equipment"));
  // }
  // 출력
  try {
    if (msg == "123123무기" || msg == "123123투구" || msg == "123123상의" || msg == "123123하의" || msg == "123123장갑" || msg == "123123어깨" || msg == "123123" || msg == "123123목걸이" || msg == "123123귀걸이" || msg == "123123반지" || msg == "123123어빌리티 스톤" || msg == "123123팔찌") {
      testJSON(replier, false, true, msg);
    }
    replyData(room, msg, sender, isGroupChat, replier, imageDB, packageName);
  } catch (e) {
    Api.replyRoom("한용희", e + "\n" + e.lineNumber);
    replier.reply("삐빅! 에러!");
    Log.debug(e, true);
    Log.error(e, true);
  }
}

// API URL 생성 & API 결과 출력
function replyData(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  // 출력 초기화
  output = "";
  var searchName = "";
  var command = "";
  var categoryCode = 0;
  var urlArr = [];
  var input;

  input = msg.split(" ");
  // 검색어
  searchName = input[1];
  // 명령어
  command = input[0];

  // 입력 값
  // 입력 값 검사
  //// TODO 입력값 검사하는 함수를 만들자 Array로 명령어 담고 for문 돌려서 검사
  if (msg.indexOf("!섬") === "-1" && msg.indexOf("!유각") === "-1") {
    if (!msg.includes("!") || msg[0] != "!" || input[1] == "" || input[1] == null) { return; }
  }

  output += "< " + searchName + " >" + "님의 정보" + "\n";

  // !가격 검사
  if (command.indexOf("!") === 0 && command.indexOf("가격") !== -1 && command.indexOf("보석") === -1) {
    var _searchName = "";
    for (var i = 1; i < input.length; i++) {
      _searchName += input[i] + " ";
    }
    output = "";
    searchName = _searchName.slice(0, _searchName.length - 1);
    output += "< " + searchName + " >" + "검색 결과" + "\n";
  }
  // !섬
  if (msg.indexOf("!섬") != "-1" || msg.indexOf("!ㅅ") != "-1" || msg.indexOf("!ㅆ") != "-1") {
    output = "";
  }
  // !유각 검사
  if (msg.indexOf("!유각") != "-1" || msg.indexOf("!ㅇㄱ") != "-1" || msg.indexOf("!ㅈㄱㄱ") != "-1" || msg.indexOf("!젬가격") != "-1" || msg.indexOf("!ㅅㅍㅇㄱ") != "-1" || msg.indexOf("!서폿유각") != "-1" || msg.indexOf("!보석가격") != "-1" || msg.indexOf("!ㅄ") != "-1" || msg.indexOf("!ㅄㄱㄱ") != "-1" || msg.indexOf("!ㅂㅅㄱㄱ") != "-1") {
    output = "";
  }

  // URL 생성
  urlArr = checkInputForURL(command, searchName);

  // 데이터 가공
  output += checkInputForData(command, urlArr, searchName);

  // 결과 출력
  if (checkInputForData(command, urlArr, categoryCode) == null || checkInputForData(command, urlArr, categoryCode) == "") {
    output = "";
    output += nullData(command);
    // 텍스트결과 출력
    replier.reply(output);
  }
  else {
    replier.reply(output);
  }
}

// !정보 가공
function Info(_urlArr, searchName) {
  var infoAPIJSON = getAPI(_urlArr[0]);
  var infoData = "";
  var infoData2 = "";
  var infoData3 = "";
  var infoData4 = "";
  var infoData5 = "";
  var infoData6 = "";
  var infoData7 = "";
  var infoData8 = "";
  var infoProfile = "";
  var infoEngraving = "";
  var infoCard = "";
  var _infoGem = "";
  var infoGem = "";
  var infoEquipment = "";
  var infoWeaponPoint = "";
  var infoQuality = 0;
  var infoElixirNum = 0;
  var infoElixirSet = "";
  var infoSet = [];
  var infoSetEffect = "";
  var infoTranscendenceSum = 0;
  var isArkPassive = false;
  var arkEvolution = "";
  var arkEvolutionValue = "";
  var arkRealiztion = "";
  var arkRealiztionValue = "";

  // API 결과 Null 인 경우
  var infoAPIstr = JSON.stringify(infoAPIJSON);
  if (infoAPIstr == null || infoAPIJSON == null || infoAPIJSON == "") {
    return null;
  }

  infoProfile = infoAPIJSON["ArmoryProfile"];
  infoEngraving = infoAPIJSON["ArmoryEngraving"];
  infoCard = infoAPIJSON["ArmoryCard"];
  _infoGem = infoAPIJSON["ArmoryGem"];
  infoEquipment = infoAPIJSON["ArmoryEquipment"];
  isArkPassive = infoProfile["ArkPassive"]["IsArkPassive"];
  arkEvolution = infoProfile["ArkPassive"]["Points"][0]["Name"];
  arkEvolutionValue = infoProfile["ArkPassive"]["Points"][0]["Value"];
  arkRealiztion = infoProfile["ArkPassive"]["Points"][1]["Name"];
  arkRealiztionValue = infoProfile["ArkPassive"]["Points"][1]["Value"];

  // 세트효과
  if (isArkPassive == false) {
    var weaponSet = tooltipJSON(infoEquipment, "무기", false, true, isArkPassive)[3];
    var gloveSet = tooltipJSON(infoEquipment, "장갑", false, true, isArkPassive)[3];
    infoSet.push((weaponSet == "장착") ? gloveSet : weaponSet);
    infoSet.push(gloveSet);
    infoSet.push(tooltipJSON(infoEquipment, "투구", false, true, isArkPassive)[3]);
    infoSet.push(tooltipJSON(infoEquipment, "상의", false, true, isArkPassive)[3]);
    infoSet.push(tooltipJSON(infoEquipment, "하의", false, true, isArkPassive)[3]);
    infoSet.push(tooltipJSON(infoEquipment, "어깨", false, true, isArkPassive)[3]);
    var result = {};
    infoSet.forEach((x) => {
      result[x] = (result[x] || 0) + 1;
    });
    var keys = Object.keys(result);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      infoSetEffect += result[key] + key;
    }
  }

  // 품질
  infoQuality += + Math.round(((
    tooltipJSON(infoEquipment, "무기", false, true, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "투구", false, true, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "상의", false, true, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "하의", false, true, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "장갑", false, true, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "어깨", false, true, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "목걸이", false, false, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "귀걸이", false, false, isArkPassive)[2]
    + tooltipJSON(infoEquipment, "반지", false, false, isArkPassive)[2]) / 11) * 10) / 10;

  // 엘릭서 세트
  var infoElixirSet01 = tooltipJSON(infoEquipment, "투구", true, true)[4].replace("연성 추가 효과 ", "");
  var infoElixirSet02 = infoElixirSet01.replace(" (", " Lv.");
  var infoElixirSet03 = infoElixirSet02.replace("단계)", "");
  infoElixirSet += infoElixirSet03;

  // 엘릭서 합
  infoElixirNum +=
    + (tooltipJSON(infoEquipment, "투구", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "상의", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "하의", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "장갑", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "어깨", true, true, isArkPassive)[1]);

  // 초월 합
  infoTranscendenceSum +=
    (tooltipJSON(infoEquipment, "무기", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "투구", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "상의", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "하의", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "장갑", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "어깨", false, true, isArkPassive)[5]);

  // 서버/클래스/세트효과/길드
  if (isArkPassive == false)
    infoData2 += infoProfile["ServerName"] + "/" + infoProfile["CharacterClassName"] + "/" + infoSetEffect + "/" + infoProfile["GuildName"] + "\n Ark OFF " + "[" + arkEvolution + " : " + arkEvolutionValue + "]" + "[" + arkRealiztion + " : " + arkRealiztionValue + "]" + "\n\n템렙/전/원/무강/품\n";
  else
    infoData2 += infoProfile["ServerName"] + "/" + infoProfile["CharacterClassName"] + "/" + infoProfile["GuildName"] + "\n Ark ON " + "[" + arkEvolution + " : " + arkEvolutionValue + "]" + "[" + arkRealiztion + " : " + arkRealiztionValue + "]" + "\n\n템렙/전/원/무강/품\n";

  // 무강
  for (var i = 0; i < infoEquipment.length; i++) {
    if (infoEquipment[i]["Type"] == "무기") {
      var infoWeapon = infoEquipment[i]["Name"].split(" ");
      infoWeaponPoint = infoWeapon[0].slice(1, infoWeapon.length);
    }
  }
  // 템렙/전/원/무강/품질
  infoData2 += infoProfile["ItemAvgLevel"].slice(0, infoProfile["ItemAvgLevel"].length - 3) + "/" + infoProfile["CharacterLevel"] + "/" + infoProfile["ExpeditionLevel"] + "/" + infoWeaponPoint + "/" + infoQuality + "\n\n각인 ";

  // 각인
  if (isArkPassive == false) {
    for (var i = 0; i < infoEngraving["Effects"].length; i++) {
      var engName = infoEngraving["Effects"][i]["Name"];
      infoData2 += engName.slice(0, 1) + engName.slice(engName.length - 1, engName.length) + " ";
    }
  }
  else {
    for (var i = 0; i < infoEngraving["ArkPassiveEffects"].length; i++) {
      var arkEngName = infoEngraving["ArkPassiveEffects"][i]["Name"];
      var arkEngGrade = infoEngraving["ArkPassiveEffects"][i]["Grade"];
      var arkEngGradeLv = infoEngraving["ArkPassiveEffects"][i]["Level"];

      if (arkEngGrade == "유물")
        arkEngGrade = "";

      infoData2 += arkEngName.slice(0, 1) + arkEngGrade.slice(0, 1) + arkEngGradeLv + " ";
    }
    infoData2 += "\n스톤 ";
    for (var j = 0; j < infoEngraving["ArkPassiveEffects"].length; j++) {
      var _arkEngName = infoEngraving["ArkPassiveEffects"][j]["Name"];
      var arkEngStoneLv = infoEngraving["ArkPassiveEffects"][j]["AbilityStoneLevel"];
      if (arkEngStoneLv != null) {
        infoData2 += _arkEngName.slice(0, 1) + arkEngStoneLv + " ";
      }
    }
  }

  // 체공
  infoData2 += "\n체공 ";
  for (var i = 0; i < infoProfile["Stats"].length; i++) {
    var statPoint = infoProfile["Stats"][i]["Value"];
    var statType = infoProfile["Stats"][i]["Type"];
    if (parseInt(statPoint) > 99) {
    }
    if (statType == "최대 생명력") {
      infoData2 += statPoint + " / ";
    }
    if (statType == "공격력") {
      infoData2 += statPoint;
    }
  }

  // 특성
  infoData2 += "\n특성 ";
  for (var i = 0; i < infoProfile["Stats"].length; i++) {
    var statPoint = infoProfile["Stats"][i]["Value"];
    var statType = infoProfile["Stats"][i]["Type"];
    if (parseInt(statPoint) > 99 && statType != "공격력" && statType != "최대 생명력") {
      infoData2 += statType + statPoint + "/";
    }
  }
  infoData3 = infoData2.slice(0, infoData2.length - 1);

  // 보석
  infoData3 += "\n멸홍  ";
  if (_infoGem["Gems"] != null) {
    infoGem = _infoGem["Gems"].sort((a, b) => { return b.Level - a.Level })
    for (var i = 0; i < infoGem.length; i++) {
      var gemsName = infoGem[i]["Name"]
      var gemsLevel = infoGem[i]["Level"]
      if (gemsName.indexOf("멸화") != "-1") {
        infoData3 += gemsLevel + ",";
      }
    }
    infoData4 = infoData3.slice(0, infoData3.length - 1) + "/ ";
    for (var i = 0; i < infoGem.length; i++) {
      var gemsName = infoGem[i]["Name"]
      var gemsLevel = infoGem[i]["Level"]
      if (gemsName.indexOf("홍염") != "-1") {
        infoData4 += gemsLevel + ",";
      }
    }
    infoData5 = infoData4.slice(0, infoData4.length - 1) + "\n겁작  ";
    for (var i = 0; i < infoGem.length; i++) {
      var gemsName = infoGem[i]["Name"]
      var gemsLevel = infoGem[i]["Level"]
      if (gemsName.indexOf("겁화") != "-1") {
        infoData5 += gemsLevel + ",";
      }
    }
    infoData6 = infoData5.slice(0, infoData5.length - 1) + "/";
    for (var i = 0; i < infoGem.length; i++) {
      var gemsName = infoGem[i]["Name"]
      var gemsLevel = infoGem[i]["Level"]
      if (gemsName.indexOf("작열") != "-1") {
        infoData6 += gemsLevel + ",";
      }
    }
    infoData7 = infoData6.slice(0, infoData6.length - 1);
    var gemDes = _infoGem["Effects"]["Description"] == "" ? "0%" : _infoGem["Effects"]["Description"].split(':')[1].trim();
    infoData7 += "\n보공 " + gemDes;
  }
  else {
    infoData7 += infoData3.slice(0, infoData5.length - 4) + "보석 " + "쌀";
  }

  // 엘릭
  infoData7 += "\n엘릭 " + infoElixirSet + " (" + infoElixirNum + ")";

  // 초월
  infoData7 += "\n초월 " + infoTranscendenceSum + "\n";

  // 카드
  infoData7 += infoCard["Effects"][0]["Items"][infoCard["Effects"][0]["Items"].length - 1]["Name"] + "\n";
  infoData += infoData7;
  infoData8 += "https://iloa.gg/character/" + searchName;
  infoData += infoData8;
  return infoData;
}

// !스킬 가공
function Skills(_urlArr) {
  var skillsAPIJSON = getAPI(_urlArr[0]);
  var _skillsData = "";
  var skillFilterRune = [];

  // API 결과 Null 인 경우
  var skillsAPIstr = JSON.stringify(skillsAPIJSON);
  if (skillsAPIstr == null || skillsAPIJSON == null || skillsAPIJSON == "") {
    return null;
  }

  // 룬 장착 여부 == 사용 여부
  for (var i = 0; i < skillsAPIJSON.length; i++) {
    if (skillsAPIJSON[i]["Rune"] != null) {
      skillFilterRune.push(skillsAPIJSON[i]);
    }
  }

  // 레벨 순 정렬
  var levelResult = skillFilterRune.sort((a, b) => {
    let x = parseInt(a.Level);
    let y = parseInt(b.Level);
    if (x < y) { return 1; }
    if (x > y) { return -1; }
    return 0;
  });

  for (var i = 0; i < levelResult.length; i++) {
    _skillsData += "Lv" + levelResult[i]["Level"]
      + " [" + levelResult[i]["Rune"]["Grade"]
      + levelResult[i]["Rune"]["Name"] + "]"
      + " [" + levelResult[i]["Name"] + "]" + "\n" + "   ";
    for (var j = 0; j < levelResult[i]["Tripods"].length; j++) {
      if (levelResult[i]["Tripods"][j]["IsSelected"] == true) {
        var tripodsName = levelResult[i]["Tripods"][j]["Name"].split(" ")
        for (var k = 0; k < tripodsName.length; k++) {
          if (tripodsName.length < 2) { _skillsData += tripodsName[k].slice(0, 2); }
          else { _skillsData += tripodsName[k].slice(0, 1); }
        }
        _skillsData += " ";
        // _skillsData += levelResult[i]["Tripods"][j]["Level"] + " ";
      }
    }
    _skillsData += "\n"
  }
  var _skillsData2 = _skillsData.slice(0, _skillsData.length - 2);
  return _skillsData2;
}

// !배럭 가공
function Characters(_urlArr) {
  var charactersAPIJSON = getAPI(_urlArr[0]);
  var _charactersData = "";

  // API 결과 Null 인 경우
  var charactersAPIstr = JSON.stringify(charactersAPIJSON);
  if (charactersAPIstr == null || charactersAPIJSON == null || charactersAPIJSON == "") {
    return null;
  }

  // 레벨 순 정렬
  var levelResult = charactersAPIJSON.sort((a, b) => {
    let x = parseFloat(a.ItemAvgLevel.replace(/,/gi, "").toLowerCase());
    let y = parseFloat(b.ItemAvgLevel.replace(/,/gi, "").toLowerCase());
    if (x < y) { return 1; }
    if (x > y) { return -1; }
    return 0;
  });
  var maxLevelSerever = levelResult[0]["ServerName"];

  // 계정 서버 리스트 
  var serverNameArrTemp = [];
  var serverNameArr = [];
  for (var i = 0; i < charactersAPIJSON.length; i++) {
    var charactersServerName = charactersAPIJSON[i]["ServerName"];
    serverNameArrTemp.push(charactersServerName);
  }
  for (var i = 0; i < serverNameArrTemp.length; i++) {
    if (!serverNameArr.includes(serverNameArrTemp[i])) {
      serverNameArr.push(serverNameArrTemp[i]);
    }
  }

  // 가장 렙이 높은 캐릭터의 서버 원정대
  var gold = 0;
  var _charactersDataTemp = ""
  _charactersDataTemp += "[" + maxLevelSerever + "]" + "\n";
  for (var i = 0; i < levelResult.length; i++) {
    if (maxLevelSerever == levelResult[i]["ServerName"]) {
      var charLv = parseInt(levelResult[i]["ItemAvgLevel"].replace(/,/gi, ""), 10);

      // 각 레벨별 가장 높은 골드 보상 3개 선택 (같은 레이드 다른 난이도 제외)
      if (1740 <= charLv) {
        // 종막 하드(52000) + 4막 하드(42000) + 세르카 악몽(54000)
        gold += 52000 + 42000 + 54000;
      }
      else if (1730 <= charLv) {
        // 종막 하드(52000) + 4막 하드(42000) + 세르카 하드(44000)
        gold += 52000 + 42000 + 44000;
      }
      else if (1720 <= charLv) {
        // 4막 하드(42000) + 종막 노말(40000) + 세르카 노말(35000)
        gold += 42000 + 40000 + 35000;
      }
      else if (1710 <= charLv) {
        // 종막 노말(40000) + 4막 노말(33000) + 세르카 노말(35000)
        gold += 40000 + 33000 + 35000;
      }
      else if (1700 <= charLv) {
        // 3막 하드(27000) + 4막 노말(33000) + 2막 하드(23000)
        gold += 27000 + 33000 + 23000;
      }
      else if (1690 <= charLv) {
        // 2막 하드(23000) + 3막 노말(21000) + 1막 하드(18000)
        gold += 23000 + 21000 + 18000;
      }
      else if (1680 <= charLv) {
        // 3막 노말(21000) + 1막 하드(18000) + 2막 노말(16500)
        gold += 21000 + 18000 + 16500;
      }
      else if (1670 <= charLv) {
        // 2막 노말(16500) + 1막 노말(11500) + 베히모스(7200)
        gold += 16500 + 11500 + 8800;
      }
      else if (1660 <= charLv) {
        // 1막 노말(11500) + 베히모스(7200) + 서막 하드(6100)
        gold += 11500 + 7200 + 6100;
      }
      else if (1640 <= charLv) {
        // 베히모스(7200) + 서막 하드(6100) + 상아탑 하드(7200 귀속)
        gold += 7200 + 6100;
      }
      else {
        gold += 0;
      }

      _charactersDataTemp += "Lv" + levelResult[i]["ItemAvgLevel"].replace(/,/gi, "")
        + " [" + levelResult[i]["CharacterClassName"].substring(0, 2) + "]"
        + " " + levelResult[i]["CharacterName"] + "\n";
      if (i == 5) {
        _charactersDataTemp += "●주급 [" + gold + "G]\n" + "\u200b".repeat(500) + "\n";
      }
    }
  }

  return _charactersDataTemp;
}
// !보석 가공
function Gems(_urlArr) {
  var gemsAPIJSON = getAPI(_urlArr[0]);
  var gemsData = '{"GemsData" : [';

  // API 결과 Null 인 경우
  var gemAPIstr = JSON.stringify(gemsAPIJSON);
  if (gemAPIstr == null || gemsAPIJSON == null) {
    return null;
  }
  if (gemsAPIJSON["Gems"] == null || gemsAPIJSON["Gems"] == "") {
    return null;
  }

  for (var i = 0; i < gemsAPIJSON["Gems"].length; i++) {
    var slot = JSON.stringify(gemsAPIJSON["Gems"][i]["Slot"]);
    for (var j = 0; j < gemsAPIJSON["Effects"]["Skills"].length; j++) {
      var gemSlot = JSON.stringify(gemsAPIJSON["Effects"]["Skills"][j]["GemSlot"]);
      if (slot == gemSlot) {
        // 멸화 홍염
        var slotName = JSON.stringify(gemsAPIJSON["Gems"][i]["Name"]);
        var _slotName1 = slotName.replace(/의 보석/gi, "");
        var _slotName2 = _slotName1.replace(/레벨/gi, "");
        var _slotName3 = _slotName2.replace(/10 /gi, "10");
        // 렙
        var gemsLevel = JSON.stringify(gemsAPIJSON["Gems"][i]["Level"]);
        // 스킬 이름
        var gemSlotName = JSON.stringify(gemsAPIJSON["Effects"]["Skills"][j]["Name"]);
        // 이미지
        var gemImage = JSON.stringify(gemsAPIJSON["Gems"][i]["Icon"]);
        gemsData += '{"GemsName" : ' + _slotName3 + ',';
        gemsData += '"GemsLevel" : ' + "\"" + gemsLevel + "\"" + ',';
        gemsData += '"GemsImage" : ' + gemImage + ',';
        gemsData += '"GemsEffect" : ' + gemSlotName + '},';
      }
    }
  }
  var gemsTemp = gemsData.slice(0, gemsData.length - 1);
  gemsTemp += ']}';
  // API 결과 JSON 반환
  var gemsJson = JSON.parse(gemsTemp);
  // JSON 객체 정렬
  var levelResult = gemsJson["GemsData"].sort((a, b) => { return b.GemsLevel - a.GemsLevel })

  // JSON to String
  var gemsName = "";
  var gemsEffect = "";
  gemsData = "";
  for (i = 0; i < gemsJson["GemsData"].length; i++) {
    gemsName = levelResult[i]["GemsName"];
    gemsEffect = levelResult[i]["GemsEffect"];
    gemsData += gemsName + gemsEffect + "\n";
  }
  var _gemsData = gemsData.slice(0, gemsData.length - 1);
  var _gemsData2 = _gemsData.replace(/\n /gi, "\n");
  var _gemsData3 = _gemsData2.slice(1);
  return _gemsData3;
}

// !장비 & 악세 함수
function tooltipJSON(_equipmentAPIJSON, type, isElixir, isEquip, isArk) {
  var data = "";
  var elixirSum = 0;
  var qualityValue = 0;
  var transcendenceSum = 0;
  var setEffect = "";
  var elixirEffect = "";

  for (var i = 0; i < _equipmentAPIJSON.length; i++) {
    if (_equipmentAPIJSON[i]["Type"] == type) {
      try {
        // JSON 파싱 부분을 안전하게 수정
        var tooltipData = _equipmentAPIJSON[i]["Tooltip"];
        var _equipTooltipJSON;

        // 이미 객체인 경우
        if (typeof tooltipData === 'object' && tooltipData !== null) {
          // 객체를 배열 형태로 변환
          _equipTooltipJSON = [];
          for (var key in tooltipData) {
            if (tooltipData[key] !== null) {
              _equipTooltipJSON.push(tooltipData[key]);
            }
          }
        } else {
          // 문자열인 경우 파싱 후 배열로 변환
          var cleanedTooltip = tooltipData.replace(/\r\n/g, '').replace(/\\r\\n/g, '');
          var parsedTooltip = JSON.parse(cleanedTooltip);

          _equipTooltipJSON = [];
          for (var key in parsedTooltip) {
            if (parsedTooltip[key] !== null) {
              _equipTooltipJSON.push(parsedTooltip[key]);
            }
          }
        }

        // 기존 로직 그대로 유지
        //장비
        if (isEquip == true) {
          if (isElixir == false) {
            for (var j = 0; j < _equipTooltipJSON.length; j++) {
              // 재련수치
              if (_equipTooltipJSON[j]["type"] == "NameTagBox") {
                var equipment = _equipTooltipJSON[j]["value"];
                data += type + ": " + equipment.slice(2, 4) + "[00] ";
              }
              // 상급 재련
              if (_equipTooltipJSON[j]["type"] == "SingleTextBox") {
                if (_equipTooltipJSON[j]["value"].indexOf("상급 재련") != "-1") {
                  var modifiedString = data.slice(0, -4);
                  data = modifiedString;
                  var startIndex = _equipTooltipJSON[j]["value"].indexOf("[상급 재련]");
                  var endIndex = _equipTooltipJSON[j]["value"].indexOf("단계") + 2;
                  var extractedString = _equipTooltipJSON[j]["value"].slice(startIndex + "[상급 재련] ".length, endIndex - 2);
                  if (extractedString.length === 1) {
                    data += "0" + extractedString + "] ";
                  }
                  else if (extractedString.length === 2) {
                    data += "" + extractedString + "] ";
                  }
                }
              }
              // 세트효과
              if (isArk == false) {
                if (_equipTooltipJSON[j]["type"] == "ItemPartBox") {
                  if (_equipTooltipJSON[j]["value"]["Element_000"].indexOf("세트") != "-1") {
                    var set0 = _equipTooltipJSON[j]["value"]["Element_001"].substring(0, 2);
                    if (set0 == "장착") {
                      data += "짱쎔";
                    } else {
                      data += set0 + " ";
                    }
                    setEffect = set0;
                  }
                }
              }
            }
            // 품질
            for (var j = 0; j < _equipTooltipJSON.length; j++) {
              if (_equipTooltipJSON[j]["type"] == "ItemTitle") {
                data += "(" + _equipTooltipJSON[j]["value"]["qualityValue"] + ")" + " ";
                qualityValue += parseInt(_equipTooltipJSON[j]["value"]["qualityValue"]);
              }
            }
            // 초월
            for (var m = 0; m < _equipTooltipJSON.length; m++) {
              if (_equipTooltipJSON[m]["type"] == "IndentStringGroup") {
                if (_equipTooltipJSON[m]["value"] == null) {
                  continue;
                }
                if (_equipTooltipJSON[m]["value"]["Element_000"]["topStr"].indexOf("초월") != "-1") {
                  var transcendence = _equipTooltipJSON[m]["value"]["Element_000"]["topStr"];
                  var startIndex = _equipTooltipJSON[m]["value"]["Element_000"]["topStr"].indexOf("[초월]");
                  var extractedString = _equipTooltipJSON[m]["value"]["Element_000"]["topStr"].slice(startIndex + "[초월]".length).trim();
                  data += extractedString;
                  transcendenceSum += parseInt(transcendence.slice(transcendence.length - 2, transcendence.length));
                }
              }
            }
          }
          // 엘릭서
          else {
            for (var k = 0; k < _equipTooltipJSON.length; k++) {
              if (_equipTooltipJSON[k]["type"] == "IndentStringGroup") {
                if (_equipTooltipJSON[k]["value"] == null) {
                  continue;
                }
                if (_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["bPoint"] == true) {
                  if (_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"].indexOf("[") != "-1") {
                    var contentStr1 = _equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"];
                    var contentStr2 = contentStr1.slice(contentStr1.search("]") + 2, contentStr1.search("Lv") + 4);
                    var elixirNum = contentStr1.slice(contentStr1.search("Lv") + 3, contentStr1.search("Lv") + 4);
                    elixirSum += parseInt(elixirNum);
                    data += type + ": " + contentStr2;
                    if (Object.keys(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]).length == 1) {
                      data += "\n";
                    }
                  }
                  if (Object.keys(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]).length > 1) {
                    if (_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_001"]["contentStr"].indexOf("[") != "-1") {
                      var contentStr3 = _equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_001"]["contentStr"];
                      var contentStr4 = contentStr3.slice(contentStr3.search("]") + 1, contentStr3.search("Lv") + 4);
                      var elixirNum = contentStr3.slice(contentStr3.search("Lv") + 3, contentStr3.search("Lv") + 4);
                      elixirSum += parseInt(elixirNum);
                      data += contentStr4 + "\n";
                    }
                  }
                }
              }
            }
            for (var k = 0; k < _equipTooltipJSON.length; k++) {
              if (_equipTooltipJSON[k]["type"] == "IndentStringGroup") {
                if (_equipTooltipJSON[k]["value"] == null) {
                  continue;
                }
                if (_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["bPoint"] == true) {
                  if (_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"].indexOf("단계 :") != "-1") {
                    elixirEffect = _equipTooltipJSON[k]["value"]["Element_000"]["topStr"];
                  }
                }
              }
            }
          }
        }
        //악세
        else {
          for (var j = 0; j < _equipTooltipJSON.length; j++) {
            // 등급 이름
            if (_equipTooltipJSON[j]["type"] == "ItemTitle") {
              if (_equipTooltipJSON[j]["value"] == null) {
                continue;
              }
              var accessory = _equipTooltipJSON[j]["value"];
              if (accessory["leftStr0"].indexOf("이") != "-1") {
                if (isArk == true)
                  data += "\n - " + accessory["leftStr0"].slice(0, accessory["leftStr0"].length - 1);
                else
                  data += "\n - " + accessory["leftStr0"].slice(0, accessory["leftStr0"].length - 2);
              }
              else if (type == "팔찌") {
                data += "\n\n" + accessory["leftStr0"] + "\n";
              }
              else if (type == "반지") {
                if (isArk == true)
                  data += "\n - " + accessory["leftStr0"];
                else
                  data += "\n - " + accessory["leftStr0"].slice(0, accessory["leftStr0"].length - 1);
              }
              else {
                if (isArk == true)
                  data += "\n" + accessory["leftStr0"];
                else
                  data += "\n - " + accessory["leftStr0"];
              }
            }
            // 각인효과
            if (_equipTooltipJSON[j]["type"] == "IndentStringGroup") {
              if (_equipTooltipJSON[j]["value"] == null) {
                continue;
              }
              var engrave00 = _equipTooltipJSON[j]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"]
              var engrave01 = _equipTooltipJSON[j]["value"]["Element_000"]["contentStr"]["Element_001"]["contentStr"]
              var engrave1 = engrave00.slice(1, 2);
              var engrave2 = engrave00.slice(engrave00.length - 3, engrave00.length - 1).trim();
              var engrave3 = engrave01.slice(1, 2);
              var engrave4 = engrave01.slice(engrave01.length - 3, engrave01.length - 1).trim();
              var engrave5 = " " + engrave1 + engrave2 + " " + engrave3 + engrave4 + " ";
              data += engrave5;
            }
          }
          if (isArk == false) {
            // 특성
            for (var j = 0; j < _equipTooltipJSON.length; j++) {
              if (_equipTooltipJSON[j]["type"] == "ItemPartBox") {
                if (_equipTooltipJSON[j]["value"]["Element_000"] == "추가 효과") {
                  var cha0 = _equipTooltipJSON[j]["value"]["Element_001"];
                  var cha1 = cha0.replace(/치명 /gi, "치");
                  var cha2 = cha1.replace(/특화 /gi, "특");
                  var cha3 = cha2.replace(/신속 /gi, "신");
                  var cha4 = cha3.replace(/제압 /gi, "제");
                  var cha5 = cha4.replace(/인내 /gi, "인");
                  var cha6 = cha5.replace(/숙련 /gi, "숙");
                  data += cha6;
                }
              }
            }
          }
          // 품질
          for (var j = 0; j < _equipTooltipJSON.length; j++) {
            if (_equipTooltipJSON[j]["type"] == "ItemTitle") {
              if (type == "어빌리티 스톤" || type == "팔찌") { }
              else {
                if (isArk == true)
                  data += "(" + _equipTooltipJSON[j]["value"]["qualityValue"] + ") [";
                else
                  data += "(" + _equipTooltipJSON[j]["value"]["qualityValue"] + ")" + "\n";
                qualityValue += parseInt(_equipTooltipJSON[j]["value"]["qualityValue"]);
              }
            }
            if (_equipTooltipJSON[j]["type"] == "ItemPartBox") {
              if (_equipTooltipJSON[j]["value"]["Element_000"].indexOf("포인트") != "-1") {
                var realization = _equipTooltipJSON[j]["value"]["Element_001"];
                data += realization.replace(/깨달음 +\+/gi, "") + "]";
              }
            }
          }
          for (var k = 0; k < _equipTooltipJSON.length; k++) {
            if (_equipTooltipJSON[k]["type"] == "ItemPartBox") {
              if (_equipTooltipJSON[k]["value"]["Element_000"].indexOf("연마") != "-1") {
                var accessory = _equipTooltipJSON[k]["value"]["Element_001"];
                var accessory1 = accessory.replace(/추가 피해 \+/gi, "\n추피 ");
                var accessory2 = accessory1.replace(/적에게 주는 피해 \+/gi, "\n적주피 ");
                var accessory3 = accessory2.replace(/무기 공격력 \+/gi, "\n무공 ");
                var accessory4 = accessory3.replace(/세레나데, 신앙, 조화 게이지 획득량 \+/gi, "\n아획량 ");
                var accessory5 = accessory4.replace(/최대 생명력 \+/gi, "\n최생 ");
                var accessory6 = accessory5.replace(/최대 마나 \+/gi, "\n최마 ");
                var accessory7 = accessory6.replace(/상태이상 공격 지속시간 \+/gi, "\n상공지 ");
                var accessory8 = accessory7.replace(/전투 중 생명력 회복량 \+/gi, "\n생회 ");
                var accessory9 = accessory8.replace(/파티원 회복 효과 \+/gi, "\n파회 ");
                var accessory10 = accessory9.replace(/파티원 보호막 효과 \+/gi, "\n파보 ");
                var accessory11 = accessory10.replace(/치명타 적중률 \+/gi, "\n치적 ");
                var accessory12 = accessory11.replace(/치명타 피해 \+/gi, "\n치피 ");
                var accessory13 = accessory12.replace(/아군 공격력 강화 효과 \+/gi, "\n아공 ");
                var accessory14 = accessory13.replace(/아군 피해량 강화 효과 \+/gi, "\n아피 ");
                var accessory15 = accessory14.replace(/공격력 \+/gi, "\n공격력 ");
                var accessory16 = accessory15.replace(/낙인력 \+/gi, "\n낙인력 ");

                var acceSplit = accessory16.split("\n");
                for (var x = 0; x < acceSplit.length; x++) {
                  if (acceSplit[x].indexOf("최생") != "-1") {
                    if (acceSplit[x].indexOf("6500") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("3250") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("1300") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("공격력") != "-1") {
                    if (acceSplit[x].indexOf("390") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("195") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("80") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("무공") != "-1") {
                    if (acceSplit[x].indexOf("960") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("480") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("195") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("최마") != "-1") {
                    if (acceSplit[x].indexOf("30") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("15") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("6") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("상공지") != "-1") {
                    if (acceSplit[x].indexOf("1.0") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.5") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.2") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("생회") != "-1") {
                    if (acceSplit[x].indexOf("50") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("25") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("10") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("추피") != "-1") {
                    if (acceSplit[x].indexOf("2.6") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("1.6") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.7") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("적주피") != "-1") {
                    if (acceSplit[x].indexOf("2.0") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("1.2") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.55") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("아획량") != "-1") {
                    if (acceSplit[x].indexOf("6.0") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("3.6") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("1.6") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("낙인력") != "-1") {
                    if (acceSplit[x].indexOf("8.0") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("4.8") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("2.15") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("공격력") != "-1") {
                    if (acceSplit[x].indexOf("1.55") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.9") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.4") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("무공") != "-1") {
                    if (acceSplit[x].indexOf("3.0") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("1.8") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.8") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("파회") != "-1") {
                    if (acceSplit[x].indexOf("3.5") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("2.1") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.95") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("파보") != "-1") {
                    if (acceSplit[x].indexOf("3.5") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("2.1") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.95") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("치적") != "-1") {
                    if (acceSplit[x].indexOf("1.55") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.9") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("0.4") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("치피") != "-1") {
                    if (acceSplit[x].indexOf("4.0") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("2.4") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("1.1") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("아공") != "-1") {
                    if (acceSplit[x].indexOf("5.0") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("3.0") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("1.35") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                  if (acceSplit[x].indexOf("아피") != "-1") {
                    if (acceSplit[x].indexOf("7.5") != "-1")
                      data += "\n" + "[상" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("4.5") != "-1")
                      data += "\n" + "[중" + "] " + acceSplit[x];
                    if (acceSplit[x].indexOf("2") != "-1")
                      data += "\n" + "[하" + "] " + acceSplit[x];
                  }
                }
              }
            }
          }
          // 팔찌효과
          if (type == "팔찌") {
            for (var j = 0; j < _equipTooltipJSON.length; j++) {
              if (_equipTooltipJSON[j]["type"] == "ItemPartBox") {
                if (_equipTooltipJSON[j]["value"]["Element_000"] == "팔찌 효과") {
                  var bracelet = _equipTooltipJSON[j]["value"]["Element_001"].replace(/\[/gi, "\n\[")
                  var bracelet1 = bracelet.replace(/치명 \+/gi, "\n 치명 ");
                  var bracelet2 = bracelet1.replace(/특화 \+/gi, "\n 특화 ");
                  var bracelet3 = bracelet2.replace(/신속 \+/gi, "\n 신속 ");
                  var bracelet4 = bracelet3.replace(/제압 \+/gi, "\n 제압 ");
                  var bracelet5 = bracelet4.replace(/인내 \+/gi, "\n 인내 ");
                  var bracelet6 = bracelet5.replace(/숙련 \+/gi, "\n 숙련 ");
                  var bracelet7 = bracelet6.replace(/최대 생명력 \+/gi, "\n 최대 생명력 ");
                  var bracelet8 = bracelet7.replace(/최대 마나 \+/gi, "\n 최대 마나 ");
                  var bracelet9 = bracelet8.replace(/물리 방어력 \+/gi, "\n 물리 방어력 ");
                  var bracelet10 = bracelet9.replace(/마법 방어력 \+/gi, "\n 마법 방어력 ");
                  var bracelet11 = bracelet10.replace(/전투 중 생명력 회복량 \+/gi, "\n 전투 중 생명력 회복량 ");
                  var bracelet12 = bracelet11.replace(/무기 공격력 \+/gi, "\n 무기 공격력 ");
                  var bracelet13 = bracelet12.replace(/체력 \+/gi, "\n 체력 ");
                  var bracelet14 = bracelet13.replace(/힘 \+/gi, "\n 힘 ");
                  var bracelet15 = bracelet14.replace(/민첩 \+/gi, "\n 민첩 ");
                  var bracelet16 = bracelet15.replace(/지능 \+/gi, "\n 지능 ");
                  data += bracelet16
                }
              }
            }
          }
        }

      } catch (error) {
        console.error("JSON 파싱 에러:", error);
        console.error("문제가 된 아이템 타입:", type);
        // 에러 발생 시 기본값 반환
        return [data || "파싱 오류", elixirSum, qualityValue, setEffect, elixirEffect, transcendenceSum];
      }

      // break 문을 제거하여 모든 동일 타입 아이템을 처리하도록 수정
      // break; <- 이 부분을 제거
    }
  }

  return [data, elixirSum, qualityValue, setEffect, elixirEffect, transcendenceSum];
}
// !장비 가공
function Equipemnt(_urlArr, _searchName) {
  var infoProfile = "";
  var infoEquipment = "";
  var equipmentData = "";
  var equipmentData2 = "";
  var isArkPassive = false;

  // API 결과 Null 인 경우
  var equipmentAPIJSON = getAPI(_urlArr[0]);
  var equipmentAPIstr = JSON.stringify(equipmentAPIJSON);
  if (equipmentAPIstr == null || equipmentAPIJSON == null || equipmentAPIJSON == "") {
    return null;
  }
  infoProfile = equipmentAPIJSON["ArmoryProfile"];
  infoEquipment = equipmentAPIJSON["ArmoryEquipment"];
  isArkPassive = equipmentAPIJSON["ArkPassive"]["IsArkPassive"];

  equipmentData2 += tooltipJSON(infoEquipment, "무기", false, true, isArkPassive)[0] + "\n";
  equipmentData2 += tooltipJSON(infoEquipment, "투구", false, true, isArkPassive)[0] + "\n";
  equipmentData2 += tooltipJSON(infoEquipment, "상의", false, true, isArkPassive)[0] + "\n";
  equipmentData2 += tooltipJSON(infoEquipment, "하의", false, true, isArkPassive)[0] + "\n";
  equipmentData2 += tooltipJSON(infoEquipment, "장갑", false, true, isArkPassive)[0] + "\n";
  equipmentData2 += tooltipJSON(infoEquipment, "어깨", false, true, isArkPassive)[0] + "\n";
  equipmentData2 += "평균 품질: "
    + Math.round(((tooltipJSON(infoEquipment, "무기", false, true, isArkPassive)[2]
      + tooltipJSON(infoEquipment, "투구", false, true, isArkPassive)[2]
      + tooltipJSON(infoEquipment, "상의", false, true, isArkPassive)[2]
      + tooltipJSON(infoEquipment, "하의", false, true, isArkPassive)[2]
      + tooltipJSON(infoEquipment, "장갑", false, true, isArkPassive)[2]
      + tooltipJSON(infoEquipment, "어깨", false, true, isArkPassive)[2]) / 6) * 10) / 10;
  equipmentData2 += "\n초월 총합: "
    + Math.round(tooltipJSON(infoEquipment, "무기", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "투구", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "상의", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "하의", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "장갑", false, true, isArkPassive)[5]
      + tooltipJSON(infoEquipment, "어깨", false, true, isArkPassive)[5]);
  equipmentData2 += "\n\n" + "< 엘릭서 >" + "\n";
  equipmentData2 += tooltipJSON(infoEquipment, "투구", true, true, isArkPassive)[0];
  equipmentData2 += tooltipJSON(infoEquipment, "상의", true, true, isArkPassive)[0];
  equipmentData2 += tooltipJSON(infoEquipment, "하의", true, true, isArkPassive)[0];
  equipmentData2 += tooltipJSON(infoEquipment, "장갑", true, true, isArkPassive)[0];
  equipmentData2 += tooltipJSON(infoEquipment, "어깨", true, true, isArkPassive)[0];
  equipmentData2 += "엘릭서 합: "
    + (tooltipJSON(infoEquipment, "투구", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "상의", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "하의", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "장갑", true, true, isArkPassive)[1]
      + tooltipJSON(infoEquipment, "어깨", true, true, isArkPassive)[1]);

  equipmentData = equipmentData2.replace(/Lv./gi, "");
  // return tooltipJSON(equipmentAPIJSON,"투구",false,true)[3] + "==" + tooltipJSON(equipmentAPIJSON,"투구",true,true)[4];
  return equipmentData;
}

// !악세 가공
function Accessories(_urlArr) {
  var acceAPIJSON = getAPI(_urlArr[0]);
  var infoProfile = "";
  var infoEngraving = "";
  var infoEquipment = "";
  var accessoriesData = "";
  var accessoriesData2 = "";
  var _engTooltipJSON = "";
  var isArkPassive = false;

  // API 결과 Null 인 경우
  var acceAPIstr = JSON.stringify(acceAPIJSON);
  if (acceAPIstr == null || acceAPIJSON == null || acceAPIJSON == "") {
    return null;
  }

  infoProfile = acceAPIJSON["ArmoryProfile"];
  infoEngraving = acceAPIJSON["ArmoryEngraving"];
  infoEquipment = acceAPIJSON["ArmoryEquipment"];
  isArkPassive = acceAPIJSON["ArkPassive"]["IsArkPassive"];

  // 실제 악세서리 개수와 품질 총합을 계산
  var totalQuality = 0;
  var accessoryCount = 0;

  // 목걸이, 귀걸이, 반지의 실제 개수와 품질 계산
  for (var i = 0; i < infoEquipment.length; i++) {
    var itemType = infoEquipment[i]["Type"];
    if (itemType === "목걸이" || itemType === "귀걸이" || itemType === "반지") {
      try {
        var tooltipData = infoEquipment[i]["Tooltip"];
        var parsedTooltip;

        if (typeof tooltipData === 'object' && tooltipData !== null) {
          parsedTooltip = tooltipData;
        } else {
          var cleanedTooltip = tooltipData.replace(/\r\n/g, '').replace(/\\r\\n/g, '');
          parsedTooltip = JSON.parse(cleanedTooltip);
        }

        // 품질 값 추출
        if (parsedTooltip.Element_001 &&
          parsedTooltip.Element_001.value &&
          parsedTooltip.Element_001.value.qualityValue !== undefined &&
          parsedTooltip.Element_001.value.qualityValue > 0) {
          totalQuality += parsedTooltip.Element_001.value.qualityValue;
          accessoryCount++;
        }
      } catch (error) {
        console.error("품질 계산 에러:", error);
      }
    }
  }

  var avgQuality = accessoryCount > 0 ? Math.round((totalQuality / accessoryCount) * 10) / 10 : 0;
  accessoriesData2 += "\n" + " ● 평균 품질: " + avgQuality;

  if (isArkPassive == false) {
    // 장착 각인
    accessoriesData2 += "\n";
    try {
      for (var i = 0; i < infoEngraving["Engravings"].length; i++) {
        var tooltipData = infoEngraving["Engravings"][i]["Tooltip"];
        var _engTooltipJSON;

        // 안전한 JSON 파싱
        if (typeof tooltipData === 'object' && tooltipData !== null) {
          _engTooltipJSON = [];
          for (var key in tooltipData) {
            if (tooltipData[key] !== null) {
              _engTooltipJSON.push(tooltipData[key]);
            }
          }
        } else {
          var cleanedTooltip = tooltipData.replace(/\r\n/g, '').replace(/\\r\\n/g, '');
          var parsedTooltip = JSON.parse(cleanedTooltip);
          _engTooltipJSON = [];
          for (var key in parsedTooltip) {
            if (parsedTooltip[key] !== null) {
              _engTooltipJSON.push(parsedTooltip[key]);
            }
          }
        }

        for (var j = 0; j < _engTooltipJSON.length; j++) {
          if (_engTooltipJSON[j]["type"] == "NameTagBox") {
            accessoriesData2 += _engTooltipJSON[j]["value"] + " ";
          }
          if (_engTooltipJSON[j]["type"] == "EngraveSkillTitle") {
            var useEng = _engTooltipJSON[j]["value"]["leftText"].split("+");
            var engPoint = useEng[1];
            accessoriesData2 += engPoint + " ";
          }
        }
      }
    } catch (error) {
      console.error("각인 파싱 에러:", error);
    }
    accessoriesData2 += "\n";
  }

  accessoriesData2 += tooltipJSON(infoEquipment, "목걸이", false, false, isArkPassive)[0];
  accessoriesData2 += tooltipJSON(infoEquipment, "귀걸이", false, false, isArkPassive)[0];
  accessoriesData2 += tooltipJSON(infoEquipment, "반지", false, false, isArkPassive)[0];
  accessoriesData2 += tooltipJSON(infoEquipment, "어빌리티 스톤", false, false, isArkPassive)[0];
  accessoriesData2 += tooltipJSON(infoEquipment, "팔찌", false, false, isArkPassive)[0];

  var accessoriesData3 = accessoriesData2.replace("고대 팔찌\n", "고대 팔찌");
  accessoriesData = accessoriesData3.replace(/\+/gi, "");
  return accessoriesData;
}
// !앜패 가공 !ㅇㅍ
function ArkPassive(_urlArr) {
  var arkAPIJSON = getAPI(_urlArr[0]);
  var arkData = "";
  var arkTemp = "";
  var arkPassive;
  var isArkPassive;
  // API 결과 Null 인 경우
  var arkAPIstr = JSON.stringify(arkAPIJSON);
  if (arkAPIstr == null || arkAPIstr == null || arkAPIstr == "") {
    return null;
  }

  arkPassive = arkAPIJSON["ArkPassive"];
  arkPassivePoint = arkPassive["Points"];
  arkPassiveEffects = arkPassive["Effects"];
  isArkPassive = arkAPIJSON["ArkPassive"]["IsArkPassive"];
  // 앜패 off
  if (isArkPassive == false) {
    return null;
  }

  for (var i = 0; i < arkPassivePoint.length; i++) {
    var arkName = arkPassivePoint[i]["Name"];
    var arkValue = arkPassivePoint[i]["Value"];
    arkTemp += arkName + "[" + arkValue + "]" + " ";
  }
  arkTemp += "\n\n[진화]\n";
  for (var x = 0; x < arkPassiveEffects.length; x++) {
    var arkDescription = arkPassiveEffects[x]["Description"];
    var arkName = arkPassiveEffects[x]["Name"];
    if (arkName == "진화")
      arkTemp += arkDescription + "\n";
  }
  arkTemp += "[깨달음]\n";
  for (var y = 0; y < arkPassiveEffects.length; y++) {
    var arkDescription = arkPassiveEffects[y]["Description"];
    var arkName = arkPassiveEffects[y]["Name"];
    if (arkName == "깨달음")
      arkTemp += arkDescription + "\n";
  }
  arkTemp += "[도약]\n";
  for (var z = 0; z < arkPassiveEffects.length; z++) {
    var arkDescription = arkPassiveEffects[z]["Description"];
    var arkName = arkPassiveEffects[z]["Name"];
    if (arkName == "도약")
      arkTemp += arkDescription + "\n";
  }
  var _arkTemp = arkTemp.replace(/깨달음 /g, " - ");
  var _arkTemp1 = _arkTemp.replace(/진화 /g, " - ");
  var _arkTemp2 = _arkTemp1.replace(/도약 /g, " - ");
  arkData = _arkTemp2.slice(0, _arkTemp.length - 1);
  return arkData;
}

// !아크그리드 가공
// 아크그리드 데이터 가공 함수
function ArkGrid(_urlArr) {
  var arkAPIJSON = getAPI(_urlArr[0]);
  var arkData = "";
  var arkTemp = "";
  var arkGrid;
  var arkSlots;
  var arkEffects;

  // API 결과 Null 인 경우
  var arkAPIstr = JSON.stringify(arkAPIJSON);
  if (arkAPIstr == null || arkAPIstr == null || arkAPIstr == "" || arkAPIJSON == null) {
    return null;
  }

  arkGrid = arkAPIJSON["ArkGrid"];
  if (arkGrid == null) {
    return null;
  }

  arkSlots = arkGrid["Slots"];
  arkEffects = arkGrid["Effects"];

  if (arkSlots == null || arkEffects == null) {
    return null;
  }

  // 코어 정보 처리
  arkTemp += "[코어]\n";
  for (var i = 0; i < arkSlots.length; i++) {
    var coreName = arkSlots[i]["Name"];
    var corePoint = arkSlots[i]["Point"];
    var coreGrade = arkSlots[i]["Grade"];

    // 코어 타입과 스킬명 추출
    var coreInfo = parseCoreInfo(coreName, corePoint, coreGrade);
    arkTemp += coreInfo + "\n";
  }

  // 젬 효과 요약 처리
  arkTemp += "\n[젬]\n";
  for (var j = 0; j < arkEffects.length; j++) {
    var effectLevel = arkEffects[j]["Level"];
    var effectTooltip = arkEffects[j]["Tooltip"];

    // 효과값 추출
    // arkTemp += effectName + " Lv." + effectLevel + "\n";
    arkTemp += "Lv." + effectLevel + " " + effectTooltip + "\n";

    arkTemp = arkTemp.replace("아군 피해량 강화 효과", "아피강");
    arkTemp = arkTemp.replace("아군 공격력 강화 효과", "아공강");
    arkTemp = arkTemp.replace("보스 등급 이상 몬스터에게 주는 피해", "보스 피해");
  }

  arkData = arkTemp.slice(0, arkTemp.length - 1);
  return arkData;
}

// 코어 정보 파싱 함수
function parseCoreInfo(coreName, corePoint, coreGrade) {
  try {
    // 코어 이름에서 타입과 스킬명 분리
    var nameParts = coreName.split(" : ");
    if (nameParts.length >= 2) {
      var coreType = nameParts[0];
      var skillName = nameParts[1];

      // "질서의 별 코어" -> "질서의 별"로 변환
      coreType = coreType.replace(" 코어", "");

      return "[" + coreGrade + "]" + coreType + " : " + skillName + " " + corePoint + "P";
    }

    return coreName + " " + corePoint + "P";
  } catch (e) {
    return coreName + " " + corePoint + "P";
  }
}

// !각인 가공
function Engravings(_urlArr) {
  var engravingsAPIJSON = getAPI(_urlArr[0]);
  var infoProfile = "";
  var infoEngraving = "";
  var engraving = "";
  var engraving2 = "";
  var isArkPassive = false;

  infoProfile = engravingsAPIJSON["ArmoryProfile"];
  infoEngraving = engravingsAPIJSON["ArmoryEngraving"];
  isArkPassive = engravingsAPIJSON["ArkPassive"]["IsArkPassive"];

  // API 결과 Null 인 경우
  var engravingAPIstr = JSON.stringify(engravingsAPIJSON);
  if (engravingAPIstr == null || engravingsAPIJSON == null || engravingsAPIJSON == "") {
    return null;
  }

  // 각인
  if (isArkPassive == false) {
    for (var i = 0; i < infoEngraving["Effects"].length; i++) {
      var engName = infoEngraving["Effects"][i]["Name"];
      engraving2 += engName + "\n";
    }
  }
  else {
    for (var i = 0; i < infoEngraving["ArkPassiveEffects"].length; i++) {
      var arkEngName = infoEngraving["ArkPassiveEffects"][i]["Name"];
      var arkEngGrade = infoEngraving["ArkPassiveEffects"][i]["Grade"];
      var arkEngGradeLv = infoEngraving["ArkPassiveEffects"][i]["Level"];

      engraving2 += "[" + arkEngGrade + "] " + arkEngName + "Lv." + arkEngGradeLv + "\n";
    }
    engraving2 += "\n스톤\n";
    for (var j = 0; j < infoEngraving["ArkPassiveEffects"].length; j++) {
      var _arkEngName = infoEngraving["ArkPassiveEffects"][j]["Name"];
      var arkEngStoneLv = infoEngraving["ArkPassiveEffects"][j]["AbilityStoneLevel"];
      if (arkEngStoneLv != null) {
        engraving2 += _arkEngName + "Lv." + arkEngStoneLv + "\n";
      }
    }
  }

  engraving = engraving2.slice(0, engraving2.length - 1);
  return engraving;
}

// !내실 가공
function Collectibles(_urlArr) {
  var profileAPIJSON = getAPI(_urlArr[0]);
  var collectiblesAPIJSON = getAPI(_urlArr[1]);
  var data = "";
  var data1 = "";

  // API 결과 Null 인 경우
  var profileAPIstr = JSON.stringify(profileAPIJSON);
  var collectiblesAPIstr = JSON.stringify(collectiblesAPIJSON);
  if (collectiblesAPIstr == null || collectiblesAPIJSON == null || profileAPIstr == null || profileAPIJSON == null || collectiblesAPIJSON == "" || profileAPIJSON == "") {
    return null;
  }

  data1 += "템/원/전/영: " + profileAPIJSON["ItemAvgLevel"].slice(0, profileAPIJSON["ItemAvgLevel"].length - 3) + "/" + profileAPIJSON["ExpeditionLevel"] + "/" + profileAPIJSON["CharacterLevel"] + "/" + profileAPIJSON["TownLevel"];
  data1 += "\n스포: " + profileAPIJSON["UsingSkillPoint"] + " / " + profileAPIJSON["TotalSkillPoint"] + "\n";
  data1 += "\n< 성향 >\n";
  for (var i = 0; i < profileAPIJSON["Tendencies"].length; i++) {
    data1 += profileAPIJSON["Tendencies"][i]["Type"] + ": " + profileAPIJSON["Tendencies"][i]["Point"] + " ";
    if (i == 1) {
      data1 += "\n"
    }
  }

  data1 += "\n\n< 수집품 >\n";
  for (var i = 0; i < collectiblesAPIJSON.length; i++) {
    data1 += collectiblesAPIJSON[i]["Type"] + ": " + collectiblesAPIJSON[i]["Point"] + " ";
  }
  var data2 = data1.replace("모코코 씨앗", "모코코");
  var data3 = data2.replace("섬의 마음", "섬마");
  var data4 = data3.replace("위대한 미술품", "\n미술품");
  var data5 = data4.replace("거인의 심장", "거심");
  var data6 = data5.replace("이그네아의 징표", "\n이그네아");
  var data7 = data6.replace("항해 모험물", "모험물");
  var data8 = data7.replace("세계수의 잎", "\n세계수");
  var data9 = data8.replace("오르페우스의 별", "별");
  var data10 = data9.replace("기억의 오르골", "\n오르골");
  var data11 = data10.replace("크림스네일의 해도", "해도");

  data += data11;
  return data;
}

// !가격 가공
function searchMarket(_command, _urlArr, searchName) {
  var marketData = "";
  var _marketData = "";
  var sort = "CURRENT_MIN_PRICE";
  var _categoryCode = makeJSONParam(_command)[0];
  var itemGrade = makeJSONParam(_command)[1];
  var characterClass = makeJSONParam(_command)[2];
  var sortCondition = makeJSONParam(_command)[3];
  var json = { "Sort": sort, "CategoryCode": _categoryCode, "CharacterClass": characterClass, "ItemTier": 0, "ItemGrade": itemGrade, "ItemName": searchName, "PageNo": 0, "SortCondition": sortCondition };
  var marketAPIJSON = postMarket(_urlArr, json);

  // API 결과 Null 인 경우
  var marketAPIstr = JSON.stringify(marketAPIJSON);
  if (marketAPIstr == null || marketAPIJSON == null || marketAPIJSON == "") {
    return null;
  }

  var marketItem = marketAPIJSON["Items"];
  _marketData += "등급 / 전날평균가 / 최저가 / 이름\n"
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += marketItem[i]["Grade"] + " / " + marketItem[i]["YDayAvgPrice"] + " / " + marketItem[i]["CurrentMinPrice"] + " / " + marketItem[i]["Name"] + "\n";
  }

  marketData = _marketData.slice(0, _marketData.length - 1);
  return marketData;
}

// !보석가격
function searchGems(_urlArr) {
  var marketData = "";
  var _marketData = "<보석 즉구 최저가>\n";
  var _marketData1 = "";
  var marketItem = "";
  var searchName = ["10레벨 겁화", "10레벨 작열", "9레벨 겁화", "9레벨 작열", "8레벨 겁화", "8레벨 작열", "7레벨 겁화", "7레벨 작열",]

  for (var i = 0; i < searchName.length; i++) {
    var json = {
      "ItemLevelMin": 0,
      "ItemLevelMax": 0,
      "ItemGradeQuality": null,
      "SkillOptions": [
        {
          "FirstOption": null,
          "SecondOption": null,
          "MinValue": null,
          "MaxValue": null
        }
      ],
      "EtcOptions": [
        {
          "FirstOption": null,
          "SecondOption": null,
          "MinValue": null,
          "MaxValue": null
        }
      ],
      "Sort": "BUY_PRICE",
      "CategoryCode": 210000,
      "CharacterClass": "",
      "ItemTier": null,
      "ItemGrade": "",
      "ItemName": searchName[i],
      "PageNo": 0,
      "SortCondition": "ASC"
    }
    var marketAPIJSON = postMarket(_urlArr, json);
    // API 결과 Null 인 경우
    var marketAPIstr = JSON.stringify(marketAPIJSON);
    if (marketAPIstr == null || marketAPIJSON == null || marketAPIJSON == "") {
      continue;
    }

    marketItem = marketAPIJSON["Items"];
    if (marketItem == null || marketItem == "") {
      continue;
    }
    _marketData += marketItem[0]["Name"] + " : " + marketItem[0]["AuctionInfo"]["BuyPrice"] + "\n";
  }
  _marketData1 = _marketData.slice(0, _marketData.length - 1);
  marketData = _marketData1.replace(/의 보석/g, "");
  return marketData;
}

// !유각
function searchEngravis(_urlArr) {
  var marketData = "";
  var _marketData = "";
  var sort = "CURRENT_MIN_PRICE";
  var json = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "각인", "PageNo": 1, "SortCondition": "DESC" };
  var json2 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "각인", "PageNo": 2, "SortCondition": "DESC" };
  var marketAPIJSON = postMarket(_urlArr, json);
  var marketAPIJSON1 = postMarket(_urlArr, json2);

  // API 결과 Null 인 경우
  var marketAPIstr = JSON.stringify(marketAPIJSON);
  if (marketAPIstr == null || marketAPIJSON == null || marketAPIJSON == "") {
    return null;
  }
  // API 결과 Null 인 경우
  var marketAPIstr1 = JSON.stringify(marketAPIJSON1);
  if (marketAPIstr1 == null || marketAPIJSON1 == null || marketAPIJSON1 == "") {
    return null;
  }

  var marketItem = marketAPIJSON["Items"];
  _marketData += "전날평균가 / 최저가 / 이름\n"
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem[i]["YDayAvgPrice"]) + " / " + marketItem[i]["CurrentMinPrice"] + " / " + marketItem[i]["Name"] + "\n";
  }
  var marketItem1 = marketAPIJSON1["Items"];
  for (var i = 0; i < marketItem1.length / 2; i++) {
    _marketData += Math.round(marketItem1[i]["YDayAvgPrice"]) + " / " + marketItem1[i]["CurrentMinPrice"] + " / " + marketItem1[i]["Name"] + "\n";
  }

  marketData = _marketData.slice(0, _marketData.length - 1).replace(/ 각인서/g, "");
  marketData = marketData.replace(/유물 /g, "");
  return marketData;
}

// !서폿유각 !ㅅㅍㅇㄱ
function searchEngravisForSupport(_urlArr) {
  var marketData = "";
  var _marketData = "";
  var sort = "CURRENT_MIN_PRICE";
  var json = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "각성", "PageNo": 0, "SortCondition": "DESC" };
  var json2 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "마나의 흐름", "PageNo": 0, "SortCondition": "DESC" };
  var json3 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "구슬", "PageNo": 0, "SortCondition": "DESC" };
  var json4 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "전문의", "PageNo": 0, "SortCondition": "DESC" };
  var json5 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "최대 마나", "PageNo": 0, "SortCondition": "DESC" };
  var json6 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "중갑", "PageNo": 0, "SortCondition": "DESC" };
  var json7 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "급소", "PageNo": 0, "SortCondition": "DESC" };
  var json8 = { "Sort": sort, "CategoryCode": 40000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "유물", "ItemName": "폭발", "PageNo": 0, "SortCondition": "DESC" };
  var marketAPIJSON = postMarket(_urlArr, json);
  var marketAPIJSON2 = postMarket(_urlArr, json2);
  var marketAPIJSON3 = postMarket(_urlArr, json3);
  var marketAPIJSON4 = postMarket(_urlArr, json4);
  var marketAPIJSON5 = postMarket(_urlArr, json5);
  var marketAPIJSON6 = postMarket(_urlArr, json6);
  var marketAPIJSON7 = postMarket(_urlArr, json7);
  var marketAPIJSON8 = postMarket(_urlArr, json8);

  // API 결과 Null 인 경우
  var marketAPIstr = JSON.stringify(marketAPIJSON);
  if (marketAPIstr == null || marketAPIJSON == null || marketAPIJSON == "") {
    return null;
  }
  var marketAPIstr2 = JSON.stringify(marketAPIJSON2);
  if (marketAPIstr2 == null || marketAPIJSON2 == null || marketAPIJSON2 == "") {
    return null;
  }
  var marketAPIstr3 = JSON.stringify(marketAPIJSON3);
  if (marketAPIstr3 == null || marketAPIJSON3 == null || marketAPIJSON3 == "") {
    return null;
  }
  var marketAPIstr4 = JSON.stringify(marketAPIJSON4);
  if (marketAPIstr4 == null || marketAPIJSON4 == null || marketAPIJSON4 == "") {
    return null;
  }
  var marketAPIstr5 = JSON.stringify(marketAPIJSON5);
  if (marketAPIstr5 == null || marketAPIJSON5 == null || marketAPIJSON5 == "") {
    return null;
  }
  var marketAPIstr6 = JSON.stringify(marketAPIJSON6);
  if (marketAPIstr6 == null || marketAPIJSON6 == null || marketAPIJSON6 == "") {
    return null;
  }
  var marketAPIstr7 = JSON.stringify(marketAPIJSON7);
  if (marketAPIstr7 == null || marketAPIJSON7 == null || marketAPIJSON7 == "") {
    return null;
  }
  var marketAPIstr8 = JSON.stringify(marketAPIJSON8);
  if (marketAPIstr8 == null || marketAPIJSON8 == null || marketAPIJSON8 == "") {
    return null;
  }
  var marketItem = marketAPIJSON["Items"];
  var marketItem2 = marketAPIJSON2["Items"];
  var marketItem3 = marketAPIJSON3["Items"];
  var marketItem4 = marketAPIJSON4["Items"];
  var marketItem5 = marketAPIJSON5["Items"];
  var marketItem6 = marketAPIJSON6["Items"];
  var marketItem7 = marketAPIJSON7["Items"];
  var marketItem8 = marketAPIJSON8["Items"];
  _marketData += "전날평균가 / 최저가 / 이름\n"
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem[i]["YDayAvgPrice"]) + " / " + marketItem[i]["CurrentMinPrice"] + " / " + marketItem[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem2[i]["YDayAvgPrice"]) + " / " + marketItem2[i]["CurrentMinPrice"] + " / " + marketItem2[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem3[i]["YDayAvgPrice"]) + " / " + marketItem3[i]["CurrentMinPrice"] + " / " + marketItem3[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem4[i]["YDayAvgPrice"]) + " / " + marketItem4[i]["CurrentMinPrice"] + " / " + marketItem4[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem5[i]["YDayAvgPrice"]) + " / " + marketItem5[i]["CurrentMinPrice"] + " / " + marketItem5[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem6[i]["YDayAvgPrice"]) + " / " + marketItem6[i]["CurrentMinPrice"] + " / " + marketItem6[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem7[i]["YDayAvgPrice"]) + " / " + marketItem7[i]["CurrentMinPrice"] + " / " + marketItem7[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem8[i]["YDayAvgPrice"]) + " / " + marketItem8[i]["CurrentMinPrice"] + " / " + marketItem8[i]["Name"] + "\n";
  }
  marketData = _marketData.slice(0, _marketData.length - 1).replace(/ 각인서/g, "");
  marketData = marketData.replace(/유물 /g, "");
  return marketData;
}
// !젬가격
// !ㅈㄱㄱ
function searchGem(_urlArr) {
  var marketData = "";
  var _marketData = "";
  var sort = "CURRENT_MIN_PRICE";
  var json = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "젬", "PageNo": 1, "SortCondition": "DESC" };
  var json2 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "젬", "PageNo": 2, "SortCondition": "DESC" };

  var marketAPIJSON = postMarket(_urlArr, json);
  var marketAPIJSON2 = postMarket(_urlArr, json2);

  // API 결과 Null 인 경우
  var marketAPIstr = JSON.stringify(marketAPIJSON);
  if (marketAPIstr == null || marketAPIJSON == null || marketAPIJSON == "") {
    return null;
  }

  var marketAPIstr2 = JSON.stringify(marketAPIJSON2);
  if (marketAPIstr2 == null || marketAPIJSON2 == null || marketAPIJSON2 == "") {
    return null;
  }

  var marketItem = marketAPIJSON["Items"];
  var marketItem2 = marketAPIJSON2["Items"];

  _marketData += "등급 이름 / 전날평균가 / 최저가\n"
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += marketItem[i]["Grade"] + " " + marketItem[i]["Name"] + " / " + Math.round(marketItem[i]["YDayAvgPrice"]) + " / " + marketItem[i]["CurrentMinPrice"] + "\n";
  }
  for (var i = 0; i < marketItem2.length; i++) {
    _marketData += marketItem2[i]["Grade"] + " " + marketItem2[i]["Name"] + " / " + Math.round(marketItem2[i]["YDayAvgPrice"]) + " / " + marketItem2[i]["CurrentMinPrice"] + "\n";
  }

  marketData = _marketData.slice(0, -1);
  marketData = marketData.replace(/의 젬/g, "");
  return marketData;
}

// !ㅇㄱㄹ
function searchEgir(_urlArr) {
  var marketData = "";
  var _marketData = "";
  var sort = "CURRENT_MIN_PRICE";
  var json = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "운명", "PageNo": 0, "SortCondition": "DESC" };
  var json1 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "용암의 숨결", "PageNo": 0, "SortCondition": "DESC" };
  var json2 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "빙하의 숨결", "PageNo": 0, "SortCondition": "DESC" };
  var json3 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "아비도스", "PageNo": 0, "SortCondition": "DESC" };
  var json4 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 4, "ItemGrade": "", "ItemName": "장인의 야금술", "PageNo": 0, "SortCondition": "DESC" };
  var json5 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 4, "ItemGrade": "", "ItemName": "장인의 재봉술", "PageNo": 0, "SortCondition": "DESC" };
  var json6 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 4, "ItemGrade": "", "ItemName": "야금술 : 업화", "PageNo": 0, "SortCondition": "DESC" };
  var json7 = { "Sort": sort, "CategoryCode": 50000, "CharacterClass": "", "ItemTier": 4, "ItemGrade": "", "ItemName": "재봉술 : 업화", "PageNo": 0, "SortCondition": "DESC" };
  var json8 = { "Sort": sort, "CategoryCode": 70000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "쫄깃한 꼬치구이", "PageNo": 0, "SortCondition": "DESC" };
  var json9 = { "Sort": sort, "CategoryCode": 70000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "허브 스테이크", "PageNo": 0, "SortCondition": "DESC" };
  var json10 = { "Sort": sort, "CategoryCode": 70000, "CharacterClass": "", "ItemTier": 0, "ItemGrade": "", "ItemName": "채끝 스테이크", "PageNo": 0, "SortCondition": "DESC" };
  var marketAPIJSON = postMarket(_urlArr, json);
  var marketAPIJSON1 = postMarket(_urlArr, json1);
  var marketAPIJSON2 = postMarket(_urlArr, json2);
  var marketAPIJSON3 = postMarket(_urlArr, json3);
  var marketAPIJSON4 = postMarket(_urlArr, json4);
  var marketAPIJSON5 = postMarket(_urlArr, json5);
  var marketAPIJSON6 = postMarket(_urlArr, json6);
  var marketAPIJSON7 = postMarket(_urlArr, json7);
  var marketAPIJSON8 = postMarket(_urlArr, json8);
  var marketAPIJSON9 = postMarket(_urlArr, json9);
  var marketAPIJSON10 = postMarket(_urlArr, json10);

  // API 결과 Null 인 경우
  var marketAPIstr = JSON.stringify(marketAPIJSON);
  if (marketAPIstr == null || marketAPIJSON == null || marketAPIJSON == "") {
    return null;
  }
  var marketAPIstr1 = JSON.stringify(marketAPIJSON1);
  if (marketAPIstr1 == null || marketAPIJSON1 == null || marketAPIJSON1 == "") {
    return null;
  }
  var marketAPIstr2 = JSON.stringify(marketAPIJSON2);
  if (marketAPIstr2 == null || marketAPIJSON2 == null || marketAPIJSON2 == "") {
    return null;
  }
  var marketAPIstr3 = JSON.stringify(marketAPIJSON3);
  if (marketAPIstr3 == null || marketAPIJSON3 == null || marketAPIJSON3 == "") {
    return null;
  }
  var marketAPIstr4 = JSON.stringify(marketAPIJSON4);
  if (marketAPIstr4 == null || marketAPIJSON4 == null || marketAPIJSON4 == "") {
    return null;
  }
  var marketAPIstr5 = JSON.stringify(marketAPIJSON5);
  if (marketAPIstr5 == null || marketAPIJSON5 == null || marketAPIJSON5 == "") {
    return null;
  }
  var marketAPIstr6 = JSON.stringify(marketAPIJSON6);
  if (marketAPIstr6 == null || marketAPIJSON6 == null || marketAPIJSON6 == "") {
    return null;
  }
  var marketAPIstr7 = JSON.stringify(marketAPIJSON7);
  if (marketAPIstr7 == null || marketAPIJSON7 == null || marketAPIJSON7 == "") {
    return null;
  }
  var marketAPIstr8 = JSON.stringify(marketAPIJSON8);
  if (marketAPIstr8 == null || marketAPIJSON8 == null || marketAPIJSON8 == "") {
    return null;
  }
  var marketAPIstr9 = JSON.stringify(marketAPIJSON9);
  if (marketAPIstr9 == null || marketAPIJSON9 == null || marketAPIJSON9 == "") {
    return null;
  }
  var marketAPIstr10 = JSON.stringify(marketAPIJSON10);
  if (marketAPIstr10 == null || marketAPIJSON10 == null || marketAPIJSON10 == "") {
    return null;
  }

  var marketItem = marketAPIJSON["Items"];
  var marketItem1 = marketAPIJSON1["Items"];
  var marketItem2 = marketAPIJSON2["Items"];
  var marketItem3 = marketAPIJSON3["Items"];
  var marketItem4 = marketAPIJSON4["Items"];
  var marketItem5 = marketAPIJSON5["Items"];
  var marketItem6 = marketAPIJSON6["Items"];
  var marketItem7 = marketAPIJSON7["Items"];
  var marketItem8 = marketAPIJSON8["Items"];
  var marketItem9 = marketAPIJSON9["Items"];
  var marketItem10 = marketAPIJSON10["Items"];
  _marketData += "전날평균가 / 최저가 / 이름\n"
  for (var i = 0; i < marketItem.length; i++) {
    _marketData += Math.round(marketItem[i]["YDayAvgPrice"]) + " / " + marketItem[i]["CurrentMinPrice"] + " / " + marketItem[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem1.length; i++) {
    _marketData += Math.round(marketItem1[i]["YDayAvgPrice"]) + " / " + marketItem1[i]["CurrentMinPrice"] + " / " + marketItem1[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem2.length; i++) {
    _marketData += Math.round(marketItem2[i]["YDayAvgPrice"]) + " / " + marketItem2[i]["CurrentMinPrice"] + " / " + marketItem2[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem3.length; i++) {
    _marketData += Math.round(marketItem3[i]["YDayAvgPrice"]) + " / " + marketItem3[i]["CurrentMinPrice"] + " / " + marketItem3[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem4.length; i++) {
    _marketData += Math.round(marketItem4[i]["YDayAvgPrice"]) + " / " + marketItem4[i]["CurrentMinPrice"] + " / " + marketItem4[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem5.length; i++) {
    _marketData += Math.round(marketItem5[i]["YDayAvgPrice"]) + " / " + marketItem5[i]["CurrentMinPrice"] + " / " + marketItem5[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem6.length; i++) {
    if (marketItem7[i]["Name"].includes("11")) {
      continue;
    }
    _marketData += Math.round(marketItem6[i]["YDayAvgPrice"]) + " / " + marketItem6[i]["CurrentMinPrice"] + " / " + marketItem6[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem7.length; i++) {
    if (marketItem7[i]["Name"].includes("11")) {
      continue;
    }
    _marketData += Math.round(marketItem7[i]["YDayAvgPrice"]) + " / " + marketItem7[i]["CurrentMinPrice"] + " / " + marketItem7[i]["Name"] + "\n";
  }
  for (var i = 0; i < marketItem8.length; i++) {
    var itemName = marketItem8[i]["Name"].replace(/\[일품\] 명인의 /gi, "");
    _marketData += Math.round(marketItem8[i]["YDayAvgPrice"]) + " / " + marketItem8[i]["CurrentMinPrice"] + " / " + itemName + "\n";
  }
  for (var i = 0; i < marketItem9.length; i++) {
    var itemName = marketItem9[i]["Name"].replace(/\[일품\] 명인의 /gi, "");
    _marketData += Math.round(marketItem9[i]["YDayAvgPrice"]) + " / " + marketItem9[i]["CurrentMinPrice"] + " / " + itemName + "\n";
  }
  for (var i = 0; i < marketItem10.length; i++) {
    var itemName = marketItem10[i]["Name"].replace(/\[일품\] 거장의 /gi, "");
    _marketData += Math.round(marketItem10[i]["YDayAvgPrice"]) + " / " + marketItem10[i]["CurrentMinPrice"] + " / " + itemName + "\n";
  }
  marketData = _marketData.slice(0, -1);
  return marketData;
}

// !가격 JSON 코드 !등급직업분류정렬가격
function makeJSONParam(input) {
  var data = [];
  var _categoryCode = 0;
  var _itemGrade = "";
  var _characterClass = "";
  var _sortCondition = "";

  // 분류
  if ((input.indexOf("아바타") != "-1")) { _categoryCode = 20000; }
  else if ((input.indexOf("각인") != "-1")) { _categoryCode = 40000; }
  else if ((input.indexOf("재료") != "-1")) { _categoryCode = 50000; }
  else if ((input.indexOf("배템") != "-1")) { _categoryCode = 60000; }
  else if ((input.indexOf("요리") != "-1")) { _categoryCode = 70000; }
  else if ((input.indexOf("생활") != "-1")) { _categoryCode = 90000; }
  else if ((input.indexOf("모험") != "-1")) { _categoryCode = 100000; }
  else if ((input.indexOf("항해") != "-1")) { _categoryCode = 110000; }
  else if ((input.indexOf("펫") != "-1")) { _categoryCode = 140000; }
  else if ((input.indexOf("탈것") != "-1")) { _categoryCode = 160000; }
  else if ((input.indexOf("기타") != "-1")) { _categoryCode = 170000; }
  else { _categoryCode = 40000; }

  // 등급
  if ((input.indexOf("일반") != "-1")) { _itemGrade = "일반"; }
  else if ((input.indexOf("고급") != "-1")) { _itemGrade = "고급"; }
  else if ((input.indexOf("희귀") != "-1")) { _itemGrade = "희귀"; }
  else if ((input.indexOf("영웅") != "-1")) { _itemGrade = "영웅"; }
  else if ((input.indexOf("전설") != "-1")) { _itemGrade = "전설"; }
  else if ((input.indexOf("유물") != "-1")) { _itemGrade = "유물"; }
  else if ((input.indexOf("고대") != "-1")) { _itemGrade = "고대"; }
  else if ((input.indexOf("에스더") != "-1")) { _itemGrade = "에스더"; }
  else { _itemGrade = ""; }

  // 클래스
  if ((input.indexOf("버서커") != "-1")) { _characterClass = "버서커"; }
  else if ((input.indexOf("디트") != "-1")) { _characterClass = "디스트로이어"; }
  else if ((input.indexOf("인파") != "-1")) { _characterClass = "인파이터"; }
  else if ((input.indexOf("기공") != "-1")) { _characterClass = "기공사"; }
  else if ((input.indexOf("창술") != "-1")) { _characterClass = "창술사"; }
  else if ((input.indexOf("스커") != "-1")) { _characterClass = "스트라이커"; }
  else if ((input.indexOf("블레") != "-1")) { _characterClass = "블레이드"; }
  else if ((input.indexOf("데모닉") != "-1")) { _characterClass = "데모닉"; }
  else if ((input.indexOf("리퍼") != "-1")) { _characterClass = "리퍼"; }
  else if ((input.indexOf("호크") != "-1")) { _characterClass = "호크아이"; }
  else if ((input.indexOf("데헌") != "-1")) { _characterClass = "데빌헌터"; }
  else if ((input.indexOf("블래") != "-1")) { _characterClass = "블래스터"; }
  else if ((input.indexOf("워로드") != "-1")) { _characterClass = "워로드"; }
  else if ((input.indexOf("스카") != "-1")) { _characterClass = "스카우터"; }
  else if ((input.indexOf("건슬") != "-1")) { _characterClass = "건슬링어"; }
  else if ((input.indexOf("도화가") != "-1")) { _characterClass = "도화가"; }
  else if ((input.indexOf("기상") != "-1")) { _characterClass = "기상술사"; }
  else if ((input.indexOf("홀나") != "-1")) { _characterClass = "홀리나이트"; }
  else if ((input.indexOf("슬레") != "-1")) { _characterClass = "슬레이어"; }
  else if ((input.indexOf("알카") != "-1")) { _characterClass = "아르카나"; }
  else if ((input.indexOf("서머너") != "-1")) { _characterClass = "서머너"; }
  else if ((input.indexOf("바드") != "-1")) { _characterClass = "바드"; }
  else if ((input.indexOf("소서") != "-1")) { _characterClass = "소서리스"; }
  else if ((input.indexOf("배마") != "-1")) { _characterClass = "배틀마스터"; }
  else { _characterClass = ""; }

  // 가격순
  if ((input.indexOf("높은순") != "-1")) { _sortCondition = "DESC"; }
  else if ((input.indexOf("낮은순") != "-1")) { _sortCondition = "ASC"; }
  else { _sortCondition = ""; }

  data.push(_categoryCode);
  data.push(_itemGrade);
  data.push(_characterClass);
  data.push(_sortCondition);

  return data;
}
// !섬
function Island(_urlArr) {
  var islandAPIJSON = getAPI(_urlArr);

  // API 결과 Null 인 경우
  var islandAPIstr = JSON.stringify(islandAPIJSON);
  if (islandAPIstr == null || islandAPIJSON == null || islandAPIJSON == "") {
    return null;
  }

  // 골드 섬 데이터를 저장할 배열
  var goldIslands = [];
  var processedIslands = {}; // 중복 제거를 위한 객체 (섬이름_날짜)

  // 모험 섬에서 골드 보상이 있는 섬만 수집
  for (var i = 0; i < islandAPIJSON.length; i++) {
    if (islandAPIJSON[i]["CategoryName"] == "모험 섬") {
      var contentsName = islandAPIJSON[i]["ContentsName"];
      var rewardItems = islandAPIJSON[i]["RewardItems"];

      // RewardItems가 있는 경우
      if (rewardItems && rewardItems.length > 0) {
        var items = rewardItems[0]["Items"];
        if (items && items.length > 0) {
          for (var j = 0; j < items.length; j++) {
            var itemName = items[j]["Name"];
            // 골드 보상만 필터링
            if (itemName && itemName.includes('골드')) {
              var startTimes = items[j]["StartTimes"];
              if (Array.isArray(startTimes)) {
                for (var k = 0; k < startTimes.length; k++) {
                  var startTime = startTimes[k];
                  var datePart = startTime.split("T")[0]; // YYYY-MM-DD
                  var timePart = startTime.split("T")[1]; // HH:MM:SS
                  var startHour = parseInt(timePart.split(":")[0], 10);

                  // 날짜 객체 생성
                  var dateObj = new Date(datePart);
                  var month = String(dateObj.getMonth() + 1).padStart(2, '0');
                  var day = String(dateObj.getDate()).padStart(2, '0');
                  var displayDate = month + "." + day;

                  // 요일 확인 (날짜 기준)
                  var dayOfWeek = dateObj.getDay();
                  var isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

                  // 시간대 구분
                  var timeLabel;
                  if (isWeekend) {
                    timeLabel = startHour < 15 ? "오전" : "오후";
                  } else {
                    timeLabel = "ㅡㅡ";
                  }

                  // 중복 체크용 키 (섬이름_날짜)
                  var uniqueKey = contentsName + "_" + datePart;

                  if (!processedIslands[uniqueKey]) {
                    goldIslands.push({
                      date: datePart,
                      displayDate: displayDate,
                      timeLabel: timeLabel,
                      islandName: contentsName,
                      sortKey: datePart + "_" + (isWeekend ? (startHour < 15 ? "1" : "2") : "0")
                    });
                    processedIslands[uniqueKey] = true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 날짜순으로 정렬
  goldIslands.sort(function (a, b) {
    return a.sortKey.localeCompare(b.sortKey);
  });

  // 결과 문자열 생성
  if (goldIslands.length === 0) {
    return null;
  }

  var result = "<쌀 섬 일정표>\n";
  for (var i = 0; i < goldIslands.length; i++) {
    var island = goldIslands[i];
    result += island.displayDate + " " + island.timeLabel + " " + island.islandName + "\n";
  }

  // 마지막 개행 문자 제거
  if (result.endsWith("\n")) {
    result = result.slice(0, -1);
  }

  return result;
}

// 모험 섬 정보 처리 함수
// function Island(_urlArr) {
//   const islands = getAPI(_urlArr);

//   // API 응답 유효성 검사
//   if (!islands || islands.length === 0) {
//     return null;
//   }

//   const today = getKoreanDate();
//   const isWeekend = isWeekendDay();
//   const processedIslands = new Set(); // 중복 방지

//   let morningData = "";
//   let afternoonData = "";
//   let weekdayData = "";
//   let unknownRewardData = "";

//   // 모험 섬 데이터 처리
//   for (const island of islands) {
//     if (island.CategoryName !== "모험 섬") continue;
//     if (processedIslands.has(island.ContentsName)) continue;

//     const todaySchedule = getTodaySchedule(island, today);
//     if (!todaySchedule) continue;

//     const rewardName = getRewardName(island);
//     const islandInfo = `${island.ContentsName} - ${rewardName}\n`;

//     if (rewardName === "???") {
//       unknownRewardData += islandInfo;
//     } else if (isWeekend) {
//       if (todaySchedule.isMorning) {
//         morningData += islandInfo;
//       } else {
//         afternoonData += islandInfo;
//       }
//     } else {
//       weekdayData += islandInfo;
//     }

//     processedIslands.add(island.ContentsName);
//   }

//   // 결과 조합
//   return buildResult(isWeekend, morningData, afternoonData, weekdayData, unknownRewardData);
// }

// // === 헬퍼 함수들 ===

// // 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
// function getKoreanDate() {
//   const now = new Date();
//   const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

//   const year = koreanTime.getUTCFullYear();
//   const month = String(koreanTime.getUTCMonth() + 1).padStart(2, '0');
//   const day = String(koreanTime.getUTCDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }

// // 주말 여부 확인
// function isWeekendDay() {
//   const now = new Date();
//   const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
//   const dayOfWeek = koreanTime.getUTCDay();

//   return dayOfWeek === 0 || dayOfWeek === 6; // 일요일 또는 토요일
// }

// // 오늘의 스케줄 정보 가져오기
// function getTodaySchedule(island, today) {
//   if (!Array.isArray(island.StartTimes)) return null;

//   for (const startTime of island.StartTimes) {
//     const [date, time] = startTime.split("T");

//     if (date === today) {
//       const hour = parseInt(time.split(":")[0], 10);
//       return {
//         isMorning: hour < 15,
//         hour: hour
//       };
//     }
//   }

//   return null;
// }

// // 보상 아이템 이름 추출 및 단순화
// function getRewardName(island) {
//   // RewardItems가 없는 경우
//   if (!island.RewardItems || island.RewardItems.length === 0) {
//     return "???";
//   }

//   const rewardItems = island.RewardItems[0];
//   if (!rewardItems.Items || rewardItems.Items.length === 0) {
//     return "???";
//   }

//   const itemName = rewardItems.Items[0].Name;

//   // 아이템 이름 단순화
//   if (itemName.includes('카드')) return '카드';
//   if (itemName.includes('주화')) return '주화';

//   return itemName;
// }

// // 최종 결과 문자열 생성
// function buildResult(isWeekend, morningData, afternoonData, weekdayData, unknownRewardData) {
//   let result = "";

//   if (isWeekend) {
//     if (morningData) {
//       result += "- 오전 -\n" + morningData;
//     }
//     if (afternoonData) {
//       result += "\n- 오후 -\n" + afternoonData;
//     }
//   } else {
//     result = weekdayData;
//   }

//   // 보상 정보 미확인 섬 추가
//   if (unknownRewardData) {
//     result += (result ? "\n" : "") + unknownRewardData;
//   }

//   // 마지막 개행 제거
//   return result.trim();
// }

// Data 가공
function checkInputForData(_command, _urlArr, _searchName) {
  var resultData = "";

  switch (_command) {
    case "!배럭":
      resultData = Characters(_urlArr);
      break;
    case "!부캐":
      resultData = Characters(_urlArr);
      break;
    case "!ㅂㅋ":
      resultData = Characters(_urlArr);
      break;
    case "!ㅂㄹ":
      resultData = Characters(_urlArr);
      break;
    case "!원정대":
      resultData = Characters(_urlArr);
      break;
    case "!ㅇㅈㄷ":
      resultData = Characters(_urlArr);
      break;
    // case "!정보":
    //   resultData = Info(_urlArr, _searchName);
    //   break;
    case "!보석":
      resultData = Gems(_urlArr);
      break;
    case "!아바타":
      break;
    case "!스킬":
      resultData = Skills(_urlArr);
      break;
    case "!장비":
      resultData = Equipemnt(_urlArr, _searchName);
      break;
    case "!악세":
      resultData = Accessories(_urlArr);
      break;
    case "!각인":
      resultData = Engravings(_urlArr);
      break;
    case "!앜패":
      resultData = ArkPassive(_urlArr);
      break;
    case "!ㅇㅍ":
      resultData = ArkPassive(_urlArr);
      break;
    case "!아크":
      resultData = ArkGrid(_urlArr);
      break;
    case "!ㅇㅋ":
      resultData = ArkGrid(_urlArr);
      break;
    case "!내실":
      resultData = Collectibles(_urlArr);
      break;
    case "!섬":
      resultData = Island(_urlArr);
      break;
    case "!유각":
      resultData = searchEngravis(_urlArr);
      break;
    case "!ㅇㄱㄹ":
      resultData = searchEgir(_urlArr);
      break;
    case "!ㅈㄱㄱ":
      resultData = searchGem(_urlArr);
      break;
    case "!젬가격":
      resultData = searchGem(_urlArr);
      break;
    case "!ㅅ":
      resultData = Island(_urlArr);
      break;
    case "!ㅆ":
      resultData = Island(_urlArr);
      break;
    case "!ㅇㄱ":
      resultData = searchEngravis(_urlArr);
      break;
    case "!ㅅㅍㅇㄱ":
      resultData = searchEngravisForSupport(_urlArr);
      break;
    case "!서폿유각":
      resultData = searchEngravisForSupport(_urlArr);
      break;
    case "!보석가격":
      resultData = searchGems(_urlArr);
      break;
    case "!ㅂㅅㄱㄱ":
      resultData = searchGems(_urlArr);
      break;
    case "!ㅂㅅ":
      resultData = searchGems(_urlArr);
      break;
    case "!ㅄ":
      resultData = searchGems(_urlArr);
      break;
    case "!ㅄㄱㄱ":
      resultData = searchGems(_urlArr);
      break;
    case "!ㄴㅇ":
      resultData = ParadisePower(_urlArr, _searchName);
      break;
    case "!ㄴㅇㄹ":
      resultData = ParadisePower(_urlArr, _searchName);
      break;
    case "!낙원":
      resultData = ParadisePower(_urlArr, _searchName);
      break;
    case "!낙원력":
      resultData = ParadisePower(_urlArr, _searchName);
      break;
    case (_command.indexOf("가격") != "-1" && _command.indexOf("!") == 0) ? _command : "입1력2방3지4방5지6":
      resultData = searchMarket(_command, _urlArr, _searchName);
      break;
  }
  return resultData;
}

// Null Data 처리
function nullData(_command) {
  var _nullData = "";

  switch (_command) {
    case "!배럭":
      _nullData = "안함";
      break;
    case "!부캐":
      _nullData = "안함";
      break;
    case "!ㅂㅋ":
      _nullData = "안함";
      break;
    case "!ㅂㄹ":
      _nullData = "안함";
      break;
    case "!원정대":
      _nullData = "안함";
      break;
    case "!ㅇㅈㄷ":
      _nullData = "안함";
      break;
    // case "!정보":
    //   _nullData = "안함";
    //   break;
    case "!보석":
      _nullData = "쌀";
      break;
    case "!아바타":
      break;
    case "!스킬":
      _nullData = "평타맨";
      break;
    case "!장비":
      _nullData = "알몸";
      break;
    case "!악세":
      _nullData = "그지";
      break;
    case "!각인":
      _nullData = "응애";
      break;
    case "!내실":
      _nullData = "응애";
      break;
    case "!유각":
      _nullData = "장사안함";
      break;
    case "!ㅇㅍ":
      _nullData = "3티어!!";
      break;
    case "!앜패":
      _nullData = "3티어!!";
      break;
    case "!ㅇㅋ":
      _nullData = "조빱!!!";
      break;
    case "!아크":
      _nullData = "조빱!!!";
      break;
    case "!ㄴㅇ":
      _nullData = "조빱!!!";
      break;
    case "!ㄴㅇㄹ":
      _nullData = "조빱!!!";
      break;
    case "!낙원":
      _nullData = "조빱!!!";
      break;
    case "!낙원력":
      _nullData = "조빱!!!";
      break;
    case "!ㅇㄱㄹ":
      _nullData = "장사안함";
      break;
    case "!ㅈㄱㄱ":
      _nullData = "장사안함";
      break;
    case "!젬가격":
      _nullData = "장사안함";
      break;
    case "!ㅅ":
      _nullData = "없음";
      break;
    case "!ㅆ":
      _nullData = "없음";
      break;
    case "!ㅇㄱ":
      _nullData = "장사안함";
      break;
    case "!ㅅㅍㅇㄱ":
      _nullData = "장사안함";
      break;
    case "!서폿유각":
      _nullData = "장사안함";
      break;
    case "!보석가격":
      _nullData = "장사안함";
      break;
    case "!ㅂㅅㄱㄱ":
      _nullData = "장사안함";
      break;
    case "!ㅂㅅ":
      _nullData = "장사안함";
      break;
    case "!ㅄ":
      _nullData = "장사안함";
      break;
    case "!ㅄㄱㄱ":
      _nullData = "장사안함";
      break;
    case (_command.indexOf("가격") != "-1" && _command.indexOf("!") == 0) ? _command : "입1력2방3지4방5지6":
      _nullData = "장사안함";
      break;
  }
  return _nullData;
}

// 다중 URL 생성
function checkInputForURL(_command, searchName) {
  var _urlArr = [];

  // 가격 검색
  if (_command.indexOf("!") === 0 && _command.indexOf("가격") !== -1 && _command.indexOf("보석") === -1) {
    _command = true;
  }

  switch (_command) {
    case "!배럭":
      _urlArr.push(makeURIget(0, 0, searchName));
      break;
    case "!부캐":
      _urlArr.push(makeURIget(0, 0, searchName));
      break;
    case "!ㅂㅋ":
      _urlArr.push(makeURIget(0, 0, searchName));
      break;
    case "!ㅂㄹ":
      _urlArr.push(makeURIget(0, 0, searchName));
      break;
    case "!원정대":
      _urlArr.push(makeURIget(0, 0, searchName));
      break;
    case "!ㅇㅈㄷ":
      _urlArr.push(makeURIget(0, 0, searchName));
      break;
    // case "!정보":
    //   _urlArr.push(makeURIget(1, 14, searchName));
    //   break;
    case "!보석":
      _urlArr.push(makeURIget(1, 7, searchName));
      break;
    case "!아바타":
      // _urlArr.push(makeURIget(1,3,searchName));
      break;
    case "!스킬":
      _urlArr.push(makeURIget(1, 4, searchName));
      break;
    case "!장비":
      _urlArr.push(makeURIget(1, 14, searchName));
      break;
    case "!악세":
      _urlArr.push(makeURIget(1, 14, searchName));
      break;
    case "!각인":
      _urlArr.push(makeURIget(1, 14, searchName));
      break;
    case "!ㅇㅍ":
      _urlArr.push(makeURIget(1, 14, searchName));
      break;
    case "!앜패":
      _urlArr.push(makeURIget(1, 14, searchName));
      break;
    case "!ㅇㅋ":
      _urlArr.push(makeURIget(1, 14, searchName));
      break;
    case "!아크":
      _urlArr.push(makeURIget(1, 14, searchName));
      break;
    case "!내실":
      _urlArr.push(makeURIget(1, 1, searchName));
      _urlArr.push(makeURIget(1, 9, searchName));
      break;
    case "!섬":
      _urlArr.push(makeURIget(5, 13, ""));
      break;
    case "!유각":
      _urlArr.push(makeURIpost(4, 12));
      break;
    case "!ㅇㄱㄹ":
      _urlArr.push(makeURIpost(4, 12));
      break;
    case "!ㅈㄱㄱ":
      _urlArr.push(makeURIpost(4, 12));
      break;
    case "!젬가격":
      _urlArr.push(makeURIpost(4, 12));
      break;
    case "!ㅅ":
      _urlArr.push(makeURIget(5, 13, ""));
      break;
    case "!ㅆ":
      _urlArr.push(makeURIget(5, 13, ""));
      break;
    case "!ㅇㄱ":
      _urlArr.push(makeURIpost(4, 12));
      break;
    case "!ㅅㅍㅇㄱ":
      _urlArr.push(makeURIpost(4, 12));
      break;
    case "!서폿유각":
      _urlArr.push(makeURIpost(4, 12));
      break;
    case "!보석가격":
      _urlArr.push(makeURIpost(2, 12));
      break;
    case "!ㅂㅅㄱㄱ":
      _urlArr.push(makeURIpost(2, 12));
      break;
    case "!ㅂㅅ":
      _urlArr.push(makeURIpost(2, 12));
      break;
    case "!ㅄ":
      _urlArr.push(makeURIpost(2, 12));
      break;
    case "!ㅄㄱㄱ":
      _urlArr.push(makeURIpost(2, 12));
      break;
    case "!ㄴㅇ":
      _urlArr.push(makeURIget(0, 0, searchName)); // siblings
      _urlArr.push(makeURIget(1, 14, searchName)); // armories (전체 정보)
      break;
    case "!ㄴㅇㄹ":
      _urlArr.push(makeURIget(0, 0, searchName)); // siblings
      _urlArr.push(makeURIget(1, 14, searchName)); // armories (전체 정보)
      break;
    case "!낙원":
      _urlArr.push(makeURIget(0, 0, searchName)); // siblings
      _urlArr.push(makeURIget(1, 14, searchName)); // armories (전체 정보)
      break;
    case "!낙원력":
      _urlArr.push(makeURIget(0, 0, searchName)); // siblings
      _urlArr.push(makeURIget(1, 14, searchName)); // armories (전체 정보)
      break;
    case true:
      _urlArr.push(makeURIpost(4, 12));
      break;
  }
  return _urlArr;
}

// get URL 생성
function makeURIget(_urlF, _urlB, searchName) {
  var _url = "";
  // searchName이 빈 문자열이 아닌 경우 URL 인코딩
  if (searchName && searchName !== "") {
    _url = apiURLF[_urlF] + encodeURIComponent(searchName) + apiURLB[_urlB];
  } else {
    _url = apiURLF[_urlF] + searchName + apiURLB[_urlB];
  }

  return _url;
}

// post URL 생성
function makeURIpost(_urlF, _urlB) {
  var _url = "";
  _url = apiBaseURL + apiURLF[_urlF] + apiURLB[_urlB];

  return _url;
}

// getAPI
function getAPI(_url) {
  var data = "";
  try {
    var res = org.jsoup.Jsoup.connect(apiBaseURL + _url)
      .header("accept", "application/json")
      .header("authorization", apiKey)
      .ignoreHttpErrors(true)
      .ignoreContentType(true)
      .get().text();
    // JSON 문자열을 객체로 반환
    if (res == "" || res == null) {
      data = res;
    }
    else {
      data = JSON.parse(res);
    }

    return data;
  } catch (e) {
    return e;
  }
}

// postAPI 마켓용
function postMarket(_urlArr, _json) {
  var data = "";
  try {
    /*
    .data("Sort", "GRADE")
    .data("CategoryCode", categoryCode)
    .data("CharacterClass", "")
    .data("ItemTier", 0)
    .data("ItemGrade", "")
    .data("ItemName", item)
    .data("PageNo", 0)
    .data("SortCondition", "ASC")            
    .ignoreContentType(true) 
    .ignoreHttpErrors(true) 
    .post().text(); 
    */
    var json = _json;
    var url = _urlArr;
    // "https://developer-lostark.game.onstove.com/markets/items";
    var res = org.jsoup.Jsoup.connect(url)
      .header("accept", "application/json")
      .header("authorization", apiKey)
      .header("Content-Type", "application/json")
      .requestBody(JSON.stringify(json))
      .ignoreHttpErrors(true)
      .ignoreContentType(true)
      .post().text();
    // JSON 문자열을 객체로 반환
    if (res == "" || res == null) {
      data = res;
    }
    else {
      data = JSON.parse(res);
    }
    return data;
  } catch (e) {
    return e;
  }
};

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


// !가격 xxx
// !비싼전각
// !아바타

function testJSON(replier, isElixir, isEquip, msg) {
  var type = msg.substr(6, msg.length);
  var _equipmentAPIJSON = getAPI("/armories/characters/" + "lana율이" + "/equipment")
  var data = "";
  var element_num = "";
  var elixirSum = 0;
  var qualityValue = 0;
  var transcendenceSum = 0;
  var setEffect = "";
  var elixirEffect = "";
  for (var i = 0; i < _equipmentAPIJSON.length; i++) {
    if (_equipmentAPIJSON[i]["Type"] == type) {
      var test = JSON.stringify(_equipmentAPIJSON[i]["Tooltip"]);
      var test1 = test.replace(/\\/gi, "");
      var test2 = test1.replace(/rn/gi, "");
      var test3 = test2.replace(/"Element_000": { "type":/gi, "},{ \"type\":");
      var test4 = test3.replace(/"Element_001": { "type":/gi, "{ \"type\":");
      var test5 = test4.replace(/"Element_002": { "type":/gi, "{ \"type\":");
      var test6 = test5.replace(/"Element_003": { "type":/gi, "{ \"type\":");
      var test7 = test6.replace(/"Element_004": { "type":/gi, "{ \"type\":");
      var test8 = test7.replace(/"Element_005": { "type":/gi, "{ \"type\":");
      var test9 = test8.replace(/"Element_006": { "type":/gi, "{ \"type\":");
      var test10 = test9.replace(/"Element_007": { "type":/gi, "{ \"type\":");
      var test11 = test10.replace(/"Element_008": { "type":/gi, "{ \"type\":");
      var test12 = test11.replace(/"Element_009": { "type":/gi, "{ \"type\":");
      var test13 = test12.replace(/"Element_010": { "type":/gi, "{ \"type\":");
      var test14 = test13.replace(/"Element_011": { "type":/gi, "{ \"type\":");
      var test15 = test14.replace(/"Element_012": { "type":/gi, "{ \"type\":");
      var test16 = test15.replace(/"Element_013": { "type":/gi, "{ \"type\":");
      var test17 = test16.replace(/"Element_014": { "type":/gi, "{ \"type\":");
      var test18 = test17.replace(/"Element_015": { "type":/gi, "{ \"type\":");
      var test19 = test18.replace(/"Element_016": { "type":/gi, "{ \"type\":");
      var test20 = test19.replace(/"Element_017": { "type":/gi, "{ \"type\":");
      var test21 = test20.replace(/"Element_018": { "type":/gi, "{ \"type\":");
      var test22 = test21.replace(/"{ },/gi, "[");
      var test23 = test22.replace(/}"/gi, "]");
      // var _equipTooltipJSON = JSON.parse(test22);
      // var testdata = "test=";
      // //장비
      // if(isEquip == true){
      //   if(isElixir == false){
      //     for(var j = 0; j < _equipTooltipJSON.length; j++){
      //       // 재련수치
      //       if(_equipTooltipJSON[j]["type"] == "NameTagBox"){
      //         var equipment = _equipTooltipJSON[j]["value"];
      //         data += type + ": " + equipment.slice(2, 4) + "[00";
      //       }
      //       // 상급 재련
      //       if(_equipTooltipJSON[j]["type"] == "SingleTextBox"){
      //         if(_equipTooltipJSON[j]["value"].indexOf("상급 재련") != "-1")
      //         {
      //           var modifiedString = data.slice(0, -2);
      //           data = modifiedString;
      //           var startIndex = _equipTooltipJSON[j]["value"].indexOf("[상급 재련]");
      //           var endIndex = _equipTooltipJSON[j]["value"].indexOf("단계") + 2; 
      //           var extractedString = _equipTooltipJSON[j]["value"].slice(startIndex + "[상급 재련] ".length, endIndex - 2);
      //           if (extractedString.length === 1) {
      //             data += "0" + extractedString;
      //           }
      //           else if (extractedString.length === 2){
      //             data += "" + extractedString;
      //           }
      //         }
      //       }
      //       // 세트효과
      //       if(_equipTooltipJSON[j]["type"] == "ItemPartBox"){
      //         if(_equipTooltipJSON[j]["value"]["Element_000"].indexOf("세트") != "-1"){
      //           var set0 = _equipTooltipJSON[j]["value"]["Element_001"].substring(0,2);
      //           if(set0 == "장착"){
      //             data += "짱쎔";
      //           }else{
      //             data += "] " + set0 + " ";
      //           }
      //           setEffect = set0;
      //         }
      //       }
      //     }
      //     // 품질
      //     for(var j = 0; j < _equipTooltipJSON.length; j++){
      //       if(_equipTooltipJSON[j]["type"] == "ItemTitle"){
      //         data += "(" + _equipTooltipJSON[j]["value"]["qualityValue"] + ")" + " ";
      //         // if(type == "무기"){
      //         //   data += "\n";
      //         // }
      //         qualityValue += parseInt(_equipTooltipJSON[j]["value"]["qualityValue"]);
      //       }
      //     }
      //     // 초월
      //     for(var m = 0; m < _equipTooltipJSON.length; m++){
      //       if(_equipTooltipJSON[m]["type"] == "IndentStringGroup"){
      //         testdata += JSON.stringify(_equipTooltipJSON[m]["value"]);
      //         if(_equipTooltipJSON[m]["value"] == null){
      //           continue;
      //         }
      //         if(_equipTooltipJSON[m]["value"]["Element_000"]["topStr"].indexOf("초월") != "-1"){
      //           var transcendence = _equipTooltipJSON[m]["value"]["Element_000"]["topStr"];
      //           var startIndex = _equipTooltipJSON[m]["value"]["Element_000"]["topStr"].indexOf("[초월]");
      //           var extractedString = _equipTooltipJSON[m]["value"]["Element_000"]["topStr"].slice(startIndex + "[초월]".length).trim();
      //           data += extractedString;
      //           transcendenceSum += parseInt(transcendence.slice(transcendence.length-2,transcendence.length));
      //         }
      //         else{
      //           if(_equipTooltipJSON[m]["value"]["Element_000"]["topStr"].indexOf("엘릭서") != "-1"){}
      //           else if(_equipTooltipJSON[m]["value"]["Element_000"]["topStr"].indexOf("연성") != "-1"){}
      //           else if(_equipTooltipJSON[m]["value"]["Element_000"]["topStr"].indexOf("세트") != "-1"){
      //             // if(type != "무기"){
      //                 data += "\n";
      //             // }
      //           }
      //         }
      //       }
      //     }
      //   }
      //   // 엘릭서
      //   // else{
      //   //   for(var k = 0; k < _equipTooltipJSON.length; k++){
      //   //     if(_equipTooltipJSON[k]["type"] == "IndentStringGroup"){
      //   //       if(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["bPoint"] == true){
      //   //         if(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"].indexOf("[") != "-1"){
      //   //           var contentStr1 = _equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"];
      //   //           var contentStr2 = contentStr1.slice(contentStr1.search("]")+2,contentStr1.search("Lv")+4);
      //   //           var elixirNum = contentStr1.slice(contentStr1.search("Lv")+3,contentStr1.search("Lv")+4);
      //   //           elixirSum += parseInt(elixirNum);
      //   //           data += type + ": " + contentStr2;
      //   //           if(Object.keys(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]).length == 1){
      //   //             data += "\n";
      //   //           }
      //   //         }
      //   //         if(Object.keys(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]).length > 1){
      //   //           if(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_001"]["contentStr"].indexOf("[") != "-1"){
      //   //             var contentStr3 = _equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_001"]["contentStr"];
      //   //             var contentStr4 = contentStr3.slice(contentStr3.search("]")+1,contentStr3.search("Lv")+4);
      //   //             var elixirNum = contentStr3.slice(contentStr3.search("Lv")+3,contentStr3.search("Lv")+4);
      //   //             elixirSum += parseInt(elixirNum);
      //   //             data += contentStr4 + "\n";
      //   //           }
      //   //         }
      //   //       }
      //   //     }
      //   //   }
      //   //   for(var k = 0; k < _equipTooltipJSON.length; k++){
      //   //     if(_equipTooltipJSON[k]["type"] == "IndentStringGroup"){
      //   //       if(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["bPoint"] == true){
      //   //         if(_equipTooltipJSON[k]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"].indexOf("단계 :") != "-1"){
      //   //           elixirEffect = _equipTooltipJSON[k]["value"]["Element_000"]["topStr"];
      //   //         }
      //   //       }
      //   //     }
      //   //   }
      //   // }

      // }
      //악세
      // else{
      //   for(var j = 0; j < _equipTooltipJSON.length; j++){
      //     // 등급 이름
      //     if(_equipTooltipJSON[j]["type"] == "ItemTitle"){
      //       var accessory = _equipTooltipJSON[j]["value"];
      //       if(accessory["leftStr0"].indexOf("이") != "-1"){
      //         data += accessory["leftStr0"].slice(0,accessory["leftStr0"].length -2);
      //       }
      //       else if(type == "팔찌"){
      //         data += "\n\n" + accessory["leftStr0"] + "\n";
      //       }
      //       else if(type == "반지"){
      //         data += accessory["leftStr0"].slice(0,accessory["leftStr0"].length -1);
      //       }
      //       else{
      //         data += accessory["leftStr0"];
      //       }
      //     }
      //     // 각인효과
      //     if(_equipTooltipJSON[j]["type"] == "IndentStringGroup"){
      //       var engrave00 = _equipTooltipJSON[j]["value"]["Element_000"]["contentStr"]["Element_000"]["contentStr"]
      //       var engrave01 = _equipTooltipJSON[j]["value"]["Element_000"]["contentStr"]["Element_001"]["contentStr"]
      //       var engrave1 = engrave00.slice(1,2);
      //       var engrave2 = engrave00.slice(engrave00.length-2,engrave00.length-1);
      //       var engrave3 = engrave01.slice(1,2);
      //       var engrave4 = engrave01.slice(engrave01.length-2,engrave01.length-1);
      //       var engrave5 = " " + engrave1 + engrave2 + " " + engrave3 + engrave4 + " ";
      //       data += engrave5;
      //     }
      //   }
      //   // 특성
      //   for(var j = 0; j < _equipTooltipJSON.length; j++){
      //     if(_equipTooltipJSON[j]["type"] == "ItemPartBox"){
      //       if(_equipTooltipJSON[j]["value"]["Element_000"] == "추가 효과"){
      //         var cha0 = _equipTooltipJSON[j]["value"]["Element_001"];
      //         var cha1 = cha0.replace(/치명 /gi,"치");
      //         var cha2 = cha1.replace(/특화 /gi,"특");
      //         var cha3 = cha2.replace(/신속 /gi,"신");
      //         var cha4 = cha3.replace(/제압 /gi,"제");
      //         var cha5 = cha4.replace(/인내 /gi,"인");
      //         var cha6 = cha5.replace(/숙련 /gi,"숙");
      //         data += cha6;
      //       }
      //     }
      //   }
      //   // 품질
      //   for(var j = 0; j < _equipTooltipJSON.length; j++){
      //     if(_equipTooltipJSON[j]["type"] == "ItemTitle"){
      //       if(type == "어빌리티 스톤" || type == "팔찌"){}
      //       else{
      //         data += "(" + _equipTooltipJSON[j]["value"]["qualityValue"] + ")" + "\n";
      //         qualityValue += parseInt(_equipTooltipJSON[j]["value"]["qualityValue"]);
      //       }
      //     }
      //   }
      //   // 팔찌효과
      //   if(type == "팔찌"){
      //     for(var j = 0; j < _equipTooltipJSON.length; j++){
      //       if(_equipTooltipJSON[j]["type"] == "ItemPartBox"){
      //         if(_equipTooltipJSON[j]["value"]["Element_000"] == "팔찌 효과"){
      //           var bracelet = _equipTooltipJSON[j]["value"]["Element_001"].replace(/\[/gi,"\n\[")
      //           var bracelet1 = bracelet.replace(/치명 \+/gi,"\n 치명 ");
      //           var bracelet2 = bracelet1.replace(/특화 \+/gi,"\n 특화 ");
      //           var bracelet3 = bracelet2.replace(/신속 \+/gi,"\n 신속 ");
      //           var bracelet4 = bracelet3.replace(/제압 \+/gi,"\n 제압 ");
      //           var bracelet5 = bracelet4.replace(/인내 \+/gi,"\n 인내 ");
      //           var bracelet6 = bracelet5.replace(/숙련 \+/gi,"\n 숙련 ");
      //           var bracelet7 = bracelet6.replace(/최대 생명력 \+/gi,"\n 최대 생명력 ");
      //           var bracelet8 = bracelet7.replace(/최대 마나 \+/gi,"\n 최대 마나 ");
      //           var bracelet9 = bracelet8.replace(/물리 방어력 \+/gi,"\n 물리 방어력 ");
      //           var bracelet10 = bracelet9.replace(/마법 방어력 \+/gi,"\n 마법 방어력 ");
      //           var bracelet11 = bracelet10.replace(/전투 중 생명력 회복량 \+/gi,"\n 전투 중 생명력 회복량 ");
      //           var bracelet12 = bracelet11.replace(/무기 공격력 \+/gi,"\n 무기 공격력 ");
      //           var bracelet13 = bracelet12.replace(/체력 \+/gi,"\n 체력 ");
      //           var bracelet14 = bracelet13.replace(/힘 \+/gi,"\n 힘 ");
      //           var bracelet15 = bracelet14.replace(/민첩 \+/gi,"\n 민첩 ");
      //           var bracelet16 = bracelet15.replace(/지능 \+/gi,"\n 지능 ");
      //           data += bracelet16
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
  replier.reply(test23);
  // replier.reply(testdata);
  return test22;
  // return [data, elixirSum, qualityValue, setEffect, elixirEffect]
}

// !ㄴㅇ, !ㄴㅇㄹ 낙원력 가공
function ParadisePower(_urlArr, _searchName) {
  var result = "";

  // siblings API 호출 (원정대 캐릭터 목록)
  var siblingsJSON = getAPI(_urlArr[0]);
  var siblingsStr = JSON.stringify(siblingsJSON);

  // API 결과 Null 체크
  if (siblingsStr == null || siblingsJSON == null || siblingsJSON == "") {
    return null;
  }

  // 입력된 캐릭터 이름 사용
  var mainCharName = _searchName;
  var mainCharServer = "";

  // siblings에서 서버 정보 찾기
  for (var i = 0; i < siblingsJSON.length; i++) {
    if (siblingsJSON[i]["CharacterName"] === mainCharName) {
      mainCharServer = siblingsJSON[i]["ServerName"];
      break;
    }
  }

  // 메인 캐릭터 정보 조회
  var encodedMainName = encodeURIComponent(mainCharName);
  var mainCharURL = "/armories/characters/" + encodedMainName;
  var mainCharEquipJSON = getAPI(mainCharURL);
  var mainCharParadise = getCharacterParadisePower(mainCharEquipJSON);

  if (mainCharParadise.hasBouju === true) {
    result += mainCharName + ": " + mainCharParadise.paradisePower + "\n";
  } else {
    result += mainCharName + ": 보주 미착용\n";
  }

  result += "\n▼ 원정대 전체보기\n";

  // 메인 캐릭터와 같은 서버의 캐릭터만 필터링
  var sameServerChars = [];
  for (var i = 0; i < siblingsJSON.length; i++) {
    if (siblingsJSON[i]["ServerName"] === mainCharServer && siblingsJSON[i]["CharacterName"] !== mainCharName) {
      sameServerChars.push(siblingsJSON[i]);
    }
  }

  // 레벨 순으로 정렬 (높은 레벨부터)
  sameServerChars.sort(function (a, b) {
    var levelA = parseFloat(a.ItemAvgLevel.replace(/,/gi, ""));
    var levelB = parseFloat(b.ItemAvgLevel.replace(/,/gi, ""));
    return levelB - levelA; // 내림차순
  });

  // 원정대 전체 캐릭터 낙원력 조회 (레벨 순)
  for (var i = 0; i < sameServerChars.length; i++) {
    var charName = sameServerChars[i]["CharacterName"];

    // 각 캐릭터의 전체 정보 조회 (URL 인코딩)
    var encodedCharName = encodeURIComponent(charName);
    var charEquipURL = "/armories/characters/" + encodedCharName;
    var charEquipJSON = getAPI(charEquipURL);
    var charParadise = getCharacterParadisePower(charEquipJSON);

    if (i == 5) { result += "\u200b".repeat(500); }
    if (charParadise.hasBouju) {
      result += charName + ": " + charParadise.paradisePower + "\n";
    } else {
      result += charName + ": 보주 미착용\n";
    }
  }

  return result;
}

// 개별 캐릭터의 보주 낙원력 추출 헬퍼 함수
function getCharacterParadisePower(equipJSON) {
  var returnData = {
    charName: "",
    hasBouju: false,
    paradisePower: "0"
  };

  // API 결과 Null 체크
  if (equipJSON == null || equipJSON == "") {
    return returnData;
  }

  var infoEquipment = equipJSON["ArmoryEquipment"];

  // ArmoryEquipment Null 체크
  if (infoEquipment == null || infoEquipment.length == 0) {
    return returnData;
  }

  // 보주 찾기
  for (var i = 0; i < infoEquipment.length; i++) {
    if (infoEquipment[i]["Type"] === "보주") {
      returnData.hasBouju = true;

      try {
        var tooltipData = infoEquipment[i]["Tooltip"];
        var parsedTooltip;

        // Tooltip 파싱
        if (typeof tooltipData === 'object' && tooltipData !== null) {
          parsedTooltip = tooltipData;
        } else {
          var cleanedTooltip = tooltipData.replace(/\r\n/g, '').replace(/\\r\\n/g, '');
          parsedTooltip = JSON.parse(cleanedTooltip);
        }

        // Element_004에서 낙원력 추출
        if (parsedTooltip.Element_004 && parsedTooltip.Element_004.value && parsedTooltip.Element_004.value.Element_001) {
          var element001 = parsedTooltip.Element_004.value.Element_001;

          // 낙원력 값 정규식으로 추출 (시즌 표기 포함)
          var paradiseMatch = element001.match(/낙원력\s*:\s*(\d+)/);

          if (paradiseMatch && paradiseMatch[1]) {
            // 숫자에 3자리마다 콤마 추가
            returnData.paradisePower = paradiseMatch[1].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }
      } catch (e) {
        returnData.paradisePower = "파싱 오류";
      }
      break;
    }
  }

  return returnData;
}