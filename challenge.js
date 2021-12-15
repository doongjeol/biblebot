const scriptName = "challenge.js";

var sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();    //절대경로
var filepathRead = "/storage/emulated/0/KakaoTalkDownload/calendar/";
var filepathSave = "/storage/emulated/0/KakaoTalkDownload/calendar/save/";
var inputBible = ["오늘 성경", "어제 성경","내일 성경","이번주 성경","이번달 성경","월 성경","날짜 성경"];
var inputEtc = ["심심해", "점심"];

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    // 목록
    var help = "";
    if(msg == "#ㅇㅈ" || msg == "#인증"){
        var date = new Date();
        var month = getMonth(date);
        var day = getDay(date);
        var data = checkProof(month, day); // 1월 달력
        replier.reply(sender+"님");
        replier.reply(data);
        var filename = sender+".csv";

        save(filepathSave,filename,data);
    }

    if(msg == "#ㅊㅅ" || msg == "#취소"){
        var date = new Date();
        var month = getMonth(date);
        var day = getDay(date);
        replier.reply(month);
        var data = cancelProof(month, day); // 1월 달력
        replier.reply(sender+"님");
        replier.reply(data);
        var filename = sender+".csv";

        save(filepathSave,filename,data);
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

function checkProof(month, day){
    var data = read(filepathRead, month+"월.csv");
    var fullCalendar = ""
    for(var row=0 ; row<data.length ; row++){
        for(var col = 0 ; col <data[0].length ; col++) {
            if(day == data[row][col]){
                data[row][col] = "xx";
            }
            fullCalendar += data[row][col]+"  ";
        }
        fullCalendar+="\n";
    }
    return fullCalendar;
}

function cancelProof(month, day){
    var data = read(filepathRead, month+"월.csv");
    var fullCalendar = ""
    for(var row=0 ; row<data.length ; row++){
        for(var col = 0 ; col <data[0].length ; col++) {
            if(day == data[row][col]){
                data[row][col] = day;
            }
            fullCalendar += data[row][col]+"  ";
        }
        fullCalendar+="\n";
    }
    return fullCalendar;
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

function getFulldateStr(date) {
    var year = date.split('-')[0];
    var month = date.split('-')[1];
    var day = date.split('-')[2];

    return year+"년 "+month+"월 "+day+"일";
}
