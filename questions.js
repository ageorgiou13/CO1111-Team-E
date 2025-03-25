/* This function fetches the next question from the API based on the session ID.Also updates the UI dynamically to display the question and input fields based on the question type. */
async function callQuestion() {

    const boxQ = document.getElementById("questionBox");
    const sessionId = getCookie("sessionId");
    const numberOfQuestions = getCookie("numQ");

    fetch(`https://codecyprus.org/th/api/question?session=${sessionId}`)
        .then(response => response.json())
        .then(json => {
            if (json.status === "OK") {
                //Stores the completion status in a cookie.
                const completeCookie = setCookie("IsCompleted",json.completed,1);
                boxQ.innerHTML = "";
                //Displays the question text-title.
                const title = document.createElement("h4");
                title.innerHTML = json.questionText;
                boxQ.appendChild(title);
                let inputElement;
                let submitButton;
                //Handles different question types and based on the type ,creates the necessary elements with the correct input to submitAnswer function.
                switch (json.questionType) {
                    //INTEGER and NUMERIC create an input box that only accepts numbers based on the step and a submit button with a submitAnswer function.
                    case "INTEGER":
                        inputElement = document.createElement("input");
                        inputElement.type = "number";
                        inputElement.step = 1;
                        submitButton = document.createElement("input");
                        submitButton.type = "button";
                        submitButton.value = "Submit";
                        submitButton.onclick = () => submitAnswer(inputElement.value.trim(),json.requiresLocation);
                        boxQ.appendChild(inputElement);
                        boxQ.appendChild(submitButton);
                        break;
                    case "NUMERIC":
                        inputElement = document.createElement("input");
                        inputElement.type = "number";
                        inputElement.step = 0.001;
                        submitButton = document.createElement("input");
                        submitButton.type = "button";
                        submitButton.value = "Submit";
                        submitButton.onclick = () => submitAnswer(inputElement.value.trim(),json.requiresLocation);
                        boxQ.appendChild(inputElement);
                        boxQ.appendChild(submitButton);
                        break;
                    //Creates 2 buttons TRUE or FALSE that have submitAnswer function with the necessary parameter.
                    case "BOOLEAN":
                        let buttonT = document.createElement("input");
                        buttonT.type = "button";
                        buttonT.value = "Yes/True";
                        buttonT.onclick = () => {
                            if (confirm("Is this your final Answer?")) {
                                submitAnswer("true", json.requiresLocation);
                            }
                        };
                        let buttonF = document.createElement("input");
                        buttonF.type = "button";
                        buttonF.value = "No/False";
                        buttonF.onclick = () => {
                            if (confirm("Is this your final Answer?")) {
                                submitAnswer("false", json.requiresLocation);
                            }
                        };
                        boxQ.appendChild(buttonT);
                        boxQ.appendChild(buttonF);
                        break;
                    case "TEXT":
                        inputElement = document.createElement("input");
                        inputElement.type = "text";
                        submitButton = document.createElement("input");
                        submitButton.type = "button";
                        submitButton.value = "Submit";
                        submitButton.onclick = () => submitAnswer(inputElement.value,json.requiresLocation);
                        boxQ.appendChild(inputElement);
                        boxQ.appendChild(submitButton);
                        break;
                    //Creates 4 buttons A,B,C,D that have submitAnswer function with the necessary parameter.Also asks the user for conformation when the user press it.
                    case "MCQ":
                        let buttonA = document.createElement("input");
                        buttonA.type = "button";
                        buttonA.value = "A";
                        buttonA.onclick = () => {
                            if (confirm("Is this your final Answer?")) {
                                submitAnswer('A', json.requiresLocation);
                            }
                        };

                        let buttonB = document.createElement("input");
                        buttonB.type = "button";
                        buttonB.value = "B";
                        buttonB.onclick = () => {
                            if (confirm("Is this your final Answer?")) {
                                submitAnswer('B', json.requiresLocation);
                            }
                        };

                        let buttonC = document.createElement("input");
                        buttonC.type = "button";
                        buttonC.value = "C";
                        buttonC.onclick = () => {
                            if (confirm("Is this your final Answer?")) {
                                submitAnswer('C', json.requiresLocation);
                            }
                        };

                        let buttonD = document.createElement("input");
                        buttonD.type = "button";
                        buttonD.value = "D";
                        buttonD.onclick = () => {
                            if (confirm("Is this your final Answer?")) {
                                submitAnswer('D', json.requiresLocation);
                            }
                        };
                        boxQ.appendChild(buttonA);
                        boxQ.appendChild(buttonB);
                        boxQ.appendChild(buttonC);
                        boxQ.appendChild(buttonD);
                        break;
                    default:
                        console.log("Unknown question Type");
                        return;
                }


            } else {
                console.log("Error: " + json.errorMessages);

            }
        });

}
//This variable is used as a flag to make sure that when the user goes to the next question, the callQuestion runs only one time.
let isCallQuestionOneTime = false;
/*This function  processes the player's answer by first retrieving the session ID and checking if the answer is empty. It prevents multiple submissions and,
 if required, fetches the player's geolocation before sending the answer to the API. Based on the API response, it displays feedback messages for correct or
 incorrect answers and updates the player's score. If the treasure hunt is not completed, it fetches the next question.If the user answered all the questions,
   it displays a completion message and a leaderboard button. */
