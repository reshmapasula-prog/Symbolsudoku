from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

SYMBOLS = ["★", "♦", "♠", "♥", "♣", "▲", "●", "■", "♪"]

BASE = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8]
]

REMOVE = {
    "easy": 36,
    "medium": 48,
    "hard": 58
}


def shuffled_solution():
    rows = [
        g * 3 + r
        for g in random.sample(range(3), 3)
        for r in random.sample(range(3), 3)
    ]

    cols = [
        g * 3 + c
        for g in random.sample(range(3), 3)
        for c in random.sample(range(3), 3)
    ]

    nums = random.sample(range(1, 10), 9)

    return [
        [nums[BASE[r][c] - 1] for c in cols]
        for r in rows
    ]


def new_game(level):
    solution = shuffled_solution()
    puzzle = [row[:] for row in solution]

    cells = [
        (r, c)
        for r in range(9)
        for c in range(9)
    ]

    random.shuffle(cells)

    for r, c in cells[:REMOVE.get(level, 48)]:
        puzzle[r][c] = 0

    return puzzle, solution


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/new", methods=["POST"])
def api_new():
    data = request.get_json() or {}
    level = data.get("level", "medium")

    puzzle, solution = new_game(level)

    return jsonify({
        "puzzle": puzzle,
        "solution": solution
    })


@app.route("/api/check", methods=["POST"])
def api_check():
    data = request.get_json()

    board = data["board"]
    solution = data["solution"]

    errors = []
    complete = True

    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                complete = False
            elif board[r][c] != solution[r][c]:
                errors.append([r, c])

    return jsonify({
        "correct": len(errors) == 0 and complete,
        "errors": errors,
        "complete": complete
    })


@app.route("/api/hint", methods=["POST"])
def api_hint():
    data = request.get_json()

    board = data["board"]
    solution = data["solution"]

    empty = [
        (r, c)
        for r in range(9)
        for c in range(9)
        if board[r][c] == 0
    ]

    if not empty:
        return jsonify({
            "done": True
        })

    r, c = random.choice(empty)

    return jsonify({
        "row": r,
        "col": c,
        "value": solution[r][c],
        "done": False
    })


if __name__ == "__main__":
    app.run(debug=True)