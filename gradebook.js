const overviewButton = document.querySelector('#overview-btn');
const editButton = document.querySelector('#edit-btn');

const overviewPage = document.querySelector('#overviewdiv');
const editPage = document.querySelector('#editdiv');

const inputDiv = document.querySelector('#inputdiv');
const warningMsg = document.querySelector('#create');

let focusedElement = '';

document.addEventListener('DOMContentLoaded', () => {
    onUserVisit();
    document.querySelectorAll('#topnav > button').forEach(element => {
        switchView(element);
    })
    document.querySelectorAll('td').forEach(element => {
        element.addEventListener('click', () => {
            navigator.clipboard.writeText(element.innerHTML);
        })
    })
    document.querySelector('#addnew').addEventListener('click', () => {
        addNewSubject();
    })
    document.querySelector('#save').addEventListener('click', () => {
        saveGrades();
    })
    document.querySelector('#remove').addEventListener('click', () => {
        removeSubject();
    })
})

function saveGrades() {
    document.querySelectorAll('#inputdiv > div').forEach(div => {
        const subjectInfo = div.childNodes[0];
        const gradesInfo = div.childNodes[1];

        if (isValid(gradesInfo.value) && validSubjectName(subjectInfo.value)) {
            document.querySelector('#generalwarning').style.display = 'none';
            if (!localStorage.getItem(subjectInfo.value)) {
                localStorage.setItem(subjectInfo.value, gradesInfo.value);
            } else if (localStorage.getItem(subjectInfo.value)) {
                localStorage.setItem(subjectInfo.value, gradesInfo.value);
            }
        } else {
            document.querySelector('#generalwarning').style.display = 'block';
        }
    })
}

function isValid(str) {
    if (str.length === 0) {
        return false;
    }
    try {
        grades = String(str).split(',')
        let sum = 0;
        for(let i = 0; i < grades.length; i++) {
            if (Number(grades[i]) > 100) {
                return false;
            }
            sum += Number(grades[i]);
        }
        average = sum/grades.length;

        if (!isNaN(average)) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        return false;
    }
}

function validSubjectName(str) {
    for (let i = 0; i < str.length; i++) {
        if (!'abcdefghijklmnopqrstuvwxyz '.includes(str[i])) {
            return false;
        }
    }
    return true;
}

function switchView(page) {
    page.addEventListener('click', () => {
        if (page.id === 'edit-btn') {
            overviewButton.style.textDecoration = 'none';
            overviewButton.style.color = 'white';

            editButton.style.textDecoration = 'overline';
            editButton.style.color = 'skyblue';

            overviewPage.style.display = 'none';
            editPage.style.display = 'block';
            loadEditView();
        } else if (page.id === 'overview-btn') {
            editButton.style.textDecoration = 'none';
            editButton.style.color = 'white';

            overviewButton.style.textDecoration = 'overline';
            overviewButton.style.color = 'skyblue';

            editPage.style.display = 'none';
            overviewPage.style.display = 'block';
            loadOverView();
        }
    })
}

function onUserVisit() {
    if (isLocalStorageEmpty()) {
        editPage.style.display = 'block';
        editButton.style.textDecoration = 'overline';
        editButton.style.color = 'skyblue';
        overviewPage.style.display = 'none';
        loadEditView();
    } else {
        overviewPage.style.display = 'block';
        overviewButton.style.textDecoration = 'overline';
        overviewButton.style.color = 'skyblue';
        editPage.style.display = 'none';
        loadOverView();
    }
}

function isLocalStorageEmpty() {
    if (localStorage.length > 0) {
        return false;
    } else {
        return true;
    }
}

function loadEditView() {
    document.querySelector('#generalwarning').style.display = 'none';
    inputDiv.innerHTML = '';
    if (isLocalStorageEmpty()) {
        warningMsg.style.display = 'block';
    } else {
        warningMsg.style.display = 'none';
        for (let i = 0; i < localStorage.length; i++) {
            const keyInfo = localStorage.getItem(localStorage.key(i)).split(',');
            const keyName = localStorage.key(i);

            const editGradeInput = document.createElement('div');
            const inputBox = document.createElement('input');
            const subjectBox = document.createElement('input');

            subjectBox.onfocus = () => {focusedElement = subjectBox}

            inputBox.placeholder = 'subject';
            subjectBox.placeholder = 'grades';

            editGradeInput.style.display = 'flex';
            inputBox.value = keyName;
            inputBox.disabled = 'true';
            subjectBox.value = keyInfo;
            inputBox.type = 'text';
            subjectBox.type = 'text';

            editGradeInput.append(inputBox, subjectBox);

            inputDiv.append(editGradeInput);
        }
    }
}

function loadOverView() {
    const resultsTable = document.querySelector('#resulttable');
    const resultsCenter = document.querySelector('#resultcenter');
    const noOverview = document.querySelector('#noverview');
    clearTable();
    if (isLocalStorageEmpty()) {
        noOverview.style.display = 'block';
        resultsCenter.style.display = 'none';
    } else {
        noOverview.style.display = 'none';
        resultsCenter.style.display = 'block';

        for (let i = 0; i < localStorage.length; i++) {
            const keyInfo = localStorage.getItem(localStorage.key(i)).split(',');
            const keyName = localStorage.key(i);
            const tableRow = document.createElement('tr');

            let numArray = [];
            let sum = 0;
            for (let j = 0; j < keyInfo.length; j++) {
                numArray.push(Number(keyInfo[j]))
                sum += Number(keyInfo[j]);
            }

            let average = (sum / numArray.length).toFixed(2);

            let grade = '';
            if (average > 85) {
                grade = 'A'
            } else if (average <= 84 && average >= 70) {
                grade = 'B'
            } else if (average <= 69 && average >= 51) {
                grade = 'C'
            } else if (average <= 50 && average >= 31) {
                grade = 'D'
            } else if (average <= 30 && average >= 26) {
                grade = 'E'
            } else if (average <= 25) {
                grade = 'F'
            }

            details = [keyName, `${average}%`, `${Math.max(...numArray)}%`, `${Math.min(...numArray)}%`, grade]

            for (let i = 0; i < details.length; i++) {
                const newTag = document.createElement('td');
                newTag.innerHTML = details[i];
                tableRow.append(newTag);
            }

            resultsTable.append(tableRow);
        }
    }
}

function addNewSubject() {
    warningMsg.style.display = 'none';
    const newGradeInput = document.createElement('div');
    const [inputBox, subjectBox] = [document.createElement('input'), document.createElement('input')];
    newGradeInput.style.display = 'flex';
    inputBox.placeholder = 'subject';
    subjectBox.placeholder = 'grades';
    inputBox.type = 'text';
    subjectBox.type = 'text';
    inputBox.onfocus = () => {focusedElement = inputBox};
    subjectBox.onfocus = () => {focusedElement = subjectBox};

    newGradeInput.append(inputBox, subjectBox);
    inputDiv.append(newGradeInput);
}

function clearTable() {
    const table = document.querySelector('#resulttable');
    while (table.getElementsByTagName('tr')[1]) {
        table.removeChild(table.getElementsByTagName('tr')[1]);
    }
}

function removeSubject() {
    if (focusedElement !== '' && focusedElement.tagName === 'INPUT') {
        if (focusedElement.placeholder = 'grades') {
            if (localStorage.getItem(focusedElement.parentNode.firstChild.value)) {
                localStorage.removeItem(focusedElement.parentNode.firstChild.value);
            }
        }
    }
    focusedElement.parentNode.remove();
    if (isLocalStorageEmpty()) {
        warningMsg.style.display = 'block';
    }
}