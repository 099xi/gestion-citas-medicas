-- =========================================================================
-- Evidencia 2: Implementación y manipulación de la base de datos
-- Código: GA6-220501096-AA2-EV01 | RAP: 220501096-02
-- Proyecto: Sistema de Gestión de Citas Médicas
-- Aprendiz: Leonardo José Madera Buelvas
-- Programa: Tecnología en Análisis y Desarrollo de Software (ADSO)
-- Ficha: 3336056
-- Script 02 de 5: DML - Inserción de datos de prueba representativos
-- -------------------------------------------------------------------------
-- Prerrequisito: ejecutar DESPUÉS de 01_DDL_creacion_bd.sql (recrea la BD vacía).
-- Si necesitas repetir este script, vuelve a correr el Script 01 antes,
-- para evitar duplicados en claves UNIQUE (documento, correo, nombre).
-- -------------------------------------------------------------------------
-- Bitácora de cambios:
--   27/09/2026 Revisión y mejoras:
--     a) Corregido COUNT() -> COUNT(*) en la verificación final (error 1064).
--     b) Fechas de citas relativas (CURDATE() ± INTERVAL): reproducibles y
--        semanticamente coherentes (atendidas/canceladas en pasado,
--        programadas/confirmadas en presente/futuro).
--     c) Médico con estado 'Inactivo' (ENUM explícito) y cita pasada atendida
--        con él; el primer INSERT omite estado a propósito para evidenciar
--        el DEFAULT 'Activo'.
--     d) Paciente menor con correo NULL: columna anulable y UNIQUE con NULL.
--     e) Historial con pasos intermedios congruentes con el estado final.
-- =========================================================================

USE gestion_citas_medicas;

-- -------------------------------------------------------------------------
-- Tabla: especialidades (5 registros)
-- Restricción UNIQUE sobre nombre: sin especialidades duplicadas.
-- -------------------------------------------------------------------------
INSERT INTO especialidades (nombre, descripcion) VALUES
('Medicina General', 'Atención primaria y valoración inicial del paciente'),
('Pediatría',        'Atención médica para niños y adolescentes'),
('Cardiología',      'Diagnóstico y tratamiento de enfermedades del corazón'),
('Dermatología',     'Diagnóstico y tratamiento de enfermedades de la piel'),
('Ginecología',      'Salud del sistema reproductor femenino');

-- -------------------------------------------------------------------------
-- Tabla: consultorios (3 registros)
-- -------------------------------------------------------------------------
INSERT INTO consultorios (nombre, ubicacion) VALUES
('Consultorio 101', 'Piso 1 - Torre A'),
('Consultorio 102', 'Piso 1 - Torre A'),
('Consultorio 201', 'Piso 2 - Torre B');

-- -------------------------------------------------------------------------
-- Tabla: medicos (5 + 1 registros)
-- El primer INSERT omite `estado` a propósito: aplica DEFAULT 'Activo'
-- (evidencia de valores por defecto, criterio 2).
-- El segundo fija estado='Inactivo' de forma explícita (dominio ENUM).
-- FK: id_especialidad referencia especialidades (ids 1..5).
-- -------------------------------------------------------------------------
INSERT INTO medicos (nombre, apellido, documento, telefono, correo, id_especialidad) VALUES
('Carlos',  'Ramírez', '10001001', '3001110001', 'carlos.ramirez@clinica.com', 1),
('Laura',   'Gómez',   '10001002', '3001110002', 'laura.gomez@clinica.com',    2),
('Andrés',  'Pérez',   '10001003', '3001110003', 'andres.perez@clinica.com',   3),
('Marcela', 'Torres',  '10001004', '3001110004', 'marcela.torres@clinica.com', 4),
('Diana',   'Suárez',  '10001005', '3001110005', 'diana.suarez@clinica.com',   5);

INSERT INTO medicos (nombre, apellido, documento, telefono, correo, id_especialidad, estado) VALUES
('Ernesto', 'Castillo', '10001006', '3001110006', 'ernesto.castillo@clinica.com', 1, 'Inactivo');

