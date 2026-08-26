let boardSize = null;
let difficulty = null;
let levelNumber = 1;

let symbols = [];
let solution = [];
let puzzle = [];

let selectedCell = null;
let selectedSymbol = null;

const symbolSets = {
    3: ["★", "♥", "♦"],
    4: ["★", "♥", "♦", "♣"],
    5: ["★", "♥", "♦", "♣", "●"],
    6: ["★", "♥", "♦", "♣", "●", "▲"]
};


function chooseSize(size) {

    boardSize = size;

    document.querySelectorAll(".size-buttons button").forEach(button => {
        button.classList.remove("selected");

        if (button.innerText.includes(size + " × " + size)) {
            button.classList.add("selected");
        }
    });

    updateSelectionText();
}


function chooseLevel(level) {

    difficulty = level;

    document.querySelectorAll(".level-buttons button").forEach(button => {
        button.classList.remove("selected");

        if (button.innerText === level) {
            button.classList.add("selected");
        }
    });

    updateSelectionText();
}


function updateSelectionText() {

    const text = document.getElementById("selectionText");
    const enterButton = document.getElementById("enterBtn");

    if (boardSize && difficulty) {
        text.innerHTML =
            `<b>${boardSize} × ${boardSize}</b> Symbol Sudoku - <b>${difficulty}</b>`;
        enterButton.disabled = false;
    }
}


function startGame() {

    if (!boardSize || !difficulty) {
        return;
    }

    levelNumber = 1;

    document.getElementById("startScreen").classList.remove("active");
    document.getElementById("gameScreen").classList.add("active");

    createGame();
}


function goToStart() {

    document.getElementById("gameScreen").classList.remove("active");
    document.getElementById("startScreen").classList.add("active");

    selectedCell = null;
    selectedSymbol = null;
}


function createGame() {

    selectedCell = null;
    selectedSymbol = null;

    symbols = symbolSets[boardSize];

    solution = generateSolution(boardSize);

    puzzle = solution.map(row => [...row]);

    removeCells();

    document.getElementById("gameInfo").innerText =
        `${boardSize} × ${boardSize} Symbol Sudoku`;

    document.getElementById("levelName").innerText = difficulty;
    document.getElementById("levelNumber").innerText = levelNumber;

    document.getElementById("message").innerText = "";
    document.getElementById("message").className = "message";

    document.getElementById("nextBtn").classList.add("hidden");

    renderBoard();
    renderSymbolOptions();
}


function generateSolution(size) {

    let grid = [];

    for (let row = 0; row < size; row++) {

        let newRow = [];

        for (let col = 0; col < size; col++) {
            newRow.push(symbols[(row + col) % size]);
        }

        grid.push(newRow);
    }

    return grid;
}


function removeCells() {

    let removePercentage = 0.30;

    if (difficulty === "Medium") {
        removePercentage = 0.48;
    }

    if (difficulty === "Hard") {
        removePercentage = 0.62;
    }

    let totalCells = boardSize * boardSize;
    let removeCount = Math.floor(totalCells * removePercentage);

    let positions = [];

    for (let i = 0; i < totalCells; i++) {
        positions.push(i);
    }

    positions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < removeCount; i++) {

        let position = positions[i];

        let row = Math.floor(position / boardSize);
        let col = position % boardSize;

        puzzle[row][col] = "";
    }
}


function renderBoard() {

    const board = document.getElementById("sudokuBoard");

    board.innerHTML = "";

    board.style.gridTemplateColumns =
        `repeat(${boardSize}, 1fr)`;

    board.style.gridTemplateRows =
        `repeat(${boardSize}, 1fr)`;

    for (let row = 0; row < boardSize; row++) {

        for (let col = 0; col < boardSize; col++) {

            const cell = document.createElement("div");

            cell.className = "cell";

            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.innerText = puzzle[row][col];

            if (puzzle[row][col] !== "") {
                cell.classList.add("fixed");
            } else {
                cell.addEventListener("click", () => selectCell(cell));
            }

            board.appendChild(cell);
        }
    }
}


function selectCell(cell) {

    if (cell.classList.contains("fixed")) {
        return;
    }

    document.querySelectorAll(".cell").forEach(item => {
        item.classList.remove("selected");
    });

    selectedCell = cell;

    selectedCell.classList.add("selected");

    if (selectedSymbol) {
        placeSymbol();
    }
}


function renderSymbolOptions() {

    const options = document.getElementById("symbolOptions");

    options.innerHTML = "";

    symbols.forEach(symbol => {

        const button = document.createElement("button");

        button.className = "symbol-option";
        button.innerText = symbol;

        button.addEventListener("click", () => {

            selectedSymbol = symbol;

            document.querySelectorAll(".symbol-option").forEach(btn => {
                btn.classList.remove("active-symbol");
            });

            button.classList.add("active-symbol");

            if (selectedCell) {
                placeSymbol();
            }
        });

        options.appendChild(button);
    });
}


function placeSymbol() {

    if (!selectedCell || !selectedSymbol) {
        return;
    }

    selectedCell.innerText = selectedSymbol;

    selectedCell.classList.remove("wrong-cell");
}


function checkGame() {

    let complete = true;
    let wrong = false;

    document.querySelectorAll(".cell").forEach(cell => {

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (cell.innerText === "") {
            complete = false;
        }

        if (
            cell.innerText !== "" &&
            cell.innerText !== solution[row][col]
        ) {
            wrong = true;
            cell.classList.add("wrong-cell");
        }
    });

    const message = document.getElementById("message");

    if (wrong) {

        message.innerText = "❌ Wrong! Please correct the highlighted boxes.";
        message.className = "message wrong-message";

        return;
    }

    if (!complete) {

        message.innerText = "⚠ Complete all boxes first.";
        message.className = "message wrong-message";

        return;
    }

    message.innerText =
        `🎉 Correct! ${difficulty} Level ${levelNumber} completed!`;

    message.className = "message correct-message";

    document.getElementById("nextBtn").classList.remove("hidden");
}


function resetGame() {

    puzzle = solution.map(row => [...row]);

    removeCells();

    selectedCell = null;
    selectedSymbol = null;

    document.getElementById("message").innerText = "";
    document.getElementById("message").className = "message";

    document.getElementById("nextBtn").classList.add("hidden");

    renderBoard();
    renderSymbolOptions();
}


function nextLevel() {

    levelNumber++;

    createGame();
}


function toggleTheme() {

    document.body.classList.toggle("dark");
}
// Your existing Sudoku game code above

function chooseSize(size) {
    // existing code
}

function startGame() {
    // existing code
}

function checkGame() {
    // existing code
}

function nextLevel() {
    // existing code
}

function toggleTheme() {
    // existing code
}


/* ==============================
   LOGIN AND SIGNUP CODE
   ADD THIS AT THE VERY END
================================= */

function showLogin() {
    // paste your full login code here
}

function showSignup() {
    // paste your full signup code here
}

async function loginUser() {
    // paste your full login code here
}

async function signupUser() {
    // paste your full signup code here
}

function openGameMenu(username) {
    // paste your full login code here
}

function showAuthMessage(message, success) {
    // paste your full login code here
}

async function logoutUser() {
    // paste your full login code here
}

async function checkLoggedInUser() {
    // paste your full login code here
}

window.addEventListener(
    "DOMContentLoaded",
    checkLoggedInUser
);
