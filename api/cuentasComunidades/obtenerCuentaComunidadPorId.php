<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  // REALIZA LA QUERY A LA DB
  $registros = mysqli_query($conexion, "SELECT   cuentacomunidad.id_asociativo_banco as id_banco_fk,
                                                 cuentacomunidad.id_cuenta_comunidad,
                                                 cuentacomunidad.grupo1,
                                                 cuentacomunidad.grupo2,
                                                 cuentacomunidad.grupo3,
                                                 cuentacomunidad.grupo4,
                                                 cuentacomunidad.id_comunidad,
                                                 banco.id_asociativo_banco,
                                                 banco.nombre_banco
                                        FROM     cuentacomunidad, banco
                                        WHERE    cuentacomunidad.id_asociativo_banco = banco.id_banco AND
                                                 cuentacomunidad.id_cuenta_comunidad=$_GET[id_cuenta_comunidad]");
  $id_banco_fk = array();
  $id_cuenta_comunidad = array();
  $grupo1 = array();
  $grupo2 = array();
  $grupo3 = array();
  $grupo4 = array();
  $id_comunidad = array();
  
  $id_asociativo_banco = array();
  $nombre_banco = array();
  $datos = array(
      'id_banco_fk' => $id_banco_fk,
      'id_cuenta_comunidad' => $id_cuenta_comunidad,
      'grupo1' => $grupo1,
      'grupo2' => $grupo2,
      'grupo3' => $grupo3,
      'grupo4' => $grupo4,
      'id_comunidad' => $id_comunidad,
      
      'id_asociativo_banco' => $id_asociativo_banco,
      'nombre_banco' => $nombre_banco
  );

  // SI EL USUARIO EXISTE OBTIENE LOS DATOS Y LOS GUARDA EN UN ARRAY
  while ($resultado = mysqli_fetch_array($registros))  
  {
    array_push($datos['id_banco_fk'], $resultado['id_banco_fk']);
    array_push($datos['id_cuenta_comunidad'], $resultado['id_cuenta_comunidad']);
    array_push($datos['grupo1'], $resultado['grupo1']);
    array_push($datos['grupo2'], $resultado['grupo2']);
    array_push($datos['grupo3'], $resultado['grupo3']);
    array_push($datos['grupo4'], $resultado['grupo4']);
    array_push($datos['id_comunidad'], $resultado['id_comunidad']);
    
    array_push($datos['id_asociativo_banco'], $resultado['id_asociativo_banco']);
    array_push($datos['nombre_banco'], $resultado['nombre_banco']);
  }


  if (sizeof($datos) == 0) {
    $json = json_encode('null');
  } else {
    $json = json_encode($datos); // GENERA EL JSON CON LOS DATOS OBTENIDOS
  }

  echo $json; // MUESTRA EL JSON GENERADO
  
  header('Content-Type: application/json');
?>