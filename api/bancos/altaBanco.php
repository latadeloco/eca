<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  $json = file_get_contents('php://input'); // RECIBE EL JSON DE ANGULAR
 
  $params = json_decode($json, true); // DECODIFICA EL JSON Y LO GUARADA EN LA VARIABLE
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION

  if (is_array($params)) {
    $nombre_banco = $params['nombre_banco'];
    $id_asociativo_banco = $params['id_asociativo_banco'];
    $iban = $params['iban'];
  } else {
    $nombre_banco = $params->nombre_banco;
    $id_asociativo_banco = $params->id_asociativo_banco;
    $iban = $params->iban;
  }

  // REALIZA LA QUERY A LA DB
  mysqli_query($conexion, "INSERT INTO banco(nombre_banco, id_asociativo_banco, iban) VALUES
                  ('$nombre_banco','$id_asociativo_banco', '$iban')");    
  
  class Result {}
  // GENERA LOS DATOS DE RESPUESTA
  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'SE REGISTRO EXITOSAMENTE EL USUARIO';
  header('Content-Type: application/json');
  echo json_encode($response); // MUESTRA EL JSON GENERADO
?>