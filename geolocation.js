/*async function callGeo() {
    const sessionID = getCookie("sessionID");
    const cords = await getCurrentLocation();
    const lat = parseFloat(cords.latitude);
    const long = parseFloat(cords.longitude);
    console.log(lat, long);
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
    new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
    ); */