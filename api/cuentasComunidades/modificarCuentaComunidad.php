<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  $json = file_get_contents('php://input');
 
  $params = json_decode($json);
  

  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  
  
  $parametroEnPrimeraQuery = $params[0]->id_asociativo_banco[0];

  // REALIZA LA QUERY A LA DB
  $query = mysqli_query($conexion, "SELECT id_banco FROM banco WHERE banco.id_asociativo_banco=$parametroEnPrimeraQuery");

  $id_asociativo_banco_array = array();
  while ($resultadoQuery = mysqli_fetch_array($query))  
  {
      echo var_dump($resultadoQuery);
      $id_asociativo_banco_array[] = $resultadoQuery['id_banco'];
    }
    
    die();

  $grupo1 = $params[0]->grupo1;
  $grupo2 = $params[0]->grupo2;
  $grupo3 = $params[0]->grupo3;
  $grupo4 = $params[0]->grupo4;
  $id_cuenta_comunidad = $params[0]->id_cuenta_comunidad;
 // $id_asociativo_banco = $id_asociativo_banco_array;
  
  echo var_dump($id_asociativo_banco_array);
  die();

  mysqli_query($conexion, "UPDATE cuentacomunidad
    SET 
        id_asociativo_banco=$id_asociativo_banco,
        grupo1='$grupo1',
        grupo2='$grupo2',
        grupo3='$grupo3',
        grupo4='$grupo4'
    WHERE id_cuenta_comunidad='$id_cuenta_comunidad'");
    
  
  class Result {}
  // GENERA LOS DATOS DE RESPUESTA
  $response = new Result();
  $response->resultado = 'OK';
  $response->mensaje = 'EL USUARIO SE ACTUALIZO EXITOSAMENTE';
  header('Content-Type: application/json');
  echo json_encode($params); // MUESTRA EL JSON GENERADO
?>