function plan(student_values, ondone, onfail){
	$.getJSON("http://macsplan.mines.edu/RPC2?student_data="+student_values, function(json){
    ondone(json);
	}) .always(function(){$("body").css("cursor","default");})  .fail(function(error){onfail(error)});
}
