var xmlrpc = require('xmlrpc')
var client = xmlrpc.createClient({host: 'localhost', port: 8080, path: '/RPC2'})
function plan(catalog, student_values){
	client.methodCall('plan', [catalog, student_values], function(error,value){
		if (error){
			return error
		}
		return value
	})
	alert('this shouldnt happen')
}