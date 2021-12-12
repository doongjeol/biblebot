const scriptName = "food.js";

var filepath = "/storage/emulated/0/KakaoTalkDownload/";
var inputFood = ["식당별","지하","가격별","포장 식당별","포장 메뉴별","종류별"];
var inputFoodOption = ["ㄹ","키워드 초기화","현재 키워드"];
var kindOfPrice = ["고려미","8 to 9","7 to 8","저려미","7 to 9"];
var prevFoodMsg = "";

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
    // msg 공백제거
    msg = trimSpace(msg);

    if(msg == inputFoodOption[0] || msg == 'f'){
        msg = prevFoodMsg;
        if(msg == "" || msg == "점심" || msg == trimSpace(inputFoodOption[1])){
            msg = "";
            replier.reply("키워드 목록 중 하나를 먼저 입력해주세요");
        } else if(msg == trimSpace(inputFoodOption[2])){
            msg = temp;
        }
    }

    if(msg == trimSpace(inputFoodOption[1])){
        if(prevFoodMsg == ""){
            replier.reply("초기화할 점심 키워드가 없습니다");
        } else {
            prevFoodMsg = "";
            replier.reply("반복할 점심 키워드를 초기화하였습니다");
        }
    }


    if(msg == trimSpace(inputFoodOption[2])){
        if(prevFoodMsg == ""){
            replier.reply("반복할 점심 키워드가 없습니다");
        } else {
            replier.reply("반복할 키워드는 '"+prevFoodMsg+"' 입니다");
        }
    }


    var help = "";
    var help2 = "";
    if (msg == "점심") {
        for (var i = 0; i < inputFood.length; i++) {
            help += i+1+". "+inputFood[i];
            if(i == 2){
                help += "\n* 가격 범위를 입력하여주세요"+
                "\n - "+kindOfPrice[0]+
                "\n - "+kindOfPrice[1]+
                "\n - "+kindOfPrice[2]+
                "\n - "+kindOfPrice[3];
            }
            if(i == inputFood.length-1)
                break;
            help +="\n";
        }

        replier.reply("--- 상암 점심 픽 키워드 목록 ---\n\n"+help);

        for (var i = 0; i < inputFoodOption.length; i++) {
            help2 += i+1+". "+inputFoodOption[i];
            if(i == 0) {
                help2 += "\n * 방금 전 점심 키워드를 다시 입력합니다."
            }else if(i == 1){
                help2 += "\n * 반복할 점심 키워드를 초기화합니다."
            } else if(i==2) {
                help2 += "\n * 반복하고 있는 점심 키워드를 조회합니다."
            }
            if(i == inputFoodOption.length-1)
                break;
            help2 +="\n";
        }

        replier.reply("-------- 기타 옵션 목록 --------\n\n"+help2);
    }

    // 식당별
    if(msg == inputFood[0]) {
        replier.reply(byRestaurant());
    }

    // 지하
    if(msg == inputFood[1]){
        replier.reply(byBasement());
    }

    // 가격별
    if(msg == inputFood[2]){
        replier.reply("가격 범위를 입력하여주세요."+
            "\n - "+kindOfPrice[0]+
            "\n - "+kindOfPrice[1]+
            "\n - "+kindOfPrice[2]+
            "\n - "+kindOfPrice[3]);
    }

    // 가격별
    if(msg == trimSpace(kindOfPrice[0])){
        replier.reply(byPrice(0));
    } else if(msg == trimSpace(kindOfPrice[1])){
        replier.reply(byPrice(1));
    } else if (msg == trimSpace(kindOfPrice[2])){
        replier.reply(byPrice(2));
    } else if(msg == trimSpace(kindOfPrice[3])){
        replier.reply(byPrice(3));
    } else if(msg == trimSpace(kindOfPrice[4])){
        replier.reply(byPrice(4));
    }

    // 포장 식당별
    if(msg == trimSpace(inputFood[3])){
        replier.reply(byTakeOutRestaurant());
    }

    // 포장 메뉴별
    if(msg == trimSpace(inputFood[4])){
        replier.reply(byTakeOutMenu());
    }

    if(msg == inputFood[5]){
        replier.reply(byKind());
    }

    for(var i=0 ; i< inputFood.length ; i++){
        if(msg == trimSpace(inputFood[i]))
            prevFoodMsg = msg;
    }

    for(var i=0 ; i<kindOfPrice.length ; i++){
        if(msg == trimSpace(kindOfPrice[i]))
            prevFoodMsg = msg;
    }

}

function trimSpace(str) {
    return str.replace(/ /gi,"");
}

function byRestaurant() {
    var data = read(filepath, "restaurant.csv");

    var randomRow = Math.floor((Math.random() * data.length));
    var randomCol = Math.floor((Math.random() * (data[randomRow].length - 1))) + 1;

    return data[randomRow][randomCol];

}

function byBasement() {
    var data = read(filepath, "basement.csv");
    var randomCol = Math.floor((Math.random() * (data[0].length - 1))) + 1;

    return data[0][randomCol];
}

function byPrice(row) {
    var data = read(filepath, "price.csv");

    if(row == 4){
        for(var j=0 ; j<data[1].length-1 ; j++) {
            data[4][j] = data[1][j+1];
        }

        for(var k=data[1].length ; k<data[1].length+data[2].length-1 ; k++){
            data[4][k] = data[2][k-data[1].length+1];
        }
    }

    var randomCol = Math.floor((Math.random() * (data[row].length - 1))) + 1;
    return data[row][randomCol];
}

function byTakeOutRestaurant() {
    var data = read(filepath, "takeout.csv");
    var randomCol = Math.floor((Math.random() * (data[0].length - 1))) + 1;

    return data[0][randomCol];
}

function byTakeOutMenu() {
    var data = read(filepath, "takeout.csv");
    var randomCol = Math.floor((Math.random() * (data[1].length - 1))) + 1;

    return data[1][randomCol];
}

function byKind() {
    var data = read(filepath, "restaurant.csv");
    var randomRow = Math.floor((Math.random() * (data.length)));

    return data[randomRow][0];
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