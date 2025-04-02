import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS # Indica que tiene permitido ingresar solamente la API indicada
app = Flask(__name__)
CORS(app, origins = "http://localhost:5173")

# Esta función se encarga de establecer y devolver una conexión a la base de datos
# Se establecen los parámetros de la función [psycopg2.connect()], aquí es donde se CREA la conexión a la base de datos con la librería, los parámetros son necesarios para que la librería sepa dónde está la base de datos
# [host: localhost] -> Indica que la base de datos está en tu máquina local
# [database: spendtracker] -> Nombre de la base de datos
# [user: admin; password: admin] -> Nombre de usuario y contraseña que se usaron al crear el contenedor de docker
def get_db_connection():
    conn = psycopg2.connect(
        host = "localhost",
        database = "spendtracker",
        user = "admin",
        password = "admin"
    )
    return conn # Se devuelve el objeto conn, que se puede usar más adelante para ejecutar consultas SQL

@app.route('/')
def index():
    return "¡Bienvenido a la API de SpendTracker!"

# @app.route('/test_db') -> Este endpoint responde cuando visitas la ruta http://localhost:5000/test_db en el navegador
# conn = get_db_connection() -> Se obtiene la conexión a la base de datos
# conn.close() -> Se cierra la conexión a la base de datos
# return "Conexión a la base de datos establecida correctamente" -> Se devuelve un mensaje de éxito
# except Exception as e: -> Se maneja cualquier error que pueda ocurrir al intentar establecer la conexión a la base de datos

# Health check de bd
@app.route('/test_db')
def test_db():
    try:
        conn = get_db_connection()
        conn.close()
        return "Conexión a la base de datos establecida correctamente"
    except Exception as e:
        return f"Error: {e}"

# Esta función se encarga de obtener todos los gastos de la base de datos
# @app.route('/expenses', methods = ['GET']) -> Este endpoint responde cuando visitas la ruta http://localhost:5000/expenses en el navegador, y se indica que se puede obtener información de la base de datos vía el método GET
# conn = get_db_connection() -> Se obtiene la conexión a la base de datos
# cursor = conn.cursor() -> Se obtiene el cursor, que es un objeto especial, que permite ejecutar consultas SQL
# cursor.execute('SELECT * FROM expenses') -> Se ejecuta la consulta SQL para obtener todos los gastos
# expenses = cursor.fetchall() -> Se obtiene todos los gastos de la consulta en forma de lista de tuplas. Ejemplo: [(1, '2024-01-01', 'Comida', 100.00), (2, '2024-01-02', 'Transporte', 50.00)]
# cursor.close(); conn.close() -> Se cierra el cursor y la conexión a la base de datos. Siempre cerramos primero el cursor y luego la conexión, así se evita que el cursor quede abierto y la conexión se quede abierta, lo que podría causar errores o fugas de memoria
# return jsonify(expenses) -> Se devuelve los gastos en formato JSON
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

# Esta función se encarga de agregar un gasto a la base de datos
# @app.route('/expenses', methods = ['POST']) -> Este endpoint responde cuando visitas la ruta http://localhost:5000/expenses en el navegador, y se indica que se puede agregar información a la base de datos vía el método POST
# data = request.get_json() -> Se obtiene el JSON enviado previamente vía solicitud POST (por postman o el frontend)
# description = data.get("description") -> Se guarda el valor del campo "description" extraído del JSON en la variable description
# amount = data.get("amount") -> Se guarda el valor del campo "amount" extraído del JSON en la variable amount
# date = data.get("date") -> Se guarda el valor del campo "date" extraído del JSON en la variable date
# if not description or not amount or not date: -> Se verifica si alguno de los campos es nulo o vacío
# return {"error": "Todos los campos son requeridos"}, 400 -> Se devuelve un mensaje de error y un código de estado 400 (Bad Request)
# cursor.execute("INSERT INTO expenses (description, amount, date) VALUES (%s, %s, %s)", (description, amount, date)) -> Se ejecuta la consulta SQL para agregar un gasto a la base de datos, en base a los parámetros que se le pasan que se extrajeron del JSON previamente
# conn.commit() -> Se confirma la transacción, es decir, se guarda el gasto en la base de datos
# return {"message": "Gasto agregado correctamente"}, 201 -> Se devuelve un mensaje de éxito y un código de estado 201 (Created)

# Para los mensajes de error o éxito, enviamos un diccionario python que luego flask lo convierte a JSON, ya que es un formato universal para intercambiar información entre aplicaciones
@app.route('/expenses', methods = ['POST'])
def add_expense():
    data = request.get_json()
    description = data.get("description")
    amount = data.get("amount")
    date = data.get("date")

    if not description or not amount or not date:
        return {"error": "Todos los campos son requeridos"}, 400

    # Se verifica que el monto sea un número entero positivo
    if not isinstance(amount, (int)) or amount <= 0:
        return {"error": "El monto debe ser un número entero positivo"}, 400

    # Se verifica que la fecha sea una cadena de texto en formato YYYY-MM-DD
    try:
        from datetime import datetime
        datetime.strptime(date, '%Y-%m-%d') # Se intenta convertir la fecha a un objeto datetime, si falla, se lanza un error
    except ValueError:
        return {"error": "La fecha debe estar en formato YYYY-MM-DD"}, 400


    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO expenses (description, amount, date) VALUES (%s, %s, %s)",
        (description, amount, date)
    )

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Gasto agregado correctamente"}, 201


