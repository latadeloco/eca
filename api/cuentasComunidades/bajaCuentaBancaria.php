<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  

  // REALIZA LA QUERY A LA DB
  mysqli_query($conexion, "DELETE FROM cuentacomunidad WHERE id_cuenta_comunidad=$_GET[id_cuenta_comunidad]");
  
  class Result {}
  // GENERA LOS DATOS DE RESPUESTA
  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'EL USUARIO SE ELIMINO EXITOSAMENTE';
  header('Content-Type: application/json');
  echo json_encode($response); // MUESTRA EL JSON GENERADO
?>