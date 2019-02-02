var map;
var points;

function initMap() {
    points = JSON.parse(document.getElementById('points').value);
    var lats = [];
    var lons = [];
    for(var i = 0; i < points.length; i++) {
        lats[i] = points[i].lat;
        lons[i] = points[i].lon;
    }
    console.log(lats);
    console.log(lons);
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(6.200367, -75.577609),
        zoom: 16
    });
}