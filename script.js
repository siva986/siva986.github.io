let typingTimer;  // Timer variable
let doneTypingInterval = 300;  // Time in milliseconds (300ms delay)

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


    // try {
    //     const parsedJson = JSON.parse(rawString);
    //     const beautifiedString = JSON.stringify(parsedJson, null, 2);  // Beautify with 2 spaces indentation

    //     document.getElementById('canvas').innerText = beautifiedString;  // Update the same div with beautified text
    // } catch (error) {
    //     document.getElementById('canvas').innerText = 'Invalid JSON format. Please check your input.';
    // }
}
