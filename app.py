from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = "symbol_sudoku_secret_key"

users = {}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if len(username) < 3:
        return jsonify({
            "success": False,
            "message": "Username must contain at least 3 characters."
        })

    if len(password) < 4:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 4 characters."
        })

    if username in users:
        return jsonify({
            "success": False,
            "message": "Username already exists. Please sign in."
        })

    users[username] = password

    session["username"] = username

    return jsonify({
        "success": True,
        "username": username,
        "message": "Account created successfully!"
    })


@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if username not in users:
        return jsonify({
            "success": False,
            "message": "Account not found. Please create an account."
        })

    if users[username] != password:
        return jsonify({
            "success": False,
            "message": "Incorrect password."
        })

    session["username"] = username

    return jsonify({
        "success": True,
        "username": username,
        "message": "Login successful!"
    })


@app.route("/logout", methods=["POST"])
def logout():

    session.pop("username", None)

    return jsonify({
        "success": True
    })


@app.route("/user")
def get_user():

    username = session.get("username")

    if username:
        return jsonify({
            "logged_in": True,
            "username": username
        })

    return jsonify({
        "logged_in": False
    })


if __name__ == "__main__":
    app.run(debug=True)
