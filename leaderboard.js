async function callLeaderboard(){
   const sessionId = getCookie("sessionId");
    fetch(`https://codecyprus.org/th/api/leaderboard?session=${sessionId}&sorted`)
        .then(response => response.json())
        .then(json => {
            if (json.status == "OK") {

                const leaderboard = json.leaderboard;


                let table = `
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Points</th>
                        <th>Time</th>
                    </tr> `
                ;
                for(let ranking=0; ranking<table.length; ranking++) {
                    if (ranking >= 15)
                        break;
                    const player = leaderboard[ranking];
                    table += `
                        <tr>
                            <td>${ranking + 1}</td>
                            <td>${player.player}</td>
                            <td>${player.score}</td>
                            <td>${player.completionTime}</td>
                        </tr>`
                    ;
                }

                const leaderboardTable = document.getElementById("leaderboard");
                leaderboardTable.innerHTML = table;
            }
            else {

                alert("Error: " + json.errorMessages);
            }
        });


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
document.addEventListener("DOMContentLoaded", callLeaderboard);