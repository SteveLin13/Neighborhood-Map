
var companies = [
    {title: 'Googleplex', location: {lat: 37.4220147, lng: -122.0840693}},
    {title: 'Yahoo', location: {lat: 37.4171578, lng: -122.025007}},
    {title: 'Microsoft', location: {lat: 37.4116103, lng: -122.0713127}},
    {title: 'Apple', location: {lat: 37.3795358, lng: -122.0111346}},
    {title: 'Intel', location: {lat: 37.3875909, lng: -121.9637869 }},
    {title: 'Udacity', location: {lat: 37.399913, lng: -122.108363 }},
];

var Company = function(data) {
  this.title = ko.observable(data.title);
  this.location = data.location;
  this.marker = data.marker;
}

var ViewModel = function() {
  var markers = [];
  var infowindow = new google.maps.InfoWindow({});
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < companies.length; i++) {
    // Get the position from the location array.
    var position = companies[i].location;
    var title = companies[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    //将marker与相应的company进行绑定
    companies[i].marker = marker;
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      toggleBounce(this);
      populateInfoWindow(this, infowindow);
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  // map.fitBounds(bounds);

  var self = this;

  this.companiesList = ko.observableArray([]);

  companies.forEach(function(company) {
    self.companiesList.push(new Company(company));
  });

  this.currentCompany = ko.observable();
  //点击列表项，相应的地标会有反映，且显示相关信息
  this.toCompany = function(selectedCompany) {
    self.currentCompany(selectedCompany);
    toggleBounce(self.currentCompany().marker);
    populateInfoWindow(self.currentCompany().marker, infowindow);
  };

//筛选器
  this.filter = ko.observable('');
  //将筛选后的数组封装、监控起来
  this.filteredItems = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    //如果没有筛选条件，则显示所有地标，返回所有列表项
    if (!filter) {
        showMarkers(markers);
        return self.companiesList();
    } else {
      hideMarkers(markers);
      //arrayFilter()函数对companiesList()里的每一个列表项执行一个函数，并返回其真值，决定其是否在筛选后的companiesList()里
      return ko.utils.arrayFilter(self.companiesList(), function(company) {
        //列表项标题与筛选条件开头是否匹配
        var match = ko.utils.stringStartsWith(company.title().toLowerCase(), filter);
        //如果匹配，则显示相应地标
        if (match === true) {
          company.marker.setMap(map);
          company.marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        return match;
      });
    }
  }, this);
  //字符串开头匹配函数
  ko.utils.stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
       return false;
    return string.substring(0, startsWith.length) === startsWith;
  };

  //在地图上隐藏数组内所有地标的函数
  function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  //在地图上显示数组内所有地标的函数
  function showMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    var contentString = '<div id="content">'+
      '<div class="nytimes-container">'+
      '<h3 id="nytimes-header">New York Times Articles</h3>'+
      '<ul id="nytimes-articles" class="article-list">'+
      '</ul>'+
      '</h3>'+
      '</div>'+
      '</div>';
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent(contentString);
      loadData(marker);
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

  function loadData(company) {

    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');

    $nytElem.text("");

    var companyStr = company.title;

    // load nytimes
    // obviously, replace all the "X"s with your own API key
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + companyStr + '&sort=newest&api-key=7584ec63c3424efeb6bd8923b3777536';
    $.getJSON(nytimesUrl, function(data){
      console.log(data);
      $nytHeaderElem.text('New York Times Articles About ' + companyStr);
      articles = data.response.docs;
      for (var i = 0; i < 3; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">'+
            '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
            '<p>' + article.snippet + '</p>'+
        '</li>');
      };
    }).error(function(e){
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // for (var i = 0; i < companies.length; i++) {
    //   bounds.extend(markers[i].position);
    // }
    map.fitBounds(bounds);
  }

}

