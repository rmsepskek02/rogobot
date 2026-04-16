const scriptName = "로아API카링";
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

// const { KakaoLinkClient } = require('kakaolink');
// const Kakao = new KakaoLinkClient('c0d2d5a6da78d03cc4667cec3b4756a9', 'https://open.kakao.com/o/ssdOPG0e');
// Kakao.login('rmsepskek02@gmail.com', 'wmrm13241423!');

var { KakaoApiService, KakaoShareClient } = require('kakaolink');

const service = KakaoApiService.createService();
const client = KakaoShareClient.createClient();

const cookies = service.login({
  signInWithKakaoTalk: true
}).awaitResult();
client.init('c0d2d5a6da78d03cc4667cec3b4756a9', 'https://open.kakao.com/o/ssdOPG0e', cookies);

var kalingTpye = "";

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

  if (room == "한용희") {
    replier.reply("test");
    getZloaAPI(room, msg, sender, isGroupChat, replier, imageDB, packageName);
    // Log.debug(getZloaAPI("1"), true);
  }

  // if (msg == "고로바드" || msg == "예니") {
  //   var getUrl = getImage(msg);
  //   var imageString = getUrl.replace("https://img.lostark.co.kr/armory/", "");
  //   replier.reply(imageString);
  // }
  // 출력
  try {
    replyData(room, msg, sender, isGroupChat, replier, imageDB, packageName);
  } catch (e) {
    Api.replyRoom("한용희", e + "\n" + e.lineNumber);
    replier.reply("삐빅! 에러!");
    Log.debug(e, true);
    Log.error(e, true);
  }
}
function testreply(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  replier.reply("TTTTT");
}
// API URL 생성 & API 결과 출력
function replyData(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  // 출력 초기화
  var output;
  var searchName = "";
  var command = "";
  var urlArr = [];
  var input;

  input = msg.split(" ");
  // 검색어
  searchName = input[1];
  // 명령어
  command = input[0];

  // URL 생성
  urlArr = checkInputForURL(command, searchName);

  // JSON 데이터 
  output = checkInputForData(command, urlArr, searchName);
  // 결과 출력
  if (checkInputForData(command, urlArr, searchName) == null || checkInputForData(command, urlArr, searchName) == "") {
    output = "";
    output += nullData(command);
    // 텍스트결과 출력
    replier.reply(output);
  }
  else {
    // 카카오링크 출력 
    checkTemplatesKakaolink(kalingTpye, room, output);
  }
}

