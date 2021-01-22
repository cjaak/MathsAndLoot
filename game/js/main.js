let gridRowCount = 10;
let gridColumnCount = 10;
let myGrid = [];
let digits = [0,1,2,3,4,5,6,7,8,9];
$(function() {
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

}
