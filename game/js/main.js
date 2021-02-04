/**@type {number[]}*/
let digits = [0,1,2,3,4,5,6,7,8,9];

/**@type {number}*/
let solution; //Lösung

/**@type {number}*/
let tryCount = 0; //verbrauchte Versuche

/**@type {number}*/
let coinCount = 0; //gesammelte Münzen

/**@type {number}*/
let myTimeout; //setTimeout-Id zum stoppen

/**@type {number}*/
let myTimer; //setInterval-Id zum stoppen

/**@type {number}*/
let time = 30; //Zeit zum bearbeiten der Aufgabe in Sekunden

/**@type {number}*/
let gridColumn = 10; //Anzahl der Spalten des Spielfelds

/**@type {number}*/
let gridRow = 10; //Anzahl der Reihen des Spielfelds

/**@type {string}*/
let gridDivSize = "70px";

/**@type {number}*/
let chestCount = 10; //Anzahl der initialisierten Kisten

/**@type {number}*/
let definedRangeOfNumbersMin = 0; //Zahlenraum von

/**@type {number}*/
let definedRangeOfNumbersMax = 100; //Zahlenraum bis

/**@type {number}*/
let delay = 1500; //Abstand zur nächsten Aufgabe nach Fehler/Zeit um

/**
 * Dies ist die Haupt-jquery-Funktion. Sie regelt sämtliche Click-Events
 * */
$(function() {
    let exitClick = 0; //Anzahl der Klicks auf div.exit
    let nextCounter = 0; //Anzahl der Klicks auf "weiter" im Tutorial
    let contentText; //Inhalt Textteil Tutorial

    drawGrid();

    /**
     * Diese Funktion erneuert pro weiter-Klick den Inhalt der Tutorial Seite.
     * */
    $("#continue").on( 'click', function() {
         switch (nextCounter){

             case 0: contentText ="Betritt den Garten und untersuche eine Truhe, indem du auf einen Hinweis Marker klickst. Bedenke jedoch, dass du den Inhalt der Truhe für immer verlierst, wenn du sie nur untersuchst, aber die Aufgabe nicht löst"; break;
             case 1: contentText ="Du hast für jede Aufgabe " +time+ " Sekunden Zeit. Wenn du es nicht schaffst die Aufgabe in der Zeit zu lösen oder du sie falsch löst, erscheint eine neue Aufgabe und du verlierst ein Leben."; break;
             case 2: contentText ="Je weniger Leben du verlierst, desto besser wird die Belohnung ausfallen"; break;
             case 3: contentText ="Vorsicht, sobald du den Garten betrittst, verlierst du die Orientierung und siehst den Ausgang nicht mehr. Suche auch den Ausgang unter einem der Hinweis Marker.";
                        $("#continue").text("Spiel starten")
                        break;
             case 4: location.href="#field"; break;
         }
        $("#tutorialText p").html(contentText);
         nextCounter++;
    });

    $("div.exit").on( 'click',function(){
        if(exitClick === 0){
            $("#grid .exit").css({"background-image" : "url('img/gate.png')"});
            exitClick++;
        }else{
            location.href="#exit";
        }
    });

    $("button#cancel").on( 'click',function(){
        location.href="#field";
    });

    $("button#exitGame").on( 'click',function(){
        location.href="#menu";
        location.reload();
    });

    $("div.chest").on( 'click',function (){
        $(this).removeClass("chest");
        location.href="#chest";
        tryCount = 0;
        chestReset();
    });

    $(".arrows button").on( 'click',function(){
        let position = $(this).attr("class");
        let newIndex;
        let currentDigit = parseInt($("span." + position).text());
        if ($(this).parent().hasClass("up")){
            if(currentDigit === digits[digits.length -1]){
                newIndex = 0;
            }else {
                newIndex = findIndexInDigits(currentDigit) + 1;
            }
        }else{
            if(currentDigit === digits[0]){
                newIndex = digits.length -1;
            }else {
                newIndex = findIndexInDigits(currentDigit) - 1;
            }
        }
        $("span." + position).text(digits[newIndex]);
    });

    $("#ok").on( 'click',function (){
        disableButtons();
        stopTimeControl();
        if(checkAnswer()){
            generateLoot()
        }else{
            tryCount++;
            setTimeout(function (){
                chestReset();
            },delay);
            setLife();
        }
    });

    $("#chest .return").on('click', function (){
        stopTimeControl();
    })
});

/**
 * Diese Funktion sucht die Position im Digit-Array, an der die angegebene Zahl ist.
 *
 * @param {number} num Zahl, dessen Index im Digit-Array gefunden werden soll
 * @returns {number} Index der gefundenen Zahl
 * */
function findIndexInDigits(num){
    for (let i=0; i<digits.length; i++){
        if (digits[i] === num){
            return i;
        }
    }
    return -1;
}

/**
 * Diese Funktion liest aus der Eingabe einen numerischen Wert aus.
 *
 * @returns {number} eingegebene Antwort
 * */
function getAnswer(){
    return $("#digit100").text() * 100 + $("#digit10").text() * 10 + $("#digit1").text() * 1;
}
/**
 * Diese Funktion legt die Anzahl der Reihen und Spalten des Spielfelds fest.
 * */
