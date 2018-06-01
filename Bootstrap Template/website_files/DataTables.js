var classes = [["CSCI101", "Intro to Programming", 3],["CSCI2161 Elective", ["Elective", "test1", "test2", "test3"], 3],["CSCI262", "Data Structures", 3],
 ["CBEN110", "Fundementals of Biology 1", 4],["CHGN121", "Principles of Chemistry", 4],["MATH111", "Calculus for Scientists and Engineers", 3],
 ["PHGN100", "Physics 1", 4.5],["PHGN200", "Physics 2", 4.5],["MATH225", "Differential Equations", 3]];
var takenTableData = JSON.parse(sessionStorage.getItem("takenTableData")) || [];
var desiredTableData = JSON.parse(sessionStorage.getItem("desiredTableData")) || [];
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
	
	if(sessionStorage.takenTableData){
		loadElementsInClassTables(takenDataTable, takenTableData);
	}
	
	if(sessionStorage.desiredTableData){
		loadElementsInClassTables(desiredDataTable, desiredTableData);
	}
	
	loadElementsInMainTable();
	
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
		
		if(this.id=="takenButton"){
			takenDataTable.row.add(data).draw(true);
			
			if(sessionStorage.takenTableData){
				var temp = JSON.parse(sessionStorage.takenTableData);
				temp[temp.length] = data;
				sessionStorage.takenTableData = JSON.stringify(temp);
			}
			else{
				sessionStorage.takenTableData = JSON.stringify([data]);
			}
		}
		else if(this.id=="desiredButton"){
			desiredDataTable.row.add(data).draw(true);
			
			if(sessionStorage.desiredTableData){
				var temp = JSON.parse(sessionStorage.desiredTableData);
				temp[temp.length] = data;
				sessionStorage.desiredTableData = JSON.stringify(temp);
			}
			else{
				sessionStorage.desiredTableData = JSON.stringify([data]);
			}
		}
	});
	
	$("#removeButton").click(function(){
		RemoveButtonPressed();
	});
	
});

function keyPressedFunction(event){
	if(event.keyCode==deleteKeyCode){
		RemoveButtonPressed();
	}
}

function RemoveButtonPressed(){
	var data = null;
		var tableUsed = "";
		if(takenDataTable.$('tr.selected').length==1){
			data = takenDataTable.row($(takenDataTable.$('tr.selected')[0])).data();
			takenDataTable.row($(takenDataTable.$('tr.selected')[0])).remove().draw(false);
			tableUsed = "takenTableData";
		}
		else if(desiredDataTable.$('tr.selected').length==1){
			data = desiredDataTable.row($(desiredDataTable.$('tr.selected')[0])).data();
			desiredDataTable.row($(desiredDataTable.$('tr.selected')[0])).remove().draw(false);
			tableUsed = "desiredTableData";
		}
		else{return;}
		removeItemFromStorage(tableUsed, data);
		mainDataTable.row.add(data).draw(true);
	
}

function loadElementsInClassTables(table, data){
	for(var i=0; i<data.length; i++){
		table.row.add(data[i]).draw(true);
	}
}

function removeItemFromStorage(name, item){
	var data = JSON.parse(sessionStorage.getItem(name));
	var loc = -1;
	
	for(var i=0; i<data.length; i++){
		if(data[i][0]==item[0]){
			loc = i;
		}
	}
	
	data.splice(loc, 1);
	sessionStorage.setItem(name, JSON.stringify(data));
}

function loadElementsInMainTable(){
	for(var i=0; i<classes.length; i++){
		var createRow = true;
		var createDropDown = false;
		var dropdownData = null;
		var row = document.createElement("tr");
		for(var j=0; j<classes[i].length; j++){
			var colData = classes[i][j];
			
			if(j==1 && classes[i][j].length == 4){
				dropdownData = classes[i][j];
				createDropDown = true;
			}
			
			takenDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
				if(this.data()[0]==classes[i][j]){
					createRow = false;
				}
			});
			
			desiredDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
				if(this.data()[0]==classes[i][j]){
					createRow = false;
				}
			});
			
			var col = document.createElement("td");
			if(createDropDown){
				var menuButton = document.createElement("button");
				//menuButton.setAttribute("class","btn btn-secondary dropdown-toggle");
				menuButton.setAttribute("type","button");
				menuButton.setAttribute("data-toggle","dropdown");
				menuButton.setAttribute("aria-haspopup","true");
				menuButton.setAttribute("aria-expanded","false");
				menuButton.innerHTML = dropdownData[0];
				
				var menu = document.createElement("div");
				menu.setAttribute("class", "dropdown-menu");
				menu.setAttribute("aria-labelledby", "dropdownMenuButton");
				
				for(var k=1; k<dropdownData.length; k++){
					var item = document.createElement("a");
					item.setAttribute("class", "dropdown-item");
					item.setAttribute("href", "#");
					var itemData = document.createTextNode(dropdownData[k]);
					item.appendChild(itemData);
					menu.appendChild(item);
				}
				col.appendChild(menu);
				row.appendChild(menuButton);
				row.appendChild(col);
				
				createDropDown = false; 
			}
			else{
				var colInfo = document.createTextNode(colData);
				col.appendChild(colInfo);
				row.appendChild(col);
			}
			
		}
		var col = document.createElement("td");
		$(col).append(createButtons);
		row.appendChild(col);
		if(createRow){
			mainDataTable.row.add(row).draw(true);
			
		}
	}
}

function createButtons(){return $("<div class='row'><button class='btn btn-secondary btn-sm m-2' type='button' id='takenButton'>Taken</button><button class='btn btn-secondary btn-sm m-2' type='button' id='desiredButton'>Desired</button></div>");}

