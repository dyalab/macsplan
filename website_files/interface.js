function plan(student_values){
	var service = new rpc.ServiceProxy("localhost:8080/RPC2", {
							 asynchronous: false,   //default: true
							 sanitize: true,       //default: true
							 methods: ['plan'],   //default: null (synchronous introspection populates)
							 protocol: 'XML-RPC', //default: JSON-RPC
	});
	var input_json = JSON.stringify(student_values);
	console.log(input_json)
	service.plan({
		params:{arg1:input_json},
		onSuccess:function(message){
			alert('success')
			return message;
		},
		onException:function(e){
			return 'could not plan schedule because'+e;
		}
	});
}