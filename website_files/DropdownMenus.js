
  //reference variables for HTML elements
  var majorDropDown = document.getElementById("majorOptions");
  var minorDropDown = document.getElementById("minorOptions");
  var semesterDropDown = document.getElementById("semesterOptions");
  var bulletinDropDown = document.getElementById("bulletinOptions");

  //Input variables
  var Major = JSON.parse(sessionStorage.getItem("major")) || [];
  var Minor = JSON.parse(sessionStorage.getItem("minor")) || [];
  var numSemester = Number(sessionStorage.getItem("numSemester"))|| "";
  var bulletinYear = sessionStorage.getItem("Bulletin") || "";
  var ASI = "";
  var startsem = sessionStorage.getItem("startsem") || "";

  //angularJS. This is so that the display on the cards will be updated with saved values when refreshed
  var app = angular.module('myApp', []);
  app.controller('myCtrl', function($scope) {
  	$scope.major = Major.toString();
  	$scope.minor = Minor.toString();
  	$scope.ASI = ASI;
  	$scope.bulYear = bulletinYear;
  	$scope.startsem = startsem;
  	$scope.numS = numSemester;
  });
//////FIlling in all the dropdown menu ITEMS ///////////////////////////////////////////////////////

//filling in Major drop down
//NOTE: uses variables intialized in loadCourses.js

/*degreeOoptions is for test purposes. Leave commented out.
  var degreeOptions = ["Applied Mathematics & Statistics","Chemical Engineering","Chemical and Biochemical Engineering","Chemistry","Civil Engineering","Computer Science","Economics & Business","Electrical Engineering",
  "Engineering Physics","Environmental Engineering",
  "Geological Engineering","Geophysical Engineering",
  "Mechanical Engineering","Metallurgical & Materials Engineering","Mining Engineering"];
  */

majorCatalogDone.then(function(){
  for (var i= 0; i < majorCatalog.length; i++){
    var node = document.createElement("a");
    node.setAttribute("class", "dropdown-item");
    node.setAttribute("href","#");
    var textnode = document.createTextNode(majorCatalog[i].Id);
    node.appendChild(textnode);
    majorDropDown.appendChild(node);
  }
});

//fill in Bulletin Year
for (var i = 2015; i < 2020; i++){
   var node = document.createElement("a");
  node.setAttribute("class", "dropdown-item");
  node.setAttribute("href","#");
  node.innerHTML = i + "-" + (i+1);
  bulletinDropDown.appendChild(node);
}



//TODO:filling in ASI and minor dropdown (There's more ASI options so it needs to be a separate one)

//filling in number of semesters dropdown
for (var i = 1; i <= 10; i++){
	var node = document.createElement("a");
  node.setAttribute("class", "dropdown-item");
  node.setAttribute("href","#");
  node.innerHTML = i;
  semesterDropDown.appendChild(node);
}
//End of filling in items for dropdown menus //////////////////////////////////////////////////////////////////////////


$(document).ready(function(){

//Event Handlers for the dropdown items/////////////////////////////////////////////////
$("#bulletinOptions a").click(function(){
  var selText = $(this).text();
	bulletinYear = selText;
	sessionStorage.setItem("Bulletin", bulletinYear);
	var cardText = document.getElementById("bulcard");
	cardText.innerHTML = bulletinYear;
});


$( '#majorOptions a' ).click(function() {
		var selText = $(this).text();
		var index = $.inArray(selText,Major);
		//alert(index);
		if(index == -1){
		    Major.push( selText );
	  }
	  else{
		  if (index !== -1) Major.splice(index, 1);
	  }

	sessionStorage.setItem("major",JSON.stringify(Major));
  	var cardText = document.getElementById("majcard");
	cardText.innerHTML = Major;
});

$( '#minorOptions a' ).click(function() {
		var selText = $(this).text();
		var index = $.inArray(selText,Minor);
		if(index == -1){
		    Minor.push( selText );
	  }
	  else{
		  if (index !== -1) Minor.splice(index, 1);
	  }

   sessionStorage.setItem("minor",JSON.stringify(Minor));
  	var cardText = document.getElementById("mincard");
	cardText.innerHTML = Minor;
});

$("#semesterOptions a").click(function(){
  var selText = $(this).text();
	numSemester = Number(selText);
	sessionStorage.setItem("numSemester",numSemester.toString());
	var cardText = document.getElementById("numcard");
	cardText.innerHTML = numSemester;
});

$("#startSemesterOptions a").click(function(){
  var selText = $(this).text();
	startsem = selText;
	sessionStorage.setItem("startsem",startsem);
	var cardText = document.getElementById("startsemcard");
	cardText.innerHTML = startsem;
});
//////////////////////////////////////////////////////////////////////////////////////












});
