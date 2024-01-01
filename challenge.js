const scriptName = "challenge.js";

var sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();    //절대경로
var filepathCallendarRaw = "/storage/emulated/0/msgbot/Bots/db/challengeBot/callendar_raw/";
var filepathCallendarEmoji = "/storage/emulated/0/msgbot/Bots/db/challengeBot/callendar_emoji/";
var filepathEphWeekList = "/storage/emulated/0/msgbot/Bots/db/challengeBot/ephlist/";
var filepathSave = "/storage/emulated/0/msgbot/Bots/db/challengeBot/userData/";
var filepathList = "/storage/emulated/0/msgbot/Bots/db/challengeBot/list/"
var rawSuffix = "월_raw.csv";
var emojiSuffix = "월_emoji.csv";
var inputProof = ["#ㅊㅋ", "#체크","#ㅎㅈ","#해제","ㅈㅎ","조회","#ㅈㅎ","#조회","ㅊㅋ","체크","ㅎㅈ","해제"];
var outputSuffix = ["님 체크완료👏","님 해제완료🙂","월 조회결과🤗","년 조회결과😊"];
var roomName = "";
var ephListPick = ["김다인","김성준","김채연","박현규","박지수","안찬울","이예은","이하나","이한민","이한은","임찬웅","장수빈","장은혜","조은경"];
var newList = [];
ephListPick = ephListPick.concat(newList);
var ephTotalUser = ephListPick.length;
var ephLastList = ["아무개"];
var r ;

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    r = replier;
    // msg 공백제거
    msg = trimSpace(msg);
    roomName = room;
    var isChallenge = false;

    if(msg.charAt(0)=='#'){
        isChallenge = true;
    }
    // 목록
    if(msg == inputProof[9]+"키워드"){
        checkInfo(replier);
        var list2 = read(filepathList,"dainmsg.csv");
        var help2 = "";

        for(var i=0 ; i<list2.length ; i++){
            help2+= list2[i] + "\n";
        }
        replier.reply(help2);
    }

    // 체크
    if(msg == inputProof[0] || msg == inputProof[1]){
        var date = new Date();
        var month = getMonth(date);
        var day = getDay(date);
        var data = checkProof(month, day, sender,replier); // 달력
        var filename = senderFileName(sender,month);
        save(filepathSave+sender+"/",filename,data);

        var printData = printInfo(sender,month);
        replier.reply(sender+outputSuffix[0]);
        replier.reply(month+"월\n"+printData);
        sendCongratMsg(month, sender, replier)
    }

    // 해제
    if(msg ==  inputProof[2] || msg == inputProof[3]){
        var date = new Date();
        var month = getMonth(date);
        var day = getDay(date);
        var data = cancelProof(month, day, sender, replier); // 달력
        var filename = senderFileName(sender,month);
        save(filepathSave+sender+"/",filename,data);

        var printData = printInfo(sender,month);
        replier.reply(sender+outputSuffix[1]);
        replier.reply(month+"월\n"+printData);

    }

    var viewMonthFlag = false;
    var viewDayFlag = false;
    var viewYearFlag = false;

    if(msg=="#월조회" || msg == "#월ㅈㅎ"){
        replier.reply("'#N월 ㅈㅎ'으로 입력해주세요.\n" +"  예시 : #3월 ㅈㅎ");
    } else if(msg == "#월일체크" || msg == "#월일ㅊㅋ"){
        replier.reply("'#N월 N일 ㅊㅋ'으로 입력해주세요.\n" +"  예시 : #12월 25일 ㅊㅋ");
    } else if(msg == "#월일해제" || msg == "#월일ㅎㅈ"){
        replier.reply("'#N월 N일 ㅎㅈ'으로 입력해주세요.\n" + "  예시 : #12월 25일 ㅎㅈ");
    } else if(msg == "#월일조회" || msg == "#월일ㅈㅎ"){
        replier.reply("'#N월 ㅈㅎ'으로 입력해주세요.\n" +"  예시 : #3월 ㅈㅎ");
    } else if(msg == "#월-일체크" || msg == "#월-일ㅊㅋ"){
      replier.reply("'#N월 N-N일 ㅊㅋ'으로 입력해주세요.\n"+"예시 : #12월 1-25일 ㅊㅋ");
    } else if(msg.includes("일#")){
        replier.reply("입력하신 키워드를 확인해주세요.");
        checkExample(replier);
    } else if(msg.includes("#")&&msg.includes("월")&&!msg.includes("일")){
        viewMonthFlag = true;
    } else if(msg.includes("#")&&msg.includes("월")&&msg.includes("일")) {
        viewDayFlag = true;
    } else if(msg.includes("#")&&msg.includes("년")) {
        viewYearFlag = true;
    }

    try {
        // 특정 달의 체크 현황 보기
        if (viewMonthFlag && (msg.includes(inputProof[4]) || msg.includes(inputProof[5])) && msg.length <7 && isChallenge) {
            var msgArr = msg.split("월");
            var month = msgArr[0].substring(1, msgArr[0].length);
            var printData = printInfo(sender, month);
            replier.reply(sender + "님 " + month + outputSuffix[2]);
            replier.reply(month + "월\n" + printData);
        }

        // 이번달의 체크 현황 보기
        if (msg == inputProof[6] || msg == inputProof[7]) {
            var date = new Date();
            var month = getMonth(date);
            var printData = printInfo(sender, month);
            replier.reply(sender + "님 " + month + outputSuffix[2]);
            replier.reply(month + "월\n" + printData);
        }

        // 특정 연도의 체크 현황 보기
        if (viewYearFlag && (msg.includes(inputProof[4]) || msg.includes(inputProof[5])) && msg.length <9 && isChallenge) {
            var msgArr = msg.split("년");
            var year = msgArr[0].substring(1, msgArr[0].length);
            var month = 1;
            replier.reply(sender + "님 " + year + outputSuffix[3]);
            for(var month = 1; month <= 12 ; month ++) {
                var printData = printInfoByYear(sender, year, month, replier);
                replier.reply(month + "월\n" + printData);
            }
        }

        // 특정 날짜 체크
        if (viewDayFlag && (msg.includes(inputProof[8]) || msg.includes(inputProof[9])) && !msg.includes("-") && msg.length <10 && isChallenge) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var day = msgArr2[0].substring(0, msgArr2[0].length);
            var data = checkProof(month, day, sender, replier); // 달력

            if(data === ""|| !month || !day ){
                replier.reply("입력하신 월 또는 일을 확인해주세요.");
                checkExample(replier);
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);

                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[0]);
                replier.reply(month + "월\n" + printData);
                sendCongratMsg(month, sender, replier);
            }
        }

        // 특정 날짜 체크 해제
        if (viewDayFlag && (msg.includes(inputProof[10]) || msg.includes(inputProof[11])) && !msg.includes("-") && msg.length <10 && isChallenge) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var day = msgArr2[0].substring(0, msgArr2[0].length);
            var data = cancelProof(month, day, sender, replier); // 달력

            if(data === "" || !month || !day){
                replier.reply("입력하신 월 또는 일을 확인해주세요.");
                checkExample(replier);
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);
                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[1]);
                replier.reply(month + "월\n" + printData);
            }
        }

        // 연속된 날짜 체크
        if (viewDayFlag && (msg.includes(inputProof[8]) || msg.includes(inputProof[9])) && msg.includes("-") && msg.length <14 && isChallenge) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var msgArr3 = msgArr2[0].split("-");
            var firstday = msgArr3[0];
            var lastday = msgArr3[1];

            if(!month || !firstday || !lastday || Number(firstday) > Number(lastday)){
                replier.reply("입력하신 월 또는 일을 확인해주세요.");
                checkExample(replier);
                return;
            }

            var data = checkMultiProof(month, firstday, lastday, sender, replier);

            if(data === ""){
                replier.reply("입력하신 월 또는 일을 확인해주세요.");
                checkExample(replier);
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);
                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[0]);
                replier.reply(month + "월\n" + printData);
                sendCongratMsg(month, sender, replier);
            }
        }

        // 연속된 날짜 체크해제
        if (viewDayFlag && (msg.includes(inputProof[10]) || msg.includes(inputProof[11])) && msg.includes("-")  && msg.length <14 && isChallenge) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var msgArr3 = msgArr2[0].split("-");
            var firstday = msgArr3[0];
            var lastday = msgArr3[1];

            if(!month || !firstday || !lastday || firstday > lastday){
                replier.reply("입력하신 월 또는 일을 확인해주세요.");
                checkExample(replier);
                return;
            }

            var data = cancelMultiProof(month, firstday, lastday, sender, replier);
            if(data === ""){
                replier.reply("입력하신 월 또는 일을 확인해주세요.");
                checkExample(replier);
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);
                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[1]);
                replier.reply(month + "월\n" + printData);
            }
        }

        // N월 N주 인증결과
        // ----- 에바다 리더를 위한 키워드
        if(msg.includes("주인증결과")){
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(0, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("주");
            var week = msgArr2[0];

            replier.reply(printEphWeekInfo(month, week));
        }

        if(msg == "주디버그"){
            try {
                replier.reply(debugEphUserList());
            } catch(e){
                replier.reply(e);
            }
        }

        if(msg == "딘디버그"){
            try {
                replier.reply(debugEphUserMultiList());
            } catch(e){
                replier.reply(e);
            }
        }

        if(msg=="에바다목록동기화"){
            var date = new Date();
            var month = getMonth(date);
            var day = getDay(date);
            var ephUserList = reloadEphWeekProof(replier);
            for(var i=1 ; i<=ephTotalUser ; i++) {
                ephWeekProof(month, day, ephUserList[i], replier);
            }
            replier.reply("이번주 인증 동기화 완료");
        }

        // sender 이번달 성경읽은결과
        if(msg.includes("님ㅈㅎ")){
            var msgArr1 = msg.split("님");
            sender = msgArr1[0].substring(0, msgArr1[0].length);
            msg = inputProof[6];

            replier.reply(printInfo(sender, month))

        }
        // N월 인증결과
        if(msg.includes("월인증및체크결과")){
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(0, msgArr1[0].length);

            replier.reply(printEphMonthInfo(month));

        }

        // N월 인증결과
        if(msg.includes("분기결과")||msg.includes("분기중간점검")){
            var msgArr1 = msg.split("분");
            var qNum = msgArr1[0].substring(0, msgArr1[0].length);

            replier.reply(printQuarterInfo(qNum,replier));

        }

        if(msg == "기도짝추첨"){
            replier.reply(pickPrayer(replier));

        }

        if(msg == "야너두상추첨"){
            replier.reply(pickRandom(replier));
        }

        // 디버그
        if(msg == "하이"){
            replier.reply("헙")
            let list2 = ridLastName(ephListPick)

            for (let i = 0; i < list2.length; i++) {
                replier.reply(list2[i])
            }
        }

        // ----------------------------------

    } catch (e) {
        replier.reply("입력하신 키워드를 확인해주세요.");
        checkExample(replier);
        replier.reply(e);

    }

}

