let currentUser = "";

let boardSize = 3;
let difficulty = "Easy";
let levelNumber = 1;

let selectedCell = null;

let currentBoard = [];
let solutionBoard = [];

const allSymbols = [
    "★",
    "♥",
    "♦",
    "♣",
    "▲",
    "●"
];


/* =========================
   LOGIN
========================= */

async function loginUser() {

    const username =
        document
        .getElementById("loginUsername")
        .value
        .trim();

    const password =
        document
        .getElementById("loginPassword")
        .value
        .trim();

    const message =
        document.getElementById("loginMessage");

    message.innerText = "";

    if (username === "") {
        showLoginMessage(
            "Please enter your username.",
            false
        );
        return;
    }

    if (password === "") {
        showLoginMessage(
            "Please enter your password.",
            false
        );
        return;
    }

    try {

        const response =
            await fetch("/login", {

                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })

            });

        const data =
            await response.json();

        if (data.success) {

            currentUser =
                data.username;

            showLoginMessage(
                "Login successful! Welcome " +
                currentUser + "!",
                true
            );

            setTimeout(
                openGameMenu,
                500
            );

        } else {

            showLoginMessage(
                data.message,
                false
            );
        }

    } catch (error) {

        showLoginMessage(
            "Server error. Please try again.",
            false
        );
    }
}


/* =========================
   SIGN UP
========================= */

async function signupUser() {

    const username =
        document
        .getElementById("signupUsername")
        .value
        .trim();

    const password =
        document
        .getElementById("signupPassword")
        .value
        .trim();

    const message =
        document.getElementById(
            "signupMessage"
        );

    message.innerText = "";

    if (username.length < 3) {

        showSignupMessage(
            "Username must contain at least 3 characters.",
            false
        );

        return;
    }

    if (password.length < 4) {

        showSignupMessage(
            "Password must contain at least 4 characters.",
            false
        );

        return;
    }

    try {

        const response =
            await fetch("/signup", {

                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })

            });

        const data =
            await response.json();

        if (data.success) {

            currentUser =
                data.username;

            showSignupMessage(
                "Account created successfully!",
                true
            );

            setTimeout(
                openGameMenu,
                600
            );

        } else {

            showSignupMessage(
                data.message,
                false
            );
        }

    } catch (error) {

        showSignupMessage(
            "Server error. Please try again.",
            false
        );
    }
}


function showLoginMessage(
    text,
    success
) {

    const message =
        document.getElementById(
            "loginMessage"
        );

    message.innerText = text;

    message.style.color =
        success
        ? "#16a34a"
        : "#dc2626";
}


function showSignupMessage(
    text,
    success
) {

    const message =
        document.getElementById(
            "signupMessage"
        );

    message.innerText = text;

    message.style.color =
        success
        ? "#ffffff"
        : "#ffd4d4";
}


/* =========================
   OPEN GAME MENU
========================= */

function openGameMenu() {

    document
    .getElementById("loginScreen")
    .classList.remove("active");

    document
    .getElementById("gameScreen")
    .classList.remove("active");

    document
    .getElementById("startScreen")
    .classList.add("active");

    document
    .getElementById("usernameDisplay")
    .innerText = currentUser;
}


/* =========================
   LOGOUT
========================= */

async function logoutUser() {

    await fetch("/logout", {
        method: "POST"
    });

    currentUser = "";

    document
    .getElementById("startScreen")
    .classList.remove("active");

    document
    .getElementById("gameScreen")
    .classList.remove("active");

    document
    .getElementById("loginScreen")
    .classList.add("active");
}


/* =========================
   SELECT SIZE
========================= */

function selectSize(size, button) {

    boardSize = size;

    document
    .querySelectorAll(".size-btn")
    .forEach(function(btn) {

        btn.classList.remove(
            "selected-option"
        );

    });

    button.classList.add(
        "selected-option"
    );
}


/* =========================
   SELECT LEVEL
========================= */

function selectLevel(level, button) {

    difficulty = level;

    document
    .querySelectorAll(".level-btn")
    .forEach(function(btn) {

        btn.classList.remove(
            "selected-option"
        );

    });

    button.classList.add(
        "selected-option"
    );
}


/* =========================
   START GAME
========================= */

function startGame() {

    document
    .getElementById("startScreen")
    .classList.remove("active");

    document
    .getElementById("gameScreen")
    .classList.add("active");

    updateGameInfo();

    generateGame();
}


function updateGameInfo() {

    document
    .getElementById("gameDetails")
    .innerText =

        boardSize +
        " × " +
        boardSize +
        " Symbol Sudoku • " +
        difficulty +
        " • Level " +
        levelNumber;
}


/* =========================
   SYMBOLS
========================= */

function getSymbols() {

    return allSymbols.slice(
        0,
        boardSize
    );
}


/* =========================
   CREATE SOLUTION
========================= */

function createSolution() {

    const symbols =
        getSymbols();

    const board = [];

    for (
        let row = 0;
        row < boardSize;
        row++
    ) {

        board[row] = [];

        for (
            let col = 0;
            col < boardSize;
            col++
        ) {

            board[row][col] =
                symbols[
                    (row + col) %
                    boardSize
                ];
        }
    }

    return board;
}


