/*
	JSON format for user file

[
		{ "Bulletin": "2017-2018",
			"Major": ["asdfasd", "asdfas"],
			"Minor": ["asdfasdf","asdfasdf"],
			"ASI": ["asdfasdf","asdf"],
			"NumSemester": "AFSDF",
			"StartingSemester": "asdfasdf",
		},
		{
		{	"Id": "dla",
			"Name": "ads",
			"Credits": "3"
		},
		{	"Id": "adsf",
			"Name": "adlsf",
			"Credits": "dslf"
		}
		},
		{
		{	"Id": "adsf",
			"Name": "adlsf",
			"Credits": "dslf"
		},
		{	"Id": "adsf",
			"Name": "adlsf",
			"Credits": "dslf"
		}
	}
]




*/



$(document).ready(function(){

	document.getElementById('Import').onclick = function() {
		var files = document.getElementById('scheduleFile').files;
		if (files.length <= 0) {
			return false;
		}
		var fr = new FileReader();

		fr.onload = function(e) {
			var result = JSON.parse(e.target.result);
			var formatted = JSON.stringify(result, null, 2);
			document.getElementById('result').value = formatted;
		}
  
var JSONimport =	files.item(0); //this is our array imported from JSON FILE, TODO: for Sebastian, figure out how to actually get this
		loadDataTablesFromImportFile(JSONimport);
		

	 //importing dropdown menu items
   bulletinYear = JSONimport[0].Bulletin;
	 Major = JSONimport[0].Major;
   Minor = JSONimport[0].Minor;
	 ASI = JSONimport[0].ASI;
   numSemester = Number(JSONimport[0].NumSemester);
   startsem = JSONimport[0].StartingSemester;

	 sessionStorage.setItem("Bulletin", bulletinYear);
	 var cardText = document.getElementById("bulcard");
	 cardText.innerHTML = bulletinYear;

sessionStorage.setItem("major",JSON.stringify(Major));
	 cardText = document.getElementById("majcard");
 cardText.innerHTML = Major;

sessionStorage.setItem("minor",JSON.stringify(Minor));
 cardText = document.getElementById("mincard");
cardText.innerHTML = Minor;

sessionStorage.setItem("numSemester",numSemester.toString());
cardText = document.getElementById("numcard");
cardText.innerHTML = numSemester;

sessionStorage.setItem("startsem",startsem);
cardText = document.getElementById("startsemcard");
cardText.innerHTML = startsem;
//end of importing for dropdown menu**********************************

	};





	document.getElementById('Export').onclick = function() {
			//prepare JSON array for export:
			var JSONexport = [];
			var firstElement = { "Bulletin": bulletinYear,
				"Major": Major,
				"Minor": Minor,
				"ASI": ASI,
				"NumSemester": numSemester,
				"StartingSemester": startsem,
			};
			JSONexport.push(firstElement);
	
		var mainTable = document.getElementById('dataTable');
		
		var takenExport = [];
		var desiredExport = [];
		
		takenDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			takenExport.push(this.data());
		});
		
		desiredDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			desiredExport.push(this.data());
		});
		
		JSONexport.push(takenExport);
		JSONexport.push(desiredExport);

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSONexport));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "Generated_Schedule.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

	};

});


function loadDataTablesFromImportFile(JSONimport){
	
	takenDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
		takenDataTable.row(this.data()).remove().draw(false);
	});
	
	desiredDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
		desiredDataTable.row(this.data()).remove().draw(false);
	});
	
	mainDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
		mainDataTable.row(this.data()).remove().draw(false);
	});
	
	takenTableData = JSONimport[1];
	desiredTableData = JSONimport[2];
	sessionStorage.takenTableData = takenTableData;
	sessionStorage.desiredTableData = desiredTableData;
	
	for(var i=0; i<takenTableData.length; i++){
		takenDataTable.row.add(takenTableData[i]).draw(true);
	}
	
	for(var i=0; i<desiredTableData.length; i++){
		desiredDataTable.row.add(desiredTableData[i]).draw(true);
	}
	loadElementsInMainTable();
	
}