// !정보 110730
function kalingInfo(room, data) {
  var armoryProfile = data["ArmoryProfile"]; // 프로필정보
  var armoryEquipment = data["ArmoryEquipment"]; // 장비정보
  var armoryEngraving = data["ArmoryEngraving"]; // 각인정보
  var armoryGem = data["ArmoryGem"]; // 보석정보
  var armoryCard = data["ArmoryCard"]; // 카드정보
  var arkPassive = data["ArkPassive"]; // 아크패시브
  //var arkPassive = armoryProfile["ArkPassive"]; // 아크패시브
  var characterName = armoryProfile["CharacterName"]; // 닉네임
  var itemLevel = armoryProfile["ItemAvgLevel"]; // 템렙
  var expeditionLevel = armoryProfile["ExpeditionLevel"]; // 원대
  var characterLevel = armoryProfile["CharacterLevel"]; // 전렙
  var characterclass = armoryProfile["CharacterClassName"]; // 클래스
  var server = armoryProfile["ServerName"]; //서버
  var guildName = armoryProfile["GuildName"] //길드
  var _combatPower = armoryProfile["CombatPower"]; // 전투력
  var isArkPassive = arkPassive["IsArkPassive"]; // 아크패시브 유무
  var _templateId = 0;
  if (isArkPassive)
    _templateId = 110730;
  else
    _templateId = 110687;

  var getUrl = getImage(characterName);
  var imageString = getUrl.replace("https://img.lostark.co.kr/armory/", "");
  // 무강(상재)
  {
    var weapon = "";
    for (var i = 0; i < armoryEquipment.length; i++) {
      if (armoryEquipment[i]["Type"] == "무기") {
        weapon += armoryEquipment[i]["Name"].slice(1, 3);
        break;
      }
    }
    for (var j = 0; j < armoryEquipment.length; j++) {
      if (armoryEquipment[j]["Type"] == "무기") {
        var weaponTemp = TooltipToJSON(armoryEquipment[j]["Tooltip"]);
        for (var k = 0; k < weaponTemp.length; k++) {
          if (weaponTemp[k]["type"].indexOf("SingleTextBox") != "-1") {
            if (weaponTemp[k]["value"].indexOf("상급 재련") != "-1") {
              var valueTemp = weaponTemp[k]["value"];
              var valueTemp1 = valueTemp.replace(/[^\d]*(\d+)[^\d]*/g, '$1');
              var valueTemp2 = valueTemp1.slice(0, 2); // 앞의 숫자 2개만 남김
              weapon += "(" + valueTemp2 + ")";
            }
          }
        }
      }
    }
  }

  // 평품
  {
    var toolTipQuality = 0;
    var equipQuality = 0;
    var equipCount = 0;
    for (var i = 0; i < armoryEquipment.length; i++) {
      var equipTemp = TooltipToJSON(armoryEquipment[i]["Tooltip"]);

      for (var j = 0; j < equipTemp.length; j++) {
        if (equipTemp[j]["type"].indexOf("ItemTitle") != "-1") {
          if (equipTemp[j]["value"]["qualityValue"] >= 0) {
            equipQuality += equipTemp[j]["value"]["qualityValue"];
            equipCount++;
          }
        }
      }
    }
    toolTipQuality = Math.round(equipQuality / equipCount * 10) / 10;
  }

  // 초월
  {
    var transcendence = "";
    var transcendenceTotal = 0;
    for (var i = 0; i < armoryEquipment.length; i++) {
      transcendenceTemp = TooltipToJSON(armoryEquipment[i]["Tooltip"]);
      for (var j = 0; j < transcendenceTemp.length; j++) {
        if (transcendenceTemp[j]["type"].indexOf("IndentStringGroup") != "-1") {
          if (transcendenceTemp[j]["value"] == null)
            continue;
          var _transcendenceTemp = transcendenceTemp[j]["value"]["Element_000"]["topStr"];
          if (_transcendenceTemp.indexOf("초월") != "-1") {
            transcendenceTotal += parseInt(_transcendenceTemp.replace(/.*?(\d+)\D*$/, '$1'));
          }
        }
      }
    }
    transcendence += "초월" + "(" + transcendenceTotal + ")";
  }

  // 엘릭서
  {
    var elixir = "";
    for (var i = 0; i < armoryEquipment.length; i++) {
      if (armoryEquipment[i]["Type"] == "투구") {
        var elixirTemp = TooltipToJSON(armoryEquipment[i]["Tooltip"]);
        for (var j = 0; j < elixirTemp.length; j++) {
          if (elixirTemp[j]["type"].indexOf("IndentStringGroup") != "-1") {
            if (elixirTemp[j]["value"] == null)
              continue;
            var _elixirTemp = elixirTemp[j]["value"]["Element_000"]["topStr"];
            if (_elixirTemp.indexOf("연성") != "-1") {
              elixir += _elixirTemp.replace(/연성 추가 효과\s*/g, '').replace(/\((\d+)단계\)/g, 'Lv.$1');;
            }
          }
        }
      }

    }
  }

  // 타이틀
  var _title = itemLevel + " / " + weapon + "\n" + expeditionLevel + " / " + characterLevel + " / " + toolTipQuality;

  // 각인
  {
    var _engravings = "";
    // Ark_On
    if (isArkPassive) {
      if(armoryEngraving == null){
        // 각인 설정 안한 경우
        _engravings += "미설정";
      }
      else{
        var arkPassiveEffects = armoryEngraving["ArkPassiveEffects"];
        var stone = "/ ";
        for (var i = 0; i < arkPassiveEffects.length; i++) {
          var effectName = arkPassiveEffects[i]["Name"].slice(0, 1);
          var effectLevel = arkPassiveEffects[i]["Level"];
          var effectGrade = arkPassiveEffects[i]["Grade"];
          if (effectGrade == "유물")
            effectGrade = ""
          else if (effectGrade == "전설")
            effectGrade = "전"
          else if (effectGrade == "영웅")
            effectGrade = "영"
  
          _engravings += effectName + effectGrade + effectLevel + " ";
  
          if (arkPassiveEffects[i]["AbilityStoneLevel"] != null) {
            stone += effectName + arkPassiveEffects[i]["AbilityStoneLevel"] + " ";
          }
        }
        _engravings += stone;
      }
    }
    // Ark_Off
    else {
      var engravings = armoryEngraving["Effects"];
      for (var i = 0; i < engravings.length; i++) {
        var engravingName = engravings[i]["Name"].slice(0, 1);
        var engravingValue = engravings[i]["Name"].slice(engravings[i]["Name"].length - 1, engravings[i]["Name"].length);
        _engravings += engravingName + engravingValue + " ";
      }
    }
  }

  var _stoneAtk = "+";
  //스톤 공증
  for (var i = 0; i < armoryEquipment.length; i++) {
    if (armoryEquipment[i]["Type"] == "어빌리티 스톤") {
      var stoneData = TooltipToJSON(armoryEquipment[i]["Tooltip"]);
      for (var j = 0; j < stoneData.length; j++) {
        var stoneDataType = stoneData[j]["type"];
        var stoneDataValue = stoneData[j]["value"];
        if (stoneDataType.indexOf("IndentStringGroup") != "-1") {
          if (typeof stoneDataValue === 'object' && stoneDataValue !== null) {
            if (stoneDataValue.hasOwnProperty("Element_001")) {
              var stoneAtkData = stoneDataValue["Element_001"]["contentStr"];
              if (typeof stoneAtkData === 'object' && stoneAtkData !== null) {
                if (stoneAtkData.hasOwnProperty("Element_003")) {
                  var stoneAtk = stoneAtkData["Element_003"]["contentStr"];
                  _stoneAtk += stoneAtk.slice(stoneAtk.length - 6, stoneAtk.length);
                }
                else {
                  _stoneAtk = "%";
                }
              }
            }
          }
        }
      }
    }
  }

  //보석
  {
    var _gems4 = "";
    var gems = armoryGem["Gems"];
    var _gemsDescription = armoryGem["Effects"]["Description"];
    var gemsDescription = "공증:";

    if (gems == null) {
      _gems4 = "쌀";
      if (_stoneAtk.length > 2)
        gemsDescription += _stoneAtk.slice(1, _stoneAtk.length);
      else
        gemsDescription = "";
    }
    else {
      gemsDescription += _gemsDescription.slice(_gemsDescription.length - 6, _gemsDescription.length - 2) + _stoneAtk;

      var damageGems = []; // 겁화계열 (광휘, 겁화, 멸화)
      var coolGems = [];   // 작열계열 (작열, 홍염)

      for (var i = 0; i < gems.length; i++) {
        var gemName = gems[i]["Name"];
        var gemLevel = gems[i]["Level"];

        if (gemName.indexOf("광휘") != -1 || gemName.indexOf("겁화") != -1) {
          damageGems.push(gemLevel);
        } else if (gemName.indexOf("멸화") != -1) {
          damageGems.push(gemLevel - 2);
        } else if (gemName.indexOf("작열") != -1) {
          coolGems.push(gemLevel);
        } else if (gemName.indexOf("홍염") != -1) {
          coolGems.push(gemLevel - 2);
        }
      }

      // 내림차순 정렬
      damageGems.sort(function (a, b) { return b - a; });
      coolGems.sort(function (a, b) { return b - a; });

      // 출력 형식 만들기
      var damageStr = damageGems.length > 0 ? damageGems.join(", ") : "";
      var coolStr = coolGems.length > 0 ? coolGems.join(", ") : "";
      _gems4 = damageStr + " / " + coolStr;
    }
  }

  //스탯
  {
    var _stats = "";
    var stats = armoryProfile["Stats"];
    var maxHp = "";
    var atk = "";
    var charStat = "";
    for (var i = 0; i < stats.length; i++) {
      if (stats[i]["Type"] == "최대 생명력")
        maxHp = stats[i]["Value"];
      else if (stats[i]["Type"] == "공격력")
        atk = stats[i]["Value"];
      else {
        if (parseInt(stats[i]["Value"]) >= 100)
          charStat += stats[i]["Type"] + " " + stats[i]["Value"] + " ";
      }
    }
    var evolutionName = arkPassive["Points"][0]["Name"].slice(0, 1);
    var evolutionValue = arkPassive["Points"][0]["Value"];
    var realizationName = arkPassive["Points"][1]["Name"].slice(0, 1);
    var realizationValue = arkPassive["Points"][1]["Value"];

    _stats += "공: " + atk + " " + "최생: " + maxHp + "\n" + evolutionName + ": " + evolutionValue + " " + realizationName + ": " + realizationValue + " ";
  }

  //카드
  {
    var cardEffect = "";
    var effect = armoryCard["Effects"][0]["Items"];
    cardEffect += effect[effect.length - 1]["Name"];
  }

  // 설명
  // var _description = characterclass + "/" + server + "/" + guildName + "\n" + transcendence + "/" + elixir;
  var _description = characterclass + " / " + server + " / " + elixir + " / " + transcendence;
  client.sendLink(room, {
    templateId: _templateId, //템플릿 아이디
    templateArgs: {
      header: characterName,
      title: _title,
      engravings: _engravings,
      gems4: _gems4,
      combatPower: _combatPower, 
      stat: _stats + gemsDescription,
      character: charStat,
      description: _description,
      card: cardEffect,
      illoa: characterName,
      image: getUrl,
      imageurl: imageString
    }
  }, 'custom').awaitResult();
}