function trimSpace(str) {
    return str.replace(/ /gi,"");
}

function read(originpath, filename) {
    var file = new java.io.File(originpath+filename);
    if(file.exists() === false) {
        return null;
    }
    try
    {
        var fis = new java.io.FileInputStream(file);
        var isr = new java.io.InputStreamReader(fis);
        var br = new java.io.BufferedReader(isr);
        var data = [];
        var i = 0;
        var str = "";

        while((str = br.readLine()) !== null){
            var strArray = str.split('\t');
            data[i] = strArray;
            i ++;
        }

        try
        {
            fis.close();
            isr.close();
            br.close();

            return data;
        }

        catch(error)
        {
            return error;
        }
    }
    catch(error)
    {
        return error;
    }
}

function save(path, filename, content)
{
    var folder = new java.io.File(path);
    folder.mkdirs();
    var file = new java.io.File(path+filename);
    var fos = new java.io.FileOutputStream(file);
    var contentstring = new java.lang.String(content);
    fos.write(contentstring.getBytes());
    fos.close();
}

function ridLastName(ephListPick){
    let ephList = []
    for (let i = 0; i < ephListPick.length; i++) {
        let length = ephListPick[i].length
        let name = ephListPick[i].substring(length-2,length);
        ephList.push(name)
    }

    return ephList
}

