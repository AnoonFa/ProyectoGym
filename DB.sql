drop database ProyectoGym;
create database ProyectoGym;
use ProyectoGym;

-- Tabla admin
CREATE TABLE admin (
    id INT PRIMARY KEY auto_increment not null,
    usuario VARCHAR(255),
    password VARCHAR(255),
    cargo VARCHAR(50),
    correo VARCHAR(255)
);

-- Tabla employee
CREATE TABLE employee (
    id INT PRIMARY KEY auto_increment not null,
    name VARCHAR(255),
    usuario VARCHAR(255),
    password VARCHAR(255),
    cargo VARCHAR(50),
    correo VARCHAR(255)
);

-- Tabla client
CREATE TABLE client (
    id INT PRIMARY KEY auto_increment not null,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    tipoDocumento VARCHAR(10),
    numeroDocumento VARCHAR(20),
    sexo VARCHAR(10),
    tipoCuerpo VARCHAR(50),
    peso INT,
    altura INT,
    usuario VARCHAR(255),
    password VARCHAR(255),
    correo VARCHAR(255),
    telefono VARCHAR(20),
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
    nombre VARCHAR(255),
    entrenador VARCHAR(255),
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
    nombre VARCHAR(255),
    quantity INT,
    totalPrice DECIMAL(10, 2),
    date DATE,
    time TIME,
    status VARCHAR(50),
    FOREIGN KEY (clientId) REFERENCES client(id)
);

-- Tabla productos
CREATE TABLE 
productos (
    id VARCHAR(10) PRIMARY KEY not null,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    image VARCHAR(255),
    category VARCHAR(255)
);

select * from client;

INSERT INTO client (
    id, nombre, apellido, tipoDocumento, numeroDocumento, sexo, peso, altura, usuario, password, correo, telefono,  tickets, fechaCreacion, horaCreacion, habilitado
) VALUES
(
    1, 'Esteban', 'Piñeros', 'CC', '1029142018', 'Hombre', 20, 211, 'InsanoXD', 'Soyesteban1234*', 'estebanpineros43@gmail.com', '3196699831', 
    15, '2024-09-20', '10:00:00', TRUE
),
(
    2, 'Alejandro', 'Espinosa', 'TI', '1067948521', 'Hombre',  74, 123, 'ozuna', 'Soyesteban2111*', 'estebanpineros41@gmail.com', '3196699831', 
    5, '2024-09-01', '09:30:00', TRUE
),
(
    3, 'Sofia', 'Nazaret', 'TI', '1032555698', 'Mujer',  65, 168, 'Esteban', 'Soyesteban1234*', 'nanoespinosa13@gmail.com', '3146874784', 
    3, '2024-09-08', '10:00:00', FALSE
);


INSERT INTO employee (id, name, usuario, password, cargo, correo) VALUES
(1, 'Daniel Lopez', 'Daniel', 'Soyempleado1234*', 'employee', 'admins3@gmail.com'),
(2, 'Carolina Rodriguez', 'Carolina', 'Soyempleado1234*', 'employee', NULL);

