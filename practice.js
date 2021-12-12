const scriptName = "practice";
/**
 * https://omble-blog.tistory.com/8
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

// var allsee = new Array(1000).join(String.formatCharCode(847));
var rspCountWin = 0;
var rspCountLose = 0;
var inputGame = ["안녕","바보","가위바위보","전적 초기화","인사","홀짝"];

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    var allsee = "        ";

    var help = "";

    // msg 공백제거
    msg = trimSpace(msg);

    if (msg == "심심해") {
        for (var i2 = 0; i2 < inputGame.length; i2++) {
            help += i2+1+". "+inputGame[i2];
            if (i2 == 2) {
                help += "\n"+" * 셋 중 하나만 입력해주세요.\n 예시 : 가위";
            } else if(i2 == 3){
                help += "\n"+" * 가위바위보 전적을 초기화합니다.";
            } else if(i2 == 5){
                help += "\n"+" * 둘 중 하나만 입력해주세요.\n 예시 : 홀";
            }
            if(i2 == inputGame.length-1)
                break;
            help +="\n";
        }
        replier.reply("--- 심심풀이땅콩 키워드 목록 ---\n\n"+help);
    }

    if (msg == "/기능연습") {
        replier.reply("made by 딘\n\n--------기능------"+allsee+"\n\n안녕\n바보\n가위바위보\n초기화");
    }
    if (msg == "/패치노트"){
        replier.reply("-----패치노트-----"+allsee+"\n\n20190826 ver1 /기능과 /패치노트 추가");
    }

    if (msg == inputGame[0]) {
        replier.reply(sender + "님도 하이루");
        replier.reply(room + "방에 있는 " + sender + "님도 하이루용~");
    }

    if(msg == inputGame[1]){
        replier.reply('반사!');
    }

    if(msg == inputGame[2]){
        replier.reply('셋 중 하나만 입력해주세요.\n예시 : 바위');
    }
    if(msg == '가위'||msg == '보' ||msg == '바위'){
        var RSP = ['가위', '바위', '보'];
        RSP_bot = RSP[Math.floor((Math.random() * 3))];
        replier.reply(RSP_bot);

        if(msg == RSP_bot){
            replier.reply('비겼습니다');
        }
        else if((msg == '가위' && RSP_bot == '바위')||(msg == '보' && RSP_bot == '가위')||(msg == '바위' && RSP_bot =='보')){
            rspCountLose ++;
            if(rspCountWin > 1){
                replier.reply('학살되었습니다');
            } else if(rspCountLose == 1 && rspCountWin == 0){
                replier.reply('퍼스트 블러드!');
            } else if(rspCountLose == 2){
                replier.reply('적이 전장을 지배하고 있습니다!');
            } else if(rspCountLose == 3){
                replier.reply('적은 전장의 화신입니다!');
            } else if(rspCountLose == 4){
                replier.reply('적은 전설적입니다!');
            }
            replier.reply('적에게 당했습니다');
            rspCountWin = 0;
        }
        else{
            rspCountWin ++;
            if(rspCountWin == 1 && rspCountLose == 0) {
                replier.reply('퍼스트 블러드!');
                replier.reply('적을 처치했습니다!');
            }else if(rspCountWin == 2){
                replier.reply('더블 킬!');
                replier.reply('당신은 미쳐 날뛰고 있습니다!');
            } else if(rspCountWin == 3){
                replier.reply('트리플 킬!');
                replier.reply('전장의 지배자!');
            } else if(rspCountWin == 4){
                replier.reply('쿼드라 킬!');
                replier.reply('도저히 막을 수 없습니다!');
            } else if(rspCountWin == 5){
                replier.reply('펜타 킬!');
                replier.reply('마무리!');
            } else if(rspCountWin > 6){
                replier.reply('전설의 출현!');
            } else if(rspCountLose > 1){
                replier.reply('적이 제압되었습니다!');
            } else{
                replier.reply('적을 처치했습니다!');
            }
            rspCountLose = 0;
        }
    }

    if(msg == trimSpace(inputGame[3])){
        replier.reply('가위바위보 전적이 초기화되었습니다.');
        rspCountWin = 0;
        rspCountLose = 0;
    }

    if(msg == inputGame[4]){
        replier.reply("안녕하세요! 저는 딘봇입니다\n아직 해외가상번호를 쓰고 있어서\n친구 추가를 하지 않으면\n프사가 보이스피싱 같아요 T^T\n\n키워드를 입력하면\n*맥체인 성경읽기* 범위를 알려드려요!\n키워드 또는 딘봇 또는 목록 을 입력하면\n키워드를 확인하실 수 있습니다 :)");
    }

    if(msg == inputGame[5]){
        replier.reply('둘 중 하나만 입력해주세요.\n예시 : 홀');
    }

    if(msg == '홀' || msg == '짝'){
        var oe = Math.floor((Math.random() * 100));
        replier.reply(oe);
        if(oe %2 == 0){
            if(msg == '짝'){
                replier.reply('오오오오올~~~');
            } else {
                replier.reply('탈락 !! 재도전가쥬아~');
            }
        } else {
            if(msg == '홀'){
                replier.reply('이요오올~~~');
            } else {
                replier.reply('띠로리~~ 재도전가쥬아~');
            }
        }
    }
}

function trimSpace(str) {
    return str.replace(/ /gi,"");
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
    var textView = new android.widget.TextView(activity);
    textView.setText("Hello, World!");
    textView.setTextColor(android.graphics.Color.DKGRAY);
    activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}