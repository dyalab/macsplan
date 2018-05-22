var classes = [["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],
 ["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],
 ["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],
 ["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],
 ["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],
 ["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],
 ["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],
 ["CSCI101", "Intro to Programming", 3],["CSCI2161", "Programming Concepts", 3],["CSCI262", "Data Structures", 3],];
var mainTable = document.getElementById("mainTableBody");
var takenTable = document.getElementById("takenTableBody");
var desiredTable = document.getElementById("desiredTableBody");
var mainDataTable = null;
var takenDataTable = null;
var desiredDataTable =  null;
var deleteKeyCode = 46;



$(document).ready(function(){
	
	//NOTE: Also remember to get rid of datatable.js in js folder!!!!
	mainDataTable = $('#dataTable').DataTable( {
        "lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"iDisplayLength":5
    } );
	takenDataTable = $('#TakenDataTable').DataTable( {
        "lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"iDisplayLength":5
    } );
	desiredDataTable =  $('#DesiredDataTable').DataTable( {
        "lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"iDisplayLength":5
    } );
	
	loadElements(mainDataTable);
	
	$('#personalClassesWrapper tbody').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
		}
		else {
			takenDataTable.$('tr.selected').removeClass('selected');
			desiredDataTable.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			SelectedTakenRow = this;
		}
	} );
	
	
	$("#dataTable tbody").on("click", "button", function(){
		var node = $(this).parent().parent();
		var data = mainDataTable.row( node ).data();
		
		mainDataTable.row(node).remove().draw( false );
		
		if(this.id=="takenButton")takenDataTable.row.add(data).draw(true);
		else if(this.id=="desiredButton")desiredDataTable.row.add(data).draw(true);
	});
	
	$("#removeButton").click(function(){
		var data = null;
		if(takenDataTable.$('tr.selected').length==1){
			data = takenDataTable.row($(takenDataTable.$('tr.selected')[0])).data();
			takenDataTable.row($(takenDataTable.$('tr.selected')[0])).remove().draw(false);
		}
		else{
			data = desiredDataTable.row($(desiredDataTable.$('tr.selected')[0])).data();
			desiredDataTable.row($(desiredDataTable.$('tr.selected')[0])).remove().draw(false);
		}
		mainDataTable.row.add(data).draw(true);
	});
	
});

function keyPressedFunction(event){
	if(event.keyCode==deleteKeyCode){
		var data = null;
		if(takenDataTable.$('tr.selected').length==1){
			data = takenDataTable.row($(takenDataTable.$('tr.selected')[0])).data();
			takenDataTable.row($(takenDataTable.$('tr.selected')[0])).remove().draw(false);
		}
		else if(desiredDataTable.$('tr.selected').length==1){
			data = desiredDataTable.row($(desiredDataTable.$('tr.selected')[0])).data();
			desiredDataTable.row($(desiredDataTable.$('tr.selected')[0])).remove().draw(false);
		}
		else{
			return;
		}
		mainDataTable.row.add(data).draw(true);
		
	}
}


function loadElements(mainDataTable){
	for(var i=0; i<classes.length; i++){
		
		var row = document.createElement("tr");
		for(var j=0; j<classes[i].length; j++){
			var col = document.createElement("td");
			var colInfo = document.createTextNode(classes[i][j]);
			col.appendChild(colInfo);
			row.appendChild(col);
		}
		var col = document.createElement("td");
		$(col).append(createButtons);
		row.appendChild(col);
		
		mainDataTable.row.add(row).draw(true)
	}
}

function createButtons(){
	
	return $("<div class='row'><button class='btn btn-secondary btn-sm m-2' type='button' id='takenButton'>Taken</button><button class='btn btn-secondary btn-sm m-2' type='button' id='desiredButton'>Desired</button></div>");
	
}

