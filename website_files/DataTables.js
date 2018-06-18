var classes = [];
var electiveClasses = [];
var takenTableData = JSON.parse(sessionStorage.getItem("takenTableData")) || [];
var desiredTableData = JSON.parse(sessionStorage.getItem("desiredTableData")) || [];
var mainTable = document.getElementById("mainTableBody");
var takenTable = document.getElementById("takenTableBody");
var desiredTable = document.getElementById("desiredTableBody");
var mainDataTable = null;
var electiveDataTable = null;
var deleteKeyCode = 46;

function FindObjects(typeList, bulletin, id){
	  // input = inputValues array that will be the input to sendToBackEnd
		// typeList = the array of major, minor, or ASI
		// bulletin = bulletinYear variable from dropdownmenu.js
		//id = major, minor, asi variable from dropdownmenu.js
	 
	 var selectedType; //major, minor, asi
  
  for (var i = 0; i < typeList.length; i++){
      /*
      if (typeList[i].Id === id && typeList[i].Bulletin === bulletin){
          selectedType = typeList[i];
      }
      */
            if (typeList[i].Id === id){
          selectedType = typeList[i];
      }
  }
  return selectedType;
	
	
}

$(document).ready(function(){

	mainDataTable = $('#dataTable').DataTable( {
        "lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"iDisplayLength":5
    } );
	
	electiveDataTable = $('#electiveDataTable').DataTable( {
        "lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"iDisplayLength":5
    } );

	
	$("#loadMainDataTableButton").on('click', function(){
		loadTables();
		
		
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

function loadTables(){
	if(populateClassesList()){
		document.getElementById("tableWrapper").style.display = "block";
		loadElementsInMainTable();
		loadElementsInElectivesTable();
	}
	else{
		alert("please choose a major");
	}
}


function loadElementsInMainTable(){
	
	for(var i=0; i<classes.length; i++){
		var row = document.createElement("tr");
		
		
		for(var j=0; j<classes[i].length; j++){
            var col = document.createElement("td");
			col.appendChild(document.createTextNode(classes[i][j]));
            row.appendChild(col);
		}
		var col = document.createElement("td");
		$(col).append(createButtons);
		row.appendChild(col);
		mainDataTable.row.add(row).draw(true);
		
	}
}

function loadElementsInElectivesTable(){
	
	for(var i=0; i<electiveClasses.length; i++){
		var row = document.createElement("tr");
        var buttonCol = document.createElement("td");
        for(var j=0; j<electiveClasses[i].length; j++){
            var col = document.createElement("td");
            if(j==1){
                var menuButton = document.createElement("button");
                menuButton.setAttribute("type","button");
                menuButton.setAttribute("class","btn");
                menuButton.setAttribute("data-toggle","dropdown");
                //menuButton.setAttribute("style", "max-height:250px; overflow:auto;");
                menuButton.innerHTML = "Choose One";
                var menu = document.createElement("div");
                menu.setAttribute("class", "dropdown-menu");
                menu.setAttribute("style", "max-height:250px; overflow:auto;");

                for(var k=0; k<electiveClasses[i][j].length; k++){
                    var item = document.createElement("a");
                    item.setAttribute("class", "dropdown-item");
                    item.setAttribute("id", "ElectiveChoice");
                    var itemData = document.createTextNode(electiveClasses[i][j][k]);
                    item.appendChild(itemData);
                    menu.appendChild(item);
                    
                }
                var div = document.createElement("div");
                div.appendChild(menu);
                div.appendChild(menuButton);
                col.appendChild(div);
                row.appendChild(col);
            }else{
                var col = document.createElement("td");
                if(j==0){
                    col.appendChild(document.createTextNode(electiveClasses[i][j].substr(0,electiveClasses[i][j].length-3)));
                }
                else{
                    col.appendChild(document.createTextNode(electiveClasses[i][j]));
                }
                row.appendChild(col);
            }
            
        }
		$(buttonCol).append(createButtons);
		row.appendChild(buttonCol);
        electiveDataTable.row.add(row).draw(true);
	}
	
}

function populateClassesList(){
	var ret = true;
	var chosenMajor = [];
	
	for (var i = 0; i < Major.length; i ++){
		chosenMajor.push(FindObjects(majorCatalog,bulletinYear,Major[i]));
	}
	
	if(chosenMajor.length == 0 || document.getElementById("tableWrapper").style.display == "block"){
		ret = false;
	}
	
	for(var i=0; i<chosenMajor.length; i++){
		for(var j=0; j<chosenMajor[i].Classes.length; j++){
			classes.push(chosenMajor[i].Classes[j]);
		}
        
		for(var j=0; j<chosenMajor[i].Electives.length; j++){
            for(var l=0; l<chosenMajor[i].Electives[j][1]; l++){
                for(var k=0; k<electives.length; k++){
                    if(electives[k].Id == chosenMajor[i].Electives[j][0]){
                        var elec = [electives[k].Id, electives[k].Classes, 0.0];
                        electiveClasses.push(elec);
                    }
                }
            }
		}
	}
	classes = getOtherInfoFromCatalog(classes);
	
	return ret;
}

function getOtherInfoFromCatalog(list){
	var temp = [];
	for(var i=0; i<list.length; i++){
		var courseName = "NOT FOUND";
		var courseCredits = "NOT FOUND";
		for(var k = 0; k < courseCatalog.length; k++) {

			if(courseCatalog[k].Id == list[i]) {
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
		temp.push([courseName, list[i], courseCredits]);
		
	}
	return temp;
}

function createButtons(){return $("<label class='container'>Taken<input type='checkbox' value='false' class='takenCheck'><span class='checkmark'></span></label>");}

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
        var courseID = event.target.innerHTML;
        var row = electiveDataTable.row(getNParent(event.target, 3)).data();
        var courseName = "NOT FOUND";
		var courseCredits = "NOT FOUND";
		for(var i = 0; i < courseCatalog.length; i++) {

			if(courseCatalog[i].Id == courseID) {
				courseName = courseCatalog[i].Name;
				// some courses have min and max number of credits so this will display it properly
				if(courseCatalog[i].Min_Credits == courseCatalog[i].Max_Credits) {
					courseCredits = courseCatalog[i].Min_Credits;
				} else {
				courseCredits = courseCatalog[i].Min_Credits + "-" + courseCatalog[i].Max_Credits;
				}
				break;
			}
		}
        row[0] = courseName;
        row[2] = courseCredits;
        row[1] = row[1].substr(0,row[1].indexOf("dropdown\">") + "dropdown\">".length) + courseID + row[1].substr(row[1].indexOf("</button"));
        electiveDataTable.row(getNParent(event.target, 3)).remove().draw(false);
        electiveDataTable.row.add(row).draw(true);
	}
    else if(event.target.matches(".takenCheck")){
        var row = null;
        var changeElectives = true;
        try{
            row = electiveDataTable.row(getNParent(event.target, 3)).data();
            changeElectives = true;
        }
        catch{
            row = mainDataTable.row(getNParent(event.target, 3)).data();
            changeElectives = false;
        } 
    
    
        var loc = row[3].indexOf("value=\"")  + "value=\"".length;
        if(row[3].substr(loc, 5)=="false"){
           row[3] = row[3].substr(0,loc) + "true" + row[3].substr(loc+5); 
        }
        else{
            row[3] = row[3].substr(0,loc) + "false" + row[3].substr(loc+4);
        }
        
        /*if(changeElectives){
            electiveDataTable.row(getNParent(event.target, 3)).remove().draw(false);
            electiveDataTable.row.add(row).draw(true);
        }
        else{
            mainDataTable.row(getNParent(event.target, 3)).remove().draw(false);
            mainDataTable.row.add(row).draw(true);
        }*/
        
            
        
    }


}