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

if (isset($data['id_usuario'])) {
    $id_usuario = $data['id_usuario'];

    try {
        $pdo = getConexion(); 

        if (isset($data['nombre']) && isset($data['email']) && isset($data['budget'])) {
            $nombre = trim($data['nombre']);
            $email = trim($data['email']);
            $budget = floatval($data['budget']);

            if (empty($nombre) || empty($email)) {
                echo json_encode(["error" => "Name and email cannot be empty."]);
                exit;
            }

            $query = "SELECT COUNT(*) FROM usuario WHERE correo = :email AND id_usuario != :id_usuario";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':id_usuario', $id_usuario);
            $stmt->execute();
            $count = $stmt->fetchColumn();

            if ($count > 0) {
                echo json_encode([
                    "error" => "This email is already in use. Please choose a different one."
                ]);
                exit;
            }


            $query = "UPDATE usuario SET nombre = :nombre, correo = :email, patrimonio = :budget WHERE id_usuario = :id_usuario";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':id_usuario', $id_usuario);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':budget', $budget);

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Your profile has been updated successfully. Please log in again to see the changes."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "No changes were made or the user does not exist."
                ]);
            }

        } else {
            echo json_encode(["error" => "Missing required fields (name, email, or budget)."]);
        }

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Incomplete data."]);
}

?>
