/* This function gets the session ID from cookies and sends a request to the API to fetch
the leaderboard.If the request is successful ,it extracts player rankings, scores, and completion times, formatting the data into an HTML table.
Also,the top 3 players are highlighted in gold ,silver and bronze colours,while others in black.
The table is then inserted into the webpage to display the leaderboard. If the API request is not successful then an error message is displayed.
Additionally, this function is triggered when the page loads to ensure the leaderboard is always up to date.
*/
async function callLeaderboard(){
   const sessionId = getCookie("sessionId");
    fetch(`https://codecyprus.org/th/api/leaderboard?session=${sessionId}&sorted`)
        .then(response => response.json())
        .then(json => {
            if (json.status == "OK") {

                const leaderboard = json.leaderboard;

                let options = {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit', second:'2-digit'};
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
                    let date =new Date(player.completionTime);
                    let formattedDate = date.toLocaleDateString("en-UK",options);
                       if(ranking+1==1){
                            table += `
                        <tr>
                            <td style="color:gold; font-weight: bold;">${ranking + 1}</td>
                            <td style="color:gold; font-weight: bold;">${player.player}</td>
                            <td style="color:gold; font-weight: bold;">${player.score}</td>
                            <td style="color:gold; font-weight: bold;">${formattedDate}</td>
                        </tr>`
                        }
                        else if(ranking+1==2){
                        table += `
                        <tr>
                        <td style="color:silver; font-weight: bold;">${ranking + 1}</td>
                        <td style="color:silver; font-weight: bold;">${player.player}</td>
                        <td style="color:silver; font-weight: bold;">${player.score}</td>
                        <td style="color:silver; font-weight: bold;">${formattedDate}</td>
                        </tr>`
                        }
                        else if(ranking+1==3){
                        table += `
                        <tr>
                        <td style="color:#CD7F32; font-weight: bold;">${ranking + 1}</td>
                        <td style="color:#CD7F32; font-weight: bold;">${player.player}</td>
                        <td style="color:#CD7F32; font-weight: bold;">${player.score}</td>
                        <td style="color:#CD7F32; font-weight: bold;">${formattedDate}</td>
                        </tr>`
                        }
                        else{
                            table += `
                        <tr>
                            <td >${ranking + 1}</td>
                            <td >${player.player}</td>
                            <td >${player.score}</td>
                            <td >${formattedDate}</td>
                        </tr>`
                        }




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
//Cookie function from labs
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