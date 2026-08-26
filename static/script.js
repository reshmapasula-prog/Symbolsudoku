const symbols = [
    "★", "♥", "♦",
    "♣", "●", "▲",
    "■", "◆", "✿"
];

let gameData = [];

/* Create a valid symbol Sudoku pattern */

function createBoard() {

    const board = [];

    for (let row = 0; row < 9; row++) {

        board[row] = [];

        for (let col = 0; col < 9; col++) {

            const symbolIndex =
                (row * 3 +
                Math.floor(row / 3) +
                col) % 9;

            board[row][col] =
                symbols[symbolIndex];
        }
    }

    return board;
}

/* Shuffle rows */

function shuffleBoard(board) {

    for (let group = 0; group < 3; group++) {

        const start = group * 3;

        for (let i = 0; i < 3; i++) {

            const random =
                start +
                Math.floor(Math.random() * 3);

            const temp = board[start + i];

            board[start + i] = board[random];

            board[random] = temp;
        }
    }

    return board;
}

/* Start new game */

function newGame() {

    const game =
        document.getElementById("game");

    game.innerHTML = "";

    gameData =
        shuffleBoard(createBoard());

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell =
                document.createElement("div");

            cell.className = "cell";

            /* Show around 45 starting symbols */

            const showSymbol =
                Math.random() > 0.45;

            if (showSymbol) {

                cell.textContent =
                    gameData[row][col];

            } else {

                cell.textContent = "";
            }

            game.appendChild(cell);
        }
    }
}

/* Reset */

function resetGame() {
    newGame();
}

/* Automatically start */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        newGame();
    }
);
