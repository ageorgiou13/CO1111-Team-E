async function callQuestion() {

    const boxQ = document.getElementById("questionBox");
    const sessionId = getCookie("sessionId");
    const numberOfQuestions = getCookie("numQ");

    fetch(`https://codecyprus.org/th/api/question?session=${sessionId}`)
        .then(response => response.json())
        .then(json => {
            if (json.status === "OK") {
                const completeCookie = setCookie("IsCompleted",json.completed,1);
                boxQ.innerHTML = "";
                const title = document.createElement("h4");
                title.innerHTML = json.questionText;
                boxQ.appendChild(title);
                let inputElement;
                let submitButton;
                switch (json.questionType) {
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

let isCallQuestionOneTime = false;

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

function clearMessages(){
    document.getElementById("messegesAPI").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", callScore);
document.addEventListener("DOMContentLoaded", () => {
    if (!isCallQuestionOneTime) {
        callQuestion();
    }
});
async function callGeo() {
    const sessionID = getCookie("sessionId");
    const cords = await getCurrentLocation();
    const lat = parseFloat(cords.latitude);
    const long = parseFloat(cords.longitude);
    console.log(lat, long);
    console.log(sessionID);
    fetch(`https://codecyprus.org/th/api/location?session=${sessionID}&latitude=${lat}&longitude=${long}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
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
setInterval(callGeo, 30000);