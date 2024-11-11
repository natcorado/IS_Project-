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
        error_log("Error en la conexión: " . $e->getMessage());
        echo json_encode(["error" => "Error en la conexión a la base de datos"]);
        exit;
    }
}

$data = json_decode(file_get_contents("php://input"), true);

function validateRequiredFields($fields, $data) {
    $missingFields = [];
    foreach ($fields as $field) {
        if (!isset($data[$field])) {
            $missingFields[] = $field;
        }
    }
    if (!empty($missingFields)) {
        echo json_encode(["error" => "Faltan campos obligatorios: " . implode(", ", $missingFields)]);
        exit;
    }
}

try {
    if (isset($data['id_usuario'], $data['Read_Write'], $data['Outcome_Income'])) {
        $requiredFields = ['id_usuario', 'Read_Write', 'Outcome_Income'];
        validateRequiredFields($requiredFields, $data);

        $pdo = getConexion(); 
        $Income_Outcome = $data['Outcome_Income']; 
        $id_usuario = $data['id_usuario'];
        $Read_Write = $data['Read_Write'];
        $Category = $data['Category'] ?? null;

        if ($Read_Write === 0) {
            if ($Income_Outcome === 2) {
                $query = "SELECT id_tipo, categoria
                          FROM admin_tipo_reporte
                          WHERE id_usuario = :id_usuario OR id_usuario = 0;";
            
                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->execute();
                $result = $stmt->fetchAll();
            
                echo json_encode([
                    "status" => "success",
                    "data" => $result
                ]);
            }else{
                $tipo_reporte = ($Income_Outcome === 0) ? 'Gasto' : 'Ingreso';

                $query = "SELECT id_tipo, categoria
                        FROM admin_tipo_reporte
                        WHERE tipo_reporte = :tipo_reporte 
                        AND (id_usuario = :id_usuario OR id_usuario = 0);";

                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':tipo_reporte', $tipo_reporte);
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->execute();
                $result = $stmt->fetchAll();

                echo json_encode([
                    "status" => "success",
                    "data" => $result
                ]);

            }

        } elseif ($Read_Write === 1 && $Category) {
            $tipo_reporte = ($Income_Outcome === 0) ? 'Gasto' : 'Ingreso';

            $query = "SELECT COUNT(*) FROM admin_tipo_reporte 
                      WHERE tipo_reporte = :tipo_reporte 
                      AND categoria = :category 
                      AND (id_usuario = :id_usuario OR id_usuario = 0)";

            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':tipo_reporte', $tipo_reporte);
            $stmt->bindParam(':category', $Category);
            $stmt->bindParam(':id_usuario', $id_usuario);
            $stmt->execute();
            $count = $stmt->fetchColumn();

            if ($count == 0) {
                $query = "INSERT INTO admin_tipo_reporte (categoria, tipo_reporte, id_usuario)
                          VALUES (:category, :tipo_reporte, :id_usuario);";

                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':category', $Category);
                $stmt->bindParam(':tipo_reporte', $tipo_reporte);
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->execute();

                echo json_encode([
                    "status" => "success",
                    "message" => "Categoría insertada exitosamente para $tipo_reporte"
                ]);
            } else {
                echo json_encode([
                    "error" => "La categoría '$Category' ya existe en $tipo_reporte"
                ]);
            }
        } else {
            echo json_encode(["error" => "Datos incompletos o inválidos"]);
        }

    } elseif (isset($data['id_usuario'], $data['id_tipo'], $data['Outcome_Income'], $data['fecha'], $data['cantidad'], $data['descripcion'])) {
        validateRequiredFields(['id_usuario', 'id_tipo', 'Outcome_Income', 'fecha', 'cantidad', 'descripcion'], $data);

        $pdo = getConexion(); 
        $id_usuario = $data['id_usuario']; 
        $id_tipo = $data['id_tipo'];
        $Outcome_Income = $data['Outcome_Income'];
        $fecha = $data['fecha'];
        $cantidad = $data['cantidad'];
        $descripcion = $data['descripcion'];

        $tipo_reporte = ($Outcome_Income === 0) ? 'Gasto' : 'Ingreso';

        $query = "INSERT INTO admin_reporte_asociado_tiene (descripcion, cantidad, fecha, tipo_ingreso, id_tipo, id_usuario)
                  VALUES (:descripcion, :cantidad, :fecha, 'Manual', :id_tipo, :id_usuario);";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':cantidad', $cantidad);
        $stmt->bindParam(':fecha', $fecha);
        $stmt->bindParam(':id_tipo', $id_tipo);
        $stmt->bindParam(':id_usuario', $id_usuario);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Dato insertado exitosamente para $tipo_reporte"
            ]);
        } else {
            echo json_encode(["error" => "Error al insertar el dato"]);
        }

    } else {
        echo json_encode(["error" => "Datos incompletos"]);
    }
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(["error" => "Ocurrió un error inesperado"]);
}
?>
