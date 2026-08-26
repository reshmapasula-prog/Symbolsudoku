let selectedSize = 3;
let selectedDifficulty = "easy";
let selectedPattern = "classic";

let selectedCell = null;
let selectedSymbol = null;

let solution = [];
let puzzle = [];


/* ==================================
   SYMBOL PATTERNS
================================== */

const patterns = {

    classic: [
        "★", "♥", "♦", "♣",
        "●", "▲", "■", "✿", "✦"
    ],

    nature: [
        "🌸", "🌻", "🌿", "🍀",
        "🌼", "🌷", "🍁", "🌵", "🌙"
    ],

    fruit: [
        "🍎", "🍊", "🍋", "🍇",
        "🍓", "🍉", "🍒", "🍍", "🥭"
    ],

    space: [
        "🚀", "🌙", "⭐", "🪐",
        "☄️", "🌍", "👽", "🛰️", "✨"
    ]

};


/* ==================================
   PAGE FUNCTIONS
================================== */

function showPage(pageId) {

    document.querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });

    document
        .getElementById(pageId)
        .classList.add("active");
}


function openSetup() {

    showPage("setupPage");

    updateSetupPreview();
}


function goHome() {

    showPage("startPage");
}


/* ==================================
   SIZE BUTTONS
================================== */

document.querySelectorAll(".size-btn")
    .forEach(button => {

        button.addEventListener("click", function () {

            document.querySelectorAll(".size-btn")
                .forEach(btn => {
                    btn.classList.remove("selected");
                });

            this.classList.add("selected");

            selectedSize = Number(
                this.dataset.size
            );

            updateSetupPreview();
        });

    });


/* ==================================
   DIFFICULTY BUTTONS
================================== */

document.querySelectorAll(".difficulty-btn")
    .forEach(button => {

        button.addEventListener("click", function () {

            document.querySelectorAll(".difficulty-btn")
                .forEach(btn => {
                    btn.classList.remove("selected");
                });

            this.classList.add("selected");

            selectedDifficulty =
                this.dataset.difficulty;

            updateSetupPreview();
        });

    });


/* ==================================
   PATTERN BUTTONS
================================== */

document.querySelectorAll(".pattern-btn")
    .forEach(button => {

        button.addEventListener("click", function () {

            document.querySelectorAll(".pattern-btn")
                .forEach(btn => {
                    btn.classList.remove("selected");
                });

            this.classList.add("selected");

            selectedPattern =
                this.dataset.pattern;

            updateSetupPreview();
        });

    });


/* ==================================
   UPDATE PREVIEW
================================== */

function updateSetupPreview() {

    const difficultyText =
        selectedDifficulty.charAt(0).toUpperCase()
        +
        selectedDifficulty.slice(1);

    const patternText =
        selectedPattern.charAt(0).toUpperCase()
        +
        selectedPattern.slice(1);

    document.getElementById("setupPreview")
        .textContent =
        `${selectedSize} × ${selectedSize} • ${difficultyText} • ${patternText} Symbols`;
}


/* ==================================
   START GAME
================================== */

function startGame() {

    selectedCell = null;
    selectedSymbol = null;

    generateGame();

    showPage("gamePage");
}


/* ==================================
   GENERATE GAME
================================== */

function generateGame() {

    const size = selectedSize;

    const symbols =
        patterns[selectedPattern]
            .slice(0, size);

    solution = generateSolution(
        size,
        symbols
    );

    puzzle = createPuzzle(
        solution,
        selectedDifficulty
    );

    renderGame(
        symbols
    );
}


/* ==================================
   GENERATE VALID SOLUTION
   LATIN SUDOKU STYLE
================================== */

function generateSolution(
    size,
    symbols
) {

    let result = [];

    for (let row = 0; row < size; row++) {

        let currentRow = [];

        for (
            let col = 0;
            col < size;
            col++
        ) {

            const index =
                (row + col) % size;

            currentRow.push(
                symbols[index]
            );
        }

        result.push(currentRow);
    }

    /* Shuffle rows */

    shuffle(result);


    /* Shuffle symbols in every board */

    const shuffledSymbols =
        [...symbols];

    shuffle(shuffledSymbols);

    for (
        let row = 0;
        row < size;
        row++
    ) {

        for (
            let col = 0;
            col < size;
            col++
        ) {

            const oldIndex =
                symbols.indexOf(
                    result[row][col]
                );

            result[row][col] =
                shuffledSymbols[oldIndex];
        }
    }


    /* Shuffle columns */

    const columnOrder =
        Array.from(
            { length: size },
            (_, index) => index
        );

    shuffle(columnOrder);

    result = result.map(row =>
        columnOrder.map(
            index => row[index]
        )
    );

    return result;
}


/* ==================================
   CREATE PUZZLE
================================== */

function createPuzzle(
    board,
    difficulty
) {

    const size = board.length;

    let puzzleBoard =
        board.map(row => [...row]);


    let removePercentage;

    if (difficulty === "easy") {

        removePercentage = 0.35;

    } else if (
        difficulty === "medium"
    ) {

        removePercentage = 0.55;

    } else {

        removePercentage = 0.70;
    }


    const totalCells =
        size * size;

    const removeCount =
        Math.floor(
            totalCells *
            removePercentage
        );


    let positions =
        Array.from(
            { length: totalCells },
            (_, index) => index
        );


    shuffle(positions);


    for (
        let i = 0;
        i < removeCount;
        i++
    ) {

        const position =
            positions[i];

        const row =
            Math.floor(
                position / size
            );

        const col =
            position % size;

        puzzleBoard[row][col] = "";
    }

    return puzzleBoard;
}


/* ==================================
   RENDER GAME
================================== */

