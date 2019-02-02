var points;

function initMap() {
    var map;
    points = JSON.parse(document.getElementById('points').value);
    console.log(points);
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(6.200367, -75.577609),
        zoom: 16
    });
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    for (var i = 1; i < points.length-1; i++) {
        waypts.push({
            location: new google.maps.LatLng(points[i].lat, points[i].lon),
            stopover: true
        });
    }
    directionsService.route({
        origin: new google.maps.LatLng(points[0].lat, points[0].lon),
        destination: new google.maps.LatLng(points[points.length-1].lat, points[points.length-1].lon),
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}