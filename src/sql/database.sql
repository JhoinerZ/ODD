CREATE DATABASE proyecto;

USE proyecto;

create table registro(

    id_usuario int not null primary key auto_increment,
    nombre varchar(250),
    usuario varchar(100),
    correo varchar(100),
    contraseña varchar(250),
    rol varchar(50)

);

create table registro_VE(

    idregistroventa int not null primary key auto_increment,
    fecha_compra date current_timestamp(),
    total_venta float,
    forma_pago varchar(50),
    fk_id_usuariocliente varchar(100)

);

create table deudores(

    id_deuda int not null primary key auto_increment,
    fk_id_usuario varchar(100),
    fk_id_registroventa varchar(100),
    fk_id_detalle varchar(100),
    saldo int not null,
    referencia varchar(100),
    t_referencia varchar(100)

);

create table control_agenda(

    id_dia int not null primary key auto_increment,
    dia varchar(100),
    mes varchar(100),
    año varchar(100)

);


create table productos(

     id_producto int not null primary key auto_increment,
     nombre varchar(250),
     valor int not null
);

create table registro_VD(

    id_registroventa_d int not null primary key auto_increment,
    fk_id_producto varchar(250),
    cantidad varchar(250),
    valor varchar(250)
);

create table config_s(

    id_servicio int not null primary key auto_increment,
    servicios varchar(150),
    tiempo_servicio varchar(50),
    valor int not null,
    descripcion varchar(300)

);

create table citas(

    id_cita int not null primary key auto_increment,
    nombre_cliente varchar(150),
    fecha_cita DATE,
    servicio  varchar(150),
    telefono varchar(20)

);

DESCRIBE registro_VE;

insert into registro_VE(total_venta, forma_pago, id_usuariocliente) values ("170000", "credito", "435");

select * from  registro_VE;

alter table registro_VE modify fecha_compra timestamp default current_timestamp;

alter table productos change valor valor int not null;
