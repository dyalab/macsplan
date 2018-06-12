//NOTE: getJSON is an asynchronous process!!!
// had to use low-level ajax to make it synchronous


var courseCatalog;
$.getJSON("http://localhost:80/courseCatalogData.json", function(json){
    courseCatalog = json;
});

var majorCatalog;

var majorJSONDone = $.getJSON("http://localhost:80/majorData.json", function(json){
    majorCatalog = json;
});


/*
var majorCatalogDone  = $.ajax({
  url: "http://localhost:3000/majorData.json",
  dataType: 'json',
  async: false,
  success: function(data) {
  majorCatalog = data;
  }
});
*/


//variable to put into backend planner along with catalogJSON
var inputValues = [];
