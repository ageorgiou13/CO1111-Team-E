async function callQuestion() {

    const boxQ = document.getElementById("questionBox");
    const sessionId = getCookie("sessionId");
    fetch(`https://codecyprus.org/th/api/question?session=${sessionId}`)
        .then(response => response.json())
        .then(json => {
            if (json.status === "OK") {
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
                        submitButton.onclick = () => submitAnswer(inputElement.value.trim());
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
                        submitButton.onclick = () => submitAnswer(inputElement.value.trim());
                        boxQ.appendChild(inputElement);
                        boxQ.appendChild(submitButton);
                        break;
                    case "BOOLEAN":
                        let buttonT = document.createElement("input");
                        buttonT.type = "button";
                        buttonT.value = "Yes/True";
                        buttonT.onclick = () => submitAnswer("true");
                        let buttonF = document.createElement("input");
                        buttonF.type = "button";
                        buttonF.value = "No/False";
                        buttonF.onclick = () => submitAnswer("false");
                        boxQ.appendChild(buttonT);
                        boxQ.appendChild(buttonF);
                        break;
                    case "TEXT":
                        inputElement = document.createElement("input");
                        inputElement.type = "text";
                        submitButton = document.createElement("input");
                        submitButton.type = "button";
                        submitButton.value = "Submit";
                        submitButton.onclick = () => submitAnswer(inputElement.value);
                        boxQ.appendChild(inputElement);
                        boxQ.appendChild(submitButton);
                        break;
                    case "MCQ":
                        let buttonA = document.createElement("input");
                        buttonA.type = "button";
                        buttonA.value = "A";
                        buttonA.onclick = () => submitAnswer('A');

                        let buttonB = document.createElement("input");
                        buttonB.type = "button";
                        buttonB.value = "B";
                        buttonB.onclick = () => submitAnswer('B');

                        let buttonC = document.createElement("input");
                        buttonC.type = "button";
                        buttonC.value = "C";
                        buttonC.onclick = () => submitAnswer('C');

                        let buttonD = document.createElement("input");
                        buttonD.type = "button";
                        buttonD.value = "D";
                        buttonD.onclick = () => submitAnswer('D');
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

async function submitAnswer(x) {
    const sessionId = getCookie("sessionId");
    let msg = document.getElementById("messegesAPI");

    if (!x || x.trim() === "") {
        const boxQ = document.getElementById("questionBox");

        msg.textContent = "Answer cannot be empty!";
        return;
    }

    if (isCallQuestionOneTime) return;
    isCallQuestionOneTime = true;

    fetch(`https://codecyprus.org/th/api/answer?session=${sessionId}&answer=${x}`)
        .then(response => response.json())
        .then(json => {
            const boxQ = document.getElementById("questionBox");
            let msg = document.getElementById("messegesAPI");


            if (json.status === "OK") {
                callScore();
                if (json.correct) {
                    msg.style.color = "green";
                    msg.textContent =String.fromCharCode(9989)  + json.message;
                } else {
                    msg.style.color = "red";
                    msg.textContent =String.fromCharCode(10060) + json.message;
                }

                if (!json.completed) {
                    callQuestion();


                } else {
                    msg.style.color = "green";
                    msg.textContent = "You completed the treasure hunt!!!";
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
                    msg.style.color = "green";
                    msg.textContent = "You completed the treasure hunt!!!";
                }
            } else {
                msg.style.color = "red";
                msg.textContent = json.errorMessages;
            }

            isCallQuestionOneTime = false;
        });
    document.addEventListener("DOMContentLoaded", callScore);
}


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



document.addEventListener("DOMContentLoaded", callScore);
document.addEventListener("DOMContentLoaded", () => {
    if (!isCallQuestionOneTime) {
        callQuestion();
    }
});
