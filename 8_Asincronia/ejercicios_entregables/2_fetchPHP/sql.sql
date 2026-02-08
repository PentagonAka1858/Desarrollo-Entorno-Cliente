CREATE DATABASE IF NOT EXISTS curso_ajax;

USE curso_ajax;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE, /* UNIQUE evita duplicados */
    movil VARCHAR(150),
    edad INT,
    nivel_idioma enum("A1", "A2", "B1", "B2", "C1", "C2"),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