/* =========================
   GENERATE GAME
========================= */

function generateGame() {

    selectedCell = null;

    solutionBoard =
        createSolution();

    currentBoard =
        solutionBoard.map(
            row => [...row]
        );

    let removePercent;

    if (difficulty === "Easy") {

        removePercent = 0.35;

    } else if (
        difficulty === "Medium"
    ) {

        removePercent = 0.55;

    } else {

        removePercent = 0.70;
    }


    let positions = [];

    for (
        let i = 0;
        i < boardSize * boardSize;
        i++
    ) {

        positions.push(i);
    }

    shuffle(positions);

    const removeCount =
        Math.floor(
            positions.length *
            removePercent
        );

    for (
        let i = 0;
        i < removeCount;
        i++
    ) {

        const position =
            positions[i];

        const row =
            Math.floor(
                position / boardSize
            );

        const col =
            position % boardSize;

        currentBoard[row][col] = "";
    }

    drawBoard();

    drawSymbols();

    document
    .getElementById("resultMessage")
    .innerText = "";
}


/* =========================
   DRAW BOARD
========================= */

function drawBoard() {

    const board =
        document.getElementById(
            "sudokuBoard"
        );

    board.innerHTML = "";

    board.style.gridTemplateColumns =
        `repeat(${boardSize}, 1fr)`;

    for (
        let row = 0;
        row < boardSize;
        row++
    ) {

        for (
            let col = 0;
            col < boardSize;
            col++
        ) {

            const cell =
                document.createElement(
                    "div"
                );

            cell.className = "cell";

            cell.dataset.row = row;
            cell.dataset.col = col;

            if (
                currentBoard[row][col] !== ""
            ) {

                cell.innerText =
                    currentBoard[row][col];

                cell.classList.add(
                    "given"
                );

            } else {

                cell.onclick =
                    function() {
                        selectCell(cell);
                    };
            }

            board.appendChild(cell);
        }
    }
}


/* =========================
   SELECT CELL
========================= */

function selectCell(cell) {

    document
    .querySelectorAll(".cell")
    .forEach(function(item) {

        item.classList.remove(
            "selected"
        );

    });

    selectedCell = cell;

    selectedCell.classList.add(
        "selected"
    );
}


/* =========================
   DRAW SYMBOLS
========================= */

function drawSymbols() {

    const container =
        document.getElementById(
            "symbolOptions"
        );

    container.innerHTML = "";

    const symbols =
        getSymbols();

    symbols.forEach(
        function(symbol) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "symbol-btn";

            button.innerText =
                symbol;

            button.onclick =
                function() {

                    placeSymbol(symbol);

                };

            container.appendChild(button);
        }
    );
}


/* =========================
   PLACE SYMBOL
========================= */

function placeSymbol(symbol) {

    if (!selectedCell) {

        alert(
            "Please select an empty box first."
        );

        return;
    }

    selectedCell.innerText = symbol;

    const row =
        Number(
            selectedCell.dataset.row
        );

    const col =
        Number(
            selectedCell.dataset.col
        );

    currentBoard[row][col] =
        symbol;
}


/* =========================
   CHECK GAME
========================= */

function checkGame() {

    let correct = true;
    let incomplete = false;

    for (
        let row = 0;
        row < boardSize;
        row++
    ) {

        for (
            let col = 0;
            col < boardSize;
            col++
        ) {

            if (
                currentBoard[row][col] === ""
            ) {

                incomplete = true;

            }

            if (
                currentBoard[row][col] !==
                solutionBoard[row][col]
            ) {

                correct = false;
            }
        }
    }

    const result =
        document.getElementById(
            "resultMessage"
        );

    if (incomplete) {

        result.innerText =
            "⚠ Please complete all boxes.";

        result.style.color =
            "#d97706";

        return;
    }

    if (correct) {

        result.innerText =
            "🎉 Correct! Level Completed!";

        result.style.color =
            "#16a34a";

    } else {

        result.innerText =
            "❌ Wrong! Please try again.";

        result.style.color =
            "#dc2626";
    }
}


/* =========================
   RESET
========================= */

function resetGame() {

    generateGame();
}


/* =========================
   NEXT LEVEL
========================= */

function nextLevel() {

    levelNumber++;

    generateGame();

    updateGameInfo();
}


/* =========================
   BACK TO MENU
========================= */

function backToMenu() {

    document
    .getElementById("gameScreen")
    .classList.remove("active");

    document
    .getElementById("startScreen")
    .classList.add("active");
}


/* =========================
   DARK MODE
========================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );
}


/* =========================
   SHUFFLE
========================= */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];
    }
}


/* =========================
   CHECK LOGGED-IN USER
========================= */

async function checkLoggedInUser() {

    try {

        const response =
            await fetch("/user");

        const data =
            await response.json();

        if (data.logged_in) {

            currentUser =
                data.username;

            openGameMenu();
        }

    } catch (error) {

        console.log(
            "No active login."
        );
    }
}


window.addEventListener(
    "DOMContentLoaded",
    checkLoggedInUser
);
