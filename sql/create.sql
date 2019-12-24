drop table if exists banco;
create table if not exists banco(
    `id_banco` int(4) not null primary key auto_increment
  , `nombre_banco` varchar(200) not null
  , `id_asociativo_banco` varchar(4) not null
) Engine=Innodb CHARSET=UTF8;

drop table if exists comunidad;
create table if not exists comunidad(
    `id_comunidad` int(4) not null primary key auto_increment
  , `nombre` varchar(200) not null
) Engine=Innodb CHARSET=UTF8;

drop table if exists cuentacomunidad;
create table if not exists cuentacomunidad (
    `id_cuenta_comunidad` int(4) not null primary key auto_increment
  , `id_asociativo_banco` int(4) not null
  , `grupo1` varchar(4) not null
  , `grupo2` varchar(4) not null
  , `grupo3` varchar(4) not null
  , `grupo4` varchar(4) not null
  , `id_comunidad` int(4) not null
)Engine=Innodb CHARSET=UTF8;
alter table cuentacomunidad add foreign key id_asociativo_banco references banco(id_banco);
alter table cuentacomunidad add foreign key id_comunidad references comunidad(id_comunidad);

drop table if exists concepto;
create table if not exists concepto (
    `id_concepto` int(4) not null primary key auto_increment
  , `concepto` varchar(200) not null
  , `importe` decimal(8,2) not null
  , `piso` varchar(60)
  , `fecha` date not null default current_Date
)Engine=Innodb CHARSET=UTF8;