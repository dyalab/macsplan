function plan(catalog, student_values){
	var service = new rpc.ServiceProxy("localhost:8080/RPC2", {
							 asynchronous: false,   //default: true
							 sanitize: true,       //default: true
							 methods: ['plan'],   //default: null (synchronous introspection populates)
							 protocol: 'XML-RPC', //default: JSON-RPC
	});
	console.log(JSON.stringify(student_values))
	service.plan({
		params:{catalog:JSON.stringify(catalog), student:JSON.stringify(student_values)},
		onSuccess:function(message){
			alert('success');
			return message;
		},
		onException:function(e){
			return 'could not plan schedule because'+e;
		}
	});
}