class InputClass{
  constructor(id){
    this.Id = id;
    this.desiredSemester= [];
    this.taken = false;
  }
}

function ReadyClasses(input, typeList, bulletin, id){
  // input = inputValues array that will be the input to sendToBackEnd
  // typeList = the array of major, minor, or ASI
  // bulletin = bulletinYear variable from dropdownmenu.js
  //id = major, minor, asi variable from dropdownmenu.js
  var selectedType; //major, minor, asi
  
  for (var i = 0; i < typeList.length; i++){
      /*
      if (typeList[i].Id === id && typeList[i].Bulletin === bulletin){
          selectedType = typeList[i];
      }
      */
            if (typeList[i].Id === id){
          selectedType = typeList[i];
      }
  }

  for(var i = 0; i < selectedType.Classes.length; i++){
      degree.push(selectedType.Classes[i]);
  }

  for (var i = 0; i < selectedType.Electives.length; i++){
      var name = selectedType.Electives[i][0];
      var count = Number(selectedType.Electives[i][1]);
      for (var j = 0; j < count; j++){
      degree.push(name);
    }
  }
    return selectedType;
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
    var chosenMajor = [];
    for (var i = 0; i < Major.length; i ++){
		chosenMajor.push(ReadyClasses(inputValues,majorCatalog,bulletinYear,Major[i]));
	}
    console.log(chosenMajor);
	//TODO: call this function for minor, asi too
	//fixes the taken classes to set their taken value to true and puts in the appropriate class where electives are
	for(var i=0; i<degree.length; i++){
		desiredDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			if(degree[i].indexOf('xxx') != -1 && this.data()[0].slice(0,4) == degree[i].slice(0,4)){
				degree[i] = this.data()[0];
                desiredDataTable.row(this.data()).remove().draw(false);
			}
		});
   
	}
    
    takenDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        taken.push(this.data()[0]);
    });
	//TODO: for Nick, For all classes desired, update class name if it’s just electives (ex. CSCI4xx -> CSCI470)


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
	sTest = '{"taken":[], "degree":[["CSCI261"],["CSCI262"]], "modify":[]}';

    plan(sTest, function(result){loadResults(result)}, function(error){returnError(error)});
    
	});
