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

// Verifica el tipo de consulta a realizar basado en el valor de 'Income_Outcome':
// - 0: Obtiene todos los reportes de gastos para el usuario
// - 1: Obtiene todos los reportes de ingresos para el usuario
// - 2: Obtiene todos los reportes (ingresos y gastos) para el usuario
// - 3: Obtiene el total de gastos para el usuario
// - 4: Obtiene el total de ingresos para el usua

if (isset($data['id_usuario']) && isset($data['Income_Outcome'])) {
    $Income_Outcome = $data['Income_Outcome'];
    $id_usuario = $data['id_usuario'];

    try {
        $pdo = getConexion(); 

        if ($Income_Outcome === 0) {
            $query = "SELECT id_reporte, categoria, tipo_reporte, cantidad, fecha  
                      FROM admin_tipo_reporte AS tipo
                      INNER JOIN admin_reporte_asociado_tiene AS reporte ON tipo.id_tipo = reporte.id_tipo
                      WHERE tipo.tipo_reporte = 'Gasto' AND reporte.id_usuario = :id_usuario
                      AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
                      ORDER BY fecha ASC;";

        } elseif ($Income_Outcome === 1) {
            $query = "SELECT id_reporte, categoria, tipo_reporte, cantidad, fecha  
                      FROM admin_tipo_reporte AS tipo
                      INNER JOIN admin_reporte_asociado_tiene AS reporte ON tipo.id_tipo = reporte.id_tipo
                      WHERE tipo.tipo_reporte = 'Ingreso' AND reporte.id_usuario = :id_usuario
                      AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
                      ORDER BY fecha ASC;";

        }  elseif ($Income_Outcome === 2) {
            $query = "SELECT id_reporte, categoria, tipo_reporte, cantidad, fecha  
                      FROM admin_tipo_reporte AS tipo
                      INNER JOIN admin_reporte_asociado_tiene AS reporte ON tipo.id_tipo = reporte.id_tipo
                      WHERE reporte.id_usuario = :id_usuario
                      AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
                      ORDER BY fecha ASC;";
                           
        }elseif ($Income_Outcome === 3) {
            $query = "SELECT SUM(cantidad) AS total 
                      FROM admin_tipo_reporte AS tipo
                      INNER JOIN admin_reporte_asociado_tiene AS reporte ON tipo.id_tipo = reporte.id_tipo
                      WHERE tipo.tipo_reporte = 'Gasto' AND reporte.id_usuario = :id_usuario
                      AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE);";

        }elseif ($Income_Outcome === 4) {
            $query = "SELECT SUM(cantidad) AS total 
                      FROM admin_tipo_reporte AS tipo
                      INNER JOIN admin_reporte_asociado_tiene AS reporte ON tipo.id_tipo = reporte.id_tipo
                      WHERE tipo.tipo_reporte = 'Ingreso' AND reporte.id_usuario = :id_usuario
                      AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE);";
                
        }elseif ($Income_Outcome === 5) {
            $query = "SELECT SUM(cantidad) AS total 
                      FROM admin_tipo_reporte AS tipo
                      INNER JOIN admin_reporte_asociado_tiene AS reporte ON tipo.id_tipo = reporte.id_tipo
                      WHERE tipo.tipo_reporte = 'Gasto' AND reporte.id_usuario = :id_usuario 
                      AND fecha >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') 
                      AND fecha < DATE_TRUNC('month', CURRENT_DATE);";

                
        }elseif ($Income_Outcome === 6) {
            $query = "SELECT SUM(cantidad) AS total 
                      FROM admin_tipo_reporte AS tipo
                      INNER JOIN admin_reporte_asociado_tiene AS reporte ON tipo.id_tipo = reporte.id_tipo
                      WHERE tipo.tipo_reporte = 'Ingreso' AND reporte.id_usuario = :id_usuario 
                      AND fecha >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') 
                      AND fecha < DATE_TRUNC('month', CURRENT_DATE);";             
        }

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        $result = $stmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "data" => $result
        ]);

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}
?>