function renderGame(symbols) {

    const board =
        document.getElementById(
            "sudokuBoard"
        );

    const symbolOptions =
        document.getElementById(
            "symbolOptions"
        );


    board.innerHTML = "";
    symbolOptions.innerHTML = "";


    board.style.gridTemplateColumns =
        `repeat(${selectedSize}, 1fr)`;

    board.style.gridTemplateRows =
        `repeat(${selectedSize}, 1fr)`;


    /* Game information */

    const difficultyText =
        selectedDifficulty.charAt(0).toUpperCase()
        +
        selectedDifficulty.slice(1);

    document.getElementById("gameInfo")
        .textContent =
        `${selectedSize} × ${selectedSize} • ${difficultyText}`;


    document.getElementById("patternDisplay")
        .textContent =
        symbols.join("  ");


    /* Create board cells */

    for (
        let row = 0;
        row < selectedSize;
        row++
    ) {

        for (
            let col = 0;
            col < selectedSize;
            col++
        ) {

            const cell =
                document.createElement("div");

            cell.className = "cell";


            cell.dataset.row = row;
            cell.dataset.col = col;


            const value =
                puzzle[row][col];


            cell.textContent =
                value;


            if (value !== "") {

                cell.classList.add(
                    "given"
                );

            } else {

                cell.addEventListener(
                    "click",
                    function () {

                        selectCell(
                            this
                        );
                    }
                );
            }


            addBoxBorders(
                cell,
                row,
                col
            );


            board.appendChild(
                cell
            );
        }
    }


    /* Create symbol buttons BELOW board */

    symbols.forEach(symbol => {

        const symbolButton =
            document.createElement(
                "button"
            );

        symbolButton.className =
            "symbol-choice";

        symbolButton.textContent =
            symbol;


        symbolButton.addEventListener(
            "click",
            function () {

                selectSymbol(
                    symbol,
                    this
                );
            }
        );


        symbolOptions.appendChild(
            symbolButton
        );
    });


    document.getElementById(
        "message"
    ).textContent = "";
}


/* ==================================
   ADD SUBGRID BOX BORDERS
================================== */

function addBoxBorders(
    cell,
    row,
    col
) {

    /*
      4×4 = 2×2 boxes
      6×6 = 2×3 boxes
      9×9 = 3×3 boxes
    */

    if (
        selectedSize === 4
    ) {

        if (
            (col + 1) % 2 === 0
            &&
            col !== selectedSize - 1
        ) {

            cell.classList.add(
                "box-right"
            );
        }

        if (
            (row + 1) % 2 === 0
            &&
            row !== selectedSize - 1
        ) {

            cell.classList.add(
                "box-bottom"
            );
        }
    }


    if (
        selectedSize === 6
    ) {

        if (
            (col + 1) % 3 === 0
            &&
            col !== selectedSize - 1
        ) {

            cell.classList.add(
                "box-right"
            );
        }

        if (
            (row + 1) % 2 === 0
            &&
            row !== selectedSize - 1
        ) {

            cell.classList.add(
                "box-bottom"
            );
        }
    }


    if (
        selectedSize === 9
    ) {

        if (
            (col + 1) % 3 === 0
            &&
            col !== selectedSize - 1
        ) {

            cell.classList.add(
                "box-right"
            );
        }

        if (
            (row + 1) % 3 === 0
            &&
            row !== selectedSize - 1
        ) {

            cell.classList.add(
                "box-bottom"
            );
        }
    }
}


/* ==================================
   SELECT CELL
================================== */

function selectCell(cell) {

    document.querySelectorAll(".cell")
        .forEach(item => {

            item.classList.remove(
                "selected-cell"
            );
        });


    selectedCell = cell;

    cell.classList.add(
        "selected-cell"
    );


    if (selectedSymbol !== null) {

        placeSymbol();
    }
}


/* ==================================
   SELECT SYMBOL
================================== */

function selectSymbol(
    symbol,
    button
) {

    selectedSymbol = symbol;


    document
        .querySelectorAll(
            ".symbol-choice"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );
        });


    button.classList.add(
        "active"
    );


    if (selectedCell !== null) {

        placeSymbol();
    }
}


/* ==================================
   PLACE SYMBOL
================================== */

function placeSymbol() {

    if (
        selectedCell === null
        ||
        selectedSymbol === null
    ) {
        return;
    }


    selectedCell.textContent =
        selectedSymbol;


    checkGame();
}


/* ==================================
   CHECK GAME
================================== */

function checkGame() {

    const cells =
        document.querySelectorAll(
            ".cell"
        );


    let complete = true;
    let correct = true;


    cells.forEach(cell => {

        const row =
            Number(
                cell.dataset.row
            );

        const col =
            Number(
                cell.dataset.col
            );


        if (
            cell.textContent === ""
        ) {

            complete = false;

        } else if (
            cell.textContent !==
            solution[row][col]
        ) {

            correct = false;
        }
    });


    const message =
        document.getElementById(
            "message"
        );


    if (
        complete &&
        correct
    ) {

        message.textContent =
            "🎉 Congratulations! You solved the Symbol Sudoku!";
    }
}


/* ==================================
   RESET GAME
================================== */

function resetGame() {

    selectedCell = null;
    selectedSymbol = null;

    const symbols =
        patterns[selectedPattern]
            .slice(0, selectedSize);

    renderGame(symbols);
}


/* ==================================
   NEW GAME
================================== */

function newGame() {

    selectedCell = null;
    selectedSymbol = null;

    generateGame();
}


/* ==================================
   DARK / BRIGHT MODE
================================== */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );
}


/* ==================================
   SHUFFLE
================================== */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random()
                *
                (i + 1)
            );


        [
            array[i],
            array[randomIndex]
        ] =
        [
            array[randomIndex],
            array[i]
        ];
    }

    return array;
}
