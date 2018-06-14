function plan(catalog, student_values){
	var request = new XmlRpcRequest('localhost:8080/RPC2', 'plan');
	request.addParam(catalog);
	request.addParam(student_values);
	var response = request.send();
	return response.parseXML();
	alert('this shouldnt happen')
}