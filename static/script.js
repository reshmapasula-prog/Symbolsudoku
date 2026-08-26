let currentUser = null;

/* ================================
   CREATE ACCOUNT
================================ */

function signupUser() {
    const username = document
        .getElementById("signupUsername")
        .value
        .trim();

    const password = document
        .getElementById("signupPassword")
        .value
        .trim();

    if (username.length < 3) {
        showAuthMessage(
            "Username must contain at least 3 characters.",
            false
        );
        return;
    }

    if (password.length < 4) {
        showAuthMessage(
            "Password must contain at least 4 characters.",
            false
        );
        return;
    }

    const users =
        JSON.parse(localStorage.getItem("symbolSudokuUsers")) || [];

    const existingUser = users.find(
        user => user.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
        showAuthMessage(
            "Username already exists. Please sign in.",
            false
        );
        return;
    }

    users.push({
        username: username,
        password: password
    });

    localStorage.setItem(
        "symbolSudokuUsers",
        JSON.stringify(users)
    );

    currentUser = username;

    localStorage.setItem(
        "symbolSudokuCurrentUser",
        username
    );

    showAuthMessage(
        "Account created successfully!",
        true
    );

    setTimeout(() => {
        openGameMenu(username);
    }, 700);
}


/* ================================
   SIGN IN
================================ */

function loginUser() {
    const username = document
        .getElementById("loginUsername")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value
        .trim();

    const users =
        JSON.parse(localStorage.getItem("symbolSudokuUsers")) || [];

    const user = users.find(
        item =>
            item.username.toLowerCase() === username.toLowerCase() &&
            item.password === password
    );

    if (!user) {
        showAuthMessage(
            "Invalid username or password.",
            false
        );
        return;
    }

    currentUser = user.username;

    localStorage.setItem(
        "symbolSudokuCurrentUser",
        user.username
    );

    openGameMenu(user.username);
}


/* ================================
   OPEN GAME MENU
================================ */

function openGameMenu(username) {

    document
        .getElementById("loginScreen")
        .classList
        .remove("active");

    document
        .getElementById("startScreen")
        .classList
        .add("active");

    document
        .getElementById("gameScreen")
        .classList
        .remove("active");

    const usernameDisplay =
        document.getElementById("usernameDisplay");

    if (usernameDisplay) {
        usernameDisplay.innerText = username;
    }

    currentUser = username;
}


/* ================================
   LOGOUT
================================ */

function logoutUser() {

    localStorage.removeItem(
        "symbolSudokuCurrentUser"
    );

    currentUser = null;

    document
        .getElementById("startScreen")
        .classList
        .remove("active");

    document
        .getElementById("gameScreen")
        .classList
        .remove("active");

    document
        .getElementById("loginScreen")
        .classList
        .add("active");

    document
        .getElementById("loginUsername")
        .value = "";

    document
        .getElementById("loginPassword")
        .value = "";

    document
        .getElementById("signupUsername")
        .value = "";

    document
        .getElementById("signupPassword")
        .value = "";
}


/* ================================
   AUTH MESSAGE
================================ */

function showAuthMessage(message, success) {

    const messageBox =
        document.getElementById("authMessage");

    messageBox.innerText = message;

    if (success) {
        messageBox.style.color = "#16a34a";
    } else {
        messageBox.style.color = "#dc2626";
    }
}


/* ================================
   ENTER GAME
================================ */

function enterGame() {

    document
        .getElementById("startScreen")
        .classList
        .remove("active");

    document
        .getElementById("gameScreen")
        .classList
        .add("active");
}


/* ================================
   AUTO LOGIN
================================ */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const savedUser =
            localStorage.getItem(
                "symbolSudokuCurrentUser"
            );

        if (savedUser) {
            openGameMenu(savedUser);
        }

    }
);
