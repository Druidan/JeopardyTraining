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

    let currentQurl;
    
    //JService API Query
        let queryInterval = 1;
        let offsetInterval = 0;
        let targetArray =  []
    
        grabQuestions();
    //API Functions
    function grabQuestions(){
        let qValue = queryInterval*100;
        //Determine which used question array is being targeted for each go through.
        switch(qValue){
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
        if(targetArray === 96){//Determine the offset for the jservice search query.
            offsetInterval++
        };
        const offset = offsetInterval * 96;
        const queryURL = "http://jservice.io/api/clues/?value=" + qValue + "&&offset=" + offset; //Create the Query URL to pull from jService.
        $.get(queryURL, function(response){
            let qsGrabbed = false;
            for (let j = 1 ; j <= 6; j++){
                let randomQ;
                randomSelectQ();
                function randomSelectQ(){
                    randomQ = response[Math.floor(Math.random() * 100)];
                    targetId = randomQ.id;
                    if(targetArray.includes(targetId)){
                        // console.log("we got one! - " + targetId);
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
            if(qValue < 1000){
                grabQuestions();
            } else{
                console.log(currentQuestions);
            }
        });
    };
    
//When a question button is clicked...
//Grab the category from the button (however it is stored).
grabPics();
        function grabPics(){
                let rawSearchTerm = "sterwers";
                let pixSearchTerm = rawSearchTerm.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                const queryURL = "https://pixabay.com/api/?key=11885345-90fa971b5ced0a2f9df494b51&q=" + pixSearchTerm + "&orientation=horizontal&safesearch=true&order=popular&per_page=3"; //Create the Query URL to pull from Pixabay.
                $.get(queryURL) //kick off a promise (pending)
                    .then(function(response){ //do stuff when it is resolved or rejected
                        if(response.totalHits === 0){ //check if we need to do the request again
                            let newPixSearchTerm = pixSearchTerm.split(" ")[0];
                            const newQueryURL = "https://pixabay.com/api/?key=11885345-90fa971b5ced0a2f9df494b51&q=" + newPixSearchTerm + "&orientation=horizontal&safesearch=true&order=popular&per_page=3"; //Create the Query URL to pull from Pixabay.
                            return $.get(newQueryURL); //if so, return a new pending promise
                        }
                        return response; //if we don't, return the original response
                    })
                    .then(function(response){
                        if(response.totalHits === 0){ //check if we need to do the request again
                            return currentQurl = "/assets/images/alexTrebek.jpg";
                        }
                        return response.hits[0].largeImageURL;
                    })
                    .done(function(currentQurl) { //do finalization tasks
                        console.log('pics gotten!');
                        console.log(currentQurl);
                    })
                    .catch(function(error) {
                        console.log(error);
                        currentQurl = "/assets/images/alexTrebek.jpg";
                        console.log(currentQurl);
                        //other stuff upon this error
                    });
                }
    
    
    
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

        
    //All JS Ends beyond this point.

$('.amount').on('click', function(){
    grabQuestions();
})
});

