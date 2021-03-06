// Map Js
var map;
var geocoder;
var markers = [];
var selectedMarker = {id: -1};
var latitudeBounds;
var longitudeBounds;
var mapLoaded = false;
var markerIcons = { // the locations of the different coloured icons
    default: null,
    red: { url: "../../../static/images/red-dot-icon.png" }, //"http://maps.google.com/mapfiles/ms/icons/red-dot.png" },
    blue: { url: "../../../static/images/blue-dot-icon.png" }, //"http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
    yellow: { url: "../../../static/images/yellow-dot-icon.png" },
    orange: { url: "../../../static/images/orange-dot-icon.png" },
    purple: { url: "../../../static/images/purple-dot-icon.png" },
}
var favouriteHairdressers = [];

function initMap() { // function called once Gmaps API is loaded. Creates the map
    var noPoiLabels = [ // remove poi labels
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ],
        }]

    var options = { // set up map settings
        zoom: 12,
        center: { lat: 0, lng: 0 },
        disableDefaultUI: true, // hide all controls
        scaleControl: true, // make scale visible
        zoomControl: true, // make zoom controls visible
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        clickableIcons: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: noPoiLabels,
    };

    map = new google.maps.Map(document.getElementById('map'), options); // set the map to a DOM element
    geocoder = new google.maps.Geocoder; // create a geocoder to get lat-lng position

    //searchGeocode(''); // search location NEED TO ENTER
    google.maps.event.addListener(map, 'idle', function (ev) { // add a listener to update view when map is idle
        if (mapLoaded) {
            var bounds = map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            latitudeBounds = [sw.lat(), ne.lat()];
            longitudeBounds = [sw.lng(), ne.lng()];
            searchFilter();
        }
    })
    mapLoaded = true;
}

// searches for the location passed (as a string)
function searchGeocode(location) {
    geocoder.geocode({ 'address': location }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location); // center on the location found, if successful
            map.set
        } else {
             console.log('Geocode was not successful for the following reason: ' + status);
        }
    })
}

// makes markers visible
function showMarkers() {
    for (var i=0;i<markers.length;i++) {
        markers[i].setVisible(true);
    }
}

// makes markers invisible
function hideMarkers() {
    for (var i=0;i<markers.length;i++) {
        markers[i].setVisible(false);
    }
}

// loads an array of markers into the array
function loadMarkers(markersArr) {
    for (var i=0;i<markersArr.length;i++) {
        addMarker(markersArr[i]);
    }
}

// adds a marker to the markers array
function addMarker(marker) {
    var newMarker = new google.maps.Marker({
        position: marker.LatLng,
        map: map,
        id: marker.id,
        icon: markerIcons.red,
        user: marker.user,
    });
    newMarker.addListener('click', function() { // add a listener to each marker on click
        markerClicked(newMarker.id)
    });
    markers.push(newMarker); // add newMarker to markers array
    setFavouriteMarkers();
}

// clears the marker array
function clearMarkers() {
    for (var i=0;i<markers.length;i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// do this when a marker is clicked
function markerClicked(id) {
    if (!(selectedMarker.id == id)) {
        var index;
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].id == id) {
                index = i;
            } else {
                markers[i].setIcon(markerIcons.red); // set to null to go to default one
            }
        }
        selectedMarker = markers[index];
        setFavouriteMarkers();
        highlightMarkerInList(selectedMarker);
    }
}

// set favourite markers to yellow and selected marker to blue
function setFavouriteMarkers() {
    for (var i=0;i<markers.length;i++) {
        if (favouriteHairdressers.includes(markers[i].user)) {
            markers[i].setIcon(markerIcons.yellow);
        }

        if (selectedMarker) {
            if (selectedMarker.id == markers[i].id) {
                markers[i].setIcon(markerIcons.blue);
            }
        }
    }
}

// populate favourite array
function addFavouriteIds(favArr) {
    for (var i=0;i<favArr.length;i++) {
        favouriteIds.push(faveArr[i].id);
    }
}

// get lat and lng minimum and maximum bounds of the map
function getMinMaxBounds() {
    var bounds = map.getBounds();
    var left = bounds.getSouthWest().lng();
    var right = bounds.getNorthEast().lng();
    var top = bounds.getNorthEast().lat();
    var bottom = bounds.getSouthWest().lat();
    var output = {
        lat: { min: bottom, max: top },
        lng: { min: left, max: right },
    };
    return output;
}

//testing functions #############################################
var mrkrid = 0;
var markerobjects = [
    {
        LatLng: { lat: 55.865, lng: -4.2518 }
    },
    {
        LatLng: { lat: 55.8635, lng: -4.2518 }
    }
];

// Function to load test markers
function addMarkers() {
    loadMarkers(markerobjects);
    markerobjects.push({
        LatLng: { lat: 55.866, lng: -4.2518 }
    })
}

// add a random marker
function addRandomMarker() {
    var bounds = map.getBounds();
    var left = bounds.getSouthWest().lng();
    var right = bounds.getNorthEast().lng();
    var top = bounds.getNorthEast().lat();
    var bottom = bounds.getSouthWest().lat();
    var lng = random(left, right);
    var lat = random(bottom, top);
    loadMarkers([{
        LatLng: { lat: lat, lng: lng },
        id: mrkrid,
    }]);
    mrkrid++;
}

// Function to create a random number between 2 numbers
function random(min, max) {
    var random = Math.random() * (+max - +min) + +min;
    return random;
}


