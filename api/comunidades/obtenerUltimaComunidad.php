<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  // REALIZA LA QUERY A LA DB
  $registros = mysqli_query($conexion, "SELECT max(id_comunidad) as maximo FROM comunidad");
  
  $maximo = array();
  $datos = array(
      'maximo' => $maximo,
  );
  // SI EL USUARIO EXISTE OBTIENE LOS DATOS Y LOS GUARDA EN UN ARRAY
  if ($resultado = mysqli_fetch_array($registros))  
  {
    array_push($datos['maximo'], $resultado['maximo']);
  }

    $json = json_encode($datos); // GENERA EL JSON CON LOS DATOS OBTENIDOS
  

  echo $json; // MUESTRA EL JSON GENERADO
  
  header('Content-Type: application/json');
?>