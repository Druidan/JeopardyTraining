$(document).ready(function () {    //My JS starts past this point.

    //Game State Settings
    startScreenUp = true;
    gameOn = false;
    gameLoading = false;
    qScreenUp = false;
    endScreen = false;
    playerAnswerCorrect = false;

    //Used Question Arrays - Used to compare incoming randomly selected questions to see if its already been used.
    let used100Questions = [];
    let used200Questions = [];
    let used300Questions = [];
    let used400Questions = [];
    let used500Questions = [];
    let used600Questions = [];
    let used800Questions = [];
    let used1000Questions = [];

    //Our Question Object - all accepted random questions will be added here.
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
    let qsAnswered = 0; //This variable is used to determine if all the questions on a screen have been answered ot not.
    let thisQsId; //This variable is used to hold the currently selected question's Id.
    let thisAnswer; //This variable is used to hold the correct answer to the current question, raw before validation.
    let thisValue; //This variable is used to hold the value of the currently selected question.
    let answerForValidating; //This variable holds the player's raw answer input, before any validation.
    let currentQurl; //This variable is used to store the url that will be used for the current selected question.
    let rowInterval = 1; //This variable is used when constructing the question rows on game start.

    //JService API Query
    let queryInterval = 1; //Used to increment the API search for dollar value.
    let offsetInterval = 0; //Used to determine the offset of the search results in the event that all of the returned questions have been used.
    let targetArray = [] //This blank array is used to switch between the various used question arrays.

    //Users cannot type special characters
    $(".name-input").keypress(function (event) {
        var inputValue = event.which;
        // allow letters and whitespaces only.
        if (!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) {
            event.preventDefault();
        }
    });
    //Users cannot type special characters
    $(".playerAnswer").keypress(function (event) {
        var inputValue = event.which;
        // allow letters and whitespaces only.
        if (!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) {
            event.preventDefault();
        }
    });


    grabQuestions(); //This calls initial question API search when the webpage is opened.

    //API Functions
    function grabQuestions() { //This function grabs questions from JService.
        gameLoading = true; //Since the process is asynchronous, we don't want people clicking additional buttons until the search is done, so at the start of the function we say that the program is loading, which we use in the click events below.
        let qValue = queryInterval * 100; //We use the query interval to determine the value we are targetting with our search.
        //Determine which used question array is being targeted for each go through.
        switch (qValue) {
            case 100: //In case qValue = 100, the target array is the used 100 value question array. This patter repeats all the way down. 
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
            case 800: // We skip 7-700 and 9-900 throughout the project because there are no jeopardy questions with those value amounts.
                targetArray = used800Questions;
                break;
            case 1000:
                targetArray = used1000Questions;
                break;
            default:
                break;
        }
        if (targetArray === 96) {//Determine the offset for the jservice search query. We use 96 because it is the largest searchable mutliple of 6 via the JService API.
            offsetInterval++ //Increase the offset by one.
            targetArray = []; //Empty the target array so that new 
        };
        const offset = offsetInterval * 96; //The offset is determined as a multiple of 96.
        const queryURL = "http://jservice.io/api/clues/?value=" + qValue + "&&offset=" + offset; //Create the Query URL to pull from jService.
        $.get(queryURL, function (response) { //Start the ajax Get call using the constructed URL.
            for (let j = 1; j <= 6; j++) { //Establish a for loop that will run 6 times, or the number of questions for each value.
                let randomQ; // Establish a variable in which to store the random number used to find a question.
                randomSelectQ(); //Call the randomSelectQ function.
                function randomSelectQ() { //This function will randomly select a question that has not already been used before.
                    randomQ = response[Math.floor(Math.random() * 96)]; //Select a random question from the search response and store it in RandomQ.
                    targetId = randomQ.id; //Grab the randomly selected question's Id.
                    if (targetArray.includes(targetId)) { //If the array of used questions' ids contains the id of the randomly selected question, then we have already used the question...
                        randomSelectQ(); //...and so we call the random select function again to select a new question. Because the function calls itself until it is successful, we will always end up with unused questions eventually.
                    } else {
                        return randomQ //If the used q array doesn't include the question id, used the selected question.
                    }
                }
                qObjName = "val" + qValue + "Num" + j; //Construct the unique object name for this question - val (value) qValue (numerical value of the question) Num (number) j (1-6), So, the first one would be val100Num1 - The value 100 question number 1.
                qCheck = currentQuestions[qValue].qObjName //Establish the location of where the question would go in the currentQuestions object.
                if (qCheck === undefined || qCheck === undefined) { //Check to see if that location already has a value in it (an existing question). If it doesn't fill it.
                    tempQ = {}; //Establish a temporary object that will house the data we are moving into the current Questions object.
                    tempQ[qObjName] = { //further establish the object and fill it with the data pulled from the response.
                        id: randomQ.id,
                        answer: randomQ.answer,
                        question: randomQ.question,
                        value: randomQ.value,
                        airdate: randomQ.airdate,
                        category: randomQ.category.title,
                    }
                    $.extend(currentQuestions[qValue], tempQ); //take the data from the temp object and move it to the currentQuestions object.
                    targetArray.push(randomQ.id) //Push the question's Id into the used questions array to make sure it isn't used again.
                }
            }
            if (queryInterval < 10) { //If the interval is less than 10, increase it.
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
                questionBucket.html("<svg xmlns='http://www.w3.org/2000/svg' id='squareExample'><symbol id='gameSpace' class='gameSpace' x='0px' y='0px'><rect x='2.5' y='2.5' class='st0' width='100%' height='70px' fill='navy' stroke='black' stroke-width='5px'/></symbol></svg>");
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
        //$(".gameboard").addClass("buryIt");

        if (playerAnswerCorrect === true) {
            $(".gameboard").removeClass("buryIt");
            $(".questionBoard").addClass("buryIt");
            if (qsAnswered === 48) {

            }
            rightAnswerSound = new sound("assets/sounds/rightanswer.mp3");
            rightAnswerSound.play();
            console.log("playerAnswerCorrect is true")
        } else {
            if (playerAnswerCorrect === false) {
                gameOn = false;
                endScreen = true;
                queryInterval = 1;
                //remove buryIt class from end screen
                $(".currentQText").removeClass("endscreen");
                $(".endscreen").removeClass("buryIt");
                $(".play-again").removeClass("buryIt");
                $(".realAnswer").text(thisAnswer);
                timesUpSound = new sound("assets/sounds/timesup.mp3");
                timesUpSound.play();
                console.log("playerAnswerCorrect is false")
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
            $(".winner").addClass("buryIt");
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
            console.log(thisCategory);
            console.log(thisAnswer);
            console.log(thisValue[thisQsId].value);
            $(".displayCategory").text(thisCategory);
            $(".gameboard").addClass("buryIt");
            $(".questionBoard").removeClass("buryIt");
            grabPics();
            delete thisQuestion;
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
            $(".playerAnswer").val("");
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
            //currentScore = 0;
            //$("#current-total").empty();
            $(".gameboard").removeClass("buryIt");
            $(".endscreen").addClass("buryIt");
            $(".play-again").addClass("buryIt");
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

    //initial values
    var currentScore = 0;

    //validating function
    function validating() {
        if (/^[a-zA-Z0-9- ]*$/.test(answerForValidating) == false) {
            console.log("This contains illegal characters. Try again.");
            return;
        }
    }

    function gameMath() {
        let validatedPlayerAnswer;
        let validatedTrueAnswer;
        validatePlayerAnswer();
        function validatePlayerAnswer() {
            paLowerCaseTrimmed = answerForValidating.trim().toLowerCase();
            paPuctuationless = paLowerCaseTrimmed.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            paPrepositionless = paPuctuationless.replace(/(?:(the|a|an))/g, "");
            validatedPlayerAnswer = paPrepositionless;
        }
        validateTrueAnswer();
        function validateTrueAnswer() {
            taLowerCaseTrimmed = thisAnswer.trim().toLowerCase();
            taPuctuationless = taLowerCaseTrimmed.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            taPrepositionless = taPuctuationless.replace(/(?:(the|a|an))/g, "");
            validatedTrueAnswer = taPrepositionless;
        }
        if (validatedTrueAnswer.includes(validatedPlayerAnswer) || validatedPlayerAnswer.includes(validatedTrueAnswer)) {
            $(".winner").removeClass("buryIt");
            currentScore += thisValue[thisQsId].value;
            playerAnswerCorrect = true;
            console.log("This was the value of the question " + thisValue[thisQsId].value);
            console.log("This is the current score " + currentScore);
            resolveSubmission();
        } else {
            playerAnswerCorrect = false;
            resolveSubmission();
        }
        $("#current-total").text(currentScore);
    }


    //Config Firebase
    var config = {
        apiKey: "AIzaSyBE2l3onlS-3BG2b2eMS75SsDarXCC-uyg",
        authDomain: "project-1-62290.firebaseapp.com",
        databaseURL: "https://project-1-62290.firebaseio.com",
        storageBucket: "project-1-62290.appspot.com"
    };
    firebase.initializeApp(config);

    //assign the reference to the database to dataref
    var database = firebase.database();

    //initial values
    let yourName = "No one"
    let yourScore = 0;
    var highName = yourName;
    var highScore = yourScore;

    database.ref().on("value", function (snapshot) {

        //if theres already a high score and player stored
        if (snapshot.child("highName").exists() && snapshot.child("highScore").exists()) {
            //set variables to equal the stored values
            let highName = snapshot.val().highName;
            let highScore = snapshot.val().highScore;

            // Change the HTML to reflect the new high price and player
            $("#highest-name").text(highName);
            $("#highest-total").text(highScore);


            //print to console
            console.log(highName);
            console.log(highScore);

        } //if Firebase doesnt have highest yet
        else {
            $("#highest-name").text("No one");
            $("#highest-total").text(0);
        }
    }, function (errorObject) {
        //log error to console
        console.log("The read failed: " + errorObject.code);
    });

    //whenever you lose aka play-again is clicked
    $(".play-again").on("click", function (event) {
        //prevent form from submitting
        event.preventDefault();

        //get input values
        let yourName = playerName;
        let yourScore = currentScore;

        //if your score is higher than highest score
        if (yourScore > highScore) {
            console.log(yourScore);
            console.log(yourName);

            // Alert
            console.log("You are now the best.");

            // Save the new score to Firebase
            database.ref().set({
                highName: yourName,
                highScore: yourScore
            })

            //Log the new high score and player

            console.log(highScore);
            console.log(highName);

            // Store the new high score and name as a local variable
            let newHighName = snapshot.val().highName;
            let newHighScore = snapshot.val().highScore;

            // Change the HTML to reflect the new high price and bidder
            $("#highest-name").text(newHighName);
            $("#highest-total").text(newHighScore);

        } else {
            console.log("you didn't beat the last guy");
        }

    });


    $('.amount').on('click', function () {
        grabQuestions();
    })
});

