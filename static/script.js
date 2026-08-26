const symbols = ["★", "♥", "♦", "♣", "●"];

function newGame() {
    const gameArea = document.getElementById("game");

    gameArea.innerHTML = "";

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("button");

        cell.className = "cell";

        // Create some empty cells
        const isEmpty = Math.random() < 0.35;

        if (!isEmpty) {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            cell.textContent = symbol;
        } else {
            cell.textContent = "";
            cell.classList.add("empty");

            // Click empty cell
            cell.addEventListener("click", function () {
                const symbol = symbols[
                    Math.floor(Math.random() * symbols.length)
                ];

                cell.textContent = symbol;
                cell.classList.remove("empty");
            });
        }

        gameArea.appendChild(cell);
    }
}
