

function getLocation() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
}
    else {
    alert("Geolocation is not supported by your browser.");
}
}


function showPosition(position) {

    console.log("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
    alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);

}
function callLocation(latitude, longitude) {
    const sessionId = getCookie("sessionId");
    fetch('https://codecyprus.org/th/test-api/location?session=${Id}&latitude=${latitude}&longitude=${longitude}')
    .then(response => response.json())
    .then(data => {
    console.log(data);

})

}
function errorMessages(error){

}

setInterval(getLocation, 30000);
getLocation();

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
