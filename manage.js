const scriptName = "manage.js";

function response(
    room,
    msg,
    sender,
    isGroupChat,
    replier,
    ImageDB,
    packageName,
    threadId
) {
    //이 코드로 저장과 리로드 기능을 하게 할거임

    var manager = "다인";
    //리로드
    if (sender == manager && msg == "리로드") {
        try {
            Api.off(operationJS);
            if (Api.reload(operationJS) == true) {
                Api.on(operationJS);
                replier.reply("리로드 성공");
            } else {
                replier.reply("리로드 실패");
            }
        } catch (error) {
            replier.reply(error);
        }
    }

    //js파일 목록 (동기화)
    if (sender == manager && msg == "동기화") {
        replier.reply(Api.getScriptNames());
    }

    //리로드할 파일 정하기
    if (sender == manager && msg.indexOf("파일변경") !== -1) {
        operationJS = msg.split(" ")[1];
        replier.reply(operationJS + "로 변경완료");
    }
}