let typingTimer;  // Timer variable
let doneTypingInterval = 300;  // Time in milliseconds (300ms delay)
let listIndex = 1;

function addListItem() {
    const list = document.getElementById('dynamicList');
    const listItem = document.createElement('li');
    listItem.textContent = `JSON ${listIndex}`;
    list.appendChild(listItem);
    listIndex++;
}

function handleInput() {
    clearTimeout(typingTimer);  // Clear the previous timer
    typingTimer = setTimeout(beautifyJson, doneTypingInterval);  // Set the new timer
}

function beautifyJson() {
    const rawString = document.getElementById('canvas').innerText;


    let beautifiedString = '';
    let indentLevel = 0;

    function addText(text, color) {
        beautifiedString += `<span style="color:${color}">${text}</span>`;
    }

    for (let i = 0; i < rawString.length; i++) {
        const char = rawString[i];

        switch (char) {
            case '\n':
            case '\t':
                break;
            case '{':
            case '[':
                addText(char);
                addText('\n');
                indentLevel++;
                addText('  '.repeat(indentLevel)); // Indentation using spaces
                break;
            case '}':
            case ']':
                addText('\n');
                indentLevel--;
                addText('  '.repeat(indentLevel)); // Indentation using spaces
                addText(char);
                break;
            case ',':
                addText(char);
                addText('\n');
                addText('  '.repeat(indentLevel)); // Indentation using spaces
                break;
            case ':':
                addText(char + ' '); // Space after colon
                break;
            default:
                addText(char); // Just add regular characters
        }
    }
    document.getElementById('canvas').innerHTML = beautifiedString;

}



//////////////////////



let fileCount = 1; // Counter to track the number of files
let currentFile = null; // Tracks the active file

function loadFilesFromLocalStorage() {
    const savedFiles = JSON.parse(localStorage.getItem('files')) || [];
    savedFiles.forEach(file => {
        addFile(file.id, file.content, false);
    });
}

function saveFilesToLocalStorage() {
    const fileData = [];
    const fileList = document.getElementById('fileList').children;
    for (let i = 0; i < fileList.length; i++) {
        const id = fileList[i].dataset.id;
        const content = localStorage.getItem(`file_${id}`) || '';
        fileData.push({ id, content });
    }
    localStorage.setItem('files', JSON.stringify(fileData));
}

function addFile() {
    const fileList = document.getElementById("fileList");

    if (fileList.children.length >= 15) {
        alert("You can only add up to 15 files.");
        return;
    }

    const newFile = document.createElement("li");
    newFile.classList.add("file-item");

    // Add text content
    const fileText = document.createElement("span");
    fileText.textContent = `File ${fileList.children.length + 1}`;
    newFile.appendChild(fileText);

    // Add "X" button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function () {
        fileList.removeChild(newFile);
    };
    newFile.appendChild(deleteButton);

    fileList.appendChild(newFile);
}

// function addFile(id = null, content = '', selectNew = true) {
//     if (!id) {
//         id = `file_${++fileCount}`;
//     }

//     const fileList = document.getElementById('fileList');
//     const listItem = document.createElement('li');
//     listItem.dataset.id = id;

//     const fileText = document.createElement('span');
//     fileText.textContent = `File ${fileCount}`;

//     const clearButton = document.createElement('button');
//     clearButton.textContent = 'x';
//     clearButton.className = 'clear-button';
//     clearButton.onclick = () => clearFile(id, listItem);

//     listItem.appendChild(fileText);
//     listItem.appendChild(clearButton);
//     listItem.onclick = () => selectFile(id);

//     fileList.appendChild(listItem);

//     localStorage.setItem(`file_${id}`, content);

//     if (selectNew) {
//         selectFile(id);
//     }
// }

function selectFile(id) {
    currentFile = id;
    const fileList = document.getElementById('fileList').children;
    for (let i = 0; i < fileList.length; i++) {
        fileList[i].classList.remove('active');
    }

    const activeFile = Array.from(fileList).find(item => item.dataset.id === id);
    if (activeFile) {
        activeFile.classList.add('active');
    }

    const savedContent = localStorage.getItem(`file_${id}`) || '';
    document.getElementById('jsonInput').value = savedContent;
    updateDisplay();
}

function updateDisplay() {
    const input = document.getElementById('jsonInput').value;
    if (currentFile) {
        localStorage.setItem(`file_${currentFile}`, input);
    }
    const display = document.getElementById('jsonDisplay').querySelector('pre');
    try {
        const formatted = JSON.stringify(JSON.parse(input), null, 2);
        display.textContent = formatted;
    } catch (e) {
        display.textContent = 'Invalid JSON';
    }
}

function clearFile(id, listItem) {
    localStorage.removeItem(`file_${id}`);
    listItem.remove();
    saveFilesToLocalStorage();

    if (currentFile === id) {
        currentFile = null;
        document.getElementById('jsonInput').value = '';
        document.getElementById('jsonDisplay').querySelector('pre').textContent = '';
    }
}

// Resizing logic
const resizer = document.getElementById('resizer');
const inputContainer = document.querySelector('.input-container');
const displayContainer = document.querySelector('.display-container');

let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
});

function resize(e) {
    if (isResizing) {
        const totalWidth = inputContainer.offsetWidth + displayContainer.offsetWidth + resizer.offsetWidth;
        const newInputWidth = e.clientX - inputContainer.getBoundingClientRect().left;
        const newDisplayWidth = totalWidth - newInputWidth - resizer.offsetWidth;

        if (newInputWidth > 100 && newDisplayWidth > 100) {
            inputContainer.style.flex = `0 0 ${newInputWidth}px`;
            displayContainer.style.flex = `0 0 ${newDisplayWidth}px`;
        }
    }
}

function stopResize() {
    isResizing = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

window.onload = loadFilesFromLocalStorage;

// Update displayed text dynamically
function updateDisplay() {
    const input = document.getElementById("jsonInput").value;
    document.getElementById("jsonDisplay").querySelector("pre").textContent = input;
}





///////////////////////////////////////--------------
const addButton = document.getElementById("add-btn");
const listContainer = document.getElementById("list");
let listData = []; // In-memory storage for list data

// Render the list items from `listData`
function renderList() {
    listContainer.innerHTML = ""; // Clear existing list
    listData.forEach((value, index) => {
        const listItem = document.createElement("li");
        const input = document.createElement("input");
        input.type = "text";
        input.value = value;

        // Update in-memory data on input change
        input.addEventListener("input", () => {
            listData[index] = input.value;
        });

        listItem.appendChild(input);
        listContainer.appendChild(listItem);
    });
}

// Add a new item to the list
function addListItem() {
    listData.push(""); // Add an empty string for the new item
    renderList(); // Re-render the list
}

// Add button event listener
addButton.addEventListener("click", addListItem);

// Simulate file chang