# Esta función se encarga de actualizar un gasto de la base de datos
# @app.route('/expenses/<int:id>', methods = ['PUT']) -> Este endpoint responde cuando visitas la ruta http://localhost:5000/expenses/1 en el navegador, y se indica que se puede actualizar información a la base de datos vía el método PUT, pasando en el parámetro <int:id> el ID del gasto que se quiere actualizar
# data = request.get_json() -> Se obtiene el JSON enviado previamente vía solicitud PUT (por postman o el frontend)
# description = data.get("description") -> Se guarda el valor del campo "description" extraído del JSON en la variable description
# amount = data.get("amount") -> Se guarda el valor del campo "amount" extraído del JSON en la variable amount
# date = data.get("date") -> Se guarda el valor del campo "date" extraído del JSON en la variable date
# if cursor.rowcount == 0: -> Se verifica si el gasto no se encontró
# return {"error": f"No se encontró el gasto con el ID: {id}"}, 404 -> Se devuelve un mensaje de error y un código de estado 404 (Not Found)
@app.route('/expenses/<int:id>', methods = ['PUT'])
def update_expense(id):
    data = request.get_json()
    description = data.get("description")
    amount = data.get("amount")
    date = data.get("date")

    if not description or not amount or not date:
        return {"error": "Todos los campos son requeridos"}, 400

    # Se verifica que el monto sea un número entero positivo
    if not isinstance(amount, (int)) or amount <= 0:
        return {"error": "El monto debe ser un número entero positivo"}, 400

    # Se verifica que la fecha sea una cadena de texto en formato YYYY-MM-DD
    try:
        from datetime import datetime
        datetime.strptime(date, '%Y-%m-%d')
    except ValueError:
        return {"error": "La fecha debe estar en formato YYYY-MM-DD"}, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE expenses SET description = %s, amount = %s, date = %s WHERE id = %s",
        (description, amount, date, id)
    )

    # VERIFICAR EL GETBY ID
    if cursor.rowcount == 0:
        conn.rollback()
        cursor.close()
        conn.close()
        return {"error": f"No se encontró el gasto con el ID: {id}"}, 404

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Gasto actualizado correctamente"}, 200

# Esta función se encarga de eliminar un gasto de la base de datos
# @app.route('/expenses/<int:id>', methods = ['DELETE']) -> Este endpoint responde cuando visitas la ruta http://localhost:5000/expenses/1 en el navegador, y se indica que se puede eliminar información a la base de datos vía el método DELETE, pasando en el parámetro <int:id> el ID del gasto que se quiere eliminar
# cursor.execute("DELETE FROM expenses WHERE id = %s", (id,)) -> Se ejecuta la consulta SQL para eliminar un gasto de la base de datos, en base al ID que se le pasa.
@app.route('/expenses/<int:id>', methods = ['DELETE'])
def delete_expense(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM expenses WHERE id = %s", (id,)) # La coma en (id,) es para crear una tupla con un único elemento, que es el ID del gasto que se quiere eliminar, ya que psycopg2 espera un objeto iterable para los parámetros de la consulta (tupla, lista, etc.)

    if cursor.rowcount == 0:
        conn.rollback()
        cursor.close()
        conn.close()
        return {"error": f"No se encontró el gasto con el ID: {id}"}, 404

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Gasto eliminado correctamente"}, 200


# Esta función se encarga de obtener un gasto de la base de datos en base al ID que se le pasa
# expense = cursor.fetchone() -> Devuelve la primera fila de la consulta en forma de tupla. Ejemplo: (1, '2024-01-01', 'Comida', 100.00), si no hay filas, devuelve None
# if expense is None: -> Se verifica si el gasto no se encontró y devuelve un mensaje de error y un código de estado 404 (Not Found)
# expense_data = {...} -> Se crea un diccionario con los datos del gasto
@app.route('/expenses/<int:id>', methods = ['GET'])
def get_expense(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM expenses WHERE id = %s", (id,))
    expense = cursor.fetchone()

    if expense is None:
        cursor.close()
        conn.close()
        return {"error": f"No se encontró el gasto con el ID: {id}"}, 404
    
    expense_data = {
        "id": expense[0],
        "description": expense[1],
        "amount": expense[2],
        "date": expense[3]
    }


    cursor.close()
    conn.close()
    return {'expense':expense_data}, 200

# MIDDLEWARE
# Manejo de errores
# Se ejecutan automáticamente cuando ocurre un error 404, 400 o 500. Son generales y globales, independeintes a los manejos de errores que se hayan hecho en las funciones de la aplicación (endpoints)
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Recurso no encontrado'}), 404

@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({'error': 'Solicitud inválida'}), 400

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

