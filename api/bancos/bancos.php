<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  // REALIZA LA QUERY A LA DB
  $registros = mysqli_query($conexion, "SELECT * FROM banco");

  $nombre_banco = array();
  $id_asociativo_banco = array();
  $datos = array(
    'nombre_banco' => $nombre_banco,
    'id_asociativo_banco' => $id_asociativo_banco
  );
  // SI EL USUARIO EXISTE OBTIENE LOS DATOS Y LOS GUARDA EN UN ARRAY
  for ($i = 0 ; $i < $registros->field_count ; $i++) {
     $resultados = (mysqli_fetch_array($registros));
     array_push($datos['nombre_banco'], $resultados['nombre_banco']);
     array_push($datos['id_asociativo_banco'], $resultados['id_asociativo_banco']);
  }

  $json = json_encode($datos); // GENERA EL JSON CON LOS DATOS OBTENIDOS
  echo $json; // MUESTRA EL JSON GENERADO
  
  header('Content-Type: application/json');
?>