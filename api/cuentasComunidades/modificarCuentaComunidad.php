<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  $json = file_get_contents('php://input');
 
  $params = json_decode($json, true)[0];
  

  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION


  if (is_array($params['id_asociativo_banco'])) {
    $id_asociativo_banco = implode("','", $params['id_asociativo_banco']);
  } else {
    $id_asociativo_banco = $params['id_asociativo_banco'];
  }

  // REALIZA LA QUERY A LA DB
  $query = mysqli_query($conexion, "SELECT banco.id_banco 
                                    FROM   banco
                                    WHERE  banco.id_asociativo_banco='$id_asociativo_banco'");

$id_banco_array = array();
if ($resultadoQuery = mysqli_fetch_array($query))  
{
  $id_banco_array[] = $resultadoQuery['id_banco'];
}    

  $id_banco = implode("','", $id_banco_array);

  if (is_array($params['grupo1'])) {
    $grupo1 = implode("','",$params['grupo1']);
  } else {
    $grupo1 = $params['grupo1'];
  }

  if (is_array($params['grupo2'])) {
    $grupo2 = implode("','",$params['grupo2']);
  } else {
    $grupo2 = $params['grupo2'];
  }

  if (is_array($params['grupo3'])) {
    $grupo3 = implode("','",$params['grupo3']);
  } else {
    $grupo3 = $params['grupo3'];
  }

  if (is_array($params['grupo4'])) {
    $grupo4 = implode("','",$params['grupo4']);
  } else {
    $grupo4 = $params['grupo4'];
  }

  $id_cuenta_comunidad = $params['id_cuenta_comunidad'];

  
  mysqli_query($conexion, "UPDATE `cuentacomunidad`
    SET 
        `id_asociativo_banco`='$id_banco',
        `grupo1`='$grupo1',
        `grupo2`='$grupo2',
        `grupo3`='$grupo3',
        `grupo4`='$grupo4'
    WHERE `cuentacomunidad`.`id_cuenta_comunidad`='$id_cuenta_comunidad'");
    
  
  class Result {}
  // GENERA LOS DATOS DE RESPUESTA
  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'EL USUARIO SE ACTUALIZO EXITOSAMENTE';
  header('Content-Type: application/json');
  echo json_encode($params); // MUESTRA EL JSON GENERADO
?>