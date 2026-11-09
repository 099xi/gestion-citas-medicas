-- =========================================================================
-- Evidencia 2: Implementación y manipulación de la base de datos
-- Código: GA6-220501096-AA2-EV01 | RAP: 220501096-02
-- Proyecto: Sistema de Gestión de Citas Médicas
-- Aprendiz: Leonardo José Madera Buelvas
-- Programa: Tecnología en Análisis y Desarrollo de Software (ADSO)
-- Ficha: 3336056
-- Script 04 de 5: DML - UPDATE y DELETE verificando restricciones
-- -------------------------------------------------------------------------
-- MODO DE EJECUCIÓN (definitivo): desde CMD, dentro del mysql CLI:
--   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
--   mysql> source C:/proyect from hero/04_actualizaciones_eliminaciones.sql
-- La CLI de mysql CONTINÚA después de cada error y los imprime todos:
-- así corren todos los bloques y los 4 errores esperados en una pasada.
-- (En VS Code el lote se detiene en el primer error: por eso antes quedaban
--  tramos sin ejecutar y estados a medias.)
-- PROPIEDADES:
--   * Auto-reparable: la sección 0 limpia residuos de corridas anteriores
--     (paciente de prueba olvidado y transiciones duplicadas de auditoría).
--   * Idempotente: puede re-ejecutarse N veces sin corromper el estado
--     (guard DELETE-antes-INSERT en toda auditoría; UPDATE/DELETE ya lo eran).
--   * Los bloques [FALLA ESPERADA] DEBEN dar error: es la evidencia de que
--     las restricciones actúan (criterio 4).
-- Bitácora de cambios:
--   27/09/2026 Versión final (v4):
--     a-f) Ajustes de la v2 (re-apuntado de U1/D1, fechas relativas,
--          D4 ejecutable, errores esperados, encabezado oficial).
--     g) Guards idempotentes en D4 (paciente de prueba).
--     h) Sección QA final de residuos y duplicados.
--     i) Guards idempotentes en la auditoría de U1 y U2.
--     j) Sección 0 de AUTO-REPARACIÓN del estado: resuelve de raíz el
--        conteo fantasma de historial (10) y cualquier residuo previo.
--     k) Modo de ejecución documentado (mysql CLI) para corrida completa.
-- =========================================================================

USE gestion_citas_medicas;

-- -------------------------------------------------------------------------
-- 0. AUTO-REPARACIÓN del estado (segura: si no hay residuos, no hace nada)
-- -------------------------------------------------------------------------
-- 0.1 Elimina paciente de prueba olvidado en corridas interrumpidas
DELETE FROM pacientes WHERE documento = '20999991';

-- 0.2 Elimina transiciones de auditoría duplicadas conservando la primera
DELETE h FROM historial_citas h
JOIN (
    SELECT id_cita, estado_anterior, estado_nuevo, MIN(id_historial) AS mantener
    FROM historial_citas
    GROUP BY id_cita, estado_anterior, estado_nuevo
    HAVING COUNT(*) > 1
) d
  ON  h.id_cita         = d.id_cita
  AND h.estado_anterior = d.estado_anterior
  AND h.estado_nuevo    = d.estado_nuevo
  AND h.id_historial   <> d.mantener;

-- -------------------------------------------------------------------------
-- Foto del ANTES (para comparar con el DESPUÉS en las capturas)
-- -------------------------------------------------------------------------
SELECT id_cita, fecha, hora_inicio, hora_fin, estado
FROM citas WHERE id_cita IN (2, 4, 7, 9, 10, 11) ORDER BY id_cita;

-- -------------------------------------------------------------------------
-- U1: Recepción confirma una cita realmente Programada (la 7) + auditoría
-- Guard idempotente: si la transición ya existe, se reemplaza, no se duplica
-- -------------------------------------------------------------------------
UPDATE citas SET estado = 'Confirmada' WHERE id_cita = 7;
DELETE FROM historial_citas
WHERE id_cita = 7 AND estado_anterior = 'Programada' AND estado_nuevo = 'Confirmada';
INSERT INTO historial_citas (id_cita, estado_anterior, estado_nuevo, observacion)
VALUES (7, 'Programada', 'Confirmada', 'Paciente confirmó asistencia telefónicamente');
SELECT id_cita, estado FROM citas WHERE id_cita = 7;          -- esperado: Confirmada

-- -------------------------------------------------------------------------
-- U2: La cita de hoy (4) pasa a Atendida al finalizar la consulta + auditoría
-- -------------------------------------------------------------------------
UPDATE citas SET estado = 'Atendida' WHERE id_cita = 4 AND fecha = CURDATE();
DELETE FROM historial_citas
WHERE id_cita = 4 AND estado_anterior = 'Confirmada' AND estado_nuevo = 'Atendida';
INSERT INTO historial_citas (id_cita, estado_anterior, estado_nuevo, observacion)
VALUES (4, 'Confirmada', 'Atendida', 'Consulta realizada sin novedades');
SELECT id_cita, estado FROM citas WHERE id_cita = 4;          -- esperado: Atendida

