import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, origins = "http://localhost:5173")

def get_db_connection():
    conn = psycopg2.connect(
        host = "localhost",
        database = "spendtracker",
        user = "admin",
        password = "admin"
    )
    return conn 

@app.route('/')
def index():
    return "¡Welcome to the API of SPENDLY!"

@app.route('/test_db')
def test_db():
    try:
        conn = get_db_connection()
        conn.close()
        return "Connction to the DB successful."
    except Exception as e:
        return f"Error: {e}"

@app.route('/expenses', methods = ['GET'])
def get_expenses():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM expenses')
    rows = cursor.fetchall()

    expenses = []
    for row in rows: 
        expenses.append({
            'id': row[0],
            'description': row[1],
            'amount': row[2],
            'date': row[3].strftime('%d-%m-%Y')
        })

    cursor.close()
    conn.close()
    return jsonify(expenses)

@app.route('/expenses', methods = ['POST'])
def add_expense():
    data = request.get_json()
    description = data.get("description")
    amount = data.get("amount")
    date = data.get("date")

    if not description or not amount or not date:
        return {"error": "All fields are mandatory."}, 400

    if not isinstance(amount, (int)) or amount <= 0:
        return {"error": "The amount must be a positive number above 0."}, 400

    if not date:
        date = datetime.today().strftime('%Y-%m-%d')
    else:
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return {"error": "Date must be in format YYYY-MM-DD"}, 400


    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO expenses (description, amount, date) VALUES (%s, %s, %s)",
        (description, amount, date)
    )

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Expense added successfully."}, 201

@app.route('/expenses/<int:id>', methods = ['PUT'])
def update_expense(id):
    data = request.get_json()
    description = data.get("description")
    amount = data.get("amount")
    date = data.get("date")

    if not description or not amount or not date:
        return {"error": "All fields are mandatory."}, 400

    if not isinstance(amount, (int)) or amount <= 0:
        return {"error": "The amount must be a positive number above 0."}, 400

    if not date:
        date = datetime.today().strftime('%Y-%m-%d')
    else:
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return {"error": "Date must be in format YYYY-MM-DD"}, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE expenses SET description = %s, amount = %s, date = %s WHERE id = %s",
        (description, amount, date, id)
    )

    if cursor.rowcount == 0:
        conn.rollback()
        cursor.close()
        conn.close()
        return {"error": f"There's no match for the ID: {id}"}, 404

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Expense modified successfully."}, 200

@app.route('/expenses/<int:id>', methods = ['DELETE'])
def delete_expense(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM expenses WHERE id = %s", (id,))
    if cursor.rowcount == 0:
        conn.rollback()
        cursor.close()
        conn.close()
        return {"error": f"There's no match for the ID: {id}"}, 404
    
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Expense deleted successfully."}, 200


@app.route('/expenses/<int:id>', methods = ['GET'])
def get_expense(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM expenses WHERE id = %s", (id,))
    expense = cursor.fetchone()

    if expense is None:
        cursor.close()
        conn.close()
        return {"error": f"There's no match for the ID: {id}"}, 404
    
    expense_data = {
        "id": expense[0],
        "description": expense[1],
        "amount": expense[2],
        "date": expense[3]
    }

    cursor.close()
    conn.close()
    return {'expense':expense_data}, 200


@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({'error': 'Invalid request'}), 400

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal service error.'}), 500

