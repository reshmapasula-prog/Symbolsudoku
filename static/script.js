const availableSymbols = [
    "★", "♥", "♣", "♦",
    "●", "▲", "■", "✿",
    "♠", "☀", "☾", "⚡"
];

let selectedSymbols = [];
let activeCell = null;


window.onload = function () {
    showSymbolOptions();
};


function showSymbolOptions() {

    const options = document.getElementById("symbolOptions");

    options.innerHTML = "";

    availableSymbols.forEach(symbol => {

        const button = document.createElement("button");

        button.className = "symbol-option";
        button.textContent = symbol;

        if (selectedSymbols.includes(symbol)) {
            button.classList.add("selected");
        }

        button.onclick = function () {
            selectSymbol(symbol, button);
        };

        options.appendChild(button);
    });
}


function selectSymbol(symbol, button) {

    if (selectedSymbols.includes(symbol)) {

        selectedSymbols =
            selectedSymbols.filter(item => item !== symbol);

        button.classList.remove("selected");

    } else {

        if (selectedSymbols.length >= 9) {
            alert("You can select only 9 symbols.");
            return;
        }

        selectedSymbols.push(symbol);

        button.classList.add("selected");
    }

    document.getElementById("selectedCount").textContent =
        "Selected: " + selectedSymbols.length + " / 9";

    document.getElementById("startButton").disabled =
        selectedSymbols.length !== 9;
}


function startGame() {

    if (selectedSymbols.length !== 9) {
        alert("Please select exactly 9 symbols.");
        return;
    }

    document.getElementById("selectionScreen").style.display = "none";

    document.getElementById("gameScreen").style.display = "block";

    newGame();
}


function newGame() {

    const board = document.getElementById("gameBoard");

    board.innerHTML = "";

    activeCell = null;

    // VALID SUDOKU PATTERN
    const solution = [];

    for (let row = 0; row < 9; row++) {

        const rowData = [];

        for (let col = 0; col < 9; col++) {

            const symbolIndex =
                (row * 3 +
                 Math.floor(row / 3) +
                 col) % 9;

            rowData.push(selectedSymbols[symbolIndex]);
        }

        solution.push(rowData);
    }


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell = document.createElement("button");

            cell.className = "cell";

            const isGiven = Math.random() > 0.55;

            if (isGiven) {

                cell.textContent = solution[row][col];

                cell.classList.add("given");

            } else {

                cell.dataset.answer = solution[row][col];

                cell.onclick = function () {
                    selectCell(cell);
                };
            }

            board.appendChild(cell);
        }
    }
}


function selectCell(cell) {

    document.querySelectorAll(".cell").forEach(item => {
        item.classList.remove("selected-cell");
    });

    activeCell = cell;

    cell.classList.add("selected-cell");

    showSymbolPicker();
}


function showSymbolPicker() {

    let oldPicker = document.getElementById("symbolPicker");

    if (oldPicker) {
        oldPicker.remove();
    }

    const picker = document.createElement("div");

    picker.id = "symbolPicker";

    picker.style.margin = "20px auto";
    picker.style.display = "grid";
    picker.style.gridTemplateColumns = "repeat(9, 1fr)";
    picker.style.gap = "8px";
    picker.style.maxWidth = "630px";


    selectedSymbols.forEach(symbol => {

        const button = document.createElement("button");

        button.textContent = symbol;

        button.style.padding = "10px";
        button.style.fontSize = "22px";

        button.onclick = function () {

            if (!activeCell) return;

            activeCell.textContent = symbol;

            activeCell.classList.remove("selected-cell");

            activeCell = null;

            picker.remove();
        };

        picker.appendChild(button);
    });


    document.getElementById("gameScreen").appendChild(picker);
}


function backToSelection() {

    document.getElementById("gameScreen").style.display = "none";

    document.getElementById("selectionScreen").style.display = "block";

    showSymbolOptions();
}
