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
		console.log(e);
			var result = JSON.parse(e.target.result);
			var formatted = JSON.stringify(result, null, 2);
			document.getElementById('result').value = formatted;
		}

	 var JSONimport =	files.item(0); //this is our array imported from JSON FILE, TODO: for Sebastian, figure out how to actually get this

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
		var mainTable = document.getElementById('dataTable');

		var rows = mainTable.rows;
		var $th = $('table th');
		$('table tbody tr').each(function(i, tr){
			var obj = {}, $tds = $(tr).find('td');
			$th.each(function(index, th){
				obj[$(th).text()] = $tds.eq(index).text();
			});
			rows.rows.push(obj);
		});
		var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rows));

		var a = document.createElement('a');
		a.href = 'data:' + data;
		a.download = 'data.json';
		a.innerHTML = 'download JSON';

		var container = document.getElementById('container');
		container.appendChild(a);
	};

});
