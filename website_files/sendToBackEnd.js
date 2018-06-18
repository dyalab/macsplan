class InputClass{
  constructor(id){
    this.Id = id;
    this.desiredSemester= [];
    this.taken = false;
  }
}



function InsertCoreClasses(input, typeList, bulletin, id){
  // input = inputValues array that will be the input to sendToBackEnd
  // typeList = the array of major, minor, or ASI
  // bulletin = bulletinYear variable from dropdownmenu.js
  //id = major, minor, asi variable from dropdownmenu.js
  var selectedType = FindObjects(typeList, bulletin, id);

  for(var i = 0; i < selectedType.Classes.length; i++){
      degree.push(selectedType.Classes[i]);
  }
}



$("#generateButton").click(function(){
	//all front-end input preparation is done here.
	inputValues = new InputVal();
    taken = [];
    degree = ["and"];
    modify = [];

    /*current inputValue format:
        {
        "taken":[],
        "degree":["and",other classes stuff],
        "modify":[[class, [1,2,3,4]], [asdf, [1,2,4]]
        }
*/
    for (var i = 0; i < Major.length; i ++){
		InsertCoreClasses(inputValues,majorCatalog,bulletinYear,Major[i]);
	}
    
	//TODO: call this function for minor, asi too
	//fixes the taken classes to set their taken value to true and puts in the appropriate class where electives are

	/* for(var i=0; i<degree.length; i++){
		
		desiredDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			
			if(degree[i].indexOf('xxx') != -1 && this.data()[1].slice(0,4) == degree[i].slice(0,4)){
				console.log(this.data());
				degree[i] = this.data()[1];
                desiredDataTable.row(this.data()).remove().draw(false);
				
			}
		});
	
   
	} */
    
    
    
    mainDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        //console.log(this.data()[3]);
        if(this.data()[3].indexOf("value=\"true\"") !=-1) {
            taken.push(this.data()[1]);
        }
    });
    electiveDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var courseid;
        var nameBox = this.data()[0];
        for(var i = 0; i < courseCatalog.length; i++) {
            if(courseCatalog[i].Name == nameBox) {
                courseid = courseCatalog[i].Id;
                break;
            }
        }
        if(this.data()[3].indexOf("value=\"true\"") !=-1) {
            taken.push(courseid);
        }
        else{
            degree.push(courseid);
        }
        
    });
        //console.log(taken);

	//TODO: for Nick, For all classes desired, update class name if it’s just electives (ex. CSCI4xx -> CSCI470)
	//console.log("after taken");

	//For class in InputValue:
	//Make desiredSemester array be 1 to numberOfSemester decided
	/*
    var semesterArray = [];
	for (var i = 1 ; i <= numSemester; i++){
		semesterArray.push(i);
	}

	for (var i = 0; i < inputValues.length; i++){
		inputValues[i].desiredSemester = semesterArray.slice();
	}

	//puts the start semester and number of semester object in beginning of array.
	inputValues.unshift({Starting_semester: startsem, NumberOfSemesters: numSemester});
    */
    
    inputValues.taken = taken;
    inputValues.degree = degree;
    inputValues.modify = modify;

	sTest = '{"taken" : [], "degree" : ["and", "CSCI101",  "MATH111", "CSCI261", "MATH112",  "MATH213", "CSCI262", "CSCI274", "CSCI341", "CSCI358", "MATH225", "CSCI306", "MATH332", "CSCI403", "CSCI406", "MATH201", "CSCI370", "CSCI400", "CSCI442"]}';
	//console.log(JSON.stringify(inputValues));
    if(alert("do you want to download the input values JSON files?")){
        plan(JSON.stringify(inputValues), function(result){loadResults(result)}, function(error){returnError(error)});
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inputValues));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "InputValues.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courseCatalog));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "CourseCatalog.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
	});
