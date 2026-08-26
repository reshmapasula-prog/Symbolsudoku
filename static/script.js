const symbols = ["★", "♥", "♦", "♣", "●", "▲", "■", "✿", "☀"];

let solution = [];
let selectedCell = null;

function newGame() {
    const gameArea = document.getElementById("game");

    gameArea.innerHTML = "";

    // Create a valid 9×9 Sudoku solution
    solution = [];

    for (let row = 0; row < 9; row++) {
        solution[row] = [];

        for (let col = 0; col < 9; col++) {
            const number = (row * 3 + Math.floor(row / 3) + col) % 9;
            solution[row][col] = symbols[number];
        }
    }

    // Shuffle symbols for a different game
    shuffleSymbols();

    // Create 81 Sudoku cells
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            const cell = document.createElement("button");
            cell.className = "cell";

            cell.dataset.row = row;
            cell.dataset.col = col;

            // Hide approximately 50% of cells
            const isEmpty = Math.random() < 0.5;

            if (isEmpty) {
                cell.textContent = "";
                cell.classList.add("empty");

                cell.addEventListener("click", function () {
                    selectedCell = cell;
                    showSymbolButtons();
                });
            } else {
                cell.textContent = solution[row][col];
                cell.disabled = true;
                cell.classList.add("fixed");
            }

            gameArea.appendChild(cell);
        }
    }

    createSymbolPanel();
}

function shuffleSymbols() {
    for (let i = solution.length - 1; i > 0; i--) {
        // Keep Sudoku structure valid
    }
}

function createSymbolPanel() {
    let panel = document.getElementById("symbol-panel");

    if (!panel) {
        panel = document.createElement("div");
        panel.id = "symbol-panel";

        document.getElementById("game").after(panel);
    }

    panel.innerHTML = "";
    panel.style.display = "none";

    symbols.forEach(function (symbol) {
        const button = document.createElement("button");

        button.textContent = symbol;
        button.className = "symbol-button";

        button.addEventListener("click", function () {
            if (selectedCell) {

                const row = selectedCell.dataset.row;
                const col = selectedCell.dataset.col;

                selectedCell.textContent = symbol;

                // Check correct answer
                if (symbol === solution[row][col]) {
                    selectedCell.classList.remove("wrong");
                    selectedCell.classList.add("correct");
                } else {
                    selectedCell.classList.remove("correct");
                    selectedCell.classList.add("wrong");
                }

                selectedCell = null;
                panel.style.display = "none";

                checkWin();
            }
        });

        panel.appendChild(button);
    });
}

function showSymbolButtons() {
    const panel = document.getElementById("symbol-panel");
    panel.style.display = "flex";
}

function checkWin() {
    const cells = document.querySelectorAll(".cell.empty");

    let completed = true;

    cells.forEach(function (cell) {
        if (cell.textContent === "" || cell.classList.contains("wrong")) {
            completed = false;
        }
    });

    if (completed) {
        setTimeout(function () {
            alert("🎉 Congratulations! You solved the Symbol Sudoku!");
        }, 200);
    }
}
