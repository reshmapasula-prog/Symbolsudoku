function newGame() {
    const symbols = ["★", "♥", "♦", "♣", "●"];

    const gameArea = document.getElementById("game");

    gameArea.innerHTML = "";

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("button");

        cell.className = "cell";

        const symbol = symbols[Math.floor(Math.random() * symbols.length)];

        cell.textContent = symbol;

        gameArea.appendChild(cell);
    }
}
