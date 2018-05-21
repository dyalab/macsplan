$(document).ready(function(){
  
  
  var majorDropDown = document.getElementById("majorOptions");
  var minorDropDown = document.getElementById("minorOptions");
  var semesterDropDown = document.getElementById("semesterOptions");
  var bulletinDropDown = document.getElementById("bulletinOptions");

  //Input variables
  var Major = [];
  var Minor = [];
  var numSemester = -1;
  var bulletinYear = "";

  
//fill in Bulletin Year
for (var i = 2015; i < 2020; i++){
   var node = document.createElement("a");
  node.setAttribute("class", "dropdown-item");
  node.setAttribute("href","#");
  node.innerHTML = i + "-" + (i+1);
bulletinDropDown.appendChild(node);
}
  

  
//filling in Major and Minor drop down
//TODO: make sure the names are derived from JSOn objects of all the degrees
  var degreeOptions = ["Applied Mathematics & Statistics","Chemical Engineering","Chemical and Biochemical Engineering","Chemistry","Civil Engineering","Computer Science","Economics & Business","Electrical Engineering",
  "Engineering Physics","Environmental Engineering",
  "Geological Engineering","Geophysical Engineering",
  "Mechanical Engineering","Metallurgical & Materials Engineering","Mining Engineering"];
for (var i= 0; i < degreeOptions.length; i++){
  var node = document.createElement("a");
  node.setAttribute("class", "dropdown-item");
  node.setAttribute("href","#");
  
  var checkBoxes = document.createElement("input");
  checkBoxes.type = "checkbox";
  checkBoxes.class = "small"
  checkBoxes.value = degreeOptions[i];
  node.appendChild(checkBoxes);
  
  var textnode = document.createTextNode(degreeOptions[i]);
  node.appendChild(textnode);
  majorDropDown.appendChild(node);
  
  var clone = node.cloneNode(true);
  minorDropDown.appendChild(clone);
}

//TODO:filling in ASI dropdown (There's more ASI options so it needs to be a separate one)

//filling in number of semesters dropdown 
for (var i = 1; i <= 10; i++){
	var node = document.createElement("a");
  node.setAttribute("class", "dropdown-item");
  node.setAttribute("href","#");
  node.innerHTML = i;
  semesterDropDown.appendChild(node);
}


//Event Handlers/////////////////////////////////////////////////
$("#bulletinOptions a").click(function(){
  var selText = $(this).text();
	bulletinYear = selText;
	var cardText = document.getElementById("bcard");
	cardText.innerHTML = bulletinYear;
});

$("#semesterOptions a").click(function(){
  var selText = $(this).text();
	numSemester = Number(selText);
	var cardText = document.getElementById("numcard");
	cardText.innerHTML = numSemester;
});

$( '#majorOptions a input' ).change(function(event) {
		var checkbox = event.target;
		
		
	  if(checkbox.checked){
		    Major.push( checkbox.value );	  
	  }
	  else{
		  var index = Major.indexOf(checkbox.value);
		  if (index !== -1) Major.splice(index, 1);
		  
	  }

   
  	var cardText = document.getElementById("majcard");
	cardText.innerHTML = Major;
});

$( '#minorOptions a input' ).change(function(event) {
		var checkbox = event.target;
		
		
	  if(checkbox.checked){
		    Minor.push( checkbox.value );	  
	  }
	  else{
		  var index = Minor.indexOf(checkbox.value);
		  if (index !== -1) Minor.splice(index, 1);
		  
	  }

   
    	var cardText = document.getElementById("mincard");
	cardText.innerHTML = Minor;
});
//////////////////////////////////////////////////////////////////////////////////////












});
