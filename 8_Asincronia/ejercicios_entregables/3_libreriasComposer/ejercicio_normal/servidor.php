<?php

require 'vendor/autoload.php';

use Medoo\Medoo;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    $database = new Medoo([
        'type' => 'mysql',
        'host' => 'localhost',
        'database' => 'curso_ajax',
        'username' => 'root',
        'password' => 'usuario'
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error de
    conexión"]);
    exit;
}
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // READ - Get all users
            $usuarios = $database->select('usuarios', [
                'nombre',
                'correo',
                'movil',
                'edad',
                'nivel_idioma'
            ]);
            
            echo json_encode([
                'status' => 'ok',
                'data' => $usuarios
            ]);
            break;
            
        case 'POST':
            // CREATE - Insert new user
            $nombre = $_POST['nombre'] ?? '';
            $correo = $_POST['correo'] ?? '';
            $movil = $_POST['movil'] ?? '';
            $edad = $_POST['edad'] ?? '';
            $nivel_idioma = $_POST['nivel'] ?? null;
            
            // Validation
            if (empty($nombre) || empty($correo) || empty($movil) || empty($edad)) {
                throw new Exception('Todos los campos son obligatorios');
            }
            
            // Insert
            $result = $database->insert('usuarios', [
                'nombre' => $nombre,
                'correo' => $correo,
                'movil' => $movil,
                'edad' => $edad,
                'nivel_idioma' => $nivel_idioma
            ]);
            
            // Check if insert was successful
            if ($result->rowCount() > 0 || $database->id()) {
                echo json_encode([
                    'status' => 'ok',
                    'mensaje' => 'Usuario registrado correctamente'
                ]);
            } else {
                throw new Exception('Error al insertar usuario');
            }
            break;
            
        case 'PUT':
            // UPDATE - Update user
            $input = json_decode(file_get_contents('php://input'), true);
            
            $correo = $input['correo'] ?? '';
            $nombre = $input['nombre'] ?? '';
            $movil = $input['movil'] ?? '';
            $edad = $input['edad'] ?? '';
            $nivel_idioma = $input['nivel_idioma'] ?? null;
            
            if (empty($correo)) {
                throw new Exception('Correo es requerido');
            }
            
            $result = $database->update('usuarios', [
                'nombre' => $nombre,
                'movil' => $movil,
                'edad' => $edad,
                'nivel_idioma' => $nivel_idioma
            ], [
                'correo' => $correo
            ]);
            
            // Check if update affected any rows
            if ($result->rowCount() >= 0) {
                echo json_encode([
                    'status' => 'ok',
                    'mensaje' => 'Usuario actualizado correctamente'
                ]);
            } else {
                throw new Exception('Error al actualizar usuario');
            }
            break;
            
        case 'DELETE':
            // DELETE - Delete user
            $input = json_decode(file_get_contents('php://input'), true);
            $correo = $input['correo'] ?? '';
            
            if (empty($correo)) {
                throw new Exception('Correo es requerido');
            }
            
            $result = $database->delete('usuarios', [
                'correo' => $correo
            ]);
            
            // Check if delete affected any rows
            if ($result->rowCount() > 0) {
                echo json_encode([
                    'status' => 'ok',
                    'mensaje' => 'Usuario eliminado correctamente'
                ]);
            } else {
                throw new Exception('Usuario no encontrado o ya eliminado');
            }
            break;
            
        default:
            throw new Exception('Método no permitido');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'error' => $e->getMessage()
    ]);
}
