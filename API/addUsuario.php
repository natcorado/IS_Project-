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
        // Definir la cadena DSN para PostgreSQL
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    
        // Crear una nueva conexión PDO
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    
        // Retorna la conexión si es exitosa
        return $pdo;
    } catch (PDOException $e) {
        // Mostrar el error si la conexión falla
        echo json_encode(["error" => "Error en la conexión: " . $e->getMessage()]);
        exit;
    }
}

// Obtener los datos enviados en la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['nombre']) && isset($data['correo']) && isset($data['contrasena'])) {
    try {
        $pdo = getConexion();
        // Definir las variables antes de usarlas en bindParam
        $nombre = $data['nombre'];
        $correo = $data['correo'];
        $contrasenaHashed = password_hash($data['contrasena'], PASSWORD_DEFAULT);

        // Insertar el nuevo usuario en la tabla
        $sql = "INSERT INTO usuario (nombre, correo, contrasena, patrimonio) VALUES (:nombre, :correo, :contrasena, 0)";
        $stmt = $pdo->prepare($sql);
        // Vincular los parámetros
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':contrasena', $contrasenaHashed);
                
        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(["message" => "Usuario registrado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al registrar el usuario"]);
        }

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}

?>