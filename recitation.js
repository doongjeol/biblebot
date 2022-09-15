const scriptName = "recitation.js";

// var sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();    //절대경로
var filepath = "/storage/emulated/0/KakaoTalkDownload/";
var inputRec = ["오늘 암송", "어제 암송","내일 암송","이번주 암송","이번달 암송","월 암송","날짜 암송"];
var inputRecAbb = ["ㅇㄴㅇㅅ","ㅇㅈㅇㅅ","ㄴㅇㅇㅅ","ㅇㅂㅈㅇㅅ","ㅇㅂㄷㅇㅅ","ㅇㅇㅅ"];

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    msg = trimSpace(msg);

    // 도움말
    if(msg == "월암송" || msg == inputRecAbb[5]){
        replier.reply("N월 암송으로 입력해주세요.\n 예시 : 3월 암송");
    }

    if(msg == "날짜암송"){
        replier.reply("N월 N일 암송으로 입력해주세요.\n 예시 : 12월 25일 암송");
    }


    // 오늘 암송
    if(msg == trimSpace(inputRec[0]) || msg == trimSpace(inputRecAbb[0])) {
        var todayBible = checkDateRec(getFormatDate(new Date()));
        var todayStr = getFormatDate(new Date);
        replier.reply("<"+getFulldateStr(todayStr)+" 암송>\n"+
            todayBible[1] + "\n\n" + todayBible[2] + "\n")
    }

    // 어제 암송
    if(msg == trimSpace(inputRec[1]) || msg == trimSpace(inputRecAbb[1])) {
        var yesterdayBible = checkDateRec(getYesterday());
        replier.reply("<"+getFulldateStr(getYesterday())+" 암송>\n"+
            yesterdayBible[1] + "\n\n" + yesterdayBible[2] + "\n");
    }

    // 내일 암송
    if(msg == trimSpace(inputRec[2]) || msg == trimSpace(inputRecAbb[2])) {
        var tommoryBible = checkDateRec(getTomorrow());
        replier.reply("<"+getFulldateStr(getTomorrow())+" 암송>\n"+
            tommoryBible[1] + "\n\n" + tommoryBible[2] + "\n");
    }

    // 이번주 암송
    if(msg == trimSpace(inputRec[3]) || msg == trimSpace(inputRecAbb[3])){
        var weekData = checkWeekRec();
        var fullStr = "";
        for (var j=0 ; j<7 ; j++){
            fullStr += "-"+getFulldateStr(weekData[j][0])+"-"+"\n"
                +weekData[j][1] ;
            if(j == 6)
                break;
            fullStr += "\n\n";
        }
        replier.reply("<이번주 암송>\n\n"+fullStr);
    }

    // 이번달 암송
    if(msg == trimSpace(inputRec[4]) || msg == trimSpace(inputRecAbb[4])) {
        var todayMonth = new Date().getMonth()+1;
        replier.reply("<" + todayMonth + "월 암송>\n\n" +
            monthBibleToString(todayMonth));
    }

    // 월 암송
    for(var k=1 ; k<=12 ; k++){
        if(msg == trimSpace(k+inputRec[5]) || msg == trimSpace(k+inputRecAbb[5])){
            replier.reply("<" + k+"월 암송>\n\n"+
                monthBibleToString(k));
        }
    }

    // 날짜 암송
    try {
        if (msg.includes("월") && msg.includes("일") && msg.includes("암송")&& msg.length <9) {
            var monthIndex = msg.indexOf('월');
            var dateIndex = msg.indexOf('일');
            var month = msg.substring(0, monthIndex);
            var date = msg.substring(monthIndex + 1, dateIndex);

            var formatDate = month + "-" + date;
            var specificBible = checkDateRec(formatDate);
            replier.reply("<" + getFulldateStr(formatDate) + " 암송>\n" +
                specificBible[1] + "\n\n" + specificBible[2]);

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

function checkDateRec(date){

    var data = read(filepath, "recitation.csv");

    for (var i = 0; i < data.length; i++) {
        var todayBible = data[i][0];
        if (isToday(todayBible,date)) {
            data[i][1] = data[i][1].replace(/개행/gi,"\n")
            data[i][2] = data[i][2].replace(/개행/gi,"\n")
            return data[i];
        }
    }
}


function checkWeekRec() {
    var today = new Date();
    var day = today.getDay();

    var diff = 0;
    while(day != 0) {
        diff ++;
        day --;
    }

    var data = read(filepath, "recitation.csv");
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

function checkMonthRec(msg) {
    var data = read(filepath, "recitation.csv");
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
    var monthdata = checkMonthRec(msg);
    var monthstr = "";

    for(var i=0 ; i<monthdata.length ; i++){
        monthdata[i][1] = monthdata[i][1].replace("개행"," & ")
        monthstr += i+1+"일 : "+monthdata[i][1] + "\n";
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
    for(var i=0 ; i<inputRec.length ; i++){
        if(i<6) {
            help += i + 1 + ". " + "\'" + inputRec[i] + "\'  또는  " +  "\'" +inputRecAbb[i]+ "\'" ;
            if (i == 5) {
                help += "\n" + " * N월 암송으로 입력해주세요.\n  예시 : '3월 암송' 또는 '3ㅇ'";
            }
        } else {
            help += i + 1 + ". " + "\'" + inputRec[i]+ "\'"
            + "\n" + " * N월 N일 암송으로 입력해주세요.\n 예시 : '12월 25일 암송'";
        }
        help +="\n";
    }

    return help;
}