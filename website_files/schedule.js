var  generatedSchedule = [["CSCI101", "CSCI298", "MATH112", "CSCI370"], ["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"],["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"],["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"]];

var dropDownLists = document.getElementsByClassName("dropdown-check-list");
var checkListItems = document.getElementsByClassName("items");

$(document).ready(function(){
	
} );

function loadElements(semesterContainer) {
    $(semesterContainer).append($("<h2 id='schedule-label'>Generated Schedule</h2>"));
    var num = 0;
    for (var i = 0; i < generatedSchedule.length; i++) {
		
        var semester = document.createElement("div");
        semester.className = "semester";
        var head = document.createElement("h3");
        head.className = "semester-label";
        head.innerHTML = "Semester " + (i + 1);
        semester.appendChild(head);
        var semDiv = document.createElement("hr");
        semDiv.className = "semester-divider";
        $(semester).append($("<hr class='semester-divider'>"));
        semester.appendChild(createInfoTable());
        semester.appendChild(semDiv);
        
        for (var j = 0; j < generatedSchedule[i].length; j++) {
			var classDiv = document.createElement("div");
			classDiv.className = "course";
            
			var courseID = generatedSchedule[i][j]
			var id = document.createElement("span");
            id.className = "course-id";
            id.innerHTML = courseID;
            classDiv.appendChild(id);

			var courseName = "NOT FOUND";
			var courseCredits = "NOT FOUND";
			for(var k = 0; k < courseCatalog.length; k++) {

				if(courseCatalog[k].Id == courseID) {
					courseName = courseCatalog[k].Name;
					if(courseCatalog[k].Min_Credits == courseCatalog[k].Max_Credits) {
						courseCredits = courseCatalog[k].Min_Credits;
					} else {
					courseCredits = courseCatalog[k].Min_Credits + "-" + courseCatalog[k].Max_Credits;
					}
					break;
				}
			}
            var name = document.createElement("span");
			name.className = "course-name";
            name.innerHTML = courseName;
            classDiv.appendChild(name);

            var credit = document.createElement("span");
			credit.className = "course-credit";
            credit.innerHTML = courseCredits;
            classDiv.appendChild(credit);
            
            var semListCon = document.createElement("div");
            semListCon.className = "semester-label";
			var semList = document.createElement("div");
            semList.className = "dropdown-check-list";
            $(semList).append($("<span class='anchor' value=" + num + ">Semesters</span>"));
            num++;
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

			var semesDiv = document.createElement("hr");
			semesDiv.className = "course-divider";
            semester.appendChild(classDiv);
            semester.appendChild(semesDiv);
        }
        semesterContainer.appendChild(semester);
		semesterContainer.appendChild(document.createElement("br"));
        setUpCheckBoxes();
    }
}

function createInfoTable() {
    var infoTable = document.createElement("div");
    infoTable.className = "semester-info-table";
	 $(infoTable).append($("<span class='course-id'>Course ID</span><span class='course-name'>Course Name</span><span class='course-credit'>Credits</span><span class='semesters-label'>Desired Semesters</span>"));
    return infoTable;
}

function setUpCheckBoxes() {
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

function modifiedReturn() {
	var semesters = semesterContainer.getElementsByClassName("semester");
	for(var i = 0; i < semesters.length; i++) {
		var courses = semesters[i].getElementsByClassName("course");
		for(var j = 0; j < courses.length; j++) {
			var checkboxs = courses[j].getElementsByClassName("semCheck");
			var desiredSems = [];
			for(var k = 0; k < checkboxs.length; k++) {
				if(checkboxs[k].checked) {
					desiredSems.push(k + 1);
				}
			}
			course = generatedSchedule[i][j];
			for(var k = 2; k < modify.length; k++) {
				if(modify[k][0] == course) {
					 modify[k][1] = desiredSems;
					break;
				}
			}
		}
	}
}

$("#modifyButton").click(function(){
	modifiedReturn();
});