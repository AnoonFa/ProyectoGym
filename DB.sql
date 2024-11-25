drop database ProyectoGym;
create database ProyectoGym;
use ProyectoGym;

-- Tabla admin
CREATE TABLE admin (
    id INT PRIMARY KEY auto_increment not null,
    usuario VARCHAR(30),
    password VARCHAR(40),
    cargo VARCHAR(5),
    correo VARCHAR(30)
);

-- Tabla employee
CREATE TABLE employee (
    id INT PRIMARY KEY auto_increment not null,
    name VARCHAR(40),
    usuario VARCHAR(40),
    password VARCHAR(40),
    cargo VARCHAR(8),
    correo VARCHAR(30),
    habilitado BOOLEAN,
    createdBy Int,
    foreign key (createdBy) references admin (id)
);

-- Tabla client
CREATE TABLE client (
    id INT PRIMARY KEY auto_increment not null,
    nombre VARCHAR(20),
    apellido VARCHAR(20),
    tipoDocumento VARCHAR(3),
    numeroDocumento VARCHAR(20),
    sexo VARCHAR(10),
    tipoCuerpo VARCHAR(20),
    peso INT,
    altura INT,
    usuario VARCHAR(40),
    password VARCHAR(40),
    correo VARCHAR(40),
    telefono VARCHAR(10),
    rutinas longtext,
    tickets INT,
    fechaCreacion DATE,
    horaCreacion TIME,
    habilitado BOOLEAN
);

-- Tabla planes
CREATE TABLE planes (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    duration VARCHAR(50),
    image VARCHAR(255)
);

-- Tabla clases
CREATE TABLE clases (
    id VARCHAR(10) PRIMARY KEY not null,
    nombre VARCHAR(20),
    entrenador VARCHAR(20),
    startTime TIME,
    endTime TIME,
    descripcion TEXT,
    totalCupos INT,
    cuposDisponibles INT,
    fecha DATE,
    precio DECIMAL(10, 2),
    day DATE	
);

-- Tabla ticketera
CREATE TABLE ticketera (
    id VARCHAR(10) PRIMARY KEY not null,
    clientId INT,
    nombre VARCHAR(40),
    quantity INT,
    totalPrice DECIMAL(10, 2),
    date DATE,
    time TIME,
    status VARCHAR(30),
    FOREIGN KEY (clientId) REFERENCES client (id)
);

-- Tabla productos
CREATE TABLE productos (
    id int auto_increment PRIMARY KEY not null,
    name VARCHAR(30),
    description TEXT,
    price DECIMAL(10, 2),
    image longtext,
    category VARCHAR(25),
    createdBy Int,
    foreign key (createdBy) references admin (id)
);

CREATE TABLE inscripciones (
    id INT PRIMARY KEY auto_increment not null,
    clientId INT,
    claseId VARCHAR(10),
    fechaInscripcion DATETIME,
    estadoPago VARCHAR(30),
    FOREIGN KEY (clientId) REFERENCES client(id),
    FOREIGN KEY (claseId) REFERENCES clases(id)
);

select * from client;
select * from admin;
select * from employee;
select * from ticketera;
select * from clases;
select * from inscripciones;	
select * from planes;
select * from productos;

SET SQL_SAFE_UPDATES = 0;

INSERT INTO admin (id, usuario, password, cargo, correo) VALUES
(1, 'Juan', 'Soyadmin1234*', 'admin', 'admins1@gmail.com'),
(2, 'admin1234', 'Soyadmin1234*', 'admin', 'admins2@gmail.com'),
(3, 'Carlos', 'Soyadmin1234*', 'admin', 'admins3@gmail.com');

INSERT INTO employee (id, name, usuario, password, cargo, correo, habilitado) VALUES
(1, 'Daniel Lopez', 'Daniel', 'Soyempleado1234*', 'employee', 'admins3@gmail.com', 1),
(2, 'Carolina Rodriguez', 'Carolina', 'Soyempleado1234*', 'employee', NULL, 1);