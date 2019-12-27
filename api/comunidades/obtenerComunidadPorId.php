<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  // REALIZA LA QUERY A LA DB
  $registros = mysqli_query($conexion, "SELECT * FROM comunidad WHERE id_comunidad=$_GET[id_comunidad]");
  
  $id_comunidad = array();
  $nombre = array();
  $datos = array(
      'id_comunidad' => $id_comunidad,
      'nombre' => $nombre,
  );
  // SI EL USUARIO EXISTE OBTIENE LOS DATOS Y LOS GUARDA EN UN ARRAY
  if ($resultado = mysqli_fetch_array($registros))  
  {
    array_push($datos['id_comunidad'], $resultado['id_comunidad']);
    array_push($datos['nombre'], $resultado['nombre']);
  }

  $json = json_encode($datos); // GENERA EL JSON CON LOS DATOS OBTENIDOS


  echo $json; // MUESTRA EL JSON GENERADO
  
  header('Content-Type: application/json');
?>