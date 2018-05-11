var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.4116913, lng: -121.9958031},
    zoom: 13
  });

  var locations = [
    {title: 'Googleplex', location: {lat: 37.4220147, lng: -122.0840693}},
    {title: 'Yahoo', location: {lat: 37.4171578, lng: -122.025007}},
    {title: 'Microsoft', location: {lat: 37.4116103, lng: -122.0713127}},
    {title: 'Apple Campus 3', location: {lat: 37.3795358, lng: -122.0111346}},
    {title: 'Intel Corporation', location: {lat: 37.3875909, lng: -121.9637869}},
  ];

  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
  }

}


