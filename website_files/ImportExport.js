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
  
		var JSONimport = files.item(0);
		loadDataTablesFromImportFile(JSONimport);
		
	};
	
	document.getElementById('Export').onclick = function() {
		var mainTable = document.getElementById('dataTable');
		
		var JSONexport = [];
		
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


function loadDataTablesFromImportFile(var JSONimport){
	
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
