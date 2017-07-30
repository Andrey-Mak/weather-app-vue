var marker, map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 50.46, lng: 30.51},
		zoom: 6
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			vm.coordinates = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			placeMarkerAndPanTo(vm.coordinates, map);
			vm.getCoordinates();
		}, function() {
			handleLocationError(true, map.getCenter());
		});
	} else {
		handleLocationError(false, map.getCenter());
	}

	map.addListener('click', function(e) {
		vm.coordinates = {
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		};
		placeMarkerAndPanTo(e.latLng);
	});
}
function placeMarkerAndPanTo(latLng){
	if(marker) marker.setMap(null);
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
