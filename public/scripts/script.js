var option1Input = document.getElementById('option1').value;
var option2Input = document.getElementById('option2').value;
var option3Input = document.getElementById('option3').value;
var option4Input = document.getElementById('option4').value;
var correctOption = document.getElementById('correctOption').value;
var submitBtn = document.getElementById('addButton');
var editBtn = document.getElementById('editButton');
var isEditQuestion = false;
//document.getElementById('questionForm').reset();

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
});

function formatChemicalText(rawText) {
    const superscriptMap = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
        '+': '⁺',
        '-': '⁻'
    };

    return rawText
        .replace(/([A-Z][a-z]*)(\d+)/g, "$1<sub>$2</sub>") // Subscripts
        .replace(/\^(\d+)([-+]?)?/g, (_, number, sign) =>
            `<sup>${number.split('').map(char => superscriptMap[char] || char).join('')}${sign || ''}</sup>`
        );
}

function convertHtmlToUnicode(text) {
    const superscriptMap = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
        '+': '⁺',
        '-': '⁻'
    };

    return text
        .replace(/<sub>(.*?)<\/sub>/g, (_, subContent) =>
            subContent.split('').map(char => String.fromCharCode(8320 + parseInt(char))).join('')
        )
        .replace(/<sup>(.*?)<\/sup>/g, (_, supContent) =>
            supContent.split('').map(char => superscriptMap[char] || char).join('')
        );
}

function formatInputs() {
    // Format question
    const questionInput = document.getElementById('question');
    const outputElement = document.getElementById('output');

    if (questionInput) {
        const rawText = questionInput.value;
        const formattedText = formatChemicalText(rawText);
        console.log(formattedText)
        outputElement.innerHTML = formattedText;
        questionInput.value = convertHtmlToUnicode(outputElement.innerHTML);
        console.log(questionInput.value)
    }

   
}

async function fetchQuestions() {
    try {
        const response = await fetch('/professor/getQuestions');
        const data = await response.json();
        if (data.questions.length > 0) {
            populateTable(data.questions);
        } else {
            alert("No questions data to show");
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function populateTable(questions) {
    const tableBody = document.getElementById('questionTable');
    tableBody.innerHTML = '';

    questions.forEach((question, index) => {
        const row = document.createElement('tr');
        row.dataset.questionNumber = question.questionNumber;

        row.innerHTML = `
            <td class="index">${index + 1}</td>
            <td>${question.compound}</td>
            <td>${question.incorrect1}</td>
            <td>${question.incorrect2}</td>
            <td>${question.incorrect3}</td>
            <td style="color: #060; font-weight: 550;">${question.correct}</td>
            <td>
                <button class="actions edit">Edit</button>
                <button class="actions delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    addTableActions();
}

document.getElementById('questionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Format all inputs before submission
    formatInputs();

    const compound = document.getElementById('question').value;
    const correctOption = document.getElementById('correctOption').value;
    const correct = correctOption === "1" ? document.getElementById('option1').value :
                    correctOption === "2" ? document.getElementById('option2').value :
                    correctOption === "3" ? document.getElementById('option3').value :
                    document.getElementById('option4').value;

    const allOptions = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value
    ];
    const incorrectOptions = allOptions.filter(opt => opt !== correct);

    const questionData = {
        compound,
        correct,
        incorrect1: incorrectOptions[0],
        incorrect2: incorrectOptions[1],
        incorrect3: incorrectOptions[2]
    };

    try {
        const response = await fetch('/professor/addQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        });

        if (response.ok) {
            alert('Question added successfully!');
            document.getElementById('questionForm').reset();
            window.location.reload(true);
        } else {
            alert('Failed to add question.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    }
});

async function editQuestions(event) {
    event.preventDefault();
    // Format all inputs before submission
    formatInputs();
    const questionNumber = document.getElementById('questionForm').getAttribute('data-question-number');
    const compound = document.getElementById('question').value;
    const correct = document.getElementById('correctOption').value === "1" ? document.getElementById('option1').value :
                    document.getElementById('correctOption').value === "2" ? document.getElementById('option2').value :
                    document.getElementById('correctOption').value === "3" ? document.getElementById('option3').value :
                    document.getElementById('option4').value;

    const allOptions = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value
    ];
    const incorrectOptions = allOptions.filter(opt => opt !== correct);

    const questionData = {
        compound,
        correct,
        incorrect1: incorrectOptions[0],
        incorrect2: incorrectOptions[1],
        incorrect3: incorrectOptions[2],
    };

    try {
        const response = await fetch(`/professor/questions/${questionNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        });

        if (response.ok) {
            alert('Question updated successfully!');
            document.getElementById('questionForm').reset();
            window.location.reload(true);
        } else {
            alert('Failed to update question.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    }
};

function editQuestion(row, questionNumber) {
    const cells = row.getElementsByTagName('td');
    document.getElementById('question').value = cells[1].innerText;
    document.getElementById('option1').value = cells[2].innerText;
    document.getElementById('option2').value = cells[3].innerText;
    document.getElementById('option3').value = cells[4].innerText;
    document.getElementById('option4').value = cells[5].innerText;

    submitBtn.hidden = true;
    editBtn.hidden = false;
    document.getElementById('questionForm').setAttribute('data-question-number', questionNumber);
}

function addTableActions() {
    const editButtons = document.querySelectorAll('.actions.edit');
    editButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const questionNumber = row.dataset.questionNumber;
            editQuestion(row, questionNumber);
        });
    });

    const deleteButtons = document.querySelectorAll('.actions.delete');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const questionNumber = row.dataset.questionNumber;

            if (confirm('Are you sure you want to delete this question?')) {
                await deleteQuestion(questionNumber);
                row.remove();
            }
        });
    });
}

async function deleteQuestion(questionNumber) {
    try {
        const response = await fetch(`/professor/questions/${questionNumber}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error deleting question');
        }
        alert('Question deleted successfully');
    } catch (error) {
        console.error(error);
        alert('Error deleting question');
    }
}
