async function callList() {
    fetch("https://codecyprus.org/th/test-api/list?number-of-ths=5")
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
                button1.addEventListener("click", () => callStart(hunt)); // Correct way to pass object

                choiceBox.appendChild(button1);
                listContainer.appendChild(choiceBox);
            }
        })
        .catch(error => console.error("Error fetching treasure hunts:", error));
}

callList();

async function callStart(hunt) {
    const playerName = prompt("Enter your name:");
    const appId = "Team_E_Hunt";

    if (!playerName) {
        alert("Player name is required!");
        return;
    }

    fetch(`https://codecyprus.org/th/api/start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appId)}&treasure-hunt-id=${encodeURIComponent(hunt.uuid)}`)
        .then(response => response.json())
        .then(json => {
            if (json.status === "OK") {
                const sessionId = json.session;
                alert(`Treasure Hunt '${hunt.name}' Started! Session ID: ${sessionId}`);
                localStorage.setItem("sessionId", sessionId); // Store session for later use
            } else {
                alert("Error: " + json.errorMessages.join(", "));
            }
        })
        .catch(error => {
            console.error("Error starting treasure hunt:", error);
            alert("An error occurred. Please try again.");
        });
}
