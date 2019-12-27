/* Eliminamos las tablas si existen primero por orden de prioridad si tienen foreign key */
drop table if exists registroparte;
drop table if exists cuentacomunidad;
drop table if exists comunidad;
drop table if exists banco;

/* Añadimos las tablas con todas sus columnas */
create table if not exists banco(
    `id_banco` int(4) not null primary key auto_increment
  , `nombre_banco` varchar(200) not null
  , `id_asociativo_banco` varchar(4) not null
) Engine=Innodb CHARSET=UTF8;


create table if not exists comunidad(
    `id_comunidad` int(4) not null primary key auto_increment
  , `nombre` varchar(200) not null
) Engine=Innodb CHARSET=UTF8;


create table if not exists cuentacomunidad (
    `id_cuenta_comunidad` int(4) not null primary key auto_increment
  , `id_asociativo_banco` int(4) not null
  , `grupo1` varchar(4) not null
  , `grupo2` varchar(4) not null
  , `grupo3` varchar(4) not null
  , `grupo4` varchar(4) not null
  , `id_comunidad` int(4) not null
)Engine=Innodb CHARSET=UTF8;
ALTER TABLE cuentacomunidad ADD FOREIGN KEY (`id_asociativo_banco`) REFERENCES banco(`id_banco`);
ALTER TABLE cuentacomunidad ADD FOREIGN KEY (`id_comunidad`) REFERENCES comunidad(`id_comunidad`);


create table if not exists registroparte (
    `id_concepto` int(4) not null primary key auto_increment
  , `concepto` varchar(200) not null
  , `importe` decimal(8,2) not null
  , `piso` varchar(60)
  , `fecha` date not null default current_Date
  , `id_cuenta_comunidad` int(4) not null
)Engine=Innodb CHARSET=UTF8;
ALTER TABLE registroparte ADD FOREIGN KEY (`id_cuenta_comunidad`) REFERENCES cuentacomunidad(`id_cuenta_comunidad`);