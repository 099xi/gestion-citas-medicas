-- =========================================================================
-- Evidencia 2: Implementación y manipulación de la base de datos
-- Código: GA6-220501096-AA2-EV01 | RAP: 220501096-02
-- Proyecto: Sistema de Gestión de Citas Médicas
-- Aprendiz: Leonardo José Madera Buelvas
-- Programa: Tecnología en Análisis y Desarrollo de Software (ADSO)
-- Ficha: 3336056
-- Script 05 de 5: Validación de integridad referencial y de dominio
-- -------------------------------------------------------------------------
-- MODO DE EJECUCIÓN:
--   Opción A (recomendada): desde CMD con `source` para ver todos los
--     errores de corrido. La CLI de mysql continúa tras cada error.
--   Opción B: en VS Code, ejecuta cada prueba T1-T6 por separado
--     (selecciona el bloque → Run on active connection) y captura cada error.
-- Cada prueba INTENTA romper una regla; el error resultante ES la evidencia
-- de que la restricción actúa (criterios 2 y 4).
-- -------------------------------------------------------------------------
-- Bitácora de cambios:
--   27/09/2026 Revisión y mejoras:
--     a) Prueba 6 ajustada: en el DDL corregido, la fecha futura la bloquea
--        el trigger trg_pacientes_fecha_ins (error 1644), no un CHECK.
--     b) Prueba 5 convertida en DELETE ejecutable (autocontenida).
--     c) Agregada T7 (prueba de control) y conteos finales para demostrar
--        que el estado de la BD queda intacto tras los rechazos.
-- =========================================================================

USE gestion_citas_medicas;

-- -------------------------------------------------------------------------
-- T1 [FALLA ESPERADA 1062]: Integridad de entidad - UNIQUE
-- Intentar registrar un paciente con documento duplicado.
-- -------------------------------------------------------------------------
INSERT INTO pacientes (nombre, apellido, documento, fecha_nacimiento)
VALUES ('Prueba', 'Duplicado', '20001001', '2000-01-01');

-- -------------------------------------------------------------------------
-- T2 [FALLA ESPERADA 1364]: Integridad de dominio - NOT NULL
-- Intentar registrar un médico sin id_especialidad (no tiene default).
-- -------------------------------------------------------------------------
INSERT INTO medicos (nombre, apellido, documento, correo)
VALUES ('Sin', 'Especialidad', '10009999', 'sin.especialidad@clinica.com');

-- -------------------------------------------------------------------------
-- T3 [FALLA ESPERADA 3819]: Integridad de dominio - CHECK (chk_horas)
-- Hora de fin anterior a la hora de inicio.
-- -------------------------------------------------------------------------
INSERT INTO citas (id_paciente, id_medico, id_consultorio, fecha, hora_inicio, hora_fin, motivo)
VALUES (1, 1, 1, '2026-11-01', '10:00:00', '09:00:00', 'Prueba de horario inválido');

-- -------------------------------------------------------------------------
-- T4 [FALLA ESPERADA 1452]: Integridad referencial - FK inexistente
-- Cita con id_medico = 999 (no existe).
-- -------------------------------------------------------------------------
INSERT INTO citas (id_paciente, id_medico, id_consultorio, fecha, hora_inicio, hora_fin, motivo)
VALUES (1, 999, 1, '2026-11-01', '10:00:00', '10:30:00', 'Prueba de médico inexistente');

-- -------------------------------------------------------------------------
-- T5 [FALLA ESPERADA 1451]: Integridad referencial - RESTRICT en DELETE
-- Borrar un paciente que tiene citas asociadas.
-- -------------------------------------------------------------------------
DELETE FROM pacientes WHERE id_paciente = 1;

-- -------------------------------------------------------------------------
-- T6 [FALLA ESPERADA 1644]: Integridad de dominio - Trigger de negocio
-- Fecha de nacimiento futura. La bloquea trg_pacientes_fecha_ins.
-- -------------------------------------------------------------------------
INSERT INTO pacientes (nombre, apellido, documento, fecha_nacimiento)
VALUES ('Prueba', 'Futura', '20999999', '2099-01-01');

-- -------------------------------------------------------------------------
-- T7 [CONTROL - DEBE PASAR]: Operación válida para confirmar que el motor
-- sigue sano tras los rechazos. Inserta y borra en el mismo acto.
-- -------------------------------------------------------------------------
INSERT INTO citas (id_paciente, id_medico, id_consultorio, fecha, hora_inicio, hora_fin, motivo)
VALUES (6, 2, 2, '2026-12-31', '09:00:00', '09:30:00', 'Prueba válida de control');
DELETE FROM citas WHERE motivo = 'Prueba válida de control';

-- -------------------------------------------------------------------------
-- Conteos finales: deben ser IDÉNTICOS al cierre del Script 04
-- Esperado: especialidades 5 · consultorios 3 · medicos 6 ·
--           pacientes 8 · citas 10 · historial_citas 8
-- Esto demuestra que NINGUNA prueba fallida alteró el estado de la BD.
-- -------------------------------------------------------------------------
SELECT 'especialidades'  AS tabla, COUNT(*) AS registros FROM especialidades
UNION ALL SELECT 'consultorios',    COUNT(*) FROM consultorios
UNION ALL SELECT 'medicos',         COUNT(*) FROM medicos
UNION ALL SELECT 'pacientes',       COUNT(*) FROM pacientes
UNION ALL SELECT 'citas',           COUNT(*) FROM citas
UNION ALL SELECT 'historial_citas', COUNT(*) FROM historial_citas;