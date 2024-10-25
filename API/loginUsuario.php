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

if (isset($data['correo']) && isset($data['contrasena'])) {
    try {
        // Conectar a la base de datos
        $pdo = getConexion(); // Asegúrate de tener esta función definida correctamente

        // Consulta para seleccionar el usuario por correo
        $sql = "SELECT * FROM Usuario WHERE correo = :correo";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':correo', $data['correo']);
        $stmt->execute();
        $user = $stmt->fetch();

        // Verificar si se encontró el usuario y si la contraseña es correcta
        if ($user && password_verify($data['contrasena'], $user['contrasena'])) {
            echo json_encode(["success" => true, "message" => "Login exitoso"]);
        } else {
            // Si no coincide la contraseña o el usuario no existe
            echo json_encode(["success" => false, "error" => "Credenciales incorrectas"]);
        }
    } catch (Exception $e) {
        // Manejo de excepciones
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    // Si faltan datos en la solicitud
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
}
?>
