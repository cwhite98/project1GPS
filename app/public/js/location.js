var map;
var watchID;
var map;
var latitudes = new Array;
var longitudes = new Array;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
}

function trackMe() {
    console.log("Es trackme");
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(function (position) {
            console.log('Es watch');
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            latitudes.push(pos.lat);
            longitudes.push(pos.lng);
            console.log("ES " + pos.lat + " , " + pos.lng);
            addMarker(pos, map);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

async function stop() {
    navigator.geolocation.clearWatch(watchID);
    document.getElementById('latitudes').value = JSON.stringify(latitudes);
    document.getElementById('longitudes').value = JSON.stringify(longitudes);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true
    });
}