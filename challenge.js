const scriptName = "challenge.js";

var sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();    //절대경로
var filepathCallendarRaw = "/storage/emulated/0/KakaoTalkDownload/challengeBot/callendar_raw/";
var filepathCallendarEmoji = "/storage/emulated/0/KakaoTalkDownload/challengeBot/callendar_emoji/";
var filepathSave = "/storage/emulated/0/KakaoTalkDownload/challengeBot/userData/";
var filepathList = "/storage/emulated/0/KakaoTalkDownload/challengeBot/list/"
var rawSuffix = "월_raw.csv";
var emojiSuffix = "월_emoji.csv";
var inputProof = ["#ㅇㅈ", "#인증","#ㅊㅅ","#취소","ㅈㅎ","조회","#ㅈㅎ","#조회","ㅇㅈ","인증","ㅊㅅ","취소"];
var outputSuffix = ["님 인증완료👏","님 취소완료🙂","월 조회결과🤗"];

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    // msg 공백제거
    msg = trimSpace(msg);

    // 목록
    if(msg == inputProof[9]){
        var list = read(filepathList,"prooflist.csv");
        var list2 = read(filepathList,"dainmsg.csv");
        var help = "";
        var help2 = "";
        for(var i=0 ; i<list.length ; i++){
            help+= list[i] + "\n";
        }
        for(var i=0 ; i<list2.length ; i++){
            help2+= list2[i] + "\n";
        }
        replier.reply(help);
        replier.reply(help2);
    }

    // 인증 체크
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

    // 인증 취소
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

    if(msg=="#월조회" || msg == "#월ㅈㅎ"){
        replier.reply("'#N월 ㅈㅎ'으로 입력해주세요.\n" +"  예시 : #3월 ㅈㅎ");
    } else if(msg == "#월일인증" || msg == "#월일ㅇㅈ"){
        replier.reply("'#N월 N일 ㅇㅈ'으로 입력해주세요.\n" +"  예시 : #12월 25일 ㅇㅈ");
    } else if(msg == "#월일취소" || msg == "#월일ㅊㅅ"){
        replier.reply("'#N월 N일 ㅊㅅ'으로 입력해주세요.\n" + "  예시 : #12월 25일 ㅊㅅ");
    } else if(msg == "#월일조회" || msg == "#월일ㅈㅎ"){
        replier.reply("'#N월 ㅈㅎ'으로 입력해주세요.\n" +"  예시 : #3월 ㅈㅎ");
    } else if(msg == "#월일-일인증" || msg == "#월일-일ㅇㅈ"){
              replier.reply("'#N월 N-N일 ㅇㅈ'으로 입력해주세요.\n"+"예시 : #12월 1-25일 ㅇㅈ");
    } else if(msg.includes("#")&&msg.includes("월")&&!msg.includes("일")){
        viewMonthFlag = true;
    } else if(msg.includes("#")&&msg.includes("월")&&msg.includes("일")) {
        viewDayFlag = true;
    }

    try {
        // 특정 달의 인증 현황 보기
        if (viewMonthFlag && (msg.includes(inputProof[4]) || msg.includes(inputProof[5])) && msg.length <7) {
            var msgArr = msg.split("월");
            var month = msgArr[0].substring(1, msgArr[0].length);
            var printData = printInfo(sender, month);
            replier.reply(sender + "님 " + month + outputSuffix[2]);
            replier.reply(month + "월\n" + printData);
        }

        // 이번달의 인증 현황 보기
        if (msg == inputProof[6] || msg == inputProof[7]) {
            var date = new Date();
            var month = getMonth(date);
            var printData = printInfo(sender, month);
            replier.reply(sender + "님 " + month + outputSuffix[2]);
            replier.reply(month + "월\n" + printData);
        }

        // 특정 날짜 인증
        if (viewDayFlag && (msg.includes(inputProof[8]) || msg.includes(inputProof[9])) && !msg.includes("-") && msg.length <10) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var day = msgArr2[0].substring(0, msgArr2[0].length);
            var data = checkProof(month, day, sender, replier); // 달력

            if(data === ""|| !month || !day ){
                replier.reply("입력하신 월 또는 일을 확인해주세요.")
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);

                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[0]);
                replier.reply(month + "월\n" + printData);
                sendCongratMsg(month, sender, replier)
            }
        }

        // 특정 날짜 인증 취소
        if (viewDayFlag && (msg.includes(inputProof[10]) || msg.includes(inputProof[11])) && !msg.includes("-") && msg.length <10) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var day = msgArr2[0].substring(0, msgArr2[0].length);
            var data = cancelProof(month, day, sender, replier); // 달력

            if(data === "" || !month || !day){
                replier.reply("입력하신 월 또는 일을 확인해주세요.")
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);
                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[1]);
                replier.reply(month + "월\n" + printData);
            }
        }

        // 연속된 날짜 인증
        if (viewDayFlag && (msg.includes(inputProof[8]) || msg.includes(inputProof[9])) && msg.includes("-") && msg.length <13) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var msgArr3 = msgArr2[0].split("-");
            var firstday = msgArr3[0];
            var lastday = msgArr3[1];

            if(!month || !firstday || !lastday || firstday > lastday){
                replier.reply("입력하신 월 또는 일을 확인해주세요.")
                return;
            }

            var data = checkMultiProof(month, firstday, lastday, sender, replier);

            if(data === ""){
                replier.reply("입력하신 월 또는 일을 확인해주세요.")
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);
                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[0]);
                replier.reply(month + "월\n" + printData);
            }
        }

        // 연속된 날짜 취소
        if (viewDayFlag && (msg.includes(inputProof[10]) || msg.includes(inputProof[11])) && msg.includes("-")  && msg.length <13) {
            var msgArr1 = msg.split("월");
            var month = msgArr1[0].substring(1, msgArr1[0].length);
            var msgArr2 = msgArr1[1].split("일");
            var msgArr3 = msgArr2[0].split("-");
            var firstday = msgArr3[0];
            var lastday = msgArr3[1];

            if(!month || !firstday || !lastday || firstday > lastday){
                replier.reply("입력하신 월 또는 일을 확인해주세요.")
                return;
            }

            var data = cancelMultiProof(month, firstday, lastday, sender, replier);
            if(data === ""){
                replier.reply("입력하신 월 또는 일을 확인해주세요.")
            } else {
                var filename = senderFileName(sender, month);
                save(filepathSave + sender + "/", filename, data);
                var printData = printInfo(sender, month);
                replier.reply(sender + outputSuffix[1]);
                replier.reply(month + "월\n" + printData);
            }
        }


    } catch (e) {
        replier.reply("입력하신 키워드를 확인해주세요.");

    }

}

