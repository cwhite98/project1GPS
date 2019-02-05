var map;
var watchID;

function initMap() {
    console.log('ES INIT');
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(6.200367, -75.577609),
        zoom: 16
    });
}

function trackMe() {
    var socket = io();
    document.getElementById('bWatchMe').disabled = true;
    console.log("Es trackme");
    socket.emit('new route', {user: document.getElementById('user').value, name: document.getElementById('routeName').value});
    if (navigator.geolocation) {
        console.log("navigator.geolocartion");
        watchID = navigator.geolocation.watchPosition(function (position) {
            console.log('Es watch');
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("ES " + pos.lat + " , " + pos.lng);
            socket.emit('new point', { latitude: pos.lat, longitude: pos.lng, user: document.getElementById('user').value});
            var marker = new google.maps.Marker({ position: pos });
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
    document.stopForm.submit();
    console.log('STOP');
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}