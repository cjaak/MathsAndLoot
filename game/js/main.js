let gridRowCount = 10;
let gridColumnCount = 10;
let myGrid = [];
let digits = [0,1,2,3,4,5,6,7,8,9];
let qPart1;
let qPart2;
let qPart3;
let questionArray;
let solution;
let tryCount = 0;
let coinCount = 0;
$(function() {
    drawGrid();
    let nextCounter = 0;
    $("#weiter").click(function() {
         switch (nextCounter){
             case 0: $("#tutorialText p").html("einmal weiter"); break;
             case 1: $("#tutorialText p").html("zweimal weiter"); break;
             case 2: $("#tutorialText p").html("dreimal weiter"); break;
             case 3: $("#tutorialText p").html("viermal weiter"); break;
             case 4: location.href="#field";
             default: break;
         }
         nextCounter++;
    });
    $("button.chest").click(function (){
        $(this).hide();
        location.href="#chest";
        chestReset();
    })
    $(".arrows.up button").click(function(){
        let position = $(this).attr("class");
        let newIndex;
        currentDigit = parseInt($("span." + position).text());
        if(currentDigit === digits[digits.length -1]){
            newIndex = 0;
        }else {
            newIndex = findIndexInDigits(currentDigit) + 1;
        }
        $("span." + position).text(digits[newIndex]);
    });
    $(".arrows.down button").click(function(){
        let position = $(this).attr("class");
        let newIndex;
        currentDigit = parseInt($("span." + position).text());
        if(currentDigit === digits[0]){
            newIndex = digits.length -1;
        }else {
            newIndex = findIndexInDigits(currentDigit) - 1;
        }
        $("span." + position).text(digits[newIndex]);
        console.log(getAnswer());
    });
    $("#ok").click(function (){
        console.log(checkAnswer());
        $(this).prop('disabled', true);
        if(checkAnswer()){
            $(".timer").hide(0);
            generateLoot()
        }else{
            tryCount++;
        }
    });
});

function findIndexInDigits(num){
    for (let i=0; i<digits.length; i++){
        if (digits[i] === num){
            return i;
        }
    }
    return -1;
}

function getAnswer(){
    return $("#digit100").text() * 100 + $("#digit10").text() * 10 + $("#digit1").text() * 1;
}

function generateGrid(){
    for (let i=0; i < gridRowCount; i++ ){
        myGrid[i] = [];
        for (let j=0; j < gridColumnCount; j++){
            myGrid[i][j] = {x: 0, y: 0, status: 1}
        }
    }
}
function drawGrid(){
    for (let i = 0; i < 10; i++){
        $("#grid").append("<button class=\"chest\">CHEST</button>")
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function generateQuestion(){
    do{
        qPart1 = getRndInteger(1,100);
        qPart2 = getRndInteger(1,100);
        qPart3 = qPart1 + qPart2;
    }while(qPart3 > 100)
    questionArray = [qPart1, qPart2, qPart3];
    solution = questionArray[getRndInteger(0,2)];
    console.log(questionArray);
    let q1 = (solution === qPart1) ? "....." : qPart1;
    let q2 = (solution === qPart2) ? "....." : qPart2;
    let q3 = (solution === qPart3) ? "....." : qPart3;
    $("#question").text((q1 + " + " + q2 + " = " + q3));
}

function checkAnswer(){
    if(getAnswer() === solution){
        return true;
    }else{
        return false;
    }
}

function generateLoot(){
    switch (tryCount){
        case 0: coinCount +=3; break;
        case 1: coinCount +=2; break;
        case 2: coinCount +=1; break;
        default: $("#alert").text("leider ist das Schloss kaputt gegangen, der Inhalt ist wohl verloren gegangen");
                 break;
    }
    $(".coins").text(coinCount + " Münzen");
}

function chestReset(){
    console.log(tryCount);
    $("#ok").prop('disabled', false);
    $(".inputDigits span").text("0");
    $("#alert").text("");
    generateQuestion();
    $(".timerBox").html("<div class=\"timer\" style=\"--duration: 30\">\n" +
        "            <div></div>\n" +
        "        </div>").show();
    setTimeout(function () {
        if(!checkAnswer()){
            tryCount++;
            chestReset();
        }
    }, 30000);
    if (tryCount > 3){
        $("#alert").text("leider ist das Schloss kaputt gegangen, der Inhalt ist wohl verloren gegangen");
    }
}