function trimSpace(str) {
    return str.replace(/ /gi,"");
}

function read(originpath, filename)
{
    var file = new java.io.File(originpath+filename);
    if(file.exists() == false) return null;
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
        replier.reply(month+"월 첫번째 인증이시네요 !🥳");
    }

    // 오늘 날짜 읽기 표시하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            // replier.reply(userData[row][col]); //debug
            if(row == indexR && col == indexC && flag){
                userData[row][col] = "✅";
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

    // 오늘 날짜 인증 취소하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            if(row == indexR && col == indexC && flag){
                userData[row][col] = calendarEmoji[row][col];
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
    var indexR = 0;
    var indexC = 0;

    // 날짜 인덱스 가져오기
    var indexFrist = getTodayIndex(calendarRaw, firstday);
    var indexLast = getTodayIndex(calendarRaw,lastday);
    indexFirstR = indexFrist[0];
    indexFirstC = indexFrist[1];
    indexLastR = indexLast[0];
    indexLastC = indexLast[1];

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
        replier.reply(month+"월 첫번째 인증이시네요 !🥳");
    }

    // 입력한 다중 날짜 읽기 표시하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            if(indexFirstR == indexLastR){
                if(row == indexFirstR && (col >= indexFirstC && col <= indexLastC))  {
                    userData[row][col] = "✅";
                }
            } else {
                if(row == indexFirstR && col >= indexFirstC){
                    userData[row][col] = "✅";
                } else if (row == indexLastR && col <= indexLastC){
                    userData[row][col] = "✅";
                } else if(row > indexFirstR && row < indexLastR){
                    userData[row][col] = "✅";
                }
            }
            fullCalendar += userData[row][col]+"\t";
        }
        fullCalendar+="\n";
    }
    return fullCalendar;
}

function cancelMultiProof(month, firstday, lastday, sender, replier){
    var calendarRaw = read(filepathCallendarRaw, month+rawSuffix);
    var calendarEmoji = read(filepathCallendarEmoji,month+emojiSuffix);
    var filename = senderFileName(sender,month);
    var userData ;

    var fullCalendar = "";
    var indexR = 0;
    var indexC = 0;

    // 날짜 인덱스 가져오기
    var indexFrist = getTodayIndex(calendarRaw, firstday);
    var indexLast = getTodayIndex(calendarRaw,lastday);
    indexFirstR = indexFrist[0];
    indexFirstC = indexFrist[1];
    indexLastR = indexLast[0];
    indexLastC = indexLast[1];

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

    // 오늘 날짜 인증 취소하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <7 ; col++) {
            if(indexFirstR == indexLastR){
                if(row == indexFirstR && (col >= indexFirstC && col <= indexLastC))  {
                    userData[row][col] = calendarEmoji[row][col];
                }
            } else {
                if(row == indexFirstR && col >= indexFirstC){
                    userData[row][col] = calendarEmoji[row][col];
                } else if (row == indexLastR && col <= indexLastC){
                    userData[row][col] = calendarEmoji[row][col];
                } else if(row > indexFirstR && row < indexLastR){
                    userData[row][col] = calendarEmoji[row][col];
                }
            }
            fullCalendar += userData[row][col]+"\t";
        }
        fullCalendar+="\n";
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
            } else if(row == indexFirstR && col >= indexFirstC && userData[row][col] == "✅"){
                count ++;
            } else if(row == indexLastR && col <= indexLastC && userData[row][col] == "✅"){
                count ++;
            } else if(row > indexFirstR && row < indexLastR && userData[row][col] == "✅"){
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

function sendCongratMsg(month, sender, replier) {
    var isAll = isCheckAll(month,sender,replier);
    if(isAll){
        var congratList = read(filepathList,"congrat.csv");
        var congratMsg = congratList[Math.floor((Math.random() * congratList.length))];
        replier.reply(sender+"님 "+month+"월 인증을 모두 완료하셨습니다 !"+"\n"+congratMsg);
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

function isExist(calendarRaw, day){
    var index = getTodayIndex(calendarRaw, day);
    indexR = index[0];
    indexC = index[1];

    if(indexR == 0 && indexC == 0){
        return false;
    }

    return true;

}
