//NOTE: getJSON is an asynchronous process!!!
// had to use low-level ajax to make it synchronous


var courseCatalog;
$.getJSON("http://localhost:3000/courseCatalogData.json", function(json){
    courseCatalog = json;
});

var majorCatalog;

var majorCatalogDone  = $.ajax({
  url: "http://localhost:3000/majorData.json",
  dataType: 'json',
  async: false,
  success: function(data) {
  majorCatalog = data;
  }
});



var inputValues = [];
