function plan(catalog, student_values, ondone, onfail){
	$.getJSON("http://macsplan.mines.edu/RPC2, {catalog: catalog, student_values:student_values}, function(json){
    ondone(json);
	}) .fail(function(error){onfail(error)});
}
