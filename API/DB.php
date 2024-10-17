<?php
// Definir los datos de conexión correctos
$host = 'postgresql-appgestordegastos.c764g8ko6wn0.us-east-1.rds.amazonaws.com';  // Reemplaza con tu endpoint real
$dbname = 'AppGestorDeGastosDB';  // Nombre de la base de datos en RDS
$user = 'postgresUG';                 // Usuario de la base de datos en RDS
$password = 'Moshopahd03kronos';           // Contraseña del usuario en RDS
$port = 5432;                             // Puerto estándar para PostgreSQL

// Validar que las variables estén definidas correctamente
if (!isset($host, $dbname, $user, $password, $port)) {
    die("Error: Una o más variables de conexión no están definidas.");
}

try {
    // Definir la cadena DSN para PostgreSQL
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

    // Crear una nueva conexión PDO
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Si la conexión es exitosa
    echo "Conexión exitosa a la base de datos.";
} catch (PDOException $e) {
    // Mostrar el error si la conexión falla
    echo "Error en la conexión: " . $e->getMessage();
}
?>
