<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

function getConexion() {
    $host = 'postgresql-appgestordegastos.c764g8ko6wn0.us-east-1.rds.amazonaws.com';
    $dbname = 'AppGestorDeGastosDB';  
    $user = 'natali_corado';                
    $password = 'vamosnatali';        
    $port = 5432;   

    try {
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error en la conexión: " . $e->getMessage()]);
        exit;
    }
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['correo']) && isset($data['contrasena'])) {
    try {
        $pdo = getConexion();

        $sql = "SELECT * FROM usuario WHERE correo = :correo";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':correo', $data['correo']);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($user && password_verify($data['contrasena'], $user['contraseña'])) {
            echo json_encode(["message" => "Inicio de sesión exitoso", "redirect" => "home"]);
        } else {

            echo json_encode(["error" => "Correo o contraseña incorrectos"]);
        }

    } catch (Exception $e) {
        echo json_encode(["error" => "Error en la operación: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}
?>