-- -------------------------------------------------------------------------
-- U3: Reprogramación de fecha y hora (fecha relativa, no dura)
-- -------------------------------------------------------------------------
UPDATE citas
SET fecha       = DATE_ADD(CURDATE(), INTERVAL 9 DAY),
    hora_inicio = '09:00:00',
    hora_fin    = '09:30:00'
WHERE id_cita = 9;
SELECT id_cita, fecha, hora_inicio, hora_fin FROM citas WHERE id_cita = 9;

-- -------------------------------------------------------------------------
-- U4: Completar un dato que era NULL (el menor recibe correo del colegio)
-- -------------------------------------------------------------------------
UPDATE pacientes
SET correo = 'pedro.rodriguez@colegio.edu.co'
WHERE id_paciente = 3 AND correo IS NULL;
SELECT id_paciente, nombre, correo FROM pacientes WHERE id_paciente = 3;

-- -------------------------------------------------------------------------
-- U5 [FALLA ESPERADA]: viola CHECK chk_horas → error 3819 (capturar)
-- -------------------------------------------------------------------------
UPDATE citas SET hora_fin = '07:00:00' WHERE id_cita = 10;

-- -------------------------------------------------------------------------
-- U6 [FALLA ESPERADA]: valor fuera del ENUM → error 1265 (capturar)
-- -------------------------------------------------------------------------
UPDATE citas SET estado = 'Pendiente' WHERE id_cita = 11;

-- -------------------------------------------------------------------------
-- D1: Eliminación segura de la cita cancelada (2); su historial cae solo
-- por ON DELETE CASCADE → antes/después como evidencia
-- -------------------------------------------------------------------------
DELETE FROM citas WHERE id_cita = 2;
SELECT * FROM citas WHERE id_cita = 2;                          -- esperado: 0 filas
SELECT COUNT(*) AS historial_cita_2 FROM historial_citas WHERE id_cita = 2; -- esperado: 0

-- -------------------------------------------------------------------------
-- D2 [FALLA ESPERADA]: paciente con citas → FK RESTRICT → error 1451 (capturar)
-- -------------------------------------------------------------------------
DELETE FROM pacientes WHERE id_paciente = 1;

-- -------------------------------------------------------------------------
-- D3 [FALLA ESPERADA]: médico con citas → FK RESTRICT → error 1451 (capturar)
-- -------------------------------------------------------------------------
DELETE FROM medicos WHERE id_medico = 1;

-- -------------------------------------------------------------------------
-- D4: DELETE válido sobre paciente sin citas — PRUEBA IDEMPOTENTE:
-- guard inicial + crear + verificar + limpiar (re-ejecutable sin residuos)
-- -------------------------------------------------------------------------
DELETE FROM pacientes WHERE documento = '20999991';             -- guard: 0 o 1 filas
INSERT INTO pacientes (nombre, apellido, documento, fecha_nacimiento)
VALUES ('Prueba', 'Temporal', '20999991', '1995-01-01');
SELECT p.id_paciente, CONCAT(p.nombre, ' ', p.apellido) AS paciente
FROM pacientes p
LEFT JOIN citas c ON p.id_paciente = c.id_paciente
WHERE c.id_cita IS NULL;                                        -- esperado: 1 fila
DELETE FROM pacientes WHERE documento = '20999991';
SELECT COUNT(*) AS paciente_temporal FROM pacientes WHERE documento = '20999991'; -- esperado: 0

-- -------------------------------------------------------------------------
-- Foto del DESPUÉS + conteos finales
-- Esperado: especialidades 5 · consultorios 3 · medicos 6 ·
--           pacientes 8 · citas 10 · historial_citas 8
-- -------------------------------------------------------------------------
SELECT id_cita, fecha, hora_inicio, hora_fin, estado
FROM citas WHERE id_cita IN (4, 7, 9, 10, 11) ORDER BY id_cita;

SELECT 'especialidades'  AS tabla, COUNT(*) AS registros FROM especialidades
UNION ALL SELECT 'consultorios',    COUNT(*) FROM consultorios
UNION ALL SELECT 'medicos',         COUNT(*) FROM medicos
UNION ALL SELECT 'pacientes',       COUNT(*) FROM pacientes
UNION ALL SELECT 'citas',           COUNT(*) FROM citas
UNION ALL SELECT 'historial_citas', COUNT(*) FROM historial_citas;

-- -------------------------------------------------------------------------
-- QA final (control de calidad del estado): ambas deben dar 0 filas
-- -------------------------------------------------------------------------
SELECT * FROM pacientes WHERE documento = '20999991';           -- sin residuos de prueba
SELECT id_cita, estado_anterior, estado_nuevo, COUNT(*) AS repeticiones
FROM historial_citas
GROUP BY id_cita, estado_anterior, estado_nuevo
HAVING COUNT(*) > 1;                                            -- sin auditoría duplicada