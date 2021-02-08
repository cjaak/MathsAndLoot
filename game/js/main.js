/**@type {number[]}*/
const digits = [0,1,2,3,4,5,6,7,8,9];

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
const time = 30; //Zeit zum bearbeiten der Aufgabe in Sekunden

/**@type {number}*/
const gridColumn = 10; //Anzahl der Spalten des Spielfelds

/**@type {number}*/
const gridRow = 10; //Anzahl der Reihen des Spielfelds

/**@type {string}*/
let gridDivSize = "70px";

/**@type {number}*/
const chestCount = 10; //Anzahl der initialisierten Kisten

/**@type {number}*/
const definedRangeOfNumbersMin = 0; //Zahlenraum von

/**@type {number}*/
const definedRangeOfNumbersMax = 100; //Zahlenraum bis

/**@type {number}*/
const delay = 1500; //Abstand zur nächsten Aufgabe nach Fehler/Zeit um

/**
 * Dies ist die Haupt-jquery-Funktion. Sie regelt sämtliche Click-Events
 * */
$(function() {
    let exitClick = 0; //Anzahl der Klicks auf div.exit
    let nextCounter = 0; //Anzahl der Klicks auf "weiter" im Tutorial

    drawGrid();

    $("#start").on('click touch', function(){
        location.reload()
        location.href="#tutorial";
        tutorialClick(nextCounter);
    })
    $("#continue").on( 'click touch', function() {
        nextCounter++;
        console.log(nextCounter);
        tutorialClick(nextCounter);
    });

    $(".return.tutorial a").on('click touch', function (){
        nextCounter--;
        console.log(nextCounter);
        tutorialClick(nextCounter);
    })

    $("div.exit").on( 'click touch',function(){
        if(exitClick === 0){
            $("#grid .exit").css({"background-image" : "url('img/gate.png')"});
            createCoinGrid();
            exitClick++;
        }else{
            location.href="#exit";
            showCollectedCoins();
        }
    });

    $("button#cancel").on( 'click touch',function(){
        location.href="#field";
    });

    $("button#exitGame").on( 'click touch',function(){
        location.href="#menu";
    });

    $("div.chest").on( 'click touch',function (){
        $(this).removeClass("chest");
        location.href="#chest";
        tryCount = 0;
        chestReset();
    });

    $(".arrows button").on( 'click touch',function(){
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

    $("#ok").on( 'click touch',function (){
        disableButtons();
        stopTimeControl();
        if(checkAnswer()){
            generateLoot()
        }else{
            failedAttempt();
        }
    });

    $("#chest .return, #fertig").on('click touch', function (){
        stopTimeControl();
        location.href='#field';
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
 * Diese Funktion legt die Anzahl der Reihen und Spalten eines Grids fest.
 * @param {number} row Anzahl der Reihen
 * @param {number} column Anzahl der Spalten
 * @param {string} selector Selector des Grids
 * */
function setGridRowAndColumn(selector, row, column){
    $(selector).css({
        "grid-template-rows" : "repeat("+ row+", 1fr)",
        "grid-template-columns" : "repeat("+ column+", 1fr)"
    });
}

/**
 * Diese Funktion erstellt das Spielfeld
 * */
function drawGrid(){
    let exitIndex, gridIndex;
    let sizeOfGrid = gridColumn*gridRow;

    setGridRowAndColumn("#grid", gridRow, gridColumn);

    for (let i = 0; i < sizeOfGrid; i++){
        $("#grid").append("<div></div>");
    }
    exitIndex = getRndInteger(0,sizeOfGrid-1);
    $("#grid div").eq(exitIndex).addClass("exit");

    do{
        gridIndex = getRndInteger(0,sizeOfGrid-1);
        if(gridIndex !== exitIndex) $("#grid div").eq(gridIndex).addClass("chest");
    }while( $(".chest").length < chestCount );

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
    }while(qPart3 > definedRangeOfNumbersMax || checkForSameNumbers(qPart1,qPart2,qPart3))
    let questionArray = [qPart1, qPart2, qPart3];
    console.log(questionArray);
    return questionArray;
}

/**
 * Diese Funktion erstellt eine Subtraktionsaufgabe.
 *
 * @returns {number[]} Das Array mit dem Inhalt: [ Minuend, Subtrahend, Differenz]
 * */
function createSubtraction() {
    let qPart1, qPart2, qPart3;
    do{
        qPart1 = getRndInteger(definedRangeOfNumbersMin,definedRangeOfNumbersMax);
        qPart2 = getRndInteger(definedRangeOfNumbersMin,definedRangeOfNumbersMax);
        qPart3 = qPart1 - qPart2;
    }while(qPart3 < definedRangeOfNumbersMin || checkForSameNumbers(qPart1,qPart2,qPart3))
    let questionArray = [qPart1, qPart2, qPart3];
    console.log(questionArray);
    return questionArray;
}

/**
 * Diese Funktion überprüft, ob unter drei Zahlen gleiche sind
 * @returns {boolean} wenn mindestens zwei gleich sind true
 * */
function checkForSameNumbers(num1, num2, num3){
    return num1 === num2 || num1 === num3 || num2 === num3;
}

/**
 * Diese Funktion gibt die zufällig eine Addition oder Subtraktion Aufgabe aus. Dabei wird zufällig eine der drei Stellen bei der Ausgabe weggelassen. Dies ist der zu lösende Teil.
 *
 * */
function generateQuestion(){
    let questionArray;
    let operator;
    let chooseOperator = getRndInteger(0,1);
    switch (chooseOperator) {
        case 0:
            questionArray = createSummation();
            operator = " + ";
            break;
        case 1:
            questionArray = createSubtraction();
            operator = " - ";
            break;
    }

    solution = questionArray[getRndInteger(0,2)];
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
    $(".reward-card").slideDown(1500, function (){
        $("#fertig").fadeIn("slow");
    });
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
           failedAttempt();
        }
    }, time*1000);
}

/**
 * Diese Funktion regelt das Prozedere, nachdem es dem Spieler nicht möglich war, die richtige Antwort rechtzeitig anzugeben.
 * */
function failedAttempt(){
    tryCount++;
    setLife();
    disableButtons();
    setTimeout(function (){
        chestReset();
    }, delay);
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
/**
 * Diese Funktion steuert das vor und zurück Klicken im Tutorial, sowie dessen Inhalt.
 * @param {number} counter Zählvariable, um festzustellen, welcher Content als nächstes angezeigt wird.
 * */
function tutorialClick(counter){
    let contentText; //Inhalt Textteil Tutorial
    let backgroundImg;
    switch (counter){
        case -1: $(".return.tutorial a").attr("href", "#menu"); break;
        case 0: contentText =  "Willkommen am Hof der bösen Magierin Zahlgie. Lady Zahlgie hat meine wertvolle Münzsammlung in Truhen in ihrem Garten versteckt. Die Truhen sind mit einem Zahlenschloss versiegelt. Der Code, für das Schloss ist auf den deckeln der Truhen magisch hinterlassen, allerdings verschlüsselt. Nur ein wahrer Held kann die Aufgaben lösen:  Du musst mir helfen meine Münzen wieder zu erhalten";
            backgroundImg = "";
            $(".return.tutorial a").attr("href", "#tutorial");
            break;
        case 1: contentText ="Betritt den Garten und untersuche eine Truhe, indem du auf einen Hinweis Marker klickst. Bedenke jedoch, dass du den Inhalt der Truhe für immer verlierst, wenn du sie nur untersuchst, aber die Aufgabe nicht löst";
            backgroundImg = "url('img/screenshots/grid.png')";
            break;
        case 2: contentText ="Du hast für jede Aufgabe " +time+ " Sekunden Zeit. Wenn du es nicht schaffst die Aufgabe in der Zeit zu lösen oder du sie falsch löst, erscheint eine neue Aufgabe und du verlierst ein Leben. Ändere die aktuelle Stelle, indem du jeweils die 1er, 10er oder 100er Stelle verstellst.";
            backgroundImg = "url('img/screenshots/chestdialog.png')";
            break;
        case 3: contentText ="Je weniger Leben du verlierst, desto besser wird die Belohnung ausfallen";
            backgroundImg = "url('img/screenshots/reward.png')";
            break;

        case 4: contentText ="Vorsicht, sobald du den Garten betrittst, verlierst du die Orientierung und siehst den Ausgang nicht mehr. Suche auch den Ausgang unter einem der Hinweis Marker.";
            backgroundImg = "url('img/screenshots/grid.png')";
            $("#continue").text("Spiel starten");
            break;
        default: location.href="#field"; break;
    }
    $("#tutorialText p").html(contentText);
    $("#screenshot").css({
        "background-image": backgroundImg
    });
}

function showCollectedCoins(){
    // let i = 0;
    // while(i < coinCount){
    //     $(".coinGrid img").eq(i).fadeIn("slow");
    //     setTimeout(function (){
    //         i++;
    //     }, 1000);
    // }
    for (let i=0; i<coinCount; i++){
        console.log("EQ"+ i);
        $(".coinGrid img").eq(i).fadeIn(delay);
    }
}

function createCoinGrid(){
    let coinGridSize = chestCount * 3;
    // setGridRowAndColumn(".coinCount",chestCount, 3);
    for (let i = 0; i < coinGridSize; i++){
        $(".coinGrid").append("<img src=\"img/coin.png\" alt=\"Münze\" height=\"30\" width=\"30\">");
    }
    $(".coinGrid img").hide();
}
