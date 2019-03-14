$(document).ready(function(){    //My JS starts past this point.


used100Questions = [];
used200Questions = [];
used300Questions = [];
used400Questions = [];
used500Questions = [];
used600Questions = [];
used700Questions = [];
used800Questions = [];
used900Questions = [];
used1000Questions = [];

const currentQuestions = {

}

//JService API Query
    let queryInterval = 1;
    let offsetInterval = 0;
    let qValue = queryInterval * 100;
    let targetArray;

function fillAllQs(){
    for (var i = 0; i < 10 ; i++){
        grabQuestions()
        queryInterval++
        console.log(queryInterval)
    }
    queryInterval=1;
    console.log(currentQuestions);
}
fillAllQs();

//API Functions
function grabQuestions(){
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
                            if(qValue === 700){
                                targetArray = used700Questions;
                            } else {
                                if(qValue === 800){
                                    targetArray = used800Questions;
                                } else {
                                    if(qValue === 900){
                                        targetArray = used900Questions;
                                    } else {
                                        if(qValue === 1000){
                                            targetArray = used1000Questions;
                                        } else {
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //Determine the offset for the jservice search query.
    if(targetArray === 96){
        offsetInterval++
    };
    const queryURL = "http://jservice.io/api/clues/?value=" + qValue + "&&offset=" + offsetInterval;
    $.get(queryURL, function(response){
        for (var j = 1 ; j <= 6; j++){
            randomQ = response[Math.floor(Math.random() * 100)];
            qObjName = "val"+qValue+"Num"+j;
            tempQ = {};
            tempQ[qObjName] = {
                id: randomQ.id,
                answer: randomQ.answer,
                question: randomQ.question,
                value: randomQ.value,
                airdate: randomQ.airdate,
                category: randomQ.category.title,
            }
            $.extend(currentQuestions, tempQ);
            targetArray.push(randomQ.id)
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

//DSZ JS begins.

//Config
var config = {
    apiKey: "AIzaSyBE2l3onlS-3BG2b2eMS75SsDarXCC-uyg",
    authDomain: "project-1.firebaseapp.com",
    databaseURL: "https://project-1270837446.firebaseio.com",
    storageBucket: "project-1.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//push the first name and the high score of the highest jeopardy scorer so far.
dataRef.ref().push({
    name: name,
    score: score,
});

dataRef.ref().on("child_added", function(childSnapshot){

    //add this to a high scores list on front end?
    $("#").append("<tr><td scope= 'row'>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().score + "</td></tr>");
})

//Now, input validation

let input = $("#").val().trim();

//DSZ to add more here.
//DSZ JS ends at this point.