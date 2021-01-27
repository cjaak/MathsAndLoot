let digits = [0,1,2,3,4,5,6,7,8,9];
let qPart1;
let qPart2;
let qPart3;
let questionArray;
let solution;
let tryCount = 0;
let coinCount = 0;
let myTimeout;
let myTimer;
let time = 30;
let gridIndex;
//let lastGridIndex;
let exitIndex;
let chestCount = 10;
let exitClick = 0;
$(function() {
    //generateGrid();
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
    $("div.exit").click(function(){
        if(exitClick === 0){
            $("#grid .exit").css({"background-image" : "url('img/gate.png')"});
            exitClick++;
        }else{
            location.href="#exit";
        }
    })
    $("button#cancel").click(function(){
        location.href="#field";
    })
    $("button#exitGame").click(function(){
        location.href="#menu";
    })
    $("div.chest").click(function (){
        $(this).removeClass("chest");
        location.href="#chest";
        tryCount = 0;
        chestReset();
    })
    $(".arrows.up button").click(function(){
        let position = $(this).attr("class");
        let newIndex;
        let currentDigit = parseInt($("span." + position).text());
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
    });
    $("#ok").click(function (){
        $(this).prop('disabled', true);
        $(".lock button").prop('disabled', true);
        $(".timer").hide(0);
        clearTimeout(myTimeout);
        clearInterval(myTimer);
        if(checkAnswer()){
            generateLoot()
        }else{
            tryCount++;
            chestReset();
            setLife();
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


function drawGrid(){
    for (let i = 0; i < 100; i++){
        $("#grid").append("<div></div>");
    }
    exitIndex = getRndInteger(0,100);
    $("#grid div").eq(exitIndex).addClass("exit");
    do{
        gridIndex = getRndInteger(0,100);
        $("#grid div").eq(gridIndex).addClass("chest");
    }while( $(".chest").length < chestCount );
    do{
        exitIndex = getRndInteger(0,100);
    }while($("#grid div").eq(exitIndex).hasClass("chest"));
    console.log($("#grid div").eq(exitIndex));
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
    console.log("test");
    $(".reward-card").slideDown(1500);
    if (tryCount < 3) {
        let coinsGained= 0;
        $(".reward").css("background-image", "url(\"img/reward.png\")");
        switch (tryCount){
            case 0: coinsGained =3; break;
            case 1: coinsGained +=2; break;
            case 2: coinsGained +=1; break;
        }
        coinCount +=coinsGained;
        $(".coins").text(coinCount);
        $("#reward").text("Du erhältst " + coinsGained + " Münzen");
    }
    else{
        $(".reward").css("background-image", "url(\"img/truhe.png\")");
        $("#reward").text("Diese Truhe bleibt wohl für immer verschlossen.");
    }
}

function chestReset(){
    $(".reward-card").hide(0);
    setLife();
    console.log($(".chestBackground").css('background-image'));
    $("#ok").prop('disabled', false);
    $(".lock button").prop('disabled', false);
    $(".inputDigits span").text("0");
    $("#alert").text("");
    generateQuestion();
    $(".myTimer").text(time);
    $(".timerBox").html("<div class=\"timer\" style=\"--duration: 30\">\n" +
        "            <div></div>\n" +
        "        </div>").show();
    let seconds = time-1;
    myTimer = setInterval(function (){
        $(".myTimer").text(seconds--);
    }, 1000);
    myTimeout = setTimeout(function () {
        clearInterval(myTimer);
        $(".myTimer").text(0);
        if(tryCount < 3){
            tryCount++;
            setLife();
            $("#ok").prop('disabled', true);
            $(".lock button").prop('disabled', true);
            setTimeout(function (){
                chestReset();
            }, 3000);
        }
    }, time*1000);
    if (tryCount >= 3){
        clearInterval(myTimer);
        clearTimeout(myTimeout);
        $(".timerBox").hide()
        generateLoot();

    }

}

function setLife(){
    switch (tryCount){
        case 0: $('.lives span').show(); break;
        case 1: $('.lives span#heart3').hide(); break;
        case 2: $('.lives span#heart2').hide(); break;
        case 3: $('.lives span#heart1').hide(); break;

    }
}
