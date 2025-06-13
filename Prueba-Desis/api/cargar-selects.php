<?php
// Este archivo responde a peticiones GET para cargar opciones en los <select>
// Tipos válidos: bodegas, monedas, sucursales

// Primero obtengo el tipo de dato solicitado desde el parámetro GET
$tipo = $_GET['tipo'] ?? null;
$bodega_id = $_GET['bodega_id'] ?? null;

try {
    // Conexión a PostgreSQL local
    $pdo = new PDO("pgsql:host=localhost;port=5432;dbname=registro_productos", "postgres", "90585380");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Hacemos una consulta para devolver todas las bodegas
    if ($tipo === 'bodegas') {
        $res = $pdo->query("SELECT id, nombre FROM bodegas ORDER BY nombre ASC");
        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // Hacemos una consulta para devolver todas las monedas
    if ($tipo === 'monedas') {
        $res = $pdo->query("SELECT id, nombre FROM monedas ORDER BY nombre ASC");
        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // Una consulta que devuelve las sucursales dependiendo de la bodega
    if ($tipo === 'sucursales' && $bodega_id) {
        $stmt = $pdo->prepare("SELECT id, nombre FROM sucursales WHERE bodega_id = :id ORDER BY nombre ASC");
        $stmt->execute(['id' => $bodega_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // Si el tipo no es válido muestro el error
    echo json_encode(['error' => '❌ Tipo de dato no válido']);

} catch (Exception $e) {
    // Devuelve el error como JSON si ocurre alguna excepción
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
