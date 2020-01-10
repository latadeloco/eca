<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  $json = file_get_contents('php://input');
 
  $params = json_decode($json);
  

  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  
  // REALIZA LA QUERY A LA DB
  mysqli_query($conexion, "UPDATE banco
    SET nombre_banco='$params->nombre_banco',
        id_asociativo_banco='$params->id_asociativo_banco',
        iban='$params->iban'
    WHERE id_banco=$params->id_banco");
    
  
  class Result {}
  // GENERA LOS DATOS DE RESPUESTA
  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'EL USUARIO SE ACTUALIZO EXITOSAMENTE';
  header('Content-Type: application/json');
  echo json_encode($params); // MUESTRA EL JSON GENERADO
?>