CREATE DATABASE student_management;

USE student_management;

CREATE TABLE student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    course VARCHAR(50),
    enrolled_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
