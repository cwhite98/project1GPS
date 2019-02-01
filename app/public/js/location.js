var map;
var watchID;
var xhttp; 

function post(lat, lon) {
    if (window.XMLHttpRequest) {
      // code for modern browsers
      xhttp = new XMLHttpRequest();
      } else {
      // code for IE6, IE5
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           console.log('Success');
        }
    };
    xhttp.open("POST", "/addPoint", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    console.log(JSON.stringify(lat), JSON.stringify(lon));
    xhttp.send({data: JSON.stringify({lat: lat, lon: lon })});
}

function initMap() {
    console.log('ES INIT');
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(6.200367, -75.577609),
        zoom: 16
    });
}

function trackMe() {
    var socket = io();
    //document.getElementById('bWatchMe').disable = true;
    console.log("Es trackme");
    if (navigator.geolocation) {
        console.log("navigator.geolocartion");
        watchID = navigator.geolocation.watchPosition(function (position) {
            console.log('Es watch');
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("ES " + pos.lat + " , " + pos.lng);
            socket.emit('new point', { latitude: pos.lat, lon: pos.longitude, user: document.getElementById('user').value}); //Aqui falta mandar el userId
            var marker = new google.maps.Marker({ position: pos });
            marker.setMap(map);
            map.setCenter(marker.getPosition());
            document.getElementById('lat').value = pos.lat;
            document.getElementById('lon').value = pos.lng;
            //post(pos.lat, pos.lng);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

async function stop() {
    navigator.geolocation.clearWatch(watchID);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}