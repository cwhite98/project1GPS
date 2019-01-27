const router = require('express').Router();

var map;
const bWatchMe = document.getElementById('watchMe');
const bStop = document.getElementById('stop');
var watchID;
var map;
var latitudes = [];
var longitudes = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });

    if (navigator.geolocation) {
        const bWatchMe = document.getElementById('bWatchMe');
        bWatchMe.addEventListener('click', function (e) {
            console.log('bWatchMe was clicked');
            watchID = navigator.geolocation.watchPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                latitudes.push(pos.lat);
                longitudes.push(pos.lng);
                console.log("ES " + pos.lat + " , " + pos.lng);
                addMarker(pos, map);
            });
        });
        const bStop = document.getElementById('bStop');
        bStop.addEventListener('click', function (e) {
            console.log('bStop was clicked');
            navigator.geolocation.clearWatch(watchID);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
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