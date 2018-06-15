function plan(catalog, student_values){
	var scheduleJson
	var scheduleJsonDone = $.getJSON("http://macsplan.mines.edu/RPC2?catalog="+catalog+"&student_values="+student_values, function(json){
    console.log(json);
});
}