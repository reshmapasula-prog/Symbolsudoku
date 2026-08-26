from flask import Flask, render_template, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = "symbol_sudoku_secret_2026"


def get_db():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


create_table()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"success": False, "message": "Enter username and password"})

    if len(password) < 4:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 4 characters"
        })

    conn = get_db()

    try:
        conn.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, generate_password_hash(password))
        )

        conn.commit()

        user = conn.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        ).fetchone()

        session["user_id"] = user["id"]
        session["username"] = user["username"]

        conn.close()

        return jsonify({
            "success": True,
            "username": username
        })

    except sqlite3.IntegrityError:
        conn.close()

        return jsonify({
            "success": False,
            "message": "Username already exists"
        })


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE username = ?",
        (username,)
    ).fetchone()

    conn.close()

    if user and check_password_hash(user["password"], password):

        session["user_id"] = user["id"]
        session["username"] = user["username"]

        return jsonify({
            "success": True,
            "username": username
        })

    return jsonify({
        "success": False,
        "message": "Invalid username or password"
    })


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({"success": True})


@app.route("/user")
def user():
    if "username" in session:
        return jsonify({
            "logged_in": True,
            "username": session["username"]
        })

    return jsonify({
        "logged_in": False
    })


if __name__ == "__main__":
    app.run(debug=True)
