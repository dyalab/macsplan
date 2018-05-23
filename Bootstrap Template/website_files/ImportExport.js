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
  
		fr.readAsText(files.item(0));
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
