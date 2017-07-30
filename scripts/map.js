var marker;
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 30.397, lng: 50.644},
		zoom: 6
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			coordinates = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			placeMarkerAndPanTo(coordinates, map);
			vm.getCoordinates();
		}, function() {
			handleLocationError(true, map.getCenter());
		});
	} else {
		handleLocationError(false, map.getCenter());
	}

	map.addListener('click', function(e) {
		coordinates = {
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		};
		marker.setMap(null);
		placeMarkerAndPanTo(e.latLng, map);
	});
}
function placeMarkerAndPanTo(latLng, map) {
	marker = new google.maps.Marker({
		position: latLng,
		map: map
	});
	map.panTo(latLng);
}
function handleLocationError(browserHasGeolocation, pos) {
	var infoWindow = new google.maps.InfoWindow({map: map});
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}
