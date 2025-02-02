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
                button1.setAttribute("onclick", "callStart(" + hunt + ")");

                choiceBox.appendChild(button1);

                listContainer.appendChild(choiceBox);
            }
        })

}

callList();

function callStart(hunt) {

}