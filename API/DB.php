<?php

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
        echo "Error en la conexión: " . $e->getMessage();
    }
}