function pickPrayer(replier){
    var visited = [];
    var txt = "기도자\t👉\t기도 대상자(기도짝)\n\n";

    replier.reply("셋");
    replier.reply("둘");
    replier.reply("하나");
    replier.reply("🥁🥁🥁🥁");

    let ephList = ridLastName(ephListPick);
    for (let i = 0; i < ephList.length; i++) {
        txt += ephList[i] + "  \t👉\t";
        while (true) {
            let randomIndex = Math.floor((Math.random() * ephListPick.length));
            let recipient = ephListPick[randomIndex];
            if(recipient != ephList[i] && !visited[randomIndex]) {
                txt += recipient+"\n";
                visited[randomIndex] = true;
                break;
            }
        }
    }

    return txt;
}

function pickRandom(replier){
    var visited = [];
    var txt = "야, 너두 완벽할 수 있어 !! 👊\n\n🎊";

    replier.reply("셋");
    replier.reply("둘");
    replier.reply("하나");
    replier.reply("🥁🥁🥁🥁");

    for (let i = 0; i < 2; i++) {
        while (true) {
            let randomIndex = Math.floor((Math.random() * ephLastList.length));
            let winner = ephLastList[randomIndex];
            if(!visited[randomIndex]) {
                txt += winner;
                visited[randomIndex] = true;
                if(i==0){
                    txt += "\t";
                } else {
                    txt += "🎉";
                }
                break;
            }

        }
    }

    return txt;

}

function printInfo(sender, month) {
    var calendarEmoji = read(filepathCallendarEmoji,month+emojiSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    try{
        userData = read(filepathSave+sender+"/", filename);
    } catch (error) {
        replier.reply(error);
    }
    if(userData == null){
        userData = calendarEmoji;
    }

    var fullCalendar = "";

    // 오늘 날짜 읽기 표시하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <userData[0].length ; col++) {
            fullCalendar += userData[row][col]+"  ";
        }
        fullCalendar+="\n";
    }
    return fullCalendar;
}

function printInfoByYear(sender, year, month, replier) {
    var calendarEmoji = read(filepathCallendarEmoji,year+"/"+month+emojiSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    try{
        userData = read(filepathSave+year+"/"+sender+"/", filename);
    } catch (error) {
        replier.reply(error);
    }
    if(userData == null){
        userData = calendarEmoji;
    }

    var fullCalendar = "";

    // 오늘 날짜 읽기 표시하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <userData[0].length ; col++) {
            fullCalendar += userData[row][col]+"  ";
        }
        fullCalendar+="\n";
    }
    return fullCalendar;
}

function printEphWeekInfo(month, week){
    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");
    var weekCol = 0;

    for(var col = 0 ; col < ephWeekList[0].length ; col++){
        if(month+"월"+week+"주" == ephWeekList[0][col]){
            weekCol = col;
        }
    }

    var fullEphWeekList = "";
    var noProofUserList = "";
    var yesProofUserList = "";

    if(weekCol == 0){
        fullEphWeekList = "입력하신 월 또는 주를 확인해주세요.";
    } else {
        for (var row = 1; row <= ephTotalUser; row++) {
            if (Number(ephWeekList[row][weekCol]) > 0) {
                yesProofUserList += ephWeekList[row][0] + "\n";
            } else {
                noProofUserList += ephWeekList[row][0] + "\n";
            }
        }

        fullEphWeekList = "- 인증 퀘스트 완료한 사람 🥰 -\n" + yesProofUserList +
            "\n- 인증 퀘스트 미완료한 사람 🥲 -\n" + noProofUserList;
    }

    return fullEphWeekList;
}

function getMonthStartEndCol(month){
    month = Number(month);
    var weekCol = [0,0];
    var weekColStart = 0;
    var weekColEnd = 0;

    switch(month){
        case 1 :
            weekColStart = 1;
            weekColEnd = 6;
            break;
        case 2 :
            weekColStart = 6;
            weekColEnd = 10;
            break;
        case 3 :
            weekColStart = 10;
            weekColEnd = 14;
            break;
        case 4 :
            weekColStart = 14;
            weekColEnd = 18;
            break;
        case 5 :
            weekColStart = 19;
            weekColEnd = 23;
            break;
        case 6 :
            weekColStart = 23;
            weekColEnd = 27;
            break;
        case 7 :
            weekColStart = 27;
            weekColEnd = 32;
            break;
        case 8 :
            weekColStart = 32;
            weekColEnd = 36;
            break;
        case 9 :
            weekColStart = 36;
            weekColEnd = 40;
            break;
        case 10 :
            weekColStart = 40;
            weekColEnd = 45;
            break;
        case 11 :
            weekColStart = 45;
            weekColEnd = 49;
            break;
        case 12 :
            weekColStart = 49;
            weekColEnd = 53;
            break;
    }

    weekCol[0] = weekColStart;
    weekCol[1] = weekColEnd;

    return weekCol;

}