// !악세 110874 95682
function kalingAcce(room, data) {
  var armoryProfile = data["ArmoryProfile"]; // 프로필정보
  var armoryEquipment = data["ArmoryEquipment"]; // 장비정보
  var arkPassive = armoryProfile["ArkPassive"]; // 아크패시브
  var isArkPassive = arkPassive["IsArkPassive"]; // 아크패시브 유무
  var characterName = armoryProfile["CharacterName"]; // 닉네임

  var neckData;
  var earringsData = [];
  var ringsData = [];
  var braceletData;
  var stoneData;

  // 부위별 Data 정리
  for (var i = 0; i < armoryEquipment.length; i++) {
    var acceTemp = TooltipToJSON(armoryEquipment[i]["Tooltip"]);
    for (var j = 0; j < acceTemp.length; j++) {
      if (typeof acceTemp[j]["value"] === 'object' && acceTemp[j]["value"] !== null) {
        if (acceTemp[j]["value"].hasOwnProperty("leftStr0")) {
          var part = acceTemp[j]["value"]["leftStr0"];
          if (part.indexOf("목걸이") != "-1") {
            neckData = acceTemp;
          }
          else if (part.indexOf("귀걸이") != "-1") {
            earringsData.push(acceTemp);
          }
          else if (part.indexOf("반지") != "-1") {
            ringsData.push(acceTemp);
          }
          else if (part.indexOf("스톤") != "-1") {
            stoneData = acceTemp;
          }
          else if (part.indexOf("팔찌") != "-1") {
            braceletData = acceTemp;
          }
        }
      }
    }
  }

  // 목걸이
  {
    var neckName = "";
    var neckQuality = "";
    var neckEffect = "";
    for (var i = 0; i < neckData.length; i++) {
      var neckDataType = neckData[i]["type"];
      var neckDataValue = neckData[i]["value"];

      // 이름, 품질, 이미지
      if (neckDataType.indexOf("ItemTitle") != "-1") {
        neckName = neckDataValue["leftStr0"];
        neckQuality = neckDataValue["qualityValue"];
      }
      // 아크 온
      if (isArkPassive) {
        if (neckDataType.indexOf("ItemPartBox") != "-1")
          // 효과
          if (neckDataValue["Element_000"].indexOf("연마") != "-1") {
            neckEffect = neckDataValue["Element_001"];
            neckEffect = changeStrForAcce(neckEffect);
          }
      }
      else {
        if (neckDataType.indexOf("ItemPartBox") != "-1") {
          // 특성
          if (neckDataValue["Element_000"].indexOf("추가") != "-1") {
            neckEffect += changeStrForAcceEffect(neckDataValue["Element_001"]);
          }
        }
        // 각인
        if (neckDataType.indexOf("IndentStringGroup") != "-1") {
          if (typeof neckDataValue === 'object' && neckDataValue !== null) {
            if (neckDataValue.hasOwnProperty("Element_000")) {
              var neckDataValueElementStr1 = neckDataValue["Element_000"]["contentStr"]["Element_000"]["contentStr"];
              var neckDataValueElementStr2 = neckDataValue["Element_000"]["contentStr"]["Element_001"]["contentStr"];
              var neckEngravig1 = neckDataValueElementStr1.slice(1, 2);
              var neckEngravig1Value = neckDataValueElementStr1.slice(neckDataValueElementStr1.length - 2, neckDataValueElementStr1.length - 1);
              var neckEngravig2 = neckDataValueElementStr2.slice(1, 2);
              var neckEngravig2Value = neckDataValueElementStr2.slice(neckDataValueElementStr2.length - 2, neckDataValueElementStr2.length - 1);
              neckEffect += " " + neckEngravig1 + neckEngravig1Value + " " + neckEngravig2 + neckEngravig2Value;
            }
          }
        }
      }
    }
    var _necklace = "";
    var _necklaceDesc = "";
    _necklace += "[" + neckQuality + "] " + neckName;
    // [깨:" + neckPoint + "]";
    _necklaceDesc += neckEffect;
  }

  // 귀걸이
  {
    var earringName = [];
    var earringQuality = [];
    var earringPoint = [];
    var earringEffect = [];
    var earringEngraving = [];
    var earringImage = [];
    for (k = 0; k < earringsData.length; k++) {
      for (var i = 0; i < earringsData[k].length; i++) {
        var earringData = earringsData[k];
        var earringsDataType = earringData[i]["type"];
        var earringsDataValue = earringData[i]["value"];

        // 이름, 이미지
        if (earringsDataType.indexOf("NameTagBox") != "-1")
          earringName.push(earringsDataValue);
        // 품질
        if (earringsDataType.indexOf("ItemTitle") != "-1") {
          earringQuality.push(earringsDataValue["qualityValue"]);
          earringImage.push(earringsDataValue["slotData"]["iconPath"]);
        }
        // 아크 온
        if (isArkPassive) {
          if (earringsDataType.indexOf("ItemPartBox") != "-1")
            // 효과
            if (earringsDataValue["Element_000"].indexOf("연마") != "-1") {
              earringEffect.push(changeStrForAcce(earringsDataValue["Element_001"]));
            }
          // 포인트
          // if(neckDataValue["Element_000"].indexOf("포인트") != "-1")
          //   neckPoint = neckDataValue["Element_001"].replace(/깨달음 \+/gi, "");
        }
        else {
          if (earringsDataType.indexOf("ItemPartBox") != "-1") {
            // 특성
            if (earringsDataValue["Element_000"].indexOf("추가") != "-1") {
              earringEffect.push(changeStrForAcceEffect(earringsDataValue["Element_001"]));
            }
          }
          // 각인
          if (earringsDataType.indexOf("IndentStringGroup") != "-1") {
            if (typeof earringsDataValue === 'object' && earringsDataValue !== null) {
              if (earringsDataValue.hasOwnProperty("Element_000")) {
                var earringsDataValueElementStr1 = earringsDataValue["Element_000"]["contentStr"]["Element_000"]["contentStr"];
                var earringsDataValueElementStr2 = earringsDataValue["Element_000"]["contentStr"]["Element_001"]["contentStr"];
                var earringsEngravig1 = earringsDataValueElementStr1.slice(1, 2);
                var earringsEngravig1Value = earringsDataValueElementStr1.slice(earringsDataValueElementStr1.length - 2, earringsDataValueElementStr1.length - 1);
                var earringsEngravig2 = earringsDataValueElementStr2.slice(1, 2);
                var earringsEngravig2Value = earringsDataValueElementStr2.slice(earringsDataValueElementStr2.length - 2, earringsDataValueElementStr2.length - 1);
                earringEngraving.push(" " + earringsEngravig1 + earringsEngravig1Value);
                earringEngraving.push(" " + earringsEngravig2 + earringsEngravig2Value);
              }
            }
          }
        }
      }
    }
    var _earring1 = "";
    var _earring2 = "";
    var _earring1Desc = "";
    var _earring2Desc = "";
    var _earring1Img = "";
    var _earring2Img = "";
    _earring1 += "[" + earringQuality[0] + "] " + earringName[0];
    _earring2 += "[" + earringQuality[1] + "] " + earringName[1];
    // [깨:" + neckPoint + "]";
    if (isArkPassive) {
      _earring1Desc += earringEffect[0];
      _earring2Desc += earringEffect[1];
    }
    else {
      _earring1Desc += earringEffect[0] + earringEngraving[0] + earringEngraving[1];
      _earring2Desc += earringEffect[1] + earringEngraving[2] + earringEngraving[3];
    }
    _earring1Img = earringImage[0];
    _earring2Img = earringImage[1];
  }

  // 반지
  {
    var ringName = [];
    var ringQuality = [];
    var ringPoint = [];
    var ringEffect = [];
    var ringEngraving = [];
    var ringImage = [];
    for (k = 0; k < ringsData.length; k++) {
      for (var i = 0; i < ringsData[k].length; i++) {
        var ringData = ringsData[k];
        var ringsDataType = ringData[i]["type"];
        var ringsDataValue = ringData[i]["value"];

        // 이름, 이미지
        if (ringsDataType.indexOf("NameTagBox") != "-1")
          ringName.push(ringsDataValue);
        // 품질
        if (ringsDataType.indexOf("ItemTitle") != "-1") {
          ringQuality.push(ringsDataValue["qualityValue"]);
          ringImage.push(ringsDataValue["slotData"]["iconPath"]);
        }
        // 아크 온
        if (isArkPassive) {
          if (ringsDataType.indexOf("ItemPartBox") != "-1")
            // 효과
            if (ringsDataValue["Element_000"].indexOf("연마") != "-1") {
              ringEffect.push(changeStrForAcce(ringsDataValue["Element_001"]));
            }
          // 포인트
          // if(neckDataValue["Element_000"].indexOf("포인트") != "-1")
          //   neckPoint = neckDataValue["Element_001"].replace(/깨달음 \+/gi, "");
        }
        else {
          if (ringsDataType.indexOf("ItemPartBox") != "-1") {
            // 특성
            if (ringsDataValue["Element_000"].indexOf("추가") != "-1") {
              ringEffect.push(changeStrForAcceEffect(ringsDataValue["Element_001"]));
            }
          }
          // 각인
          if (ringsDataType.indexOf("IndentStringGroup") != "-1") {
            if (typeof ringsDataValue === 'object' && ringsDataValue !== null) {
              if (ringsDataValue.hasOwnProperty("Element_000")) {
                var ringsDataValueElementStr1 = ringsDataValue["Element_000"]["contentStr"]["Element_000"]["contentStr"];
                var ringsDataValueElementStr2 = ringsDataValue["Element_000"]["contentStr"]["Element_001"]["contentStr"];
                var ringsEngravig1 = ringsDataValueElementStr1.slice(1, 2);
                var ringsEngravig1Value = ringsDataValueElementStr1.slice(ringsDataValueElementStr1.length - 2, ringsDataValueElementStr1.length - 1);
                var ringsEngravig2 = ringsDataValueElementStr2.slice(1, 2);
                var ringsEngravig2Value = ringsDataValueElementStr2.slice(ringsDataValueElementStr2.length - 2, ringsDataValueElementStr2.length - 1);
                ringEngraving.push(" " + ringsEngravig1 + ringsEngravig1Value);
                ringEngraving.push(" " + ringsEngravig2 + ringsEngravig2Value);
              }
            }
          }
        }
      }
    }
    var _ring1 = "";
    var _ring2 = "";
    var _ring1Desc = "";
    var _ring2Desc = "";
    var _ring1Img = "";
    var _ring2Img = "";
    _ring1 += "[" + ringQuality[0] + "] " + ringName[0];
    _ring2 += "[" + ringQuality[1] + "] " + ringName[1];
    if (isArkPassive) {
      _ring1Desc += ringEffect[0];
      _ring2Desc += ringEffect[1];
    }
    else {
      _ring1Desc += ringEffect[0] + ringEngraving[0] + ringEngraving[1];;
      _ring2Desc += ringEffect[1] + ringEngraving[0] + ringEngraving[1];;
    }
    _ring1Img = ringImage[0];
    _ring2Img = ringImage[1];
  }

  // 어빌리티 스톤
  {
    var stoneName = "";
    var stoneEffect = "";
    var stoneImage = "";
    for (var i = 0; i < stoneData.length; i++) {
      var stoneDataType = stoneData[i]["type"];
      var stoneDataValue = stoneData[i]["value"];

      // 이름
      if (stoneDataType.indexOf("NameTagBox") != "-1")
        stoneName = stoneDataValue;
      // 이미지
      if (stoneDataType.indexOf("ItemTitle") != "-1")
        stoneImage = stoneDataValue["slotData"]["iconPath"];
      // 각인
      if (stoneDataType.indexOf("IndentStringGroup") != "-1") {
        if (typeof stoneDataValue === 'object' && stoneDataValue !== null) {
          if (stoneDataValue.hasOwnProperty("Element_000")) {
            var stoneDataValueElementStr1 = stoneDataValue["Element_000"]["contentStr"]["Element_000"]["contentStr"];
            var stoneDataValueElementStr2 = stoneDataValue["Element_000"]["contentStr"]["Element_001"]["contentStr"];
            var stoneAtk = stoneDataValue["Element_001"]["contentStr"]["Element_003"]["contentStr"];
            var _stoneAtk = stoneAtk.slice(stoneAtk.length - 6, stoneAtk.length);
            var stoneEngravig1 = stoneDataValueElementStr1.slice(1, 2);
            var stoneEngravig1Value = stoneDataValueElementStr1.slice(stoneDataValueElementStr1.length - 2, stoneDataValueElementStr1.length - 1);
            var stoneEngravig2 = stoneDataValueElementStr2.slice(1, 2);
            var stoneEngravig2Value = stoneDataValueElementStr2.slice(stoneDataValueElementStr2.length - 2, stoneDataValueElementStr2.length - 1);
            stoneEffect += " " + stoneEngravig1 + stoneEngravig1Value + " " + stoneEngravig2 + stoneEngravig2Value;
          }
        }
      }
    }
    var _stone = "";
    var _stoneDesc = "";
    _stone += stoneName;
    _stoneDesc += stoneEffect;
  }

  // 팔찌
  {
    var braceletName = "";
    var braceletEffect = "";
    var braceletImage = "";
    for (var i = 0; i < braceletData.length; i++) {
      var braceletDataType = braceletData[i]["type"];
      var braceletDataValue = braceletData[i]["value"];

      // 이름
      if (braceletDataType.indexOf("NameTagBox") != "-1")
        braceletName = braceletDataValue;
      // 이미지
      if (braceletDataType.indexOf("ItemTitle") != "-1")
        braceletImage = braceletDataValue["slotData"]["iconPath"];
      // 각인
      if (braceletDataType.indexOf("ItemPartBox") != "-1") {
        braceletEffect += changeStrForBracelet(braceletDataValue["Element_001"]);
      }
    }
    var _bracelet = "";
    var _braceletDesc = "";
    _bracelet += braceletName;
    _braceletDesc += braceletEffect;
  }
  client.sendLink(room, {
    templateId: 110874, //템플릿 아이디
    templateArgs: {
      header: characterName,
      neck: _necklace,
      neckDesc: _necklaceDesc,
      earrings1: _earring1,
      earringsDesc1: _earring1Desc,
      earrings2: _earring2,
      earringsDesc2: _earring2Desc,
      rings1: _ring1,
      ringsDesc1: _ring1Desc,
      rings2: _ring2,
      ringsDesc2: _ring2Desc,
      illoa: characterName,
      totalQuality: "",
    }
  }, 'custom');
  // client.sendLink(room, {
  //   templateId: 95682, //템플릿 아이디
  //   templateArgs: {
  //     header: characterName,
  //     stone: _stone,
  //     stoneDesc: _stoneDesc,
  //     stoneimg: stoneImage,
  //     bracelet: '',
  //     braceletDesc: _braceletDesc,
  //     braceletimg: braceletImage,
  //     illoa: characterName,
  //   }
  // }, 'custom');
}

