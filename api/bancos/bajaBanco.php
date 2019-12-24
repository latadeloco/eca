<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  

  // REALIZA LA QUERY A LA DB
  mysqli_query($conexion, "DELETE FROM cuentacomunidad WHERE cuentacomunidad.id_asociativo_banco=$_GET[id_banco]");

  mysqli_query($conexion, "DELETE FROM banco WHERE id_banco=$_GET[id_banco]");
      
  class Result {}
  // GENERA LOS DATOS DE RESPUESTA
  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'EL USUARIO SE ELIMINO EXITOSAMENTE';
  header('Content-Type: application/json');
  echo json_encode($response); // MUESTRA EL JSON GENERADO
?>