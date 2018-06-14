function plan(student_values){
	var service = new rpc.ServiceProxy("localhost:8080/RPC2", {
							 asynchronous: false,   //default: true
							 sanitize: true,       //default: true
							 methods: ['plan'],   //default: null (synchronous introspection populates)
							 protocol: 'XML-RPC', //default: JSON-RPC
	});
	console.log(input_json)
	service.plan({
		params:{arg1:student_values},
		onSuccess:function(message){
			alert('success')
			return message;
		},
		onException:function(e){
			return 'could not plan schedule because'+e;
		}
	});
}