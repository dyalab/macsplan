var semesterContainer;

var semesters = [[1, ["CSCI101", "CSCI250", "MATH112", "CSCI370"], ["Introduction to Computer Science", "PYTHON-BASED COMPUTING: BUILDING A SENSOR SYSTEM", "CALCULUS FOR SCIENTISTS AND ENGINEERS II", "ADVANCED SOFTWARE ENGINEERING"], [3.0, 3.0, 4.0, 6.0]], [2, ["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"], ["INTRODUCTION TO THE LINUX OPERATING SYSTEM", "INTRODUCTION TO DATA SCIENCE", "COMPUTER ORGANIZATION", "CALCULUS FOR SCIENTISTS AND ENGINEERS III", "DIFFERENTIAL EQUATIONS"], [1.0, 3.0, 3.0, 4.0, 3.0]]];

$(document).ready(function(){
	semesterContainer = document.getElementById("semesterContainer");
	
	loadElements(semesterContainer);
} );

function loadElements(semesterContainer) {
    for (var i = 0; i < semesters.length; i++) {
		
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
        
        for (var j = 0; j < semesters[i][1].length; j++) {
			var classDiv = document.createElement("div");
			classDiv.className = "course";
			var id = document.createElement("span");
			var name = document.createElement("span");
			var credit = document.createElement("span");
			var lock = document.createElement("span");
			var move = document.createElement("span");
			lock.innerHTML = "[]";
			move.innerHTML = "[]";
			id.className = "course-id";
			name.className = "course-name";
			credit.className = "course-credit";
			lock.className = "lock-label";
			move.className = "move-label";
			var semesDiv = document.createElement("hr");
			semesDiv.className = "course-divider";
            id.innerHTML = semesters[i][1][j];
            name.innerHTML = semesters[i][2][j];
            credit.innerHTML = semesters[i][3][j];
            classDiv.appendChild(id);
            classDiv.appendChild(name);
            classDiv.appendChild(credit);
            classDiv.appendChild(lock);
            classDiv.appendChild(move);
			console.log(id);
            semester.appendChild(classDiv);
            semester.appendChild(semesDiv);
        }
        semesterContainer.appendChild(semester);
		semesterContainer.appendChild(document.createElement("br"));
    }
}

function createInfoTable() {
    var infoTable = document.createElement("div");
    infoTable.className = "semester-info-table";
	 $(infoTable).append($("<span class='course-id'>Course ID</span> <span class='course-name'>Course Name</span> <span class='course-credit'>Credits</span> <span class='lock-label'>Lock</span> <span class='move-label'>Move</span>"));
    return infoTable;
}