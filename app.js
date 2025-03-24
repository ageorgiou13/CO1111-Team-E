/* Function that fetch a double array of text (trusure hunts) and dynamically creates UI elements to display them.Also provides a button to resume an unfinished session if applicable .   */
async function callList() {
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(json => {

            const listContainer = document.getElementById('list');

            for (let i = 0; i < json.treasureHunts.length; i++) {
                const hunt = json.treasureHunts[i];
                const choiceBox = document.createElement("div");
                choiceBox.classList.add("choiceList");
                //Creates and append the treasure hunt title.
                const title = document.createElement("h4");
                title.textContent = hunt.name;
                choiceBox.appendChild(title);
                //Creates and append the treasure hunt description.
                const description = document.createElement("p");
                description.textContent = hunt.description;
                choiceBox.appendChild(description);
                //Creates a "Start" button for the treasure hunt.
                const button1 = document.createElement("input");
                button1.type = "button";
                button1.value = "Start";
                button1.addEventListener("click", () => callStart(hunt));

                choiceBox.appendChild(button1);

                listContainer.appendChild(choiceBox);

            }
            // Checks if there is an unfinished session and provide a "Resume session" button.
            if(getCookie("IsCompleted")=== "false"){
                const unfinishedButton = document.createElement("input");
                unfinishedButton.classList.add("unfinishedbutton");
                unfinishedButton.type = "button";
                unfinishedButton.value = "Resume session";
                unfinishedButton.onclick = () => {
                    window.location.href = 'questions.html';
                };
                listContainer.appendChild(unfinishedButton);
            }
        })
        .catch(error => console.error("Error:", error));
}
//Calls the function to fetch and display the treasure hunts.
callList();
//Function that starts a new treasure hunt session for the player.Asks the player for a name  and if it's available creates necessary cookies and redirects to questions.html.If not ,displays error messages.
async function callStart(hunt) {
    const playerName = prompt("Type your name.");
    const appId = "Team_E_Hunt";

    fetch(`https://codecyprus.org/th/api/start?player=${playerName}&app=${appId}&treasure-hunt-id=${hunt.uuid}`)
        .then(response => response.json())
        .then(json => {
            if (json.status === "OK") {
                const sessionId = json.session;

                console.log(`Treasure Hunt '${hunt.name}' Started! Session ID: ${sessionId}`);
                //Clears old session cookies.
                deleteCookie("sessionId");
                deleteCookie("playerName");
                deleteCookie("huntId");
                //Creates new session cookies.
                setCookie("sessionId", sessionId,1);
                setCookie("playerName", playerName,1);
                setCookie("huntId",hunt.uuid,1);
                setCookie("numQ",hunt.numOfQuestions,1);
                //Redirects to the questions.html page.
                window.location.href="questions.html";


            } else if (json.errorMessages === "The specified playerName: " + playerName + ", is already in use (try a different one).") {
                //Displays error message if the player's name is already in use .
                alert("Error: " + json.errorMessages);

            } else {
                //Displays any other error messages if they occur.
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
