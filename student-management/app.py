from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector

app = Flask(__name__, static_folder='static')
CORS(app)

# MySQL Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root@1432",
    database="student_management"
)

cursor = db.cursor(dictionary=True)

# Home Page
@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

# Get All Students
@app.route('/api/student', methods=['GET'])
def get_student():

    cursor.execute("SELECT * FROM student")

    data = cursor.fetchall()

    return jsonify(data)

# Add Student
@app.route('/api/student', methods=['POST'])
def add_student():

    data = request.json

    sql = """
    INSERT INTO student(full_name,email,phone,course)
    VALUES(%s,%s,%s,%s)
    """

    values = (
        data['full_name'],
        data['email'],
        data['phone'],
        data['course']
    )

    cursor.execute(sql, values)

    db.commit()

    return jsonify({"message":"Student Added"})

# Update Student
@app.route('/api/student/<int:id>', methods=['PUT'])
def update_student(id):

    data = request.json

    sql = """
    UPDATE student
    SET full_name=%s,email=%s,phone=%s,course=%s
    WHERE id=%s
    """

    values = (
        data['full_name'],
        data['email'],
        data['phone'],
        data['course'],
        id
    )

    cursor.execute(sql, values)

    db.commit()

    return jsonify({"message":"Student Updated"})

# Delete Student
@app.route('/api/student/<int:id>', methods=['DELETE'])
def delete_student(id):

    cursor.execute(
        "DELETE FROM student WHERE id=%s",
        (id,)
    )

    db.commit()

    return jsonify({"message":"Student Deleted"})

# Search Student
@app.route('/api/student/search')
def search_student():

    q = request.args.get('q')

    sql = """
    SELECT * FROM student
    WHERE full_name LIKE %s
    OR course LIKE %s
    """

    values = (
        '%' + q + '%',
        '%' + q + '%'
    )

    cursor.execute(sql, values)

    data = cursor.fetchall()

    return jsonify(data)

# Run Server
if __name__ == '__main__':
    app.run(debug=True)