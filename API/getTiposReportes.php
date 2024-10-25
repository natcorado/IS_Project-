<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Permite peticiones desde cualquier origen
header("Access-Control-Allow-Methods: GET");



include_once 'DB.php';

try {
    $pdo = getConexion();

    // Consulta para obtener todos los tipos de reportes
    $sql = "SELECT * FROM ADMIN_Tipo_Reporte";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    // Obtener los resultados como un array asociativo
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Devolver los resultados en formato JSON
    echo json_encode($result);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>