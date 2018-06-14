function plan(catalog, student_values){
	var request = new XmlRpcRequest('localhost:8080/RPC2', 'plan');
	request.addParam(catalog);
	request.addParam(student_values);
	request.send_header("Access-Control-Allow-Origin", "*")
	request.send_header("Access-Control-Allow-Headers","Content-Type")
	var response = request.send();
	return response.parseXML();
	alert('this shouldnt happen')
}