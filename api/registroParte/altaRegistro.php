<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  $json = file_get_contents('php://input'); // RECIBE EL JSON DE ANGULAR
 
  $params = json_decode($json, true)[0]; // DECODIFICA EL JSON Y LO GUARADA EN LA VARIABLE
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION

  $concepto = $params['concepto'];
  $importe = $params['importe'];
  $piso = $params['piso'];
  $fecha = $params['fecha'];
  $id_cuenta_comunidad = $params['id_cuenta_comunidad'];

  // REALIZA LA QUERY A LA DB
  mysqli_query($conexion, "INSERT INTO registroparte(concepto, importe, piso, fecha, id_cuenta_comunidad) VALUES
                  ('$concepto','$importe','$piso','$fecha','$id_cuenta_comunidad')");    
  
  class Result {}
  // GENERA LOS DATOS DE RESPUESTA
  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'SE REGISTRO EXITOSAMENTE EL USUARIO';
  header('Content-Type: application/json');
  echo json_encode($response); // MUESTRA EL JSON GENERADO
?>