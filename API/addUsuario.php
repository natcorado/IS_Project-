<?php 

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

function getConexion() {
    $host = 'postgresql-appgestordegastos.c764g8ko6wn0.us-east-1.rds.amazonaws.com';
    $dbname = 'AppGestorDeGastosDB';  
    $user = 'postgresUG';                
    $password = 'Moshopahd03kronos';     
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

if (isset($data['nombre']) && isset($data['correo']) && isset($data['contrasena'])) {
    try {
        $pdo = getConexion();
        
        $nombre = $data['nombre'];
        $correo = $data['correo'];
        $contrasenaHashed = password_hash($data['contrasena'], PASSWORD_DEFAULT);

        $checkEmailExistanceSql = "SELECT COUNT(*) FROM usuario WHERE correo = :correo";
        $checkStmt = $pdo->prepare($checkEmailExistanceSql);
        $checkStmt->bindParam(':correo', $correo);
        $checkStmt->execute();
        $emailExists = $checkStmt->fetchColumn();

        if ($emailExists > 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Este correo ya está registrado",
            ]);
        } else {
            $sql = "INSERT INTO usuario (nombre, correo, contrasena, patrimonio) 
                    VALUES (:nombre, :correo, :contrasena, 0)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':correo', $correo);
            $stmt->bindParam(':contrasena', $contrasenaHashed);
                    
            if ($stmt->execute()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Usuario registrado exitosamente",
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al registrar el usuario",
                ]);
            }
        }

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}

?>