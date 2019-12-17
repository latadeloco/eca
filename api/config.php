<?php
// DATOS DE CONEXION A LA BASE DE DATOS
function conexion() {
  $conexion = mysqli_connect("localhost", "root", "", "euroCaja");
  
  return $conexion;
}
?>