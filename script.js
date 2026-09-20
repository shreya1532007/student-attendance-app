// ===============================
// STUDENT ATTENDANCE SYSTEM
// ===============================


// Get students from LocalStorage
let students = JSON.parse(localStorage.getItem("students")) || [
    {
        rollNo: 1,
        name: "Shreya"
    },
    {
        rollNo: 2,
        name: "Rahul"
    },
    {
        rollNo: 3,
        name: "Priya"
    }
];


// Get attendance from LocalStorage
let attendance =
    JSON.parse(localStorage.getItem("attendance")) || {};


// Get HTML elements
const dateInput =
    document.getElementById("attendanceDate");

const searchInput =
    document.getElementById("searchStudent");

const studentTable =
    document.getElementById("studentTable");


// Set today's date
const today = new Date();

const todayString =
    today.toISOString().split("T")[0];

dateInput.value = todayString;


// =================================
// DISPLAY STUDENTS
// =================================

function displayStudents() {

    studentTable.innerHTML = "";

    const selectedDate = dateInput.value;

    // Get search text
    const searchText =
        searchInput.value.toLowerCase().trim();


    // Filter students
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText)
    );


    filteredStudents.forEach(student => {

        // =========================
        // CALCULATE ATTENDANCE
        // =========================

        let totalDays = 0;
        let presentDays = 0;


        Object.keys(attendance).forEach(date => {

            if (
                attendance[date][student.rollNo]
                !== undefined
            ) {

                totalDays++;

                if (
                    attendance[date][student.rollNo]
                    === "Present"
                ) {
                    presentDays++;
                }
            }
        });


        let percentage =
            totalDays === 0
                ? 0
                : ((presentDays / totalDays) * 100)
                    .toFixed(1);


        // =========================
        // TODAY'S STATUS
        // =========================

        let currentStatus = "Not Marked";


        if (
            attendance[selectedDate] &&
            attendance[selectedDate][student.rollNo]
        ) {

            currentStatus =
                attendance[selectedDate][student.rollNo];
        }


        // =========================
        // CREATE TABLE ROW
        // =========================

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.rollNo}
            </td>


            <td>
                ${student.name}
            </td>


            <td>

                <button
                    class="present"
                    onclick="
                        markAttendance(
                            ${student.rollNo},
                            'Present'
                        )
                    "
                >
                    Present
                </button>


                <button
                    class="absent"
                    onclick="
                        markAttendance(
                            ${student.rollNo},
                            'Absent'
                        )
                    "
                >
                    Absent
                </button>


                <p>
                    Status:
                    <strong>
                        ${currentStatus}
                    </strong>
                </p>

            </td>


            <td>
                ${percentage}%
            </td>


            <td>

                <button
                    onclick="
                        deleteStudent(
                            ${student.rollNo}
                        )
                    "
                >
                    🗑️ Delete
                </button>

            </td>

        `;


        studentTable.appendChild(row);

    });


    // If no student found
    if (filteredStudents.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found.
                </td>
            </tr>
        `;
    }
}


// =================================
// MARK ATTENDANCE
// =================================

function markAttendance(
    rollNo,
    status
) {

    const selectedDate =
        dateInput.value;


    if (!selectedDate) {

        alert(
            "Please select a date first."
        );

        return;
    }


    // Create date record
    if (!attendance[selectedDate]) {

        attendance[selectedDate] = {};
    }


    // Prevent duplicate attendance
    if (
        attendance[selectedDate][rollNo]
    ) {

        alert(
            "Attendance is already marked for this student on this date."
        );

        return;
    }


    // Save attendance
    attendance[selectedDate][rollNo] =
        status;


    // Save to LocalStorage
    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );


    displayStudents();
    updateDashboard();
    updateReport();
}


// =================================
// ADD STUDENT
// =================================

function addStudent() {

    const name =
        prompt("Enter student name:");


    if (
        !name ||
        name.trim() === ""
    ) {

        return;
    }


    // Generate roll number
    const newRollNo =
        students.length > 0
            ? Math.max(
                ...students.map(
                    student => student.rollNo
                )
            ) + 1
            : 1;


    const newStudent = {

        rollNo: newRollNo,

        name: name.trim()

    };


    students.push(newStudent);


    // Save students
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    displayStudents();
    updateDashboard();
    updateReport();
}


// =================================
// DELETE STUDENT
// =================================

function deleteStudent(rollNo) {

    const student =
        students.find(
            student =>
                student.rollNo === rollNo
        );


    if (!student) {

        return;
    }


    const confirmation =
        confirm(
            `Are you sure you want to delete ${student.name}?`
        );


    if (!confirmation) {

        return;
    }


    // Remove student
    students =
        students.filter(
            student =>
                student.rollNo !== rollNo
        );


    // Save updated students
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    displayStudents();
    updateDashboard();
    updateReport();
}


// =================================
// ADD STUDENT BUTTON
// =================================

document
    .getElementById("addStudentBtn")
    .addEventListener(
        "click",
        addStudent
    );


// =================================
// SEARCH STUDENT
// =================================

searchInput.addEventListener(
    "input",
    displayStudents
);


// =================================
// DATE CHANGE
// =================================

dateInput.addEventListener(
    "change",
    function () {

        displayStudents();
        updateDashboard();

    }
);



// =================================
// SAVE ATTENDANCE BUTTON
// =================================

document
    .getElementById("saveAttendanceBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );


            localStorage.setItem(
                "attendance",
                JSON.stringify(attendance)
            );


            alert(
                "Attendance saved successfully! ✅"
            );

        }
    );


function updateDashboard() {
    // =================================
// ATTENDANCE REPORT
// =================================

function updateReport() {

    const reportTable =
        document.getElementById("reportTable");


    reportTable.innerHTML = "";


    students.forEach(student => {

        let presentDays = 0;
        let absentDays = 0;


        // Check all attendance dates
        Object.keys(attendance).forEach(date => {

            const status =
                attendance[date][student.rollNo];


            if (status === "Present") {

                presentDays++;

            } else if (status === "Absent") {

                absentDays++;

            }

        });


        const totalDays =
            presentDays + absentDays;


        const percentage =
            totalDays === 0
                ? 0
                : ((presentDays / totalDays) * 100)
                    .toFixed(1);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.rollNo}
            </td>

            <td>
                ${student.name}
            </td>

            <td>
                ${presentDays}
            </td>

            <td>
                ${absentDays}
            </td>

            <td>
                ${percentage}%
            </td>

        `;


        reportTable.appendChild(row);

    });
}

    // Total students
    const total =
        students.length;


    // Selected date
    const selectedDate =
        dateInput.value;


    let present = 0;
    let absent = 0;


    // Check today's attendance
    if (attendance[selectedDate]) {

        students.forEach(student => {

            const status =
                attendance[selectedDate][student.rollNo];


            if (status === "Present") {

                present++;

            } else if (status === "Absent") {

                absent++;

            }

        });

    }


    // Calculate percentage
    const marked =
        present + absent;


    const percentage =
        marked === 0
            ? 0
            : ((present / marked) * 100).toFixed(1);


    // Update HTML
    document.getElementById(
        "totalStudents"
    ).textContent = total;


    document.getElementById(
        "presentToday"
    ).textContent = present;


    document.getElementById(
        "absentToday"
    ).textContent = absent;


    document.getElementById(
        "attendancePercentage"
    ).textContent =
        percentage + "%";
}


// =================================
// START APPLICATION
// =================================

displayStudents();

updateDashboard();
updateReport();