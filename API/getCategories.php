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

// - Outcome_income 0......Outcome
// - Outcome_income 1......Income
// - Read_Write 0..........Read
// - Read_Write 0..........Write

// 00 Read Outcome
// 01 Read Income
// 10 Write Outcome
// 11 Write Income

if (isset($data['id_usuario']) && isset($data['Read_Write']) && isset($data['Outcome_Income'])) {
    $Income_Outcome = $data['Outcome_Income']; 
    $id_usuario = $data['id_usuario'];
    $Read_Write = $data['Read_Write'];
    $Category = isset($data['Category']) ? $data['Category'] : null;

    try {
        $pdo = getConexion(); 

        // Si es Read (0) -> Leer categorías de Gasto o Ingreso
        if ($Read_Write === 0) {

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

        // Si es Write (1) -> Insertar Gasto o Ingreso
        } elseif ($Read_Write === 1 && $Category) {

            $tipo_reporte = ($Income_Outcome === 0) ? 'Gasto' : 'Ingreso';

            // Verificar si la categoría ya existe en la base de datos
            if ($Income_Outcome === 0) {
                // Si es 0 (Outcome) -> revisamos si la categoría ya existe en "Gastos"
                $query = "SELECT COUNT(*) FROM admin_tipo_reporte 
                          WHERE tipo_reporte = 'Gasto' 
                          AND categoria = :category 
                          AND (id_usuario = :id_usuario OR id_usuario = 0)";
            } else {
                // Si es 1 (Income) -> revisamos si la categoría ya existe en "Ingresos"
                $query = "SELECT COUNT(*) FROM admin_tipo_reporte 
                          WHERE tipo_reporte = 'Ingreso' 
                          AND categoria = :category 
                          AND (id_usuario = :id_usuario OR id_usuario = 0)";
            }

            // Ejecutamos la consulta para contar las categorías existentes
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':category', $Category);
            $stmt->bindParam(':id_usuario', $id_usuario);
            $stmt->execute();
            $count = $stmt->fetchColumn(); // Obtén el número de coincidencias

            if ($count == 0) {
                // Si no existe, insertamos la nueva categoría
                $query = "INSERT INTO admin_tipo_reporte (categoria, tipo_reporte, id_usuario)
                          VALUES (:category, :tipo_reporte, :id_usuario);";

                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':category', $Category);
                $stmt->bindParam(':tipo_reporte', $tipo_reporte);
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->execute();

                echo json_encode([
                    "status" => "success",
                    "message" => "Dato insertado exitosamente para $tipo_reporte"
                ]);
            } else {
                echo json_encode([
                    "error" => "La categoría '$Category' ya existe en $tipo_reporte"
                ]);
            }

        } else {
            echo json_encode(["error" => "Datos incompletos o inválidos"]);
        }

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    
} else if (isset($data['id_usuario']) && isset($data['id_tipo']) && isset($data['Outcome_Income']) && isset($data['fecha']) && isset($data['cantidad']) && isset($data['descripcion'])){
    try{
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
            echo json_encode([
                "status" => "error",
                "message" => "Hubo un error al insertar el dato"
            ]);

        }
    }catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    
}else {
    echo json_encode(["error" => "Datos incompletos"]);
}
?>