// Data 분기
function Info(_urlArr, _command) {
  switch (_command) {
    case "!정보":
      resultData = getAPI(_urlArr[0]);
      break;
    // case "!악세":
    //   resultData = getAPI(_urlArr[0]);
    //   break;
  }
  return resultData;
}

// Data 가공
function checkInputForData(_command, _urlArr, _searchName) {
  var resultData;

  switch (_command) {
    case "!정보":
      resultData = Info(_urlArr, _command);
      break;
    // case "!악세":
    //   resultData = Info(_urlArr, _command);
    //   break;
  }
  return resultData;
}

// Null Data 처리
function nullData(_command) {
  var _nullData = "";

  switch (_command) {
    // case "!배럭":
    //   _nullData = "안함";
    //   break;
    // case "!부캐":
    //   _nullData = "안함";
    //   break;
    // case "!ㅂㅋ":
    //   _nullData = "안함";
    //   break;
    // case "!ㅂㄹ":
    //   _nullData = "안함";
    //   break;
    // case "!원정대":
    //   _nullData = "안함";
    //   break;
    // case "!ㅇㅈㄷ":
    //   _nullData = "안함";
    //   break;
    case "!정보":
      _nullData = "안함";
      break;
    // case "!보석":
    //   _nullData = "쌀";
    //   break;
    // case "!아바타":
    //   break;
    // case "!스킬":
    //   _nullData = "평타맨";
    //   break;
    // case "!장비":
    //   _nullData = "알몸";
    //   break;
    // case "!악세":
    //   _nullData = "그지";
    //   break;
    // case "!각인":
    //   _nullData = "응애";
    //   break;
    // case "!내실":
    //   _nullData = "응애";
    //   break;
    // case "!유각":
    //   _nullData = "장사안함";
    //   break;
    // case (_command.indexOf("가격") != "-1" && _command.indexOf("!") == 0) ? _command : "입1력2방3지4방5지6":
    //   _nullData = "안팜";
    //   break;
  }
  return _nullData;
}

