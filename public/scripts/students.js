
async function fetchStudents() {
    try {
        const response = await fetch('/professor/students');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const students = await response.json();
        const tbody = document.getElementById('studentTable').querySelector('tbody');
        tbody.innerHTML = ''; 

       
        students.forEach(student => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.sectionId}</td>
                <td>${student.data[0] ? student.data[0].accessCode :  "Empty"}</td>
                <td>${student.data[0] ? student.data[0].level1Score : 0 }</td>
                <td>${student.data[0] ? student.data[0].level2Score : 0}</td>
                <td>
                    <button onclick="openEditPopup('event','${student._id}')">Edit</button>
                    <button onclick="deleteStudent('event','${student._id}')">Delete</button>
                </td>
            `;

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students: " + error.message);
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
    //event.preventDefault();
    console.log("Delete button clicked for Student ID:", studentId);

    const confirmation = confirm("Are you sure you want to delete this student?");
    if (!confirmation) return;

    try {
        const response = await fetch(`/professor/students/${studentId}`, {
            method: 'DELETE',
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
        });
        console.log(response)
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
