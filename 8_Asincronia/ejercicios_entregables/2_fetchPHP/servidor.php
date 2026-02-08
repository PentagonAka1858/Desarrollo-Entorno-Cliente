<?php
// --- MODO DEBUG: ACTIVAR PARA VER ERRORES ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Habilitar CORS y JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// --- CHIVATO: Guardar lo que llega en un archivo de texto (SOLO POST) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $log = "Fecha: " . date("Y-m-d H:i:s") . "\n";
    $log .= "Método: " . $_SERVER['REQUEST_METHOD'] . "\n";
    $log .= "Datos recibidos: " . print_r($_POST, true) . "\n";
    $log .= "-----------------------------------\n";
    file_put_contents("debug_log.txt", $log, FILE_APPEND);
}

// --- DATOS CONEXIÓN BD ---

// Configuración de la BDD (¡Cambia esto por tus credenciales de XAMPP/MAMP!)
$host = 'localhost';
$db = 'curso_ajax'; // El nombre que pusimos en el SQL
$user = 'root'; // Usuario por defecto en XAMPP
$pass = 'usuario'; // Contraseña (suele ser vacía o 'root' en MAMP)
$charset = 'utf8mb4';
// Data Source Name (Cadena de conexión)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Lanzar errores como excepciones
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Devolver arrays asociativos
    PDO::ATTR_EMULATE_PREPARES => false, // Usar sentencias preparadas reales
];
// -----------------------------------------------------------
// 2. VALIDAR MÉTODO HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibir datos (PHP los saca del FormData automáticamente)
    $nombre = $_POST['nombre'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $movil = $_POST['movil'] ?? '';
    $edad = $_POST['edad'] ?? '';
    $nivel_idioma = $_POST['nivel'] ?? null;
    // Validación básica
    if (empty($nombre) || empty($correo) || empty($movil) || empty($edad)) {
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "error" => "Faltan campos obligatorios"]);
        exit;
    }
    try {
        // 1. Conectar
        $pdo = new PDO($dsn, $user, $pass, $options);
        // 2. Preparar la sentencia (El '?' o ':nombre' son marcadores de seguridad)
        // Usamos IGNORE o comprobación previa para evitar error fatal si el correo ya existe
        $sql = "INSERT INTO usuarios (nombre, correo, movil, edad, nivel_idioma) VALUES (:nombre, :correo, :movil, :edad, :nivel_idioma)";
        $stmt = $pdo->prepare($sql);
        // 3. Ejecutar con los datos reales
        $stmt->execute(['nombre' => $nombre, 'correo' => $correo, 'movil' => $movil, 'edad' => $edad, 'nivel_idioma' => $nivel_idioma]);
        // 4. Responder Éxito
        echo json_encode([
            "status" => "ok",
            "mensaje" => "Usuario $nombre registrado correctamente con ID: " . $pdo->lastInsertId()
        ]);
    } catch (\PDOException $e) {
        // Manejo de errores de BDD (Ej: Correo duplicado código 23000)
        if ($e->getCode() == 23000) {
            http_response_code(409); // Conflict
            echo json_encode(["status" => "error", "error" => "El correo ya está registrado"]);
        } else {
            http_response_code(500); // Error interno
            echo json_encode(["status" => "error", "error" => "Error en BDD: " . $e->getMessage()]);
        }
    }
    
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // 1. Conectar
        $pdo = new PDO($dsn, $user, $pass, $options);
        // 2. Preparar la sentencia
        $sql = "SELECT nombre, correo, movil, edad, nivel_idioma FROM usuarios";
        $stmt = $pdo->query($sql);
        // 3. Obtener resultados
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // 4. Responder Éxito
        echo json_encode([
            "status" => "ok",
            "data" => $usuarios
        ]);
    } catch (\PDOException $e) {
        // Manejo de errores de BDD (Ej: Correo duplicado código 23000)
        if ($e->getCode() == 500) {
            http_response_code(500); // Error interno
            echo json_encode(["status" => "error", "error" => "Error en BDD: " . $e->getMessage()]);
        }
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
        
    $correo = $input['correo'] ?? '';
    $nombre = $input['nombre'] ?? '';
    $movil = $input['movil'] ?? '';
    $edad = $input['edad'] ?? '';
    $nivel_idioma = $input['nivel_idioma'] ?? null;

    if (empty($correo) || empty($nombre) || empty($movil) || empty($edad)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "error" => "Faltan campos obligatorios"]);
        exit;
    }

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        $sql = "UPDATE usuarios SET nombre = :nombre, movil = :movil, edad = :edad, nivel_idioma = :nivel_idioma WHERE correo = :correo";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'correo' => $correo,
            'nombre' => $nombre,
            'movil' => $movil,
            'edad' => $edad,
            'nivel_idioma' => $nivel_idioma
        ]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                "status" => "ok",
                "mensaje" => "Usuario actualizado correctamente"
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "error" => "Usuario no encontrado o sin cambios"]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "error" => "Error en BDD: " . $e->getMessage()]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Leer datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    $correo = $input['correo'] ?? '';
    
    if (empty($correo)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "error" => "Falta el correo"]);
        exit;
    }
    
    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        $sql = "DELETE FROM usuarios WHERE correo = :correo";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['correo' => $correo]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                "status" => "ok",
                "mensaje" => "Usuario eliminado correctamente"
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "error" => "Usuario no encontrado"]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "error" => "Error en BDD: " . $e->getMessage()]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "error" => "Método no permitido"]);
}
