$(document).ready(function(){

  var options = ["Applied Mathematics & Statistics","Chemical Engineering","Chemical and Biochemical Engineering","Chemistry","Civil Engineering","Computer Science","Economics & Business","Electrical Engineering",
  "Engineering Physics","Environmental Engineering",
  "Geological Engineering","Geophysical Engineering",
  "Mechanical Engineering","Metallurgical & Materials Engineering","Mining Engineering"];
  var majorDropDown = document.getElementById("majorOptions");
  var minorDropDown = document.getElementById("minorOptions");

  var Major = null;
  var Minor = null;

for (var i= 0; i < options.length; i++){
  var node = document.createElement("a");
  node.setAttribute("class", "dropdown-item");
  node.setAttribute("href","#");
  var textnode = document.createTextNode(options[i]);
  node.appendChild(textnode);
  majorDropDown.appendChild(node);
  var clone = node.cloneNode(true);
  minorDropDown.appendChild(clone);
}


$("#majorOptions a").click(function(){
  var selText = $(this).text();
  document.getElementById("chosenMajor").innerHTML = selText;
  Major = selText;
  alert(Major);
});


$("#minorOptions a").click(function(){
  var selText = $(this).text();
  document.getElementById("chosenMinor").innerHTML = selText;
  Minor = selText;
  alert(Minor);
});


});