function printEphMonthInfo(month){
    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");
    var weekCol = getMonthStartEndCol(month);
    var weekColStart = weekCol[0];
    var weekColEnd = weekCol[1];

    var fullEphWeekList = "";

    if(weekColStart == 0 || weekColEnd == 0){
        fullEphWeekList = "입력하신 월을 확인해주세요.";
    } else {
        for (var row = 1; row <= ephTotalUser; row++) {
            var name = ephWeekList[row][0];
            var countCheck = 0;
            var ephWeekUserList = read(filepathSave, name+"/"+name+month+".csv");
            if (ephWeekUserList != null) {
                for (var rowI = 1; rowI < ephWeekUserList.length; rowI++) {
                    for (var colI = 0; colI < ephWeekUserList[0].length; colI++) {
                        if (ephWeekUserList[rowI][colI] == "💟" || ephWeekUserList[rowI][colI] == "✅") {
                            countCheck++;
                        }
                    }
                }
            }

            fullEphWeekList += name.substring(name.length-2, name.length) + "\t"; // 이름
            for(var col = weekColStart ; col <= weekColEnd ; col ++) {
                if (Number(ephWeekList[row][col]) > 0) {
                    fullEphWeekList += "💟" + "\t";
                } else {
                    fullEphWeekList += "◻" + "\t";
                }
            }

            fullEphWeekList += countCheck+ "쳌"+"\n";
        }

    }

    return fullEphWeekList;
}

function printEphMonthInfoPercent(month){
    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");
    var weekCol = getMonthStartEndCol(month);
    var weekColStart = weekCol[0];
    var weekColEnd = weekCol[1];
    var flag31 = false;
    var flag30 = false;
    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
        flag31 = true;
    if(month == 4 || month == 6 || month == 9 || month == 11)
        flag30 = true;

    var fullEphWeekList = "";

    if(weekColStart == 0 || weekColEnd == 0){
        fullEphWeekList = "입력하신 월을 확인해주세요.";
    } else {
        for (var row = 1; row <= ephTotalUser; row++) {
            var name = ephWeekList[row][0];
            var countCheck = 0;
            var percent = 0;
            var ephWeekUserList = read(filepathSave, name+"/"+name+month+".csv");
            for(var rowI = 1 ; rowI < ephWeekUserList.length ; rowI++){
                for(var colI = 0 ; colI < ephWeekUserList[0].length ; colI++){
                    if(ephWeekUserList[rowI][colI] == "💟" || ephWeekUserList[rowI][colI] == "✅"){
                        countCheck ++;
                    }
                }
            }
            if(flag30){
                percent = (countCheck / 30) * 100;
            } else if(flag31){
                percent = (countCheck / 31) * 100;
            } else {
                percent = (countCheck / 28) * 100;
            }

            percent = (Number(percent));

            fullEphWeekList += name.substring(name.length-2, name.length) + "\t"; // 이름
            for(var col = weekColStart ; col <= weekColEnd ; col ++) {
                if (Number(ephWeekList[row][col]) > 0) {
                    fullEphWeekList += "💟" + "\t";
                } else {
                    fullEphWeekList += "◻" + "\t";
                }
            }

            fullEphWeekList += countCheck+ "일"+percent+"%\n";
        }

    }

    return fullEphWeekList;
}

