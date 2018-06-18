//NOTE: getJSON is an asynchronous process!!!
// had to use low-level ajax to make it synchronous


var courseCatalog;
var courseJSONDone = $.getJSON("http://macsplan.mines.edu/courseCatalogData.json", function(json){
    courseCatalog = json;
});

var majorCatalog;

var majorJSONDone = $.getJSON("http://macsplan.mines.edu/majorData.json", function(json){
    majorCatalog = json;
});

var electives;
var electivesDone = $.getJSON("http://macsplan.mines.edu/electiveData.json", function(json){
	electives = json;
	console.log(json)
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
