<?php

//try para intentar ejecutar todo el bloque

try{

    $pdo = new PDO("pgsql:host=localhost;port=5432;dbname=registro_productos","postgres","90585380");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //recibe los datos del formulario vía POST

    $codigo = $_POST['codigo'];
    $nombre = $_POST['nombre'];
    $bodega_id = $_POST['bodega'];
    $sucursal_id = $_POST['sucursal'];
    $moneda_id = $_POST['moneda'];
    $precio = $_POST['precio'];
    $descripcion = $_POST['descripcion'];
    $materiales = $_POST['materiales'];

    //Verificar que el codigo sea unico

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM productos WHERE codigo = :codigo");
    $stmt -> execute(['codigo' => $codigo]);
    $existe = $stmt -> fetchColumn();

    if ($existe > 0){

        exit("El codigo del producto ya esta registrado.");

    }

    //Transformar array de materiales a formato PostgresSQL

    $materiales_pgsql = '{' . implode(',', array_map(fn($m) => '"' . $m . '"', $materiales)) . '}'; // ← usa coma

    //Preparar el INSERT con los campos necesarios

    $stmt = $pdo->prepare("INSERT INTO productos (codigo,nombre,bodega_id,sucursal_id,moneda_id,precio,descripcion,materiales) VALUES (:codigo, :nombre, :bodega, :sucursal, :moneda, :precio, :descripcion, :materiales)");

    //Ejecutar el INSERT con los datos recibidos

    $stmt->execute([
        'codigo' => $codigo,
        'nombre' => $nombre,
        'bodega' => $bodega_id,
        'sucursal' => $sucursal_id,
        'moneda' => $moneda_id,
        'precio' => $precio,
        'descripcion' => $descripcion,
        'materiales' => $materiales_pgsql
    ]);

    //Mostrar un mensaje si el INSERT fue exitoso

    echo "Producto guardado correctamente.";


} catch (Exception $e ){

    //Si hubiese algun error, se muestra

    http_response_code(500);
    echo "Error al guardar: " . $e->getMessage();

}
