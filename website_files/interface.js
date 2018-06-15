function plan(catalog, student_values){
	//mimic
	
	var request = new XmlRpcRequest("http://localhost:8080/RPC2", 'plan');
	request.addParam(catalog);
	request.addParam(student_values);
	var response = request.send();
	return response.parseXML();	
	
	//jQuery xmlrpc
	/*$.xmlrpc({
		url: 'http://localhost:8080/RPC2',
		methodName: 'plan',
		params:[catalog, student_values],
		success: function(response, status, jqXHR){alert(response);},
		error: function(jqXHR, status, error){alert(error);}
	});*/
}