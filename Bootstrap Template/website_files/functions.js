$(document).ready(function(){
	
	var Major = null;
	var Minor = null;
	var selectedRow = null;
	
	setupDropdownMenus();
	setupMainDataTable();
	
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


function setupMainDataTable(){
	var data = [["CSCI101", "Intro to Programming", 3], ["CSCI261", "Programming Concepts", 3], ["CSCI262", "Data Structures", 3]];
	var table = document.getElementById("mainTableBody");
	table.innerHTML = '';
	
	for(var i=0; i<data.length; i++){
		var node = document.createElement("tr");
		
		for(var j=0; j<data[i].length; j++){
			var cell = document.createElement("td");
			var info = document.createTextNode(data[i][j]);
			cell.appendChild(info);
			node.appendChild(cell);
		}
		table.appendChild(node);
		
		//sets up the ability to highlight the selected row
		var createClickHandler = function(row) {
			return function() {
				HighlightRowInTable(table, row);
				
			};
		};
		node.onclick = createClickHandler(node);
	}
}

function setupDropdownMenus(){
	var options = ["Applied Mathematics & Statistics","Chemical Engineering","Chemical and Biochemical Engineering","Chemistry","Civil Engineering","Computer Science","Economics & Business","Electrical Engineering",
	"Engineering Physics","Environmental Engineering",
	"Geological Engineering","Geophysical Engineering",
	"Mechanical Engineering","Metallurgical & Materials Engineering","Mining Engineering"];
	var majorDropDown = document.getElementById("majorOptions");
	var minorDropDown = document.getElementById("minorOptions");

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
	
}

function HighlightRowInTable(table, row){
	var rows = table.getElementsByTagName("tr");
	
	for(var i=0; i<rows.length; i++){
		rows[i].style.backgroundColor='#ffffff';
		rows[i].hilight = false;
	}
	
	row.style.backgroundColor='#BCD4EC';
	row.hilight = true;
}







