const token = localStorage.getItem('token');

async function fetchStudents() {
    try {
        const response = await fetch('/professor/students', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const students = await response.json();
        const tbody = document.getElementById('studentTable').querySelector('tbody');
        tbody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            console.log(student);

            const level1Scores = student.data[0]?.level1Scores || [];
            const level2Scores = student.data[0]?.level2Scores || [];

            const level1Average = calculateAverage(level1Scores, 240);
            const level2Average = calculateAverage(level2Scores, 160);

            const level1Score = Array.isArray(level1Scores) 
                ? level1Scores.slice(0, 5).join(', ') 
                : 0;

            const level2Score = Array.isArray(level2Scores) 
                ? level2Scores.slice(0, 5).join(', ') 
                : 0;

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.sectionId}</td>
                <td>${student.data[0]?.accessCode || "Empty"}</td>
                <td style="background-color: ${getBackgroundColor(level1Average)}; color: white;">${level1Score}</td>
                <td style="background-color: ${getBackgroundColor(level2Average)}; color: white;">${level2Score}</td>
                <td>
                    <button onclick="openEditPopup('event','${student._id}')">Edit</button>
                    <button onclick="deleteStudent('event','${student._id}')">Delete</button>
                    <button onclick="showReport('${JSON.stringify(level1Scores)}', '${JSON.stringify(level2Scores)}')">Report</button>
                </td>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students: " + error.message);
    }
}

function showReport(level1Scores, level2Scores) {
    const dialog = document.getElementById('reportDialog');
    const ctx = document.getElementById('scoreChart').getContext('2d');

    level1Scores = JSON.parse(level1Scores);
    level2Scores = JSON.parse(level2Scores);

    if (window.scoreChart && typeof window.scoreChart.destroy === 'function') {
        window.scoreChart.destroy();
    }
    

    window.scoreChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5'],
            datasets: [
                {
                    label: 'Level 1 Scores',
                    data: level1Scores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                },
                {
                    label: 'Level 2 Scores',
                    data: level2Scores,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Student Progress'
                }
            }
        }
    });

    dialog.showModal();
}

document.getElementById('closeDialog').addEventListener('click', () => {
    document.getElementById('reportDialog').close();
});


function calculateAverage(scores, maxScore) {
    if (!Array.isArray(scores) || scores.length === 0) return 0;
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    return (totalScore / (scores.length * maxScore)) * 100;
}

function getBackgroundColor(average) {
    if (average > 70) {
        return '#88e788';
    } else if (average > 40) {
        return '#90d5ff';
    } else {
        return '#F2553B';
    }
}



document.addEventListener('DOMContentLoaded', fetchStudents);


function addStudent() {
    document.getElementById('addPopup').style.display = "block";
}


async function submitStudent(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const sectionId = document.getElementById('sectionId').value.trim();

    console.log("Student Data Collected:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Section ID:", sectionId);

    try {
        const response = await fetch('/professor/addStudents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, sectionId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const result = await response.json();
        console.log(result)
        alert("Student added successfully!");
        window.location.reload()
    } catch (error) {
        console.error("Error adding student:", error);
        alert("Failed to add student: " + error.message);
    } finally {
        document.getElementById('addPopup').style.display = "none";
        document.getElementById('studentForm').reset();
    }
}

async function openEditPopup(event, studentId) {
    
   event.preventDefault();

    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const sectionId = document.getElementById('editSectionId').value.trim();

    const updatedStudent = {
        name: name,
        email: email,
        sectionId: sectionId
    };

    try {
        const response = await fetch(`/professor/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedStudent),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        alert("Student updated successfully!");
        document.getElementById('editPopup').style.display = "none";
        fetchStudents();
    } catch (error) {
        console.error("Error updating student:", error);
        alert("Failed to update student: " + error.message);
    }
}

async function deleteStudent(event, studentId) {
    // event.preventDefault();
    console.log("Delete button clicked for Student ID:", studentId);

    const confirmation = confirm("Are you sure you want to delete this student?");
    if (!confirmation) return;

    try {

        const response = await fetch(`/professor/students/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        alert("Student deleted successfully!");
        fetchStudents();
    } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student: " + error.message);
    }
}


async function generateAccessCode() {
    try {

        const response = await fetch(`/professor/generate-access-code`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        alert("Access code generated successfully!");
        fetchStudents();
    } catch (error) {
        console.error("Error generating access code:", error);
        alert("Failed to generate access to students: " + error.message);
    }
}
