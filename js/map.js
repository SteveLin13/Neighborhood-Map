var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.3986304, lng: -122.0162201},
    zoom: 13
  });

  var locations = [
    {title: 'Googleplex', location: {lat: 37.4220147, lng: -122.0840693}},
    {title: 'Yahoo', location: {lat: 37.4171578, lng: -122.025007}},
    {title: 'Microsoft', location: {lat: 37.4116103, lng: -122.0713127}},
    {title: 'Apple Campus 3', location: {lat: 37.3795358, lng: -122.0111346}},
    {title: 'Intel Corporation', location: {lat: 37.3875909, lng: -121.9637869 }},
    {title: 'Udacity', location: {lat: 37.399913, lng: -122.108363 }},
  ];

  var infowindow = new google.maps.InfoWindow({});

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
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      toggleBounce(this);
      populateInfoWindow(this, infowindow);
    });

  }

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
        marker.setAnimation(null);
      });
    }
  }
  //这个函数使地标记在点击时会上下跳动，再次点击则停止
  function toggleBounce(Marker) {
      // 停止上一次交互地标的动画
      marker.setAnimation(null);
      // 绑定目前交互的地标
      marker = Marker;
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
  }

}