function printQuarterInfo(quarter,replier) {
    var month = [];
    var start = 0;
    var score = [];
    var weekProofNum = 0;
    var weekCheckNum = 0;

    switch (quarter) {
        case "1" :
            month[0] = "1"
            month[1] = "2";
            month[2] = "3";
            weekProofNum = "12";
            weekCheckNum = "90";
            score[0] = 9;
            score[1] = 72;
            break;
        case "2" :
            month[0] = "4";
            month[1] = "5";
            month[2] = "6";
            weekProofNum = "14";
            weekCheckNum = "91";
            score[0] = 11;
            score[1] = 72;
            break;
        case "3" :
            month[0] = "7";
            month[1] = "8";
            month[2] = "9";
            weekProofNum = "14";
            weekCheckNum = "92";
            score[0] = 10;
            score[1] = 73;
            break;
        case "4" :
            month[0] = "10";
            month[1] = "11";
            month[2] = "12";
            weekProofNum = "14";
            weekCheckNum = "92"
            score[0] = 10;
            score[1] = 73;
            break;
        default :
            return null;
            break;
    }

    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");
    var fullEphWeekList = "";

    if(month == null){
        fullEphWeekList = "입력하신 월을 확인해주세요.";
    } else{
        fullEphWeekList = "----------- "+quarter+"분기  -----------\n" +
            "완벽상 자격 : "+score[0]+"인증이상 | "+ score[1]+"쳌이상\n" +
            "명불허전상 자격 : "+ (weekCheckNum/2).toFixed()+"쳌이상\n"
        if(quarter == 3) {
            fullEphWeekList += "* 신입단원 - 7인증이상 | 50쳌이상\n"
        }
        fullEphWeekList += "\n🏆 : 완벽상\n🎖 : 명불허전상 (절반이상쳌)\n🙃 : 야너두상후보 (10쳌이하)"
        replier.reply(fullEphWeekList)
        fullEphWeekList = ""
    }

    let tempWeekProofNum = weekProofNum ; // 3분기에만
    let tempWeekCheckNum = weekCheckNum ; // 3분기에만
    let tempFirstScore = score[0]; // 3분기에만
    let tempSecondScore = score[1]; // 3분기에만
    for (var row = 1; row <= ephTotalUser; row++) {
        var name = ephWeekList[row][0];
        var countCheck = 0;
        var countWeekCheck = 0;

        for(var i=start ; i<3 ; i++) {
            var weekCol = getMonthStartEndCol(month[i]);
            var weekColStart = weekCol[0];
            var weekColEnd = weekCol[1];

            var ephWeekUserList = read(filepathSave, name + "/" + name + month[i] + ".csv");
            if (ephWeekUserList != null) {
                for (var rowI = 1; rowI < ephWeekUserList.length; rowI++) {
                    for (var colI = 0; colI < ephWeekUserList[0].length; colI++) {
                        if (ephWeekUserList[rowI][colI] == "💟" || ephWeekUserList[rowI][colI] == "✅") {
                            countCheck++;
                        }
                    }
                }
            }

            for (var col = weekColStart; col <= weekColEnd; col++) {
                if (Number(ephWeekList[row][col]) > 0) {
                    countWeekCheck++;
                }
            }

            if(i == start) {
                fullEphWeekList += name.substring(name.length - 2, name.length) + " : "; // 이름
            }
        }

        // 3분기만 -debug
        if(quarter == 3) {
            if (name == "김성준" || name == "이예은" || name == "이하나" || name == "조은경") {
                weekProofNum -= 5;
                weekCheckNum -= 31;
                score[0] = 7
                score[1] = 50
            }
        }

        fullEphWeekList += countWeekCheck + "/" + weekProofNum + "인증  |  " + countCheck +"/" + weekCheckNum + "쳌";
        if(countWeekCheck >= score[0] && countCheck >= score[1]){
            fullEphWeekList += " 🏆";
        } else if(countCheck >= weekCheckNum/2){
            fullEphWeekList += " 🎖";
        } else if(countCheck <= 10){
            // 보고싶어 단원
            if(name == "보고싶어 단원"){
                fullEphWeekList += "  ";
            } else {
                fullEphWeekList += " 🙃";
            }
        }
        else{
            fullEphWeekList += "  ";
        }
        fullEphWeekList +="\n";

        if(quarter == 3) {
            weekProofNum = tempWeekProofNum; // 3분기에만
            weekCheckNum = tempWeekCheckNum // 3분기에만
            score[0] = tempFirstScore; // 3분기에만
            score[1] = tempSecondScore; // 3분기에만
        }

    }

    return fullEphWeekList;
}

function debugEphUserList(){
    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");

    var debug = "";
    for(var row = 0 ; row < ephWeekList.length ; row++){
        for(var col = 0 ; col<ephWeekList[0].length ; col++){
            debug += ephWeekList[row][col] +"\t";
        }
        debug += "\n";
    }

    return debug;
}

function debugEphUserMultiList(){
    var ephWeekList = read(filepathEphWeekList+"김다인/", "ephUserWeekMultiList.csv");

    var debug = "";
    for(var row = 0 ; row < ephWeekList.length ; row++){
        for(var col = 0 ; col<ephWeekList[0].length ; col++){
            debug += ephWeekList[row][col] +"\t";
        }
        debug += "\n";
    }

    return debug;
}

function makeContent(fileArray, totalCol){
    var fullContent = ""
    for (var row = 0; row < fileArray.length; row++) {
        for (var col = 0; col < totalCol; col++) {
            fullContent += fileArray[row][col] + "\t";
        }
        fullContent += "\n";
    }

    return fullContent;
}

function checkProof(month, day, sender, replier){
    var calendarRaw = read(filepathCallendarRaw, month+rawSuffix);
    var calendarEmoji = read(filepathCallendarEmoji,month+emojiSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    var fullCalendar = "";
    var indexR = 0;
    var indexC = 0;

    // 오늘 날짜 인덱스 가져오기
    var index = getTodayIndex(calendarRaw, day);
    indexR = index[0];
    indexC = index[1];
    var flag = true;

    if(indexR == 0 && indexC == 0){
        flag = false;
        return fullCalendar;
    }

    try{
        userData = read(filepathSave+sender+"/", filename);
        
    } catch (error) {
        replier.reply(error);
    }

    if(userData == null){
        userData = calendarEmoji;
        replier.reply(month+"월 첫번째 체크시네요 !🥳");
    }

    var count = 0;
    var todayMonth = getMonth(new Date());
    var today = getDay(new Date());
    // 오늘 날짜 읽기 표시하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            if(row == indexR && col == indexC && flag && userData[row][col] != "💟"){
                if(isEphRoom(roomName) && isThisWeek(todayMonth,today,month,row, replier)){
                    userData[row][col] = "💟";
                    count = 1;
                    ephWeekMultiProofCount(todayMonth, today, sender, replier, count, false); // 주차별 멀티 인증 카운트 파일에 저장
                    ephWeekProof(todayMonth, today, sender, replier); // 주 인증
                } else {
                    userData[row][col] = "✅";
                }
            }
            fullCalendar += userData[row][col]+"\t";
        }
        fullCalendar+="\n";
    }


    return fullCalendar;
}

