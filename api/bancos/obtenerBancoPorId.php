<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  // REALIZA LA QUERY A LA DB
  $registros = mysqli_query($conexion, "SELECT * FROM banco WHERE id_banco=$_GET[id_banco]");
  
  $id_banco = array();
  $nombre_banco = array();
  $id_asociativo_banco = array();
  $iban = array();
  $datos = array(
      'id_banco' => $id_banco,
      'nombre_banco' => $nombre_banco,
      'id_asociativo_banco' => $id_asociativo_banco,
      'iban' => $iban
  );
  // SI EL USUARIO EXISTE OBTIENE LOS DATOS Y LOS GUARDA EN UN ARRAY
  if ($resultado = mysqli_fetch_array($registros))  
  {
    array_push($datos['id_banco'], $resultado['id_banco']);
    array_push($datos['nombre_banco'], $resultado['nombre_banco']);
    array_push($datos['id_asociativo_banco'], $resultado['id_asociativo_banco']);
    array_push($datos['iban'], $resultado['iban']);
  }


    $json = json_encode($datos); // GENERA EL JSON CON LOS DATOS OBTENIDOS


  echo $json; // MUESTRA EL JSON GENERADO
  
  header('Content-Type: application/json');
?>