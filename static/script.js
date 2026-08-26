function showLogin() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("signupForm").classList.add("hidden");

    document.getElementById("loginTab").classList.add("active-tab");
    document.getElementById("signupTab").classList.remove("active-tab");

    document.getElementById("authMessage").innerText = "";
}


function showSignup() {
    document.getElementById("signupForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");

    document.getElementById("signupTab").classList.add("active-tab");
    document.getElementById("loginTab").classList.remove("active-tab");

    document.getElementById("authMessage").innerText = "";
}


function showAuthMessage(message, success) {
    const box = document.getElementById("authMessage");

    if (!box) return;

    box.innerText = message;
    box.style.color = success ? "#16a34a" : "#dc2626";
}


function signupUser() {

    const username =
        document.getElementById("signupUsername").value.trim();

    const password =
        document.getElementById("signupPassword").value.trim();

    if (username === "" || password === "") {
        showAuthMessage(
            "Please enter username and password",
            false
        );
        return;
    }

    let users =
        JSON.parse(localStorage.getItem("symbolSudokuUsers")) || [];

    const existingUser =
        users.find(user => user.username === username);

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
    }, 500);
}


function loginUser() {

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    if (username === "" || password === "") {
        showAuthMessage(
            "Please enter username and password",
            false
        );
        return;
    }

    let users =
        JSON.parse(localStorage.getItem("symbolSudokuUsers")) || [];

    const user =
        users.find(
            user =>
                user.username === username &&
                user.password === password
        );

    if (!user) {
        showAuthMessage(
            "Incorrect username or password",
            false
        );
        return;
    }

    localStorage.setItem(
        "symbolSudokuCurrentUser",
        username
    );

    openGameMenu(username);
}


function openGameMenu(username) {

    const loginScreen =
        document.getElementById("loginScreen");

    const startScreen =
        document.getElementById("startScreen");

    const gameScreen =
        document.getElementById("gameScreen");

    if (loginScreen) {
        loginScreen.classList.remove("active");
    }

    if (gameScreen) {
        gameScreen.classList.remove("active");
    }

    if (startScreen) {
        startScreen.classList.add("active");
    }

    const usernameDisplay =
        document.getElementById("usernameDisplay");

    if (usernameDisplay) {
        usernameDisplay.innerText = username;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function logoutUser() {

    localStorage.removeItem(
        "symbolSudokuCurrentUser"
    );

    const loginScreen =
        document.getElementById("loginScreen");

    const startScreen =
        document.getElementById("startScreen");

    const gameScreen =
        document.getElementById("gameScreen");

    if (startScreen) {
        startScreen.classList.remove("active");
    }

    if (gameScreen) {
        gameScreen.classList.remove("active");
    }

    if (loginScreen) {
        loginScreen.classList.add("active");
    }

    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
}


function checkLoggedInUser() {

    const username =
        localStorage.getItem(
            "symbolSudokuCurrentUser"
        );

    if (username) {
        openGameMenu(username);
    }
}


window.addEventListener(
    "DOMContentLoaded",
    function () {

        checkLoggedInUser();

    }
);
