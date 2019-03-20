$(document).ready(function () {    //My JS starts past this point.

    //Game State Settings
    startScreenUp = true;
    gameOn = false;
    gameLoading = false;
    qScreenUp = false;
    endScreen = false;
    playerAnswerCorrect = false;

    //Used Question Arrays
    let used100Questions = [];
    let used200Questions = [];
    let used300Questions = [];
    let used400Questions = [];
    let used500Questions = [];
    let used600Questions = [];
    let used800Questions = [];
    let used1000Questions = [];

    //Our Question Object
    const currentQuestions = {
        100: {},
        200: {},
        300: {},
        400: {},
        500: {},
        600: {},
        800: {},
        1000: {},
    }

    let playerName; //This variable is used to store the current player's name. 
    let thisQsId; //This variable is used to hold the currently selected question's Id.
    let thisAnswer; //This variable is used to hold the correct answer to the current question, raw before validation.
    let thisValue;
    let answerForValidating; //This variable holds the player's raw answer input, before any validation.
    let currentQurl; //This variable is used to store the url that will be used for the current selected question.
    let rowInterval = 1; //This variable is used when constructing the question rows on game start.

    //JService API Query
    let queryInterval = 1;
    let offsetInterval = 0;
    let targetArray = []

    grabQuestions();
    //API Functions
    function grabQuestions() {
        gameLoading = true;
        let qValue = queryInterval * 100;
        //Determine which used question array is being targeted for each go through.
        switch (qValue) {
            case 100:
                targetArray = used100Questions;
                break;
            case 200:
                targetArray = used200Questions;
                break;
            case 300:
                targetArray = used300Questions;
                break;
            case 400:
                targetArray = used400Questions;
                break;
            case 500:
                targetArray = used500Questions;
                break;
            case 600:
                targetArray = used600Questions;
                break;
            case 800:
                targetArray = used800Questions;
                break;
            case 1000:
                targetArray = used1000Questions;
                break;
            default:
                break;
        }
        if (targetArray === 96) {//Determine the offset for the jservice search query.
            offsetInterval++
        };
        const offset = offsetInterval * 96;
        const queryURL = "http://jservice.io/api/clues/?value=" + qValue + "&&offset=" + offset; //Create the Query URL to pull from jService.
        $.get(queryURL, function (response) {
            let qsGrabbed = false;
            for (let j = 1; j <= 6; j++) {
                let randomQ;
                randomSelectQ();
                function randomSelectQ() {
                    randomQ = response[Math.floor(Math.random() * 100)];
                    targetId = randomQ.id;
                    if (targetArray.includes(targetId)) {
                        // console.log("we got one! - " + targetId);
                        randomSelectQ();
                    } else {
                        return randomQ
                    }
                }
                qObjName = "val" + qValue + "Num" + j;
                qCheck = currentQuestions[qValue].qObjName
                if(qCheck === undefined || qCheck === undefined){
                    tempQ = {};
                    tempQ[qObjName] = {
                        id: randomQ.id,
                        answer: randomQ.answer,
                        question: randomQ.question,
                        value: randomQ.value,
                        airdate: randomQ.airdate,
                        category: randomQ.category.title,
                    }
                    $.extend(currentQuestions[qValue], tempQ);
                    targetArray.push(randomQ.id)
                }
            }
            if (queryInterval < 10) {
                ++queryInterval
            }
            if (queryInterval === 7 || queryInterval === 9) {
                ++queryInterval
            }
            if (qValue < 1000) {
                grabQuestions();
            } else {
                gameLoading = false;
                console.log(currentQuestions);
            }
        });

    };

    //When a question button is clicked...
    //Grab the category from the button (however it is stored).

    function grabPics() {
        gameLoading = true;
        let rawSearchTerm = thisCategory; //REPLACE WITH JQUERY CONNECTION TO STORED CATEGORY.
        let pixSearchTerm = rawSearchTerm.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const queryURL = "https://pixabay.com/api/?key=11885345-90fa971b5ced0a2f9df494b51&q=" + pixSearchTerm + "&orientation=horizontal&safesearch=true&order=popular&per_page=3"; //Create the Query URL to pull from Pixabay.
        $.get(queryURL) //kick off a promise (pending)
            .then(function (response) { //do stuff when it is resolved or rejected
                if (response.totalHits === 0) { //check if we need to do the request again
                    let newPixSearchTerm = pixSearchTerm.split(" ")[0];
                    const newQueryURL = "https://pixabay.com/api/?key=11885345-90fa971b5ced0a2f9df494b51&q=" + newPixSearchTerm + "&orientation=horizontal&safesearch=true&order=popular&per_page=3"; //Create the Query URL to pull from Pixabay.
                    return $.get(newQueryURL); //if so, return a new pending promise
                }
                return response; //if we don't, return the original response
            })
            .then(function (response) {
                if (response.totalHits === 0) { //check if we need to do the request again
                    return currentQurl = "/assets/images/alexTrebek.jpg";
                }
                return response.hits[0].largeImageURL;
            })
            .done(function (currentQurl) { //do finalization tasks
                console.log('pics gotten!');
                console.log(currentQurl);
                $(".categoryImg").attr("src", currentQurl.toString());
                gameLoading = false;
            })
            .catch(function (error) {
                console.log(error);
                currentQurl = "/assets/images/alexTrebek.jpg";
                $(".categoryImg").attr("src", currentQurl.toString());
                console.log(currentQurl);
                gameLoading = false;
            });
    }

    function fillQBtns() {
        let questionInterval = rowInterval
        switch (questionInterval) {
            case 7:
                questionInterval = 8;
                break;
            case 8:
                questionInterval = 10;
                break;
            default:
                break;
        }
        const questionValue = questionInterval * 100;
        if (rowInterval <= 8) {
            ++rowInterval
            const gameFrame = $(".gameboard")
            const gameRow = $("<tr>");
            rowId = questionValue + "Row"
            gameRow.attr("id", rowId)
            gameFrame.append(gameRow);
            for (let i = 1; i <= 6; ++i) {
                const questionBucket = $("<td>");
                // questionFrame = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                // questionFrame.setAttribute('id', "squareExample");
                // questionBucket.innerHTML = '';
                questionBucket.html("<svg xmlns='http://www.w3.org/2000/svg' id='squareExample'><symbol id='gameSpace' class='gameSpace' x='0px' y='0px'><rect x='2.5' y='2.5' class='st0' width='100%' height='70px' fill='navy' stroke='black' stroke-width='5px'/></symbol></svg>");
                // const questionUse = $('<svg xmlns="http://www.w3.org/2000/svg" id="squareExample"><symbol id="gameSpace" class="gameSpace x="0px" y="0px">
                // <rect x="2.5" y="2.5" class="st0" width="195px" height="95px" fill="navy" stroke="black" stroke-width="5px"/></symbol></svg>'
                // );
                // questionUse = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
                // questionUse.setAttribute('id', "gameSpace");
                // questionUse.setAttribute('class', "gameSpace");
                // questionUse.setAttribute('y', '0px');
                // questionUse.setAttribute('x', '0px');
                // questionFrame.appendChild(questionUse);
                // questionobj = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                // questionobj.setAttribute('id', "gameSpace");
                // questionobj.setAttribute('class', "st0");
                // questionobj.setAttribute('width', "195px");
                // questionobj.setAttribute('height', "95px");
                // questionobj.setAttribute('style', "fill:navy; stroke:black; stroke-width:5px");
                // questionobj.setAttribute('y', '2.5');
                // questionobj.setAttribute('x', '2.5');
                // questionUse.appendChild(questionobj);
                const questionText = $("<p>");
                questionId = "val" + questionValue + "Num" + i;
                oneDeep = currentQuestions[questionValue]
                twoDeep = oneDeep[questionId].value;
                displayValue = twoDeep;
                questionText.attr("class", "amount text-center").text("$" + displayValue);
                questionBucket.attr("class", "questionBucket unansweredQ").attr("id", questionId).append(questionText);
                $("#" + rowId).append(questionBucket);
            }
            fillQBtns();
        }
    }

    function resolveSubmission() {
        if(playerAnswerCorrect === true){
            $(".gameboard").removeClass("buryIt");
            $(".questionBoard").addClass("buryIt");
        } else {
            if(playerAnswerCorrect === false){
                gameOn = false;
                endScreen = true;
                //remove buryIt class from end screen
                $(".realAnswer").text(thisAnswer);
            }
        }
    }

    $(".submit-name").on("click", function (event) {
        event.preventDefault();
        if (gameOn === false && startScreenUp === true && qScreenUp === false && gameLoading === false && endScreen === false) {
            gameOn = true;
            fillQBtns();
            playerName = $(".name-input").val();
            console.log(playerName)
           // $("#current-total").text(0);
            $("#nameEntry").addClass("buryIt");
            startScreenUp = false;
            $(".gameboard").removeClass("buryIt");
        } else { console.log("Something's not right!") }
    })

    $(document).on({ //Exact syntax for mouse enter and leave events on populated items comes from Sethen at Stack Overflow: Source: "https://stackoverflow.com/questions/9827095/is-it-possible-to-use-jquery-on-and-hover"
        mouseenter: function () {
            if (gameOn === true && startScreenUp === false && qScreenUp === false && gameLoading === false && endScreen === false) {
                associatedQ = $(this).parent().attr("id");
                associatedValue = $(this).text().replace(/\$/, "");
                associateDeeper = currentQuestions[associatedValue]
                associatedCategory = associateDeeper[associatedQ].category;
                $(this).text(associatedCategory);
                $(this).addClass("smallerText");
            } //else { console.log("Something's not right!") }
        },
        mouseleave: function () {
            if (gameOn === true && startScreenUp === false && qScreenUp === false && gameLoading === false && endScreen === false) {
                reValue = $(this).parent().parent().attr("id");
                replaceValue = reValue.replace(/[Row]/g, "");
                $(this).text("$" + associatedValue);
                $(this).removeClass("smallerText");
            } //else { console.log("Something's not right!") }
        }
    }, ".amount");

    $(document).on("click", ".unansweredQ", function () {
        if (gameOn === true && startScreenUp === false && qScreenUp === false && gameLoading === false && endScreen === false) {
            qScreenUp = true;
            $(this).removeClass("unansweredQ");
            thisQsId = $(this).attr("id");
            narrowValue = $(this).parent().attr("id");
            newValue = narrowValue.replace(/[Row]/g, "");
            thisValue = currentQuestions[newValue];
            thisQuestion = thisValue[thisQsId];
            thisAnswer = thisQuestion.answer;
            thisQText = thisQuestion.question;
            thisAirDate = thisQuestion.airdate;
            thisCategory = thisQuestion.category;
            $(this).text("");
            $(".currentQText").text(thisQText);
            $(".gameboard").addClass("buryIt");
            $(".questionBoard").removeClass("buryIt");
            grabPics();
        }
    })

    $(document).on("click", ".submitAnswer", function (event) {
        event.preventDefault();
        if (gameOn === true && startScreenUp === false && qScreenUp === true && gameLoading === false && endScreen === false) {
            qScreenUp = false;
            $(".categoryImg").attr("src", "assets/images/alexTrebek.jpg");
            answerForValidating = $(".playerAnswer").val();
            $(".gameboard").removeClass("buryIt"); //Might change based on future needs. Currently exists to facilitate screen switching for testing.
            $(".questionBoard").addClass("buryIt"); //Might change based on future needs. Currently exists to facilitate screen switching for testing.
            gameMath();//Calling the function to do the game math
            validating();//Calling the function to validate the input
        }
    })


    //HOPEFULLY this will work, but please test it once the play-again button exists. Be sure to use the class I targeted.
    $(".play-again").on("click", function (event) {
        event.preventDefault();
        if (gameOn === false && startScreenUp === false && qScreenUp === false && gameLoading === false && endScreen === true) {
            gameOn = true;
            endScreen = false;
            grabQuestions();
            fillQBtns();
           // $("#current-total").text(0);
            $(".gameboard").removeClass("buryIt");
        } else { console.log("Something's not right!") }
    })

    //Constructors and Prototypes
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        }
        this.stop = function () {
            this.sound.pause();
        }
    }

    //Config
    var config = {
        apiKey: "AIzaSyBE2l3onlS-3BG2b2eMS75SsDarXCC-uyg",
        authDomain: "project-1-62290.firebaseapp.com",
        databaseURL: "https://project-1-62290.firebaseio.com",
        storageBucket: "project-1-62290.appspot.com"
    };
    firebase.initializeApp(config);

    //assign the reference to the database to dataref
    var dataRef= firebase.database();

    //initial values
    var yourName = "";
    var yourScore = "";
    var highName = "";
    var highScore = "";


    //push the first name and the high score of the highest jeopardy scorer so far.
    dataRef.ref().set({
        yourName: yourName,
        yourScore: yourScore,
        highName: highName,
        highScore: highScore,
    });

    dataRef.ref().on("value", function (snapshot) {

        if (snapshot.child("highName").exists() && snapshot.child("highScore").exists()) {
            //set variables to equal the stored values
            let highName = snapshot.val().highName;
            let highScore = snapshot.val().highScore;

            //change html to reflect the stored values
            $("#here").append("<tr><td scope= 'row'>" + snapshot.val().highName + "</td><td>" + snapshot.val().highScore + "</td></tr>");


            //print to console
            console.log(highName);
            console.log(highScore);

        } //if Firebase doesnt have highest yet
        else {

            $("#here").append("<tr><td scope= 'row'> 'No one yet' </td><td> '0' </td></tr>");

        }
    }, function (errorObject) {
        //log error to console
        console.log("The read failed: " + errorObject.code);
    });

    //initial values
    var currentScore= 0;
    
    //validating function
    function validating(){
        if(/^[a-zA-Z0-9- ]*$/.test(answerForValidating) == false) {
            console.log("This contains illegal characters. Try again.");
            return;
        }
    }
    //game math function
    function gameMath(){

        if (thisQuestion.answer.trim().toLowerCase().includes(answerForValidating)){ //Feel free to make this more detailed.
            currentScore+=thisQuestion.value;
            console.log("This was the value of the question " + thisQuestion.answer);
            console.log("This is the current score" + currentScore);
        }else {
            currentScore-=thisQuestion.value;
            console.log("This was the value of the question " + thisQuestion.value);
            console.log("This was the question's answer " + thisQuestion.answer);
            console.log("This was your answer" + answerforValidating);
            console.log("This is the current score" + currentScore);
            resolveSubmission();
        }
        $("#current-total").append(currentScore);
    }



    //All JS Ends beyond this point.

    $('.amount').on('click', function () {
        grabQuestions();
    })
});

