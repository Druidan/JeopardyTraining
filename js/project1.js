$(document).ready(function () {    //My JS starts past this point.


    used100Questions = [];
    used200Questions = [];
    used300Questions = [];
    used400Questions = [];
    used500Questions = [];
    used600Questions = [];
    used800Questions = [];
    used1000Questions = [];

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

    //JService API Query
    let queryInterval = 1;
    let offsetInterval = 0;
    let targetArray;

    grabQuestions();
    //API Functions
    function grabQuestions() {
        let qValue = queryInterval * 100;
        //Determine which used question array is being targeted for each go through.
        if (qValue === 100) {
            targetArray = used100Questions;
        } else {
            if (qValue === 200) {
                targetArray = used200Questions;
            } else {
                if (qValue === 300) {
                    targetArray = used300Questions;
                } else {
                    if (qValue === 400) {
                        targetArray = used400Questions;
                    } else {
                        if (qValue === 500) {
                            targetArray = used500Questions;
                        } else {
                            if (qValue === 600) {
                                targetArray = used600Questions;
                            } else {
                                if (qValue === 800) {
                                    targetArray = used800Questions;
                                } else {
                                    if (qValue === 1000) {
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
        if (targetArray === 96) {//Determine the offset for the jservice search query.
            offsetInterval++
        };
        const queryURL = "http://jservice.io/api/clues/?value=" + qValue + "&&offset=" + offsetInterval; //Create the Query URL to pull from jService.
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
                if (j === 6) {
                    qsGrabbed = true;
                }
            }
            if (queryInterval < 10) {
                ++queryInterval
            }
            if (queryInterval === 7 || queryInterval === 9) {
                ++queryInterval
            }
            if (qsGrabbed === true) {
                grabPics();
            }
            function grabPics() {
                pixGrabbed = 0;
                for (let j = 1; j <= 6; j++) {
                    imgURLs = [];
                    let qObjName = "val" + qValue + "Num" + j;
                    let deepBranch = currentQuestions[qValue];
                    let rawSearchTerm = deepBranch[qObjName].category;
                    let pixSearchTerm = rawSearchTerm.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                    const queryURL = "https://pixabay.com/api/?key=11885345-90fa971b5ced0a2f9df494b51&q=" + pixSearchTerm + "&orientation=horizontal&safesearch=true&order=popular&per_page=3"; //Create the Query URL to pull from Pixabay.
                    $.get(queryURL, function (response) {
                        if (response.totalHits === 0) {
                            let newPixSearchTerm = pixSearchTerm.split(" ")[0];
                            const queryURL = "https://pixabay.com/api/?key=11885345-90fa971b5ced0a2f9df494b51&q=" + newPixSearchTerm + "&orientation=horizontal&safesearch=true&order=popular&per_page=3"; //Create the Query URL to pull from Pixabay.
                            $.get(queryURL, function (response) {
                                imgURLs.push(response.hits[0].largeImageURL);
                                pixGrabbed++
                                if (pixGrabbed === 6) {
                                    let j = 1;
                                    imgURLs.forEach(function (i) {
                                        tempImg = {
                                            imgUrl: i,
                                        }
                                        let qObjName = "val" + qValue + "Num" + j;
                                        let deepBranch = currentQuestions[qValue];
                                        console.log(deepBranch[qObjName]);
                                        $.extend(deepBranch[qObjName], tempImg);
                                        j++
                                    })
                                    console.log(currentQuestions);
                                }
                                if (pixGrabbed === 6 && qValue < 1000) {
                                    grabQuestions();
                                }
                            })
                        } else {
                            imgURLs.push(response.hits[0].largeImageURL)
                            pixGrabbed++
                            if (pixGrabbed === 6) {
                                let j = 1;
                                imgURLs.forEach(function (i) {
                                    tempImg = {
                                        imgUrl: i,
                                    }
                                    let qObjName = "val" + qValue + "Num" + j;
                                    let deepBranch = currentQuestions[qValue];
                                    console.log(deepBranch[qObjName]);
                                    $.extend(deepBranch[qObjName], tempImg);
                                    j++
                                })
                                console.log(currentQuestions);
                            }
                            if (pixGrabbed === 6 && qValue < 1000) {
                                grabQuestions();
                            }
                        }

                    });
                }
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
        this.play = function () {
            this.sound.play();
        }
        this.stop = function () {
            this.sound.pause();
        }
    }


    //DSZ JS begins.

    //Config
    var config = {
        apiKey: "AIzaSyBE2l3onlS-3BG2b2eMS75SsDarXCC-uyg",
        authDomain: "project-1-62290.firebaseapp.com",
        databaseURL: "https://project-1-62290.firebaseio.com",
    };
    firebase.initializeApp(config);

    // Assign the reference to the database to a variable named 'database'
    // var database = ...
    let dataRef = firebase.database();

    //initial values
    let name = "";
    let score = "";

    //submit button makes variable name = value of name input
    $("#submit-name").on("click", function (event) {

        let name = $("#name-input").val().trim();
        console.log("This is the user's name: " + name);

    //push the first name and the high score of the highest jeopardy scorer so far.
    dataRef.ref().push({
        name: name,
        score: score,
    });

    dataRef.ref().on("child_added", function (childSnapshot) {

        //add this to a high scores list on front end?
        $("#high-scores").append("<tr><td scope= 'row' class = 'text-center'>" + childSnapshot.val().name + "</td><td scope= 'row' class = 'text-center'>" + childSnapshot.val().score + "</td></tr>");
    })
});
    //DSZ to add more here.

    $("#submit-name").click(function () {
        $("#name-panel").hide();
    });

    //DSZ JS ends at this point.


    //All JS Ends beyond this point.
});
