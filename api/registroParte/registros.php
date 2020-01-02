  
<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("../config.php"); // IMPORTA EL ARCHIVO CON LA CONEXION A LA DB
  $conexion = conexion(); // CREA LA CONEXION
  // REALIZA LA QUERY A LA DB

  $registros = mysqli_query($conexion, "SELECT registroparte.id_concepto as id_registro_parte,
                                               comunidad.nombre as nombre_comunidad, 
                                               registroparte.concepto as concepto, 
                                               registroparte.importe as importe, 
                                               banco.id_asociativo_banco as id_asociativo_banco, 
                                               cuentacomunidad.grupo1 as grupo1, 
                                               cuentacomunidad.grupo2 as grupo2, 
                                               cuentacomunidad.grupo3 as grupo3, 
                                               cuentacomunidad.grupo4 as grupo4, 
                                               registroparte.piso as piso, 
                                               banco.nombre_banco as nombre_banco, 
                                               registroparte.fecha as fecha
                                        FROM   registroparte, 
                                               cuentacomunidad, 
                                               banco, 
                                               comunidad 
                                        WHERE  cuentacomunidad.id_cuenta_comunidad = registroparte.id_cuenta_comunidad AND
                                               banco.id_banco = cuentacomunidad.id_asociativo_banco AND
                                               comunidad.id_comunidad = cuentacomunidad.id_comunidad");

  $id_registro_parte = array();
  $nombre_comunidad = array();
  $concepto = array();
  $importe = array();
  $id_asociativo_banco = array();
  $grupo1 = array();
  $grupo2 = array();
  $grupo3 = array();
  $grupo4 = array();
  $piso = array();
  $nombre_banco = array();
  $fecha = array();
  $datos = array(
    'id_registro_parte' => $id_registro_parte,
    'nombre_comunidad' => $nombre_comunidad,
    'concepto' => $concepto,
    'importe' => $importe,
    'id_asociativo_banco' => $id_asociativo_banco,
    'grupo1' => $grupo1,
    'grupo2' => $grupo2,
    'grupo3' => $grupo3,
    'grupo4' => $grupo4,
    'piso' => $piso,
    'nombre_banco' => $nombre_banco,
    'fecha' => $fecha
  );
  // RECORRE EL RESULTADO Y LO GUARDA EN UN ARRAY
  while ($resultado = mysqli_fetch_array($registros))  
  {
    array_push($datos['id_registro_parte'], $resultado['id_registro_parte']);
    array_push($datos['nombre_comunidad'], $resultado['nombre_comunidad']);
    array_push($datos['concepto'], $resultado['concepto']);
    array_push($datos['importe'], $resultado['importe']);
    array_push($datos['id_asociativo_banco'], $resultado['id_asociativo_banco']);
    array_push($datos['grupo1'], $resultado['grupo1']);
    array_push($datos['grupo2'], $resultado['grupo2']);
    array_push($datos['grupo3'], $resultado['grupo3']);
    array_push($datos['grupo4'], $resultado['grupo4']);
    array_push($datos['piso'], $resultado['piso']);
    array_push($datos['nombre_banco'], $resultado['nombre_banco']);
    array_push($datos['fecha'], $resultado['fecha']);
  }
  
  $json = json_encode($datos); // GENERA EL JSON CON LOS DATOS OBTENIDOS
  
  echo $json; // MUESTRA EL JSON GENERADO
  
  header('Content-Type: application/json');
?>
