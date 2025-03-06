

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
    fetch(https://codecyprus.org/th/test-api/location?session=${sessionID}&latitude=${latitude}&longitude=${longitude})
    .then(response => response.json())
    .then(data => {
    console.log(data);

})

}
    function errorMessages(error){

}

    setInterval(getLocation, 30000);
    getLocation();

