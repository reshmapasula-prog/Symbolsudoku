from flask import Flask, render_template, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "symbol_sudoku_secret_key_2026"

users = {}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Please enter username and password"
        })

    if username in users:
        return jsonify({
            "success": False,
            "message": "Username already exists"
        })

    users[username] = generate_password_hash(password)

    session["username"] = username

    return jsonify({
        "success": True,
        "username": username
    })


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if username not in users:
        return jsonify({
            "success": False,
            "message": "User not found"
        })

    if not check_password_hash(users[username], password):
        return jsonify({
            "success": False,
            "message": "Incorrect password"
        })

    session["username"] = username

    return jsonify({
        "success": True,
        "username": username
    })


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)

    return jsonify({
        "success": True
    })


@app.route("/user")
def user():
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
