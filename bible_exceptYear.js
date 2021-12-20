const scriptName = "bible_exceptYear.js";

// var sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();    //절대경로
var filepath = "/storage/emulated/0/KakaoTalkDownload/";
var inputBible = ["오늘 성경", "어제 성경","내일 성경","이번주 성경","이번달 성경","월 성경","날짜 성경"];
var inputBibleAbb = ["ㅇㄴ","ㅇㅈ","ㄴㅇ","ㅇㅂㅈ","ㅇㅂㄷ","ㅇ"];
var inputEtc = ["심심해", "점심","성경"];
var inputHelpKeyword = ["목록", "얼봇","키워드"];

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    // 목록
    var help = "";
    if(msg == inputHelpKeyword[0] || msg ==inputHelpKeyword[1] || msg == inputHelpKeyword[2]){
        help = bibleHelp(); // 맥체인 성경 키워드 안내
        help += "\n\n------------ 기타 목록 ------------\n\n";
        for(var i=0 ; i<inputEtc.length ; i++) {
            help += i+1+". "+inputEtc[i];
            if (i == 1) {
                help += "\n * 점심 키워드는 상암에 최적화되어있습니다 :)"

            }
            if(i == inputEtc.length-1)
                break;
            help += "\n";
        }
        replier.reply("---- 맥체인 성경 키워드 목록 ----\n\n"+help);
    }

    var help2="";
    if(msg == "성경"){
        help2 = bibleHelp(); // 맥체인 성경 키워드 안내
        replier.reply("---- 맥체인 성경 키워드 목록 ----\n\n"+help2);
    }



    // msg 공백제거
    msg = trimSpace(msg);

    // 도움말
    if(msg == "월성경" || msg == inputBibleAbb[5]){
        replier.reply("N월 성경으로 입력해주세요.\n 예시 : 3월 성경");
    }

    if(msg == "날짜성경"){
        replier.reply("N월 N일 성경으로 입력해주세요.\n 예시 : 12월 25일 성경");
    }


    // 오늘 성경
    if(msg == trimSpace(inputBible[0]) || msg == trimSpace(inputBibleAbb[0])) {
        var todayBible = checkDateBibleExceptYear(getFormatDate(new Date()));
        var todayStr = getFormatDate(new Date);
        replier.reply("-- "+getFulldateStr(todayStr)+" 성경 --\n\n"+
            todayBible[1] + "\n" + todayBible[2] + "\n" + todayBible[3] +"\n" +todayBible[4]);
    }

    // 어제 성경
    if(msg == trimSpace(inputBible[1]) || msg == trimSpace(inputBibleAbb[1])) {
        var yesterdayBible = checkDateBibleExceptYear(getYesterday());
        replier.reply("-- "+getFulldateStr(getYesterday())+" 성경 --\n\n"+
            yesterdayBible[1] + "\n" + yesterdayBible[2] + "\n" + yesterdayBible[3] +"\n" +yesterdayBible[4]);
    }

    // 내일 성경
    if(msg == trimSpace(inputBible[2]) || msg == trimSpace(inputBibleAbb[2])) {
        var tommoryBible = checkDateBibleExceptYear(getTomorrow());
        replier.reply("-- "+getFulldateStr(getTomorrow())+" 성경 --\n\n"+
            tommoryBible[1] + "\n" + tommoryBible[2] + "\n" + tommoryBible[3] +"\n" +tommoryBible[4]);
    }

    // 이번주 성경
    if(msg == trimSpace(inputBible[3]) || msg == trimSpace(inputBibleAbb[3])){
        var weekData = checkWeekBible();
        var fullStr = "";
        for (var j=0 ; j<7 ; j++){
            fullStr += "-"+getFulldateStr(weekData[j][0])+"-"+"\n"
                +weekData[j][1] + "\n" + weekData[j][2] + "\n" + weekData[j][3] +"\n" +weekData[j][4];
            if(j == 6)
                break;
            fullStr += "\n\n";
        }
        replier.reply("-- 이번주 성경 --\n\n"+fullStr);
    }

    // 이번달 성경
    if(msg == trimSpace(inputBible[4]) || msg == trimSpace(inputBibleAbb[4])) {
        var todayMonth = new Date().getMonth()+1;
        replier.reply("--" + todayMonth + "월 성경 --\n\n" +
            monthBibleToString(todayMonth));
    }

    // 월 성경
    for(var k=1 ; k<=12 ; k++){
        if(msg == trimSpace(k+inputBible[5]) || msg == trimSpace(k+inputBibleAbb[5])){
            replier.reply("--" + k+"월 성경 --\n\n"+
                monthBibleToString(k));
        }
    }

    // 날짜 성경
    try {
        if (msg.includes("월") && msg.includes("일") && msg.includes("성경")) {
            var monthIndex = msg.indexOf('월');
            var dateIndex = msg.indexOf('일');
            var month = msg.substring(0, monthIndex);
            var date = msg.substring(monthIndex + 1, dateIndex);

            var formatDate = month + "-" + date;
            var specificBible = checkDateBibleExceptYear(formatDate);
            replier.reply("-- " + getFulldateStr(formatDate) + " 성경 --\n\n" +
                specificBible[1] + "\n" + specificBible[2] + "\n" + specificBible[3] + "\n" + specificBible[4]);

        }
    } catch(e){
        replier.reply("입력하신 키워드를 확인해주세요.");
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

function isToday(todayBible, date) {
    var todayBibleMonth = todayBible.split('-')[0];
    var todayBibleDay = todayBible.split('-')[1];
    var todayMonth = date.split('-')[0];
    var todayDay = date.split('-')[1];

    if(todayBibleMonth == todayMonth && todayBibleDay == todayDay)
        return true;
    else
        return false;

}

function checkDateBibleExceptYear(date){

    var data = read(filepath, "bible.csv");

    for (var i = 0; i < data.length; i++) {
        var todayBible = data[i][0];

        if (isToday(todayBible,date)) {
            return data[i];
        }
    }
}


function checkWeekBible() {
    var today = new Date();
    var day = today.getDay();

    var diff = 0;
    while(day != 0) {
        diff ++;
        day --;
    }

    var data = read(filepath, "bible.csv");
    var todayBibleIndex = 0;

    for (var i = 0; i < data.length; i++) {
        var todayBible = data[i][0];
        if (isToday(todayBible,getFormatDate(today))) {
            todayBibleIndex = i;
            break;
        }
    }

    var startIndex = i-diff;
    var weekData = new Array();

    for(var j = startIndex; j<startIndex+7 ; j++){
        weekData.push(data[j]);
        if(j > 365)
            break;
    }

    return weekData;
}

function checkMonthBible(msg) {
    var data = read(filepath, "bible.csv");
    var monthData = new Array();

    for (var i = 0; i < data.length; i++) {
        var bibleMonth = data[i][0].split('-')[0];

        if (bibleMonth == msg) {
            monthData.push(data[i]);
        }
    }

    return monthData;
}

function monthBibleToString(msg) {
    var monthdata = checkMonthBible(msg);
    var monthstr = "";

    for(var i=0 ; i<monthdata.length ; i++){
        monthstr += i+1+"일 : "+monthdata[i][1] + " | " + monthdata[i][2] + " | " + monthdata[i][3] +" | " +monthdata[i][4]+"\n";
    }

    return monthstr;

}

function getFormatDate(date) {
    var month = 1+date.getMonth();
    var day = date.getDate();

    return month+'-'+day;
}

function getFulldateStr(dateStr) {
    var month = dateStr.split('-')[0];
    var day = dateStr.split('-')[1];

    return month+"월 "+day+"일";
}

function getYesterday(){
    var today = new Date();
    var yesterday = new Date(today.valueOf() - (24*60*60*1000));
    var month = yesterday.getMonth() + 1;
    var day = yesterday.getDate();

    return month+'-'+day;

}

function getTomorrow(){
    var today = new Date();
    var tomorrow = new Date(today.valueOf() + (24*60*60*1000));
    var month = tomorrow.getMonth() + 1;
    var day = tomorrow.getDate();

    return month+'-'+day;
}

function bibleHelp() {
    var help = "";
    for(var i=0 ; i<inputBible.length ; i++){
        if(i<6) {
            help += i + 1 + ". " + "\'" + inputBible[i] + "\'  또는  " +  "\'" +inputBibleAbb[i]+ "\'" ;
            if (i == 5) {
                help += "\n" + " * N월 성경으로 입력해주세요.\n  예시 : '3월 성경' 또는 '3ㅇ'";
            }
        } else {
            help += i + 1 + ". " + "\'" + inputBible[i]+ "\'"
            + "\n" + " * N월 N일 성경으로 입력해주세요.\n 예시 : '12월 25일 성경'";
        }
        help +="\n";
    }

    return help;
}