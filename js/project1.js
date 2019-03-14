$(document).ready(function(){    //My JS starts past this point.


used100Questions = [];
used200Questions = [];
used300Questions = [];
used400Questions = [];
used500Questions = [];
used600Questions = [];
used800Questions = [];
used1000Questions = [];

const currentQuestions = {
    100 : {},
    200 : {},
    300 : {},
    400 : {},
    500 : {},
    600 : {},
    800 : {},
    1000 : {},
}

//JService API Query
    let queryInterval = 1;
    let offsetInterval = 0;
    let targetArray;

    grabQuestions();
//API Functions
function grabQuestions(){
    let qValue = queryInterval*100;
    //Determine which 
    if(qValue === 100){
        targetArray = used100Questions;
    } else {
        if(qValue === 200){
            targetArray = used200Questions;
        } else {
            if(qValue === 300){
                targetArray = used300Questions;
            } else {
                if(qValue === 400){
                    targetArray = used400Questions;
                } else {
                    if(qValue === 500){
                        targetArray = used500Questions;
                    } else {
                        if(qValue === 600){
                            targetArray = used600Questions;
                        } else {
                            if(qValue === 800){
                                targetArray = used800Questions;
                            } else {
                                if(qValue === 1000){
                                    targetArray = used1000Questions;
                                } else {
                                        
                                    }}}}}}}}

//Determine the offset for the jservice search query.
    if(targetArray === 96){
        offsetInterval++
    };

    const queryURL = "http://jservice.io/api/clues/?value=" + qValue + "&&offset=" + offsetInterval;
    $.get(queryURL, function(response){
        console.log(queryInterval);
        console.log(qValue);
        for (var j = 1 ; j <= 6; j++){
            let randomQ;
            randomSelectQ();
            function randomSelectQ(){
                randomQ = response[Math.floor(Math.random() * 100)];
                targetId = randomQ.id;
                if(targetArray.includes(targetId)){
                    console.log("we got one! - " + targetId);
                    randomSelectQ();
                } else{
                    return randomQ
                }
            }
            qObjName = "val"+qValue+"Num"+j;
            tempQ = {};
            tempQ[qObjName] = {
                id: randomQ.id,
                answer: randomQ.answer,
                question: randomQ.question,
                value: randomQ.value,
                airdate: randomQ.airdate,
                category: randomQ.category.title,
                imgUrl: "",
            }
            $.extend(currentQuestions[qValue], tempQ);
            targetArray.push(randomQ.id)
        }
        if(queryInterval < 10){
            ++queryInterval
        }
        if(queryInterval === 7 || queryInterval === 9){
            ++queryInterval
        }
        console.log(currentQuestions)
        if(qValue < 1000){
            grabQuestions();
        }
        });
    };



//Constructors and Prototypes
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
} 

//My JS Ends beyond this point.
});