var map;
var watchID;
var latitudes = new Array;
var longitudes = new Array;

function initMap() {
    console.log('ES INIT');
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(51.508742,-0.120850),
        zoom: 16
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
            var marker = new google.maps.Marker({ position: pos});
            marker.setMap(map);
            map.setCenter(marker.getPosition());
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