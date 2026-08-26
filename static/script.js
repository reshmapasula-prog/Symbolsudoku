const symbols = [
    "★",
    "♥",
    "♦",
    "♣",
    "●",
    "▲",
    "■",
    "◆",
    "✿"
];

let currentGame = [];

function newGame() {

    const gameArea =
        document.getElementById("game");

    gameArea.innerHTML = "";

    currentGame = [];

    for (let i = 0; i < 81; i++) {

        const cell =
            document.createElement("div");

        cell.className = "cell";

        /* Random symbol */

        const randomSymbol =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        cell.textContent =
            randomSymbol;

        currentGame.push(
            randomSymbol
        );

        gameArea.appendChild(
            cell
        );
    }
}

function resetGame() {

    newGame();
}

/* START GAME AUTOMATICALLY */

window.onload = function () {

    newGame();

};