function setGridRowAndColumn(){
    let rowString = "";
    let columnString = "";

    for (let i = 0; i<gridRow; i++){
        rowString += gridDivSize+ ", ";
        if(i===rowString-1) rowString = rowString.substr(0, rowString.length -2);
    }

    for (let i = 0; i<gridColumn; i++){
        columnString += gridDivSize+ ", ";
        if(i===gridColumn-1) columnString = columnString.substr(0, columnString.length -2);
    }

    $("#grid").css({
        "grid-template-rows" : rowString,
        "grid-template-columns" : columnString
    });
}

/**
 * Diese Funktion erstellt das Spielfeld
 * */
function drawGrid(){
    let exitIndex, gridIndex;
    let sizeOfGrid = gridColumn*gridRow;

    setGridRowAndColumn();

    for (let i = 0; i < sizeOfGrid; i++){
        $("#grid").append("<div></div>");
    }

    do{
        gridIndex = getRndInteger(0,sizeOfGrid-1);
        if(gridIndex !== exitIndex) $("#grid div").eq(gridIndex).addClass("chest");
    }while( $(".chest").length < chestCount );
    do{
        exitIndex = getRndInteger(0,sizeOfGrid-1);
    }while($("#grid div").eq(exitIndex).hasClass("chest"));
    $("#grid div").eq(exitIndex).addClass("exit");
}

/**
 * Diese Funktion bestimmt einen zufälligen ganzzahligen Wert aus dem Interval [min, max]
 * @param {number} min Die untere Interval Grenze
 * @param {number} max Die obere Interval Grenze
 * @returns {number} Der zufällige Wert
 * */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/**
 * Diese Funktion erstellt eine Additionsaufgabe.
 *
 * @returns {number[]} Das Array mit dem Inhalt: [ 1.Summand, 2.Summand, Summe]
 * */
function createSummation(){
    let qPart1, qPart2, qPart3;
    do{
        qPart1 = getRndInteger(definedRangeOfNumbersMin,definedRangeOfNumbersMax);
        qPart2 = getRndInteger(definedRangeOfNumbersMin,definedRangeOfNumbersMax);
        qPart3 = qPart1 + qPart2;
    }while(qPart3 > definedRangeOfNumbersMax || qPart1 === qPart2)
    let questionArray = [qPart1, qPart2, qPart3];
    console.log(questionArray);
    return questionArray;
}

/**
 * Diese Funktion gibt die Aufgabe aus. Dabei wird zufällig eine der drei Stellen bei der Ausgabe weggelassen. Dies ist der zu lösende Teil.
 *
 * */
function generateQuestion(){
    let questionArray = createSummation();
    solution = questionArray[getRndInteger(0,2)];
    let operator = " + ";
    let q1 = (solution === questionArray[0]) ? "....." : questionArray[0];
    let q2 = (solution === questionArray[1]) ? "....." : questionArray[1];
    let q3 = (solution === questionArray[2]) ? "....." : questionArray[2];
    $("#question").text((q1 +  operator  + q2 + " = " + q3));
}
/**
 * Diese Funktion überprüft, ob die User Eingabe mit der korrekten Lösung übereinstimmt
 * @returns {boolean} Die Übereinstimmung
 * */
function checkAnswer(){
    return getAnswer() === solution;
}

/**
 * Diese Funktion erstellt den Loot-Bildschirm, je nach verbrauchten Versuchen
 * */
function generateLoot(){
    console.log("test");
    $(".reward-card").slideDown(1500);
    if (tryCount < 3) {
        let coinsGained= 0;
        $(".reward").css("background-image", "url(\"img/reward.png\")");
        switch (tryCount){
            case 0: coinsGained = 3; break;
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

/**
 * Diese Funktion startet einen neuen Aufgabendialog.
 * */
function chestReset(){
    $(".reward-card").hide(0);
    setLife();
    console.log($(".chestBackground").css('background-image'));
    activateButtons();
    $(".inputDigits span").text("0");
    generateQuestion();
    startTimeControl();
    if (tryCount >= 3){
        stopTimeControl()
        generateLoot();
    }
}
/**
 * Diese Funktion aktiviert den OK Button, sowie die hoch und runter Buttons am Zahlenrad
 * */
function activateButtons(){
    $("#ok").prop('disabled', false);
    $(".lock button").prop('disabled', false);
}
/**
 * Diese Funktion deaktiviert den OK Button, sowie die hoch und runter Buttons am Zahlenrad
 * */
function disableButtons(){
    $(this).prop('disabled', true);
    $(".lock button").prop('disabled', true);
}

/**
 * Diese Funktion startet den Timer und zeigt diesen an.
 * */
function startTimeControl(){
    $(".myTimer").text(time);
    $(".timerBox").html("<div class=\"timer\" style=\"--duration: " + time + " \">\n" +
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
            }, delay);
        }
    }, time*1000);
}
/**
 * Diese Funktion stoppt den Timer und blendet diesen aus.
 * */
function stopTimeControl(){
    console.log("clear")
    clearInterval(myTimer);
    clearTimeout(myTimeout);
    $(".timerBox").html("").hide();
}

/**
 * Diese Funktion setzt die Lebensanzeige den verbrauchten Versuchen entsprechend auf
 * */
function setLife(){
    switch (tryCount){
        case 0: $('.lives span').show(); break;
        case 1: $('.lives span#heart3').hide(); break;
        case 2: $('.lives span#heart2').hide(); break;
        case 3: $('.lives span#heart1').hide(); break;

    }
}