function cancelProof(month, day,sender, replier){
    var calendarRaw = read(filepathCallendarRaw, month+rawSuffix);
    var calendarEmoji = read(filepathCallendarEmoji,month+emojiSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    var fullCalendar = "";
    var indexR = 0;
    var indexC = 0;

    // 오늘 날짜 인덱스 가져오기
    var index = getTodayIndex(calendarRaw, day);
    indexR = index[0];
    indexC = index[1];
    var flag = true;

    if(indexR == 0 && indexC == 0){
        flag = false;
        return fullCalendar;
    }

    try{
        userData = read(filepathSave+sender+"/", filename);
    } catch (error) {
        replier.reply(error);
    }

    if(userData == null){
        userData = calendarEmoji;
    }

    var count = 0;
    var todayMonth = getMonth(new Date());
    var today = getDay(new Date());
    // 오늘 날짜 체크 해제하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            if(row == indexR && col == indexC && flag && userData[row][col] != calendarEmoji[row][col]){
                userData[row][col] = calendarEmoji[row][col];
                count = -1;
                if(isEphUser(sender)) {
                    ephWeekMultiProofCount(todayMonth, today, sender, replier, count, false); // 주차별 멀티 인증 카운트 파일에 저장
                    ephWeekProof(todayMonth, today, sender, replier); // 주 인증
                }
            }
            fullCalendar += userData[row][col]+"\t";
        }
        fullCalendar+="\n";
    }


    return fullCalendar;
}

function checkMultiProof(month, firstday, lastday, sender, replier){
    var calendarRaw = read(filepathCallendarRaw, month+rawSuffix);
    var calendarEmoji = read(filepathCallendarEmoji,month+emojiSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    var fullCalendar = "";

    // 날짜 인덱스 가져오기
    var indexFrist = getTodayIndex(calendarRaw, firstday);
    var indexLast = getTodayIndex(calendarRaw,lastday);
    var indexFirstR = indexFrist[0];
    var indexFirstC = indexFrist[1];
    var indexLastR = indexLast[0];
    var indexLastC = indexLast[1];

    var flag = true;

    if(indexFirstR == 0 && indexFirstC == 0){
        flag = false;
        return fullCalendar;
    }

    if(indexLastR == 0 && indexLastC == 0){
        flag = false;
        return fullCalendar;
    }

    try{
        userData = read(filepathSave+sender+"/", filename);
    } catch (error) {
        replier.reply(error);
    }

    if(userData == null){
        userData = calendarEmoji;
        replier.reply(month+"월 첫번째 체크시네요 !🥳");
    }

    var count = 0; // 주차별 인증을 위한 횟수 카운트
    var todayMonth = getMonth(new Date());
    var today = getDay(new Date());
    var checkWeek = false;

    // 입력한 다중 날짜 읽기 표시하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            if(indexFirstR == indexLastR){
                if(row == indexFirstR && (col >= indexFirstC && col <= indexLastC) && userData[row][col] != "💟" )  {
                    if(isEphRoom(roomName) && isThisWeek(todayMonth,today,month,row,replier)){
                        userData[row][col] = "💟";
                        count ++;
                        checkWeek = true;
                    } else {
                        userData[row][col] = "✅";
                    }
                }
            } else {
                if(row == indexFirstR && col >= indexFirstC && userData[row][col] != "💟"){
                    if(isEphRoom(roomName) && isThisWeek(todayMonth,today,month,row,replier)){
                        userData[row][col] = "💟";
                        count ++;
                        checkWeek = true;
                    } else {
                        userData[row][col] = "✅";
                    }
                } else if (row == indexLastR && col <= indexLastC && userData[row][col] != "💟"){
                    if(isEphRoom(roomName) && isThisWeek(todayMonth,today,month,row,replier)){
                        userData[row][col] = "💟";
                        count ++;
                        checkWeek = true;
                    } else {
                        userData[row][col] = "✅";
                    }
                } else if(row > indexFirstR && row < indexLastR && userData[row][col] != "💟"){
                    if(isEphRoom(roomName) && isThisWeek(todayMonth,today,month,row,replier)){
                        userData[row][col] = "💟";
                        count ++;
                        checkWeek = true;
                    } else {
                        userData[row][col] = "✅";
                    }
                }
            }
            fullCalendar += userData[row][col]+"\t";
        }
        fullCalendar+="\n";
    }

    if(checkWeek) {
        ephWeekMultiProofCount(todayMonth, today, sender, replier, count, true); // 주차별 멀티 인증 카운트 파일에 저장
        ephWeekProof(todayMonth, today, sender, replier);
    }

    return fullCalendar;
}

function cancelMultiProof(month, firstday, lastday, sender, replier){
    var calendarRaw = read(filepathCallendarRaw, month+rawSuffix);
    var calendarEmoji = read(filepathCallendarEmoji,month+emojiSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    var fullCalendar = "";

    // 날짜 인덱스 가져오기
    var indexFrist = getTodayIndex(calendarRaw, firstday);
    var indexLast = getTodayIndex(calendarRaw,lastday);
    var indexFirstR = indexFrist[0];
    var indexFirstC = indexFrist[1];
    var indexLastR = indexLast[0];
    var indexLastC = indexLast[1];

    var flag = true;

    if(indexFirstR == 0 && indexFirstC == 0){
        flag = false;
        return fullCalendar;
    }

    if(indexLastR == 0 && indexLastC == 0){
        flag = false;
        return fullCalendar;
    }

    try{
        userData = read(filepathSave+sender+"/", filename);
    } catch (error) {
        replier.reply(error);
    }

    if(userData == null){
        userData = calendarEmoji;
    }


    var count = 0; // 주차별 인증을 위한 횟수 카운트
    var todayMonth = getMonth(new Date());
    var today = getDay(new Date());
    var checkWeek = false;

    // 입력한 다중 날짜 읽기 해제하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            if(indexFirstR == indexLastR){
                if(row == indexFirstR && (col >= indexFirstC && col <= indexLastC) && userData[row][col] != calendarEmoji[row][col])  {
                    userData[row][col] = calendarEmoji[row][col];
                    count --;
                    checkWeek = true;
                }
            } else {
                if(row == indexFirstR && col >= indexFirstC && userData[row][col] != calendarEmoji[row][col]){
                    userData[row][col] = calendarEmoji[row][col];
                    count --;
                    checkWeek = true;
                } else if (row == indexLastR && col <= indexLastC && userData[row][col] != calendarEmoji[row][col]){
                    userData[row][col] = calendarEmoji[row][col];
                    count --;
                    checkWeek = true;
                } else if(row > indexFirstR && row < indexLastR && userData[row][col] != calendarEmoji[row][col]){
                    userData[row][col] = calendarEmoji[row][col];
                    count --;
                    checkWeek = true;
                }
            }
            fullCalendar += userData[row][col]+"\t";
        }
        fullCalendar+="\n";
    }

    if(!isEphUser(sender)){
        checkWeek = false;
    }

    if(checkWeek) {
        ephWeekMultiProofCount(todayMonth, today, sender, replier, count, true); // 주차별 멀티 인증 카운트 파일에 저장
        ephWeekProof(todayMonth, today, sender, replier);
    }

    return fullCalendar;
}

