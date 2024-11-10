<?php 

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

include_once 'DB.php';

$conexion = DB::getConexion();

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['categoria']) && isset($data['tipo_reporte'])) {
    try {
        $pdo = getConexion();
        
        $sql = "INSERT INTO ADMIN_Tipo_Reporte (categoria, tipo_reporte) VALUES (:categoria, :tipo_reporte)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':categoria', $data['categoria']);
        $stmt->bindParam(':tipo_reporte', $data['tipo_reporte']);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Tipo de reporte agregado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al agregar el tipo de reporte"]);
        }

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}
?>