async function submitAnswer(answer,geoFlag) {
    const sessionId = getCookie("sessionId");


    let msg = document.getElementById("messegesAPI");

    if (!answer || answer.trim() === "") {
        const boxQ = document.getElementById("questionBox");

        msg.textContent = "Answer cannot be empty!";
        return;
    }

    if (isCallQuestionOneTime) return;
    isCallQuestionOneTime = true;
    if (geoFlag) {
        await callGeo();
        //console.log("empike");
    }


    fetch(`https://codecyprus.org/th/api/answer?session=${sessionId}&answer=${answer}`)
        .then(response => response.json())
        .then(json => {
            const boxQ = document.getElementById("questionBox");
            let msg = document.getElementById("messegesAPI");


            if (json.status === "OK") {
                callScore();
                if (json.correct) {
                    msg.style.color = "green";
                    msg.textContent = String.fromCharCode(9989) + json.message;
                    const timeout = setTimeout(clearMessages, 3000);

                } else {
                    msg.style.color = "red";
                    msg.textContent = String.fromCharCode(10060) + json.message;
                    const timeout = setTimeout(clearMessages, 3000);

                }

                if (!json.completed) {
                    completeCookie = setCookie("IsCompleted",json.completed,1);
                    callQuestion();


                } else {
                    completeCookie = setCookie("IsCompleted",json.completed,1);
                    const leaderBox = document.getElementById("leaderB");
                    msg.style.color = "green";
                    msg.textContent = "You completed the treasure hunt!!!";
                    let buttonL = document.createElement("input");
                    buttonL.type = "button";
                    buttonL.value = "Leaderboard";
                    buttonL.setAttribute("onclick", "moveLeaderboard();");
                    leaderBox.appendChild(buttonL);

                }
            } else {
                msg.style.color = "red";
                msg.textContent = json.errorMessages;
            }

            isCallQuestionOneTime = false;
        });

}
/* This function is for skipping questions.Similar to submitAnswer it sends a request to the API to skip the question and updates the player's score. If the game is not yet complete,
it fetches the next question and displays a message indicating the skip.
If the treasure hunt is completed, it shows a completion message along with a leaderboard button.

  */
async function answerSkipped() {
    const sessionId = getCookie("sessionId");
    let msg = document.getElementById("messegesAPI");

    if (isCallQuestionOneTime) return;
    isCallQuestionOneTime = true;

    fetch(`https://codecyprus.org/th/api/skip?session=${sessionId}`)
        .then(response => response.json())
        .then(json => {
            let msg = document.getElementById("messegesAPI");


            if (json.status === "OK") {
                callScore();

                if (!json.completed) {
                    callQuestion();

                    msg.style.color = "red";
                    msg.textContent = json.message;
                } else {
                    const leaderBox = document.getElementById("leaderB");
                    msg.style.color = "green";
                    msg.textContent = "You completed the treasure hunt!!!";
                    let buttonL = document.createElement("input");
                    buttonL.type = "button";
                    buttonL.value = "Leaderboard";
                    buttonL.setAttribute("onclick","moveLeaderboard();");
                    leaderBox.appendChild(buttonL);
                }
            } else {
                alert(json.errorMessages);
            }

            isCallQuestionOneTime = false;
        });
    document.addEventListener("DOMContentLoaded", callScore);
}
function moveLeaderboard() {
    window.location.href="leaderboard.html";}

//From labs cookie functions.
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" +
        expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie =
        decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function deleteCookie(cname) {
    const cookieValue = "";
    const date = new Date();
    date.setTime(date.getTime() - 1);
    const expires = "expires="+ date.toUTCString();
    document.cookie = cname + "=" + cookieValue + "; " + expires;
}
/*This function retrieves the player's session ID from cookies and sends a request to the API to fetch the current score. If the API responds successfully, it updates the score display on the page.
If error occurs, it displays the error message to the console. */
async function callScore(){
    const sessionId = getCookie("sessionId");
    fetch(`https://codecyprus.org/th/api/score?session=${sessionId}`)
        .then(response => response.json())
        .then(json => {
            if (json.status == "OK") {
                document.getElementById("score").textContent = json.score;
                console.log(json,score);

            }
            if (json.status == "ERROR") {
                console.log(json.errorMessages);

            }
        })

}
//Clears API messeges
function clearMessages(){
    document.getElementById("messegesAPI").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", callScore);
document.addEventListener("DOMContentLoaded", () => {
    if (!isCallQuestionOneTime) {
        callQuestion();
    }
});
/* This function retrieves the player's session ID and current geolocation (latitude and longitude) using the browser's geolocation API.
   Then sends these coordinates to the API to update the player's location in the tressure hunt
    session.If API request successful then it display on console a confirmation message and if is not successful it displays to console an error message. */
async function callGeo() {
    const sessionID = getCookie("sessionId");
    const cords = await getCurrentLocation();
    const lat = parseFloat(cords.latitude);
    const long = parseFloat(cords.longitude);
    //console.log(lat, long);
    //console.log(sessionID);
    fetch(`https://codecyprus.org/th/api/location?session=${sessionID}&latitude=${lat}&longitude=${long}`)
        .then(response => response.json())
        .then(json => {
            //console.log(json);
            if (json.status === "OK") {

                console.log("successfully added location");

            } else {
                console.log("Error: " + json.errorMessages);

            }

        })

}
const getCurrentLocation = () =>
    new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log("Geo2", position.coords);
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }

        );
    });
//Calls callGeo every 30seconds.
setInterval(callGeo, 30000);