function isCheckAll(month,sender,replier) {
    var calendarRaw = read(filepathCallendarRaw, month+rawSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    try{
        userData = read(filepathSave+sender+"/", filename);
    } catch (error) {
        replier.reply(error);
    }

    var isAll = false;
    var indexFirstR = 0;
    var indexFirstC = 0;
    var indexLastR = 0;
    var indexLastC = 0;

    // 달력 1일과 마지막일 인덱스 가져오기
    var index = getMonthIndex(calendarRaw, month);
    indexFirstR = index[0];
    indexFirstC = index[1];
    indexLastR = index[2];
    indexLastC = index[3];
    var flag = true;

    if((indexFirstR == 0 && indexFirstC == 0) || (indexLastR == 0 && indexLastC == 0)){
        flag = false;
    }

    // 검증하기
    var count = 0;
    for(var row = indexFirstR ; row<calendarRaw.length ; row++){
        for(var col = 0 ; col <calendarRaw[0].length ; col++) {
            if(!flag){
                break;
            } else if(row == indexFirstR && col >= indexFirstC && (userData[row][col] == "✅" || userData[row][col] == "💟")){
                count ++;
            } else if(row == indexLastR && col <= indexLastC && (userData[row][col] == "✅" || userData[row][col] == "💟")){
                count ++;
            } else if(row > indexFirstR && row < indexLastR && (userData[row][col] == "✅" || userData[row][col] == "💟")){
                count ++;
            }
        }
    }
    var flag31 = false;
    var flag30 = false;
    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
        flag31 = true;
    if(month == 4 || month == 6 || month == 9 || month == 11)
        flag30 = true;

    if(flag31){
        if(count == 31)
            isAll = true;
    }

    if(flag30){
        if(count == 30)
            isAll = true;
    }

    if(month == 2){
        if(count == 28)
            isAll = true;
    }

    return isAll;
}

function isEphUser(sender){
    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");

    for(var i=0 ; i<ephWeekList.length ; i++){
        if(sender == ephWeekList[i][0]) {
            return true;
        }
    }

    return false;
}

function isEphRoom (room) {
    //debug
    if(room == "에바다봇"){
        return true;
    }

    return false;
}

function isThisWeek(todayMonth, today, checkMonth, checkRow, replier){
    var calendarRaw = read(filepathCallendarRaw, todayMonth + rawSuffix);
    // 이번주차 숫자 가져오기
    var thisWeekNumber = getWeekNumber(calendarRaw, todayMonth, today);
    checkRow = getWeekNumber(calendarRaw, checkMonth, today);

    if(todayMonth+"월"+thisWeekNumber+"주" == checkMonth+"월"+checkRow+"주"){
        return true;
    } else {
        return false;
    }

}

function sendCongratMsg(month, sender, replier) {
    var isAll = isCheckAll(month,sender,replier);
    if(isAll){
        var congratList = read(filepathList,"congrat.csv");
        var congratMsg = congratList[Math.floor((Math.random() * congratList.length))];
        replier.reply(sender+"님 "+month+"월 체크를 모두 완료하셨습니다 !"+"\n"+congratMsg);
    }

}

function getMonthIndex(calendar,month) {
    var index = [0,0,0,0];
    var flag31 = false;
    var flag30 = false;
    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
        flag31 = true;
    if(month == 4 || month == 6 || month == 9 || month == 11)
        flag30 = true;
    for(var row=0 ; row<calendar.length ; row++){
        for(var col = 0 ; col <calendar[0].length ; col++) {
            if(calendar[row][col] == 1){
                index[0] = row;
                index[1] = col;
            }
            if(flag31 && calendar[row][col] == 31){
                index[2] = row;
                index[3] = col;
            }
            if(flag30 && calendar[row][col] == 30){
                index[2] = row;
                index[3] = col;
            }
            if(month == 2 && calendar[row][col] == 28){
                index[2] = row;
                index[3] = col;
            }
        }
    }
    return index;
}

function getTodayIndex(calendar,day) {
    var index = [0,0];
    for(var row=0 ; row<calendar.length ; row++){
        for(var col = 0 ; col <calendar[0].length ; col++) {
            if(calendar[row][col] == day){
                index[0] = row;
                index[1] = col;
            }
        }
    }
    return index;
}

function senderFileName(sender,month) {
    var filename = sender+month+".csv";
    return filename;
}

function getMonth(date) {
    var month = 1+date.getMonth();

    return month;
}

function getDay(date) {
    var day = date.getDate();
    if(day.length == 1){
        day = "0"+day;
    }

    return day;
}

function getWeekNumber(calendarRaw, month, day){
    var weekNumber = 0;
    for(var row=0 ; row<calendarRaw.length ; row++){
        for(var col = 0 ; col <calendarRaw[0].length ; col++) {
            if(calendarRaw[row][col] == day){
                weekNumber = row;
                break;
            }
        }
    }

    if ((month == 1 && weekNumber == 6)
        || (month == 2 && weekNumber == 5)
        || (month == 3 && weekNumber == 5)
        || (month == 5 && weekNumber == 5)
        || (month == 6 && weekNumber == 5)
        || (month == 7 && weekNumber == 6)
        || (month == 8 && weekNumber == 5)
        || (month == 9 && weekNumber == 5)
        || (month == 10 && weekNumber == 6
            || (month == 11 && weekNumber == 5))) {
        month++;
        weekNumber = 1;
    }

    var weekData = [month, weekNumber];

    return weekData;
}

function getUserIndex(ephUserWeekList, sender){
    var userIndex = 0;
    // 체크한 사람 인덱스 가져오기
    for (var row = 1; row < ephUserWeekList.length; row++) {
        if (sender == ephUserWeekList[row][0]) {
            userIndex = row;
            break;
        }
    }

    return userIndex;
}

function ephWeekMultiProofCount(month, day, sender, replier, count, isMulti){
    var ephUserWeekMultiListRaw = read(filepathEphWeekList, "ephUserWeekMultiList.csv");
    var ephUserWeekMultiList;
    try{
        ephUserWeekMultiList = read(filepathEphWeekList + sender + "/", "ephUserWeekMultiList.csv");
    } catch (error) {
        replier.reply(error);
    }

    if(ephUserWeekMultiList == null){
        ephUserWeekMultiList = ephUserWeekMultiListRaw;
    }

    var calendarRaw = read(filepathCallendarRaw, month + rawSuffix);
    var weekMonth = getWeekNumber(calendarRaw,month,day)[0]
    var weekNumber = getWeekNumber(calendarRaw,month,day)[1];
    var state = 0;
    for(var col = 0 ; col < 54 ; col++){
        if (weekMonth + "월" + weekNumber + "주" == ephUserWeekMultiList[0][col]) {
            if(!isMulti && (isEphRoom(roomName) || count<0)) {
                ephUserWeekMultiList[1][col] = Number(ephUserWeekMultiList[1][col]) + count;
            } else if(isMulti && (isEphRoom(roomName)|| count<0)){
                ephUserWeekMultiList[2][col] = Number(ephUserWeekMultiList[2][col]) + count;
            }
        }
    }

    var fullEphWeekMultiProofList = makeContent(ephUserWeekMultiList, 54);
    save(filepathEphWeekList + sender + "/","ephUserWeekMultiList.csv",fullEphWeekMultiProofList);

    return state;
}


function ephWeekProof(month, day, sender, replier){
    var calendarRaw = read(filepathCallendarRaw, month + rawSuffix);
    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");
    var ephUserWeekMultiList = read(filepathEphWeekList + sender + "/", "ephUserWeekMultiList.csv");
    var ephUserWeekMultiListRaw = read(filepathEphWeekList, "ephUserWeekMultiList.csv");

    if(ephUserWeekMultiList == null){
        ephUserWeekMultiList = ephUserWeekMultiListRaw;
    }

    // 에바다 단원 인덱스 가져오기
    var userIndex = getUserIndex(ephWeekList, sender);

    // 이번주차 숫자 가져오기
    var weekMonth = getWeekNumber(calendarRaw,month,day)[0]
    var weekNumber = getWeekNumber(calendarRaw,month,day)[1];

    if(userIndex == 0)
        return;


    // 체크한 곳 ++ 또는 -- 해주기 | pm : plus minus 여부
    // 멀티 체크 시 멀티 체크한 날짜수에 따라 체크 수 포함여부
    for (var col = 1; col < 54; col++) {
        if (weekMonth + "월" + weekNumber + "주" == ephWeekList[0][col]) {
            var singleProof =  Number(ephUserWeekMultiList[1][col]);
            var multiProof =  Number(ephUserWeekMultiList[2][col]);

            if(singleProof > 0 && multiProof > 0){
                ephWeekList[userIndex][col] = 2;
            } else if(singleProof * multiProof < 0){
                ephWeekList[userIndex][col] = 1;
            } else if( (singleProof == 0 && multiProof > 0) || (singleProof > 0 && multiProof == 0)){
                ephWeekList[userIndex][col] = 1;
            } else {
                ephWeekList[userIndex][col] = 0;
            }
            break;
        }
    }

    var fullEphWeekList = makeContent(ephWeekList, 54);

    // 주차별 인증 결과 파일에 저장
    save(filepathEphWeekList, "ephWeekProof.csv", fullEphWeekList);
}

function reloadEphWeekProof(replier){
    var ephWeekList = read(filepathEphWeekList, "ephWeekProof.csv");
    var ephUserList = [];
    for(var i=1 ; i<=ephTotalUser ; i++){
        ephUserList[i] = ephWeekList[i][0];
    }

    return ephUserList;
}

function checkInfo(replier){
    var list = read(filepathList,"prooflist.csv");
    var help = "";
    for(var i=0 ; i<list.length ; i++){
        help+= list[i] + "\n";
    }
    replier.reply(help);
}

function checkExample(replier){
    var list = read(filepathList,"checkexample.csv");
    var help = "";
    for(var i=0 ; i<list.length ; i++){
        help+= list[i] + "\n";
    }
    replier.reply(help);
}
