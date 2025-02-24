async function callList() {
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(json => {

            const listContainer = document.getElementById('list');

            for (let i = 0; i < json.treasureHunts.length; i++) {
                const hunt = json.treasureHunts[i];
                const choiceBox = document.createElement("div");
                choiceBox.classList.add("choiceList");

                const title = document.createElement("h4");
                title.textContent = hunt.name;
                choiceBox.appendChild(title);

                const description = document.createElement("p");
                description.textContent = hunt.description;
                choiceBox.appendChild(description);

                const button1 = document.createElement("input");
                button1.type = "button";
                button1.value = "Start";
                button1.addEventListener("click", () => callStart(hunt));

                choiceBox.appendChild(button1);
                listContainer.appendChild(choiceBox);

            }
        })
        .catch(error => console.error("Error:", error));
}

/* async function callQuestion() {
    fetch("https://codecyprus.org/th/api/question")
    .then(response => response.json())
    .then(json => {
        if(json.status== "OK"){
            const questionContainer = document.getElementById('questionBox');
            questionContainer.innerHTML = '';

            const question = document.createElement("p");
            question.innerHTML = json.questionText;
            questionContainer.appendChild(question);


            let questionInput;
            if(json.questionType=="BOOLEAN"){
                const trueL = document.createElement("label");
                const falseL = document.createElement("label");
                const trueButton = document.createElement("input");
                const falseButton  = document.createElement("input");
                trueButton.type = "radio";
                falseButton.type = "radio";
                trueL.appendChild(trueButton);
                falseL.appendChild(trueButton);
                question.appendChild(trueL);
                question.appendChild(falseL);


            }
            if(json.questionType=="INTEGER"){
                questionInput = document.createElement("input");
                questionInput.type = "number";
                questionInput.step = 1;
            }
            if(json.questionType=="NUMERIC"){
                questionInput = document.createElement("input");
                questionInput.type = "number";
                questionInput.step = 0.01;
            }
            if(json.questionType==="MCQ"){

            }

            if(json.questionType==="TEXT"){
                questionInput = document.createElement("input");
                questionInput.type = "text";

            }
        }

    })
}
*/
callList();

async function callStart(hunt) {
    const playerName = prompt("Type your name.");
    const appId = "Team_E_Hunt";

    fetch(`https://codecyprus.org/th/api/start?player=${playerName}&app=${appId}&treasure-hunt-id=${hunt.uuid}`)
        .then(response => response.json())
        .then(json => {
            if (json.status === "OK") {
                const sessionId = json.session;

                console.log(`Treasure Hunt '${hunt.name}' Started! Session ID: ${sessionId}`);
                deleteCookie("sessionId");
                deleteCookie("playerName");
                deleteCookie("huntId");
                setCookie("sessionId", sessionId,1);
                setCookie("playerName", playerName,1);
                setCookie("huntId",hunt.uuid,1);

                window.location.href="questions.html";


            } else if (json.errorMessages === "The specified playerName: " + playerName + ", is already in use (try a different one).") {

                alert("Error: " + json.errorMessages);

            } else {

                alert("Error: " + json.errorMessages);

            }

        });
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
