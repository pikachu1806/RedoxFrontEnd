var questionInput = document.getElementById('question');
var option1Input = document.getElementById('option1').value;
var option2Input = document.getElementById('option2').value;
var submitBtn = document.getElementById('addButton');
var editBtn = document.getElementById('editButton');
var outputElement = document.getElementById('output');
var isEditQuestion = false;
const token = localStorage.getItem('token');

function checkSeparator() {
    const rawText = questionInput.value;

    if (/[+, ]/.test(rawText[rawText.length - 1])) {
       // change();
    }
}

function change() {
    // Collect input and output elements
    const questionInput = document.getElementById('question');
    const outputElement = document.getElementById('output');
    const option1Input = document.getElementById('option1');
    const output1Element = document.getElementById('output1');
    const option2Input = document.getElementById('option2');
    const output2Element = document.getElementById('output2');

    // Function to replace subscripts and superscripts with Unicode
    function convertHtmlToUnicode(text) {
        // Superscript map for numbers
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
                supContent
                    .split('')
                    .map(char => superscriptMap[char] || char) // Map digits and special characters
                    .join('')
            );
    }

    // Function to format a chemical equation or compound
    function formatChemicalText(rawText, isEquation = false) {
        if (isEquation) {
            // For equations, handle parts separated by +, →, etc.
            const parts = rawText.split(/([+→,])/); // Keep separators
            return parts
                .map(part => {
                    if (["+", "→", ","].includes(part)) return part; // Leave separators
                    return part
                        .replace(/([A-Z][a-z]*)(\d+)/g, "$1<sub>$2</sub>") // Subscripts
                        .replace(/\^(\d+)([-+]?)?/g, "<sup>$1$2</sup>"); // Superscripts
                })
                .join("");
        } else {
            // For single compounds
            return rawText
                .replace(/([A-Z][a-z]*)(\d+)/g, "$1<sub>$2</sub>") // Subscripts
                .replace(/\^(\d+)([-+]?)?/g, "<sup>$1$2</sup>"); // Superscripts
        }
    }

    // Format and set `question` input and output
    if (questionInput && outputElement) {
        const rawQuestion = questionInput.value;
        const formattedQuestion = formatChemicalText(rawQuestion, true);
        outputElement.innerHTML = formattedQuestion;
        questionInput.value = convertHtmlToUnicode(outputElement.innerHTML);
    }

    // Format and set `option1` input and output
    if (option1Input && output1Element) {
        const rawOption1 = option1Input.value;
        const formattedOption1 = formatChemicalText(rawOption1);
        output1Element.innerHTML = formattedOption1;
        option1Input.value = convertHtmlToUnicode(output1Element.innerHTML);
    }

    // Format and set `option2` input and output
    if (option2Input && output2Element) {
        const rawOption2 = option2Input.value;
        const formattedOption2 = formatChemicalText(rawOption2);
        output2Element.innerHTML = formattedOption2;
        option2Input.value = convertHtmlToUnicode(output2Element.innerHTML);
    }

    // Log final JSON output
    const outputJSON = {
        compound: questionInput.value,
        oxidized: option1Input.value,
        reduced: option2Input.value
    };
    console.log("Final JSON Output:", outputJSON);
}






const editButtons = document.querySelectorAll('.actions');
editButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        const questionNumber = row.dataset.questionNumber;
        editQuestion(row, questionNumber);
    });
});


function editQuestion(row, questionNumber) {
    const cells = row.getElementsByTagName('td');
    console.log(cells[0].innerText, cells[1].innerText )
    document.getElementById('question').value = cells[1].innerText;
    document.getElementById('option1').value = cells[2].innerText;
    document.getElementById('option2').value = cells[3].innerText;
    
    submitBtn.hidden = true;
    editBtn.hidden = false;
    document.getElementById('questionForm').setAttribute('data-question-number', questionNumber)
}


async function fetchQuestions() {
    try {

        const response = await fetch('/professor/getLevel2Questions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        
        if (data.questions && data.questions.length > 0) {
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

    questions.forEach(( question, index) => {
        const row = document.createElement('tr');

        row.dataset.questionNumber = question.questionNumber;

        row.innerHTML = `
            <td class="index">${index + 1}</td>
            <td>${question.question}</td>
            <td>${question.oxidized}</td>
            <td>${question.reduced}</td>
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
    if(isEditQuestion == false){
        change()
        e.preventDefault(); 

    const compound = document.getElementById('question').value;;
    const oxidized = document.getElementById('option1').value ;
    const reduced = document.getElementById('option2').value ;
    
    const questionData = {
        compound,
        oxidized: oxidized,
        reduced: reduced
    };

    console.log(questionData);



    try {
        const response = await fetch('/professor/addLevel2Question/addQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(questionData)
        });

        if (response.ok) {
            alert('Question added successfully!');
            document.getElementById('questionForm').reset();
            window.location.reload(true)
        } else {
            alert('Failed to add question.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    }  
    }
    
});


async function editQuestions(event) {
    event.preventDefault();
    isEditQuestion = true;
    const questionNumber = document.getElementById('questionForm').getAttribute('data-question-number');
    console.log("Edit -> ", questionNumber)
    const compound = document.getElementById('question').value;
    const oxidized = document.getElementById('option1').value ;
    const reduced = document.getElementById('option2').value ;
    
    const questionData = {
        compound,
        oxidized: oxidized,
        reduced: reduced
    };

    console.log(questionData); 

    try {
        const response = await fetch(`/professor/level2Questions/${questionNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(questionData)
        });

        if (response.ok) {
            alert('Question updated successfully!');
            document.getElementById('questionForm').reset();
            window.location.reload(true)
        } else {
            alert('Failed to update question.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    } 
}; 




function addTableActions() {
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
    console.log(questionNumber);
    try {

        const response = await fetch(`/professor/level2Questions/${questionNumber}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error deleting question');
        }
        
        alert('Question deleted successfully');
        window.location.reload(true);
    } catch (error) {
        console.error('Error deleting question:', error);
    }
}


document.addEventListener('DOMContentLoaded', fetchQuestions);
