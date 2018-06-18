var classes = [];
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
		document.getElementById("tableWrapper").style.display = "block";
	}

	if(sessionStorage.desiredTableData){
		loadElementsInClassTables(desiredDataTable, desiredTableData);
		document.getElementById("tableWrapper").style.display = "block";
	}
    
    if(sessionStorage.desiredTableData || sessionStorage.takenTableData){
		loadElementsInMainTable();
	}
	$("#loadMainDataTableButton").on('click', function(){
		document.getElementById("tableWrapper").style.display = "block";
		loadElementsInMainTable();
		
		
	});
	
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
		if(this.id=="takenButton"){
			if(isInTable(data[1], takenDataTable)){
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
		}
		else if(this.id=="desiredButton"){
			if(isInTable(data[1], desiredDataTable)){
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
		}
		else{
			return;
		}
		mainDataTable.row(node).remove().draw( false );
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
	var temp = [];
	var electiveList = [];
	var chosenMajor = [];
	for (var i = 0; i < Major.length; i ++){
		chosenMajor.push(ReadyClasses(inputValues,majorCatalog,bulletinYear,Major[i]));
	}
	
	if(chosenMajor.length == 0){
		alert("please choose a major");
		return;
	}
	
	for(var i=0; i<chosenMajor.length; i++){
		for(var j=0; j<chosenMajor[i].Classes.length; j++){
			temp.push(chosenMajor[i].Classes[j]);
		}
		for(var j=0; j<chosenMajor[i].Electives.length; j++){
			for(var k=0; k<electives.length; k++){
				if(electives[k].Id == chosenMajor[i].Electives[j]){
					var elec = [electives[k].Id];
					for(var l=0; l<electives[k].Classes.length; l++){
						elec.push(electives[k].Classes[l]);
					}
					classes.push(elec);
				}
			}
		}
	}
	
	
	
	for(var i=0; i<temp.length; i++){
		var courseName = "NOT FOUND";
		var courseCredits = "NOT FOUND";
		for(var k = 0; k < courseCatalog.length; k++) {

			if(courseCatalog[k].Id == temp[i]) {
				courseName = courseCatalog[k].Name;
				// some courses have min and max number of credits so this will display it properly
				if(courseCatalog[k].Min_Credits == courseCatalog[k].Max_Credits) {
					courseCredits = courseCatalog[k].Min_Credits;
				} else {
				courseCredits = courseCatalog[k].Min_Credits + "-" + courseCatalog[k].Max_Credits;
				}
				break;
			}
		}
		classes.push([courseName, temp[i], courseCredits]);
		
	}
	console.log(classes);
	
	
	for(var i=0; i<classes.length; i++){
		var createRow = true;
		var createDropDown = false;
		var row = document.createElement("tr");
		for(var j=0; j<classes[i].length; j++){
			var colData = classes[i][j];

			if(j==0 && classes[i][j].indexOf("xxx") != -1){
				createDropDown = true;
			}
			if(createRow) {createRow = isInTable(classes[i][j], takenDataTable);}
			if(createRow) {createRow = isInTable(classes[i][j], desiredDataTable);}


			var col = document.createElement("td");
			if(createDropDown && j==1){
				var menuButton = document.createElement("button");
				//menuButton.setAttribute("class","btn btn-secondary dropdown-toggle");
				menuButton.setAttribute("type","button");
				menuButton.setAttribute("class","btn");
				menuButton.setAttribute("data-toggle","dropdown");
				menuButton.setAttribute("data", colData);
				menuButton.innerHTML = colData[0];

				var menu = document.createElement("div");
				menu.setAttribute("class", "dropdown-menu");

				for(var k=1; k<colData.length; k++){
					var item = document.createElement("a");
					item.setAttribute("class", "dropdown-item");
					item.setAttribute("id", "ElectiveChoice");
					var itemData = document.createTextNode(colData[k]);
					item.appendChild(itemData);
					menu.appendChild(item);
				}
				var div = document.createElement("div");
				div.appendChild(menu);
				div.appendChild(menuButton);
				col.appendChild(div);
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

function getNParent(object, number){
	if(number == 0){return object;}

	return(getNParent($(object).parent(), number-1));

}

function isInTable(info, table){
	var ret = true;
	table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
		if(this.data()[1]==info){
			ret = false;
		}
	});
	return ret;
}


window.onclick = function(event) {
	if(event.target.matches("#ElectiveChoice")){
		var oldData = mainDataTable.row(getNParent(event.target, 3)).data();
		var newData = [event.target.innerHTML.substr(0, event.target.innerHTML.indexOf(",")), event.target.innerHTML.substr(event.target.innerHTML.indexOf(",") + 1), oldData[2], oldData[3]];
		var createRow = true;
		mainDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			if(this.data()[1]==newData[1]){
				createRow = false;
			}
		});
		if(createRow){
			mainDataTable.row.add(newData).draw(true);
		}
	}


}