// 다중 URL 생성
function checkInputForURL(_command, searchName) {
  var _urlArr = [];
  usingKaling = false;

  switch (_command) {
    case "!정보":
      _urlArr.push(makeURIget(1, 14, searchName));
      usingKaling = true;
      kalingTpye = "정보";
      break;
    // case "!악세":
    //   _urlArr.push(makeURIget(1, 14, searchName));
    //   usingKaling = true;
    //   kalingTpye = "악세";
    //   break;
  }
  return _urlArr;
}

// 카카오링크 템플릿
function checkTemplatesKakaolink(_kalingTpye, room, data) {
  switch (_kalingTpye) {
    case "정보":
      kalingInfo(room, data);
      break;
    // case "악세":
    //   kalingAcce(room, data);
    //   break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
  }
}

// get URL 생성
function makeURIget(_urlF, _urlB, searchName) {
  var _url = "";
  _url = apiURLF[_urlF] + searchName + apiURLB[_urlB];

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

// getImage
function getImage(text) {
  var doc = "https://lostark.game.onstove.com/Profile/Character/" + text;

  var response = org.jsoup.Jsoup.connect(doc)
    .ignoreContentType(true)
    .ignoreHttpErrors(true)
    .get().select("div.profile-equipment__character img").attr("src");

  return response;
}

// getZloa
function getZloa(text) {
  var doc = "https://zloa.net/char/" + "성하";

  var response = org.jsoup.Jsoup.connect(doc)
    .ignoreContentType(true)
    .ignoreHttpErrors(true)
    .get().select("div.app table tbody tr td.font-bold").first();
  // .get().select("div.profile-equipment__character img").attr("src");

  return response;
}

//getZloaAPI
function getZloaAPI(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  var doc = "https://zloa.net/char/" + "성하";

  // 페이지에서 데이터를 가져옵니다.
  var response = org.jsoup.Jsoup.connect(doc)
    .ignoreContentType(true)
    .ignoreHttpErrors(true)
    .get();

  // "딜러 환산 점수"에 해당하는 <td> 태그의 숫자를 가져옵니다.
  var dealerScoreValue = response.select("th:contains(딜러 환산 점수)").next("td").text();

  // 디버그 로그를 추가하여 값을 확인합니다.
  // Log.debug("TEST1", true);
  // Log.debug("value = " + dealerScoreValue, true);
  // Log.debug("TEST2", true);
  // replier.reply(dealerScoreValue);
  // replier.reply(dealerScoreValue); // 응답 메시지로 딜러 환산 점수 값 전송
  return dealerScoreValue;
}
// function getZloaAPI(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
//   var doc = "https://zloa.net/char/" + "성하";

//   // 페이지에서 데이터를 가져옵니다.
//   var response = org.jsoup.Jsoup.connect(doc)
//       .ignoreContentType(true)
//       .ignoreHttpErrors(true)
//       .get();

//   // 전체 HTML 내용을 출력하여 구조를 확인합니다.
//   var htmlContent = response.html();
//   Log.debug("HTML Content:\n" + htmlContent, true);

//   return "";
// }

function TooltipToJSON(tooltipString) {
  try {
    // 1. 전달받은 문자열을 직접 파싱
    var tooltipObj = JSON.parse(tooltipString);

    // 2. Element들을 배열로 변환
    var elements = [];
    var elementKeys = Object.keys(tooltipObj).sort();

    for (var i = 0; i < elementKeys.length; i++) {
      var key = elementKeys[i];
      if (key.startsWith('Element_')) {
        var element = tooltipObj[key];
        if (element !== null) {
          elements.push(element);
        }
      }
    }

    return elements;

  } catch (e) {
    Log.error(e, true);
    Log.error("원본 데이터:" + tooltipString, true);
    return null;
  }
}

function changeStrForAcce(data) {
  var accessory = data;
  var accessory1 = accessory.replace(/추가 피해 \+/gi, " 추피");
  var accessory2 = accessory1.replace(/적에게 주는 피해 \+/gi, " 적주피");
  var accessory3 = accessory2.replace(/무기 공격력 \+/gi, " 무공");
  var accessory4 = accessory3.replace(/세레나데, 신앙, 조화 게이지 획득량 \+/gi, " 아획량");
  var accessory5 = accessory4.replace(/최대 생명력 \+/gi, " 최생");
  var accessory6 = accessory5.replace(/최대 마나 \+/gi, " 최마");
  var accessory7 = accessory6.replace(/상태이상 공격 지속시간 \+/gi, " 상공지");
  var accessory8 = accessory7.replace(/전투 중 생명력 회복량 \+/gi, " 생회");
  var accessory9 = accessory8.replace(/파티원 회복 효과 \+/gi, " 파회");
  var accessory10 = accessory9.replace(/파티원 보호막 효과 \+/gi, " 파보");
  var accessory11 = accessory10.replace(/치명타 적중률 \+/gi, " 치적");
  var accessory12 = accessory11.replace(/치명타 피해 \+/gi, " 치피");
  var accessory13 = accessory12.replace(/아군 공격력 강화 효과 \+/gi, " 아공");
  var accessory14 = accessory13.replace(/아군 피해량 강화 효과 \+/gi, " 아피");
  var accessory15 = accessory14.replace(/공격력 \+/gi, " 공격력");
  var accessory16 = accessory15.replace(/낙인력 \+/gi, " 낙인력");
  var accessory17 = accessory16.replace(/%/gi, "");

  return accessory17;
}

function changeStrForAcceEffect(data) {
  var accessory = data;
  var accessory1 = accessory.replace(/특화 \+/gi, " 특화");
  var accessory2 = accessory1.replace(/치명 \+/gi, " 치명");
  var accessory3 = accessory2.replace(/제압 \+/gi, " 제압");
  var accessory4 = accessory3.replace(/신속 \+/gi, " 신속");
  var accessory5 = accessory4.replace(/인내 \+/gi, " 인내");
  var accessory6 = accessory5.replace(/숙련 \+/gi, " 숙련");
  var accessory7 = accessory6.replace(/%/gi, "");

  return accessory7;
}

function changeStrForBracelet(data) {
  var bracelet = data;
  var bracelet1 = bracelet.replace(/특화 \+/gi, " 특화");
  var bracelet2 = bracelet1.replace(/치명 \+/gi, " 치명");
  var bracelet3 = bracelet2.replace(/제압 \+/gi, " 제압");
  var bracelet4 = bracelet3.replace(/신속 \+/gi, " 신속");
  var bracelet5 = bracelet4.replace(/인내 \+/gi, " 인내");
  var bracelet6 = bracelet5.replace(/숙련 \+/gi, " 숙련");
  var bracelet7 = bracelet6.replace(/체력 \+/gi, " 체력");
  var bracelet8 = bracelet7.replace(/힘 \+/gi, " 힘");
  var bracelet9 = bracelet8.replace(/민첩 \+/gi, " 민첩");
  var bracelet10 = bracelet9.replace(/지능 \+/gi, " 지능");
  var bracelet11 = bracelet10.replace(/최대 생명력 \+/gi, "최생");
  var bracelet12 = bracelet11.replace(/최대 마나 \+/gi, " 마나");
  var bracelet13 = bracelet12.replace(/물리 방어력 \+/gi, " 물방");
  var bracelet14 = bracelet13.replace(/마법 방어력 \+/gi, " 마방");
  var bracelet15 = bracelet14.replace(/전투 중 생명력 회복량 \+/gi, " 생회");
  var bracelet16 = bracelet15.replace(/무기 공격력 \+/gi, " 무공");
  var bracelet17 = bracelet16.replace(/기상기 사용 후 4초 동안 인내가/gi, "");
  var bracelet18 = bracelet17.replace(/이동기 사용 후 4초 동안 신속이/gi, "");
  var bracelet19 = bracelet18.replace(/이동기 사용 후 4초 동안 제압이/gi, "");
  var bracelet20 = bracelet19.replace(/기본 공격 적중 후 4초 동안 숙련이/gi, "");
  var bracelet21 = bracelet20.replace(/마나를 소모하는 스킬 사용 시 20% 확률로 마나를/gi, "");
  var bracelet22 = bracelet21.replace(/몬스터에게 피격 시/gi, "");
  var bracelet23 = bracelet22.replace(/확률로 8초 동안 '속공' 효과를 획득한다. 속공: 무기 공격력이 1000, 공격속도가 2%, 이동속도가 2% 상승한다. (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet24 = bracelet23.replace(/배틀 아이템 사용 후 8초 동안 무기 공격력이/gi, "");
  var bracelet25 = bracelet24.replace(/증가한다. (재사용 대기시간 30초)/gi, "");
  var bracelet26 = bracelet25.replace(/생명력이/gi, "");
  var bracelet27 = bracelet26.replace(/이하일 경우 몬스터에게 피격 시 10초 후 체력 반전이 일어난다 (재사용 대기시간 900초) (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet28 = bracelet27.replace(/60레벨 이하 시드 등급 이하 몬스터에게 주는 피해량이/gi, "");
  var bracelet29 = bracelet28.replace(/60레벨 이하 시드 등급 몬스터에게 받는 피해량이/gi, "");
  var bracelet30 = bracelet29.replace(/감소한다. (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet31 = bracelet30.replace(/기상기 사용 후 20초 동안 매 초마다 생명력을/gi, "");
  var bracelet32 = bracelet31.replace(/회복한다./gi, "");
  var bracelet33 = bracelet32.replace(/생명력이 50% 이하일 경우 몬스터에게 피격 시 30% 확률로 생명력을/gi, "");
  var bracelet34 = bracelet33.replace(/회복한다. (재사용 대기시간 120초)/gi, "");
  var bracelet35 = bracelet34.replace(/생명력이 30% 이하에서 피격 시 5초 동안 회복 배틀 아이템의 회복량을/gi, "");
  var bracelet36 = bracelet35.replace(/추가 시켜주는 효과를 획득한다. (재사용 대기시간 120초)/gi, "");
  var bracelet37 = bracelet36.replace(/배틀 아이템 중 회복계열 사용 시/gi, "");
  var bracelet38 = bracelet37.replace(/확률로 효과가 한번 더 발동된다./gi, "");
  var bracelet39 = bracelet38.replace(/몬스터에게 공격 적중 시 8초 동안 '쐐기' 효과를 획득한다. 쐐기: 공격 적중 시 피해량이/gi, "");
  var bracelet40 = bracelet39.replace(/증가한다. (최대 4중첩, 발동 재사용 대기시간 2초) (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet41 = bracelet40.replace(/몬스터에게 공격 적중 시 8초 동안 '망치' 효과를 획득한다. '강철 쐐기' 효과를 보유 시 치명타 피해가 8% 추가 증가한다. 망치: 공격 적중 시 치명타 피해량이/gi, "");
  var bracelet42 = bracelet41.replace(/몬스터에게 공격 적중 시 30초 동안 '순환' 효과를 획득한다. 해당 효과는 갱신되지 않는다.순환: 10초 간격으로 스킬 피해/gi, "");
  var bracelet43 = bracelet42.replace(/증가, 치명타 적중률/gi, "");
  var bracelet44 = bracelet43.replace(/증가, 치명타 피해 /gi, "");
  var bracelet45 = bracelet44.replace(/증가 효과가 순차적으로 적용된다. (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet46 = bracelet45.replace(/자신의 생명력이 40% 이상일 경우 적에게 공격 적중 시 3초 동안 '열정' 효과를 획득한다. 열정: 몬스터에게 주는 피해가/gi, "");
  var bracelet47 = bracelet46.replace(/자신의 생명력이 80% 이하일 경우 적에게 공격 적중 시 3초 동안 '냉정' 효과를 획득한다. '냉정' 효과를 보유 중 일 때 '열정' 효과가 1% 추가 증가한다. 열정: 몬스터에게 주는 피해가 /gi, "");
  var bracelet48 = bracelet47.replace(/몬스터에게 공격 적중 시 8초 동안 대상의 방어력을/gi, "");
  var bracelet49 = bracelet48.replace(/감소시킨다. '비수' 효과는 하나의 대상에게 최대 1개만 적용된다.(60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet50 = bracelet49.replace(/몬스터에게 공격 적중 시 8초 동안 대상의 치명타 저항을/gi, "");
  var bracelet51 = bracelet50.replace(/감소시킨다. '약점 노출' 효과는 하나의 대상에게 최대 1개만 적용된다. (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet52 = bracelet51.replace(/몬스터에게 공격 적중 시 8초 동안 스킬 적중 시 아이덴티티 게이지 획득량이/gi, "");
  var bracelet53 = bracelet52.replace(/파티 효과로 보호 효과(보호막, 생명력 회복, 받는 피해 감소)가 적용된 대상에게 5초 동안 '응원' 효과가 적용된다. 응원: 몬스터에게 공격 적중 시 주는 피해가/gi, "");
  var bracelet54 = bracelet53.replace(/공격 적중 시 3%의 확률로 60초 간 '정기' 효과를 부여한다. 정기: 무기 공격력이/gi, "");
  var bracelet55 = bracelet54.replace(/증가한다. (최대 10중첩)/gi, "");
  var bracelet56 = bracelet55.replace(/치명타가 발생할 경우 10초 동안 '보상' 효과를 획득한다. (발동 재사용 대기시간 2초) 보상 효과가/gi, "");
  var bracelet57 = bracelet56.replace(/중첩이 되면 다음 공격 시 대상에게 강력한 피해를 입힌다./gi, "");
  var bracelet58 = bracelet57.replace(/몬스터에게 공격 적중 시 주는 피해가/gi, "");
  var bracelet59 = bracelet58.replace(/몬스터에게 공격 적중 시 치명타 피해량이/gi, "");
  var bracelet60 = bracelet59.replace(/몬스터에게 공격 적중 시 치명타 적중이/gi, "");
  var bracelet61 = bracelet60.replace(/몬스터에게 치명타 적중 시/gi, "");
  var bracelet62 = bracelet61.replace(/확률로 각성기를 제외한 치명타 피해가 100% 증가한다. (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet63 = bracelet62.replace(/몬스터에게 공격 적중 시 일정 확률로 10초 동안 '분개' 효과를 획득한다./gi, "");
  var bracelet64 = bracelet63.replace(/중첩 상태일 경우, 각성기를 제외한 다음 공격은 반드시 치명타가 발생되며 '분개' 버프는 제거된다. (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet65 = bracelet64.replace(/백어택으로 주는 피해가/gi, "");
  var bracelet66 = bracelet65.replace(/헤드어택으로 주는 피해가/gi, "");
  var bracelet67 = bracelet66.replace(/몬스터에게 기본 공격 적중 시 06초 동안 '적립' 효과를 획득한다. 해당 효과 10중첩 시 3초 동안 '만기도래' 효과로 변경된다. (발동 재사용 대기시간 60초) 만기도래: 각성기 제외 일반 스킬 치명타 피해량이/gi, "");
  var bracelet68 = bracelet67.replace(/증가한다. (60레벨 초과 몬스터에게는 효과 감소)/gi, "");
  var bracelet69 = bracelet68.replace(/증가한다./gi, "");

  return bracelet69;
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