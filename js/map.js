var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.3986304, lng: -122.0162201},
    zoom: 13
  });

  ko.applyBindings(new ViewModel());
}


