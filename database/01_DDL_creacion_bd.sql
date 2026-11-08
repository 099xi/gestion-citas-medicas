-- =========================================================================
-- Evidencia 2: Implementación y manipulación de la base de datos
-- Código: GA6-220501096-AA2-EV01 | RAP: 220501096-02
-- Proyecto: Sistema de Gestión de Citas Médicas
-- Aprendiz: Leonardo José Madera Buelvas
-- Programa: Tecnología en Análisis y Desarrollo de Software (ADSO)
-- Ficha: 3336056
-- Script 01 de 5: DDL - Creación de la base de datos, tablas y restricciones
-- -------------------------------------------------------------------------
-- Bitácora de cambios:
--   27/09/2026: Se corrige el CHECK chk_fecha_nacimiento: MySQL 8.0 no permite
--               funciones no deterministas (CURDATE()) dentro de CHECK
--               (ERROR 3814). Se reemplaza por un rango determinista y la
--               regla de negocio "la fecha de nacimiento no puede ser futura"
--               se traslada al trigger trg_pacientes_fecha_ins/udp.
-- =========================================================================

DROP DATABASE IF EXISTS gestion_citas_medicas;

CREATE DATABASE gestion_citas_medicas
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gestion_citas_medicas;

-- -------------------------------------------------------------------------
-- Tabla: especialidades
-- -------------------------------------------------------------------------
CREATE TABLE especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(80)  NOT NULL UNIQUE,
    descripcion     VARCHAR(255)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Tabla: medicos
-- -------------------------------------------------------------------------
CREATE TABLE medicos (
    id_medico       INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(60)  NOT NULL,
    apellido        VARCHAR(60)  NOT NULL,
    documento       VARCHAR(20)  NOT NULL UNIQUE,
    telefono        VARCHAR(20),
    correo          VARCHAR(100) UNIQUE,
    id_especialidad INT NOT NULL,
    estado          ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medico_especialidad
        FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Tabla: pacientes
-- -------------------------------------------------------------------------
CREATE TABLE pacientes (
    id_paciente      INT AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(60)  NOT NULL,
    apellido         VARCHAR(60)  NOT NULL,
    documento        VARCHAR(20)  NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    telefono         VARCHAR(20),
    correo           VARCHAR(100) UNIQUE,
    direccion        VARCHAR(150),
    fecha_registro   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Integridad de dominio: rango determinista (CHECK no acepta CURDATE())
    CONSTRAINT chk_fecha_nacimiento
        CHECK (fecha_nacimiento >= '1900-01-01' AND fecha_nacimiento < '2100-01-01')
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Triggers: regla de negocio "fecha de nacimiento no futura"
-- (El CHECK no puede usar CURDATE(); el trigger sí)
-- Nota: DELIMITER funciona en mysql CLI y en Workbench.
-- -------------------------------------------------------------------------
DELIMITER //
CREATE TRIGGER trg_pacientes_fecha_ins
BEFORE INSERT ON pacientes
FOR EACH ROW
BEGIN
    IF NEW.fecha_nacimiento > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Integridad de dominio: la fecha de nacimiento no puede ser futura';
    END IF;
END//

CREATE TRIGGER trg_pacientes_fecha_upd
BEFORE UPDATE ON pacientes
FOR EACH ROW
BEGIN
    IF NEW.fecha_nacimiento > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Integridad de dominio: la fecha de nacimiento no puede ser futura';
    END IF;
END//
DELIMITER ;

-- -------------------------------------------------------------------------
-- Tabla: consultorios
-- -------------------------------------------------------------------------
CREATE TABLE consultorios (
    id_consultorio INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(60)  NOT NULL,
    ubicacion      VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Tabla: citas
-- -------------------------------------------------------------------------
CREATE TABLE citas (
    id_cita        INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente    INT NOT NULL,
    id_medico      INT NOT NULL,
    id_consultorio INT NOT NULL,
    fecha          DATE NOT NULL,
    hora_inicio    TIME NOT NULL,
    hora_fin       TIME NOT NULL,
    motivo         VARCHAR(200) NOT NULL,
    estado         ENUM('Programada','Confirmada','Cancelada','Atendida') NOT NULL DEFAULT 'Programada',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cita_paciente
        FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cita_medico
        FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cita_consultorio
        FOREIGN KEY (id_consultorio) REFERENCES consultorios(id_consultorio)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    -- Integridad de dominio: la hora de fin debe ser posterior a la de inicio
    CONSTRAINT chk_horas CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Tabla: historial_citas (auditoría de cambios de estado de una cita)
-- -------------------------------------------------------------------------
CREATE TABLE historial_citas (
    id_historial    INT AUTO_INCREMENT PRIMARY KEY,
    id_cita         INT NOT NULL,
    estado_anterior VARCHAR(20) NOT NULL,
    estado_nuevo    VARCHAR(20) NOT NULL,
    observacion     VARCHAR(200),
    fecha_cambio    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_cita
        FOREIGN KEY (id_cita) REFERENCES citas(id_cita)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Índices adicionales para consultas frecuentes
-- -------------------------------------------------------------------------
CREATE INDEX idx_citas_fecha          ON citas(fecha);
CREATE INDEX idx_citas_estado         ON citas(estado);
CREATE INDEX idx_medicos_especialidad ON medicos(id_especialidad);

-- -------------------------------------------------------------------------
-- Verificación de la ejecución (evidencia para los criterios 1 y 2)
-- -------------------------------------------------------------------------
SHOW TABLES;

-- Demuestra que todas las tablas usan el motor InnoDB (soporte de FK)
SELECT TABLE_NAME, ENGINE
FROM   information_schema.TABLES
WHERE  TABLE_SCHEMA = 'gestion_citas_medicas'
ORDER  BY TABLE_NAME;