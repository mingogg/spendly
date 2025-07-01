import psycopg2
from psycopg2 import errors
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
import uuid

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:5173",
    "https://mingogg.github.io"  # o tu URL final del frontend
])

def get_db_connection():
    import os
    import urllib.parse as up

    up.uses_netloc.append("postgres")
    url = up.urlparse(os.environ["DATABASE_URL"])

    conn = psycopg2.connect(
        database=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
    )
    return conn


def get_user_id_from_token():
    auth_header = request.headers.get("Authorization", "")
    parts = auth_header.split()

    if len(parts) != 2 or parts[0] != "Bearer":
        return None, jsonify({"error": "Token no válido"}), 401

    token = parts[1]

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM sessions WHERE token = %s", (token,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    if not result:
        return None, jsonify({"error": "Token inválido o expirado"}), 401

    return result[0], None, None 


@app.route('/')
def index():
    return "¡Welcome to the API of SPENDLY!"

@app.route('/api/test_db')
def test_db():
    try:
        conn = get_db_connection()
        conn.close()
        return "Connction to the DB successful."
    except Exception as e:
        return f"Error: {e}"

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Faltan datos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, password_hash FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 401

    user_id, password_hash = user

    if not check_password_hash(password_hash, password):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    token = str(uuid.uuid4())

    cursor.execute('INSERT INTO sessions (token, user_id) VALUES (%s, %s)', (token, user_id))
    conn.commit()
    conn.close()

    return jsonify({"token": token, "username":username})

@app.route('/api/register', methods=['POST'])
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Faltan datos"}), 400

    hashed = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)',
            (username, email, hashed)
        )
        conn.commit()

        cursor.execute('SELECT id FROM users WHERE username = %s', (username,))
        user_id = cursor.fetchone()[0]

        token = str(uuid.uuid4())
        cursor.execute('INSERT INTO sessions (token, user_id) VALUES (%s, %s)', (token, user_id))
        conn.commit()

    except errors.UniqueViolation:
        conn.rollback()
        return jsonify({"error": "Usuario o correo ya existe"}), 409

    finally:
        cursor.close()
        conn.close()

    return jsonify({"token": token, "username": username}), 201


@app.route('/api/expenses', methods = ['GET'])
def get_expenses():
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, description, amount, date, entryType FROM expenses WHERE user_id = %s", (user_id,))
    rows = cursor.fetchall()

    expenses = []
    for row in rows: 
        expenses.append({
            'id': row[0],
            'description': row[1],
            'amount': row[2],
            'date': row[3].strftime('%d-%m-%Y'),
            'entryType': row[4]
        })

    cursor.close()
    conn.close()
    return jsonify(expenses)

@app.route('/api/expenses', methods = ['POST'])
def add_expense():
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status

    data = request.get_json()
    description = data.get("description")
    amount = data.get("amount")
    date = data.get("date")
    entryType = data.get("entrytype")


    if not description or not amount or not date:
        return {"error": "All fields are mandatory."}, 400

    if not isinstance(amount, (int)) or amount <= 0:
        return {"error": "The amount must be a positive number above 0."}, 400


    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
    "INSERT INTO expenses (user_id, description, amount, date, entryType) VALUES (%s, %s, %s, %s, %s)",
    (user_id, description, amount, date, entryType)
)

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Expense added successfully."}, 201

@app.route('/api/expenses/<int:id>', methods = ['PUT'])
def update_expense(id):
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status
    
    
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

    cursor.execute("SELECT id FROM expenses WHERE id = %s AND user_id = %s", (id, user_id))
    if not cursor.fetchone():
        return jsonify({"error": "Expense not found or not authorized"}), 403

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

@app.route('/api/expenses/<int:id>', methods = ['DELETE'])
def delete_expense(id):
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM expenses WHERE id = %s AND user_id = %s", (id, user_id))
    if not cursor.fetchone():
        return jsonify({"error": "Expense not found or not authorized"}), 403

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


@app.route('/api/expenses/<int:id>', methods = ['GET'])
def get_expense(id):
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status
    

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM expenses WHERE id = %s AND user_id = %s", (id, user_id))
    expense = cursor.fetchone()

    if expense is None:
        cursor.close()
        conn.close()
        return jsonify({"error": f"No expense found for ID {id} or not authorized"}), 404

    
    expense_data = {
        "id": expense[0],
        "description": expense[2],
        "amount": expense[3],
        "date": expense[4].strftime('%Y-%m-%d'),
        "entryType": expense[5]
    }

    cursor.close()
    conn.close()
    return {'expense':expense_data}, 200

@app.route('/api/categories', methods = ['GET'])
def get_categories():
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status
    
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT category FROM categories WHERE user_id = %s', (user_id,))
    rows = cursor.fetchall()

    categories = []
    
    for row in rows:
        categories.append(row[0])

    cursor.close()
    conn.close()
    return jsonify(categories)

@app.route('/api/categories', methods=['POST'])
def add_category():
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status
    
    data = request.get_json()
    category = data.get('category')

    if not category:
        return jsonify({'error': 'Missing category name'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO categories (category, user_id) VALUES (%s, %s)',
            (category, user_id)
        )
        conn.commit()
        return jsonify({'message': 'Category added'}), 201

    except errors.UniqueViolation:
        conn.rollback()
        return jsonify({'error': 'Ya existe esa categoría'}), 409

    finally:
        cursor.close()
        conn.close()

@app.route('/api/categories/<category>', methods=['DELETE'])
def delete_category(category):
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM categories WHERE category = %s AND user_id = %s', (category, user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Category deleted'})

@app.route('/api/categories/<old_name>', methods=['PUT'])
def update_category(old_name):
    user_id, error_response, status = get_user_id_from_token()
    if error_response:
        return error_response, status
    
    data = request.get_json()
    new_name = data.get('new_name')

    if not new_name:
        return jsonify({'error': 'Missing new name'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('UPDATE categories SET category = %s WHERE category = %s AND user_id = %s', (new_name, old_name, user_id))
    if cursor.rowcount == 0:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'error': 'Category not found or not authorized'}), 404
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Category updated'})


@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({'error': 'Invalid request'}), 400

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal service error'}), 500