-- -------------------------------------------------------------------------
-- Tabla: pacientes (8 registros)
-- Integridad de dominio: fechas de nacimiento pasadas (no disparan el
-- trigger trg_pacientes_fecha_ins ni violan chk_fecha_nacimiento).
-- El menor Pedro tiene correo NULL: columna anulable + UNIQUE acepta NULL.
-- -------------------------------------------------------------------------
INSERT INTO pacientes (nombre, apellido, documento, fecha_nacimiento, telefono, correo, direccion) VALUES
('Juan',      'Martínez',  '20001001', '1990-05-14', '3102220001', 'juan.martinez@correo.com',   'Cra 10 #20-30'),
('María',     'López',     '20001002', '1985-11-02', '3102220002', 'maria.lopez@correo.com',     'Cll 15 #8-22'),
('Pedro',     'Rodríguez', '20001003', '2015-03-21', '3102220003', NULL,                          'Cra 5 #12-10'),
('Sofía',     'Hernández', '20001004', '1998-07-09', '3102220004', 'sofia.hernandez@correo.com', 'Cll 30 #4-55'),
('Camilo',    'Vargas',    '20001005', '1975-01-30', '3102220005', 'camilo.vargas@correo.com',   'Cra 18 #9-40'),
('Valentina', 'Ríos',      '20001006', '2002-09-17', '3102220006', 'valentina.rios@correo.com',  'Cll 22 #6-15'),
('Andrés',    'Moreno',    '20001007', '1992-12-25', '3102220007', 'andres.moreno@correo.com',   'Cra 7 #14-60'),
('Isabel',    'Castro',    '20001008', '1988-04-05', '3102220008', 'isabel.castro@correo.com',   'Cll 40 #2-18');

-- -------------------------------------------------------------------------
-- Tabla: citas (11 registros)
-- Integridad de dominio: hora_fin > hora_inicio (CHECK chk_horas).
-- Integridad referencial: id_paciente (1..8), id_medico (1..6) y
-- id_consultorio (1..3) existen en sus tablas padre.
-- Fechas relativas: atendidas/canceladas en pasado, confirmadas/programadas
-- en presente/futuro → coherencia semántica y script reproducible.
-- -------------------------------------------------------------------------
INSERT INTO citas (id_paciente, id_medico, id_consultorio, fecha, hora_inicio, hora_fin, motivo, estado) VALUES
-- Pasadas (ya atendidas o canceladas)
(5, 1, 1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), '08:30:00', '09:00:00', 'Dolor lumbar',               'Atendida'),
(7, 3, 3, DATE_SUB(CURDATE(), INTERVAL 5 DAY),  '15:00:00', '15:30:00', 'Dolor en el pecho',          'Cancelada'),
(3, 6, 2, DATE_SUB(CURDATE(), INTERVAL 20 DAY), '10:00:00', '10:30:00', 'Consulta general de rutina', 'Atendida'),
-- Hoy
(1, 1, 1, CURDATE(),                            '08:00:00', '08:30:00', 'Consulta general de rutina', 'Confirmada'),
-- Futuras
(3, 2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY),  '10:00:00', '10:30:00', 'Control de crecimiento',     'Confirmada'),
(8, 1, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY),  '16:00:00', '16:30:00', 'Consulta general',           'Confirmada'),
(2, 3, 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY),  '09:00:00', '09:30:00', 'Chequeo cardiológico',       'Programada'),
(4, 5, 1, DATE_ADD(CURDATE(), INTERVAL 4 DAY),  '11:00:00', '11:30:00', 'Valoración ginecológica',    'Programada'),
(6, 4, 2, DATE_ADD(CURDATE(), INTERVAL 6 DAY),  '14:00:00', '14:30:00', 'Revisión de lunar',          'Programada'),
(1, 4, 2, DATE_ADD(CURDATE(), INTERVAL 7 DAY),  '08:00:00', '08:30:00', 'Consulta dermatológica',     'Programada'),
(2, 1, 1, DATE_ADD(CURDATE(), INTERVAL 8 DAY),  '09:30:00', '10:00:00', 'Seguimiento tratamiento',    'Programada');

-- -------------------------------------------------------------------------
-- Tabla: historial_citas (7 registros)
-- Auditoría con transiciones congruentes con el estado FINAL de cada cita.
-- -------------------------------------------------------------------------
INSERT INTO historial_citas (id_cita, estado_anterior, estado_nuevo, observacion) VALUES
(1, 'Programada', 'Confirmada', 'Paciente confirmó por teléfono'),
(1, 'Confirmada', 'Atendida',   'Consulta realizada sin novedades'),
(2, 'Programada', 'Cancelada',  'Paciente canceló por motivos personales'),
(3, 'Programada', 'Confirmada', 'Confirmación en recepción'),
(3, 'Confirmada', 'Atendida',   'Atendido antes de la inactivación del médico'),
(4, 'Programada', 'Confirmada', 'Paciente confirmó por teléfono'),
(5, 'Programada', 'Confirmada', 'Confirmación vía correo');

-- -------------------------------------------------------------------------
-- Verificación de la carga (evidencia del criterio 3)
-- Resultado esperado: 5, 3, 6, 8, 11, 7
-- -------------------------------------------------------------------------
SELECT 'especialidades'  AS tabla, COUNT(*) AS registros FROM especialidades
UNION ALL SELECT 'consultorios',    COUNT(*) FROM consultorios
UNION ALL SELECT 'medicos',         COUNT(*) FROM medicos
UNION ALL SELECT 'pacientes',       COUNT(*) FROM pacientes
UNION ALL SELECT 'citas',           COUNT(*) FROM citas
UNION ALL SELECT 'historial_citas', COUNT(*) FROM historial_citas;
