/*
var  generatedSchedule = [["CSCI101", "CSCI298", "MATH112", "CSCI370"], ["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"],["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"],["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"]];
*/

// pastes error message in container
function returnError(error) {
	console.log("error");
	generatedSchedule = [["CSCI101", "CSCI298", "MATH112", "CSCI370"], ["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"],["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"],["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"]];
    loadElements(generatedSchedule);
}

// checks to see if result is a json file
// if not displays error message
// if it is, checks to make sure it is not null then displays
// if it is null then shows error of nothing returned
function loadResults(result) {
    result = typeof result !== "string" ? JSON.stringify(result): result; // if result is not a string, stringifies json
    try {
        generatedSchedule = JSON.parse(result);
        loadElements(generatedSchedule);
    } catch {
        returnError(result); // if can't parse result (string) then shows error
    }
}

// Generates HTML for the schedule and assings appropriate classes to each semester
function loadElements(generatedSchedule) {
	var semesterContainer = document.getElementById("semesterContainer");
    $(semesterContainer).append($("<h2 id='schedule-label'>Generated Schedule</h2>")); // Generated Schedule
    var num = 0; // variable to determine how many courses entered
	console.log(generatedSchedule);
    for (var i = 0; i < generatedSchedule.length; i++) { // iterate through number of semesters
			console.log("1");

        var semester = document.createElement("div"); // semester div
        semester.className = "semester";
        // label for the semester "Semester 1"
        var head = document.createElement("h3");
        head.className = "semester-label";
        head.innerHTML = "Semester " + (i + 1);
        semester.appendChild(head);
        // break lines in semester surrounding the column infoTable
        $(semester).append($("<hr class='semester-divider'>"));
        semester.appendChild(createInfoTable());
        $(semester).append($("<hr class='semester-divider'>"));
        
        // iterate through the course in each semester
        for (var j = 0; j < generatedSchedule[i].length; j++) {
				console.log("2");

			var classDiv = document.createElement("div"); // div for class row
			classDiv.className = "course";
            
			var courseID = generatedSchedule[i][j] // get the courseID
            // courseID element
			var id = document.createElement("span");
            id.className = "course-id";
            id.innerHTML = courseID;
            classDiv.appendChild(id);

            // loop to search catalog for courseName and courseCredits
            // if it is not in catalog will display NOT FOUND
			var courseName = "NOT FOUND";
			var courseCredits = "NOT FOUND";
			for(var k = 0; k < courseCatalog.length; k++) {
					console.log("3");

				if(courseCatalog[k].Id == courseID) {
					courseName = courseCatalog[k].Name;
                    // some courses have min and max number of credits so this will display it properly
					if(courseCatalog[k].Min_Credits == courseCatalog[k].Max_Credits) {
						courseCredits = courseCatalog[k].Min_Credits;
					} else {
					courseCredits = courseCatalog[k].Min_Credits + "-" + courseCatalog[k].Max_Credits;
					}
					break;
				}
			}
        
            // courseName element 
            var name = document.createElement("span");
			name.className = "course-name";
            name.innerHTML = courseName;
            classDiv.appendChild(name);
            
            // courseCredits element
            var credit = document.createElement("span");
			credit.className = "course-credit";
            credit.innerHTML = courseCredits;
            classDiv.appendChild(credit);
            
            // dropdowm menu containter of selecting desired semesters
            var semListCon = document.createElement("div");
            semListCon.className = "semester-label";
			var semList = document.createElement("div");
            semList.className = "dropdown-check-list";
            // labels each checkbox for what number course it is **only way to iterate through them from what I found**
            $(semList).append($("<span class='anchor' value=" + num + ">Semesters</span>")); 
            num++; //increment num
            var uList = document.createElement("ul");
            uList.className = "items";
            for(var k = 0; k < generatedSchedule.length; k++) {
                var item = document.createElement("li");
                item.innerHTML = "<input type='checkbox' class='semCheck' checked='true' />" + (k + 1);
                uList.appendChild(item);
            }
            semList.appendChild(uList);
            semListCon.appendChild(semList);
            classDiv.appendChild(semListCon);

            // add course div to semester container and a line to break up classes
            semester.appendChild(classDiv);
            $(semester).append($("<hr class='course-divider'>"));
        }
        // add semester to semesterContainer then a break between semesters
        semesterContainer.appendChild(semester);
		semesterContainer.appendChild(document.createElement("br"));
    }
	// set up the checkboxes and add modify schedule button to bottom of page
	setUpCheckBoxes();
	$(semesterContainer).append($("<button type='button' class='btn btn-primary btn-lg btn-block' id='modifyButton'>Modify Schedule</button>"));
}

// Creates the info at the top of each semester with the column labels
function createInfoTable() {
    var infoTable = document.createElement("div"); // div for element
    infoTable.className = "semester-info-table";
    $(infoTable).append($("<span class='course-id'>Course ID</span><span class='course-name'>Course Name</span><span class='course-credit'>Credits</span><span class='semesters-label'>Desired Semesters</span>")); // all labels
    return infoTable;
}

// makes checkboxes for desired semesters to be openable and closeable
function setUpCheckBoxes() {
    var dropDownLists = document.getElementsByClassName("dropdown-check-list");
    var checkListItems = document.getElementsByClassName("items");
    for(var i = 0; i < dropDownLists.length; i++) {
        dropDownLists[i].getElementsByClassName("anchor")[0].onclick = function(evt) {
            var value = $(this).attr('value');
            if(checkListItems[value].classList.contains('visible')) {
                checkListItems[value].classList.remove('visible');
                checkListItems[value].style.display = "none";
            }
            else {
                checkListItems[value].classList.add('visible');
                checkListItems[value].style.display = "block";
            }
        }
        checkListItems[i].onblur = function(evt) {
            checkListItems[i].classList.remove('visible');
        }
    }
}

// function to change the modify array with each class student still needs to take and desired semesters when button clicked
$("#modifyButton").click(function(){
	var semesters = semesterContainer.getElementsByClassName("semester"); // get list of semesters
	for(var i = 0; i < semesters.length; i++) {
		var courses = semesters[i].getElementsByClassName("course"); // get list of courses for current semester iterating through
		for(var j = 0; j < courses.length; j++) {
			var checkboxs = courses[j].getElementsByClassName("semCheck"); // get list of checkboxes for current course iterating through
			var desiredSems = [];
			for(var k = 0; k < checkboxs.length; k++) {
				if(checkboxs[k].checked) {
					desiredSems.push(k + 1); // if checked add to list of desired semesters
				}
			}
			modify.push([generatedSchedule[i][j], desiredSems]); // add [CourseID, [desiredSems]] to the modify array
		}
	}
    
    console.log(modify); // delete once modying schedule works
});