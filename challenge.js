const scriptName = "challenge.js";

var sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();    //절대경로
var filepathCallendarRaw = "/storage/emulated/0/KakaoTalkDownload/challengeBot/callendar_raw/";
var filepathCallendarEmoji = "/storage/emulated/0/KakaoTalkDownload/challengeBot/callendar_emoji/";
var filepathSave = "/storage/emulated/0/KakaoTalkDownload/challengeBot/userData/";
var rawSuffix = "월_raw.csv";
var emojiSuffix = "월_emoji.csv";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    // msg 공백제거
    msg = trimSpace(msg);

    // 목록
    var help = "";
    if(msg == "#ㅇㅈ" || msg == "#인증"){
        var date = new Date();
        var month = getMonth(date);
        var day = getDay(date);
        var data = checkProof(month, day, sender,replier); // 달력
        var filename = senderFileName(sender,month);
        save(filepathSave,filename,data);

        var printData = printInfo(sender,month);
        replier.reply(sender+"님");
        replier.reply(printData);

    }

    if(msg == "#ㅊㅅ" || msg == "#취소"){
        var date = new Date();
        var month = getMonth(date);
        var day = getDay(date);
        var data = cancelProof(month, day, sender, replier); // 달력
        var filename = senderFileName(sender,month);
        save(filepathSave,filename,data);

        var printData = printInfo(sender,month);
        replier.reply(sender+"님");
        replier.reply(printData);

    }


    if(msg.includes("#")&&msg.includes("월")&&msg.includes("ㅇㅈ")){
        var msgArr = msg.split("월");
        var month = msgArr[0].substring(1,msgArr[0].length);
        var printData = printInfo(sender,month);
        replier.reply(printData);
    }

    if(msg == "#ㅈㅎ"){
        var date = new Date();
        var month = getMonth(date);
        var printData = printInfo(sender,month);
        replier.reply(printData);
    }


}

function test(replier,msg) {
    replier.reply(msg);
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
    var filename = senderFileName(sender,month);
    var userData = read(filepathSave, filename);

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

    try{
        userData = read(filepathSave, filename);
        // replier.reply(userData[0][0]); //debug
    } catch (error) {
        replier.reply(error);
    }
    if(userData == null){
        userData = calendarEmoji;
        replier.reply(month+"월 "+"첫번째 인증이시네요 !🥳");
    }

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
    }

    // 오늘 날짜 읽기 표시하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <userData[0].length ; col++) {
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

    try{
        userData = read(filepathSave, filename);
        // replier.reply(userData[0][0]); //debug
    } catch (error) {
        replier.reply(error);
    }
    if(userData == null){
        userData = calendarEmoji;
    }

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
    }

    // 오늘 날짜 인증 취소하기
    for(var row=0 ; row<userData.length ; row++){
        for(var col = 0 ; col <userData[0].length ; col++) {
            if(row == indexR && col == indexC && flag){
                userData[row][col] = calendarEmoji[row][col];
            }
            fullCalendar += userData[row][col]+"\t";
        }
        fullCalendar+="\n";
    }
    return fullCalendar;
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
