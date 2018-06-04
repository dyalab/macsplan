var semesterContainer = document.getElementById("semesterContainer");

var semsters = [1];
var classIDs = ["CSCI101", "CSCI250", "MATH112", "CSCI370"];
var classNames = ["Introduction to Computer Science", "PYTHON-BASED COMPUTING: BUILDING A SENSOR SYSTEM", "CALCULUS FOR SCIENTISTS AND ENGINEERS II", "ADVANCED SOFTWARE ENGINEERING"];
var classCredits = [3.0, 3.0, 4.0, 6.0];
var semesters = [[1, ["CSCI101", "CSCI250", "MATH112", "CSCI370"], ["Introduction to Computer Science", "PYTHON-BASED COMPUTING: BUILDING A SENSOR SYSTEM", "CALCULUS FOR SCIENTISTS AND ENGINEERS II", "ADVANCED SOFTWARE ENGINEERING"], [3.0, 3.0, 4.0, 6.0]], [2, ["CSCI274", "CSCI303", "CSCI341", "MATH213", "MATH225"], ["INTRODUCTION TO THE LINUX OPERATING SYSTEM", "INTRODUCTION TO DATA SCIENCE", "COMPUTER ORGANIZATION", "CALCULUS FOR SCIENTISTS AND ENGINEERS III", "DIFFERENTIAL EQUATIONS"], [1.0, 3.0, 3.0, 4.0, 3.0]]];

function loadElements(semesterContainer) {
    for (var i = 0; i < semesters.legnth; i++) {
        var semester = document.createElement("div");
        semester.className = "semester";
        var head = document.createElement("h3");
        head.className = "semester-label";
        head.text = "Semester " + (i + 1);
        semester.appendChild(head);
        var semDiv = document.createElement("hr");
        semDiv.className = "semester-divider";
        semester.appendChild(semDiv);
        semester.appendChild(createInfoTable());
        semester.appendChild(semDiv);
        var classDiv = document.createElement("div");
        classDiv.className = "course";
        var id = document.createElement("span");
        var name = document.createElement("span");
        var credit = document.createElement("span");
        var lock = document.createElement("span");
        var move = document.createElement("span");
        lock.text = "[]";
        move.text = "[]";
        id.className = "course-id";
        name.className = "course-name";
        credit.className = "course-credit";
        lock.className = "lock-label";
        move.className = "move-label";
        var semesDiv = document.createElement("hr");
        semesDiv.className = "semester-divider";
        for (var j = 0; j < semesters[i][1].length; j++) {
            id.text = semesters[i][1][j];
            name.text = semesters[i][2][j];
            credit.text = semesters[i][3][j];
            classDiv.appendChild(id);
            classDiv.appendChild(name);
            classDiv.appendChild(credit);
            classDiv.appendChild(lock);
            classDiv.appendChild(move);
            semester.appendChild(classDiv);
            semester.appendChild(semesDiv);
        }
        semesterContainer.write(semester);
    }
}

function createInfoTable() {
    var infoTable = document.createElement("div");
    infoTable.className = "semester-info-table";
    var idLabel = document.createElement("span");
    idLabel.text = "Course ID";
    var nameLabel = document.createElement("span");
    nameLabel.text = "Course Name";
    var creditLabel = document.createElement("span");
    creditLabel.text = "Credits";
    var lockLabel = document.createElement("span");
    lockLabel.text = "Lock";
    var moveLabel = document.createElement("span");
    moveLabel.text = "Move";
    idLabel.className = "course-id";
    nameLabel.className = "course-name";
    creditLabel.className = "course-credit";
    lockLabel.className = "lock-label";
    moveLabel.className = "move-label";
    infoTable.appendChild(idLabel);
    infoTable.appendChild(nameLabel);
    infoTable.appendChild(creditLabel);
    infoTable.appendChild(lockLabel);
    infoTable.appendChild(moveLabel);
    return infoTable;
}