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

callList();

async function callStart(hunt) {
    const playerName = prompt("Type your name.");
    const appId = "Team_E_Hunt";

    if(!playerName) {
        alert("Player name is required!");
    }

    fetch(`https://codecyprus.org/th/api/start?player=${playerName}&app=${appId}&treasure-hunt-id=${hunt.uuid}`)
        .then(response => response.json())
        .then(json => {
            if (json.status === "OK") {
                const sessionId = json.session;

                alert(`Treasure Hunt '${hunt.name}' Started! Session ID: ${sessionId}`);
                deleteCookie(sessionId);
                deleteCookie(playerName);
                setCookie("sessionId", sessionId);
                setCookie("playerName", playerName);
            } else if (json.errorMessages === "The specified playerName: "+playerName+", is already in use (try a different one).") {

                alert("Error: " + json.errorMessages);
                callStart(hunt);
            } //else {

              ///  alert("Error: " + json.errorMessages);

        //    }

        })
        .catch(error => {

            console.error("Error:", error);
            alert("Error! Please try again.");
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
    document.cookie = cookieName + "=" + cookieValue + "; " + expires;
}
