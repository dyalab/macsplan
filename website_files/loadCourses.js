//NOTE: getJSON is an asynchronous process!!!
// had to use low-level ajax to make it synchronous


var courseCatalog;
var courseJSONDone = $.getJSON("http://localhost:80/courseCatalogData.json", function(json){
    courseCatalog = json;
});

var majorCatalog;

var majorJSONDone = $.getJSON("http://localhost:80/majorData.json", function(json){
    majorCatalog = json;
});



//variable to put into backend planner along with catalogJSON
class InputVal{
  constructor(){
    this.taken = [];
    this.degree= [];
    this.modify = [];
  }
}

var inputValues = new InputVal();
var taken = [];
var degree = [];
var modify = [];
