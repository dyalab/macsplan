class InputClass{
  constructor(id){
    this.id = id;
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
  
  console.log(id);
  console.log(bulletin);
  for (var i = 0; i < typeList.length; i++){
      if (typeList[i].Id === id && typeList[i].Bulletin === bulletin){
          selectedType = typeList[i];
      }
  }
  console.log(selectedType);

  for(var i = 0; i < selectedType.Classes.length; i++){
      input.push(new InputClass(selectedType.Classes[i]));
  }

  for (var i = 0; i < selectedType.Electives.length; i++){
      var name = selectedType.Electives[i][0];
      var count = Number(selectedType.Electives[i][1]);
      for (var j = 0; j < count; j++){
      input.push(new InputClass(name));
    }
  }
}



$("#generateButton").click(function(){
	//all front-end input preparation is done here.
	inputValues = [];
	
	for (var i = 0; i < Major.length; i ++){
		ReadyClasses(inputValues,majorCatalog,bulletinYear,Major[i]);
	}
	//TODO: call this function for minor, asi too

	//fixes the taken classes to set their taken value to true and puts in the appropriate class where electives are
	for(var i=0; i<inputValues.length; i++){
		takenDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			if(this.data()[0]==inputValues[i].id){
				inputValues[i].taken = true;
			}
			else if(inputValues[i].id[4] == "x" && this.data()[0].slice(0,4) == inputValues[i].id.slice(0,4)){
				inputValues[i].id = this.data()[0];
				inputValues[i].taken = true;
			}
		});
		
		desiredDataTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			
			if(inputValues[i].id.indexOf('xxx') != -1 && this.data()[0].slice(0,4) == inputValues[i].id.slice(0,4)){
				inputValues[i].id = this.data()[0];
			}
		});
		
	}

	//TODO: for Nick, For all classes desired, update class name if it’s just electives (ex. CSCI4xx -> CSCI470)


	//For class in InputValue:
	//Make desiredSemester array be 1 to numberOfSemester decided
	var semesterArray = [];
	for (var i = 1 ; i <= numSemester; i++){
		semesterArray.push(i);
	}

	for (var i = 0; i < inputValues.length; i++){
		inputValues[i].desiredSemester = semesterArray.slice();
	}

	//puts the start semester and number of semester object in beginning of array.
	inputValues.unshift({Starting_semester: startsem, NumberOfSemesters: numSemester});


	console.log(JSON.stringify(inputValues));
	});
