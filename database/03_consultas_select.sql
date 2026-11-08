-- =========================================================================
-- Evidencia 2: Implementación y manipulación de la base de datos
-- Código: GA6-220501096-AA2-EV01 | RAP: 220501096-02
-- Proyecto: Sistema de Gestión de Citas Médicas
-- Aprendiz: Leonardo José Madera Buelvas
-- Programa: Tecnología en Análisis y Desarrollo de Software (ADSO)
-- Ficha: 3336056
-- Script 03 de 5: DML - Consultas SELECT con JOIN, filtros y ordenamientos
-- -------------------------------------------------------------------------
-- Prerrequisito: ejecutar después de 01 (DDL) y 02 (carga de datos).
-- Cada consulta responde a una necesidad real del sistema (criterio 4).
-- Ejecutar consulta por consulta y capturar cada rejilla de resultados.
-- -------------------------------------------------------------------------
-- Bitácora de cambios:
--   27/09/2026 Revisión y mejoras:
--     a) Fechas duras de la Consulta 2 reemplazadas por rango relativo
--        (CURDATE() + INTERVAL): reproducible y no envejece.
--     b) Consulta 3 coherente con su comentario: cuenta solo citas
--        'Atendida'; la condición va en el ON del LEFT JOIN para
--        conservar los médicos con 0 atendidas.
--     c) Consulta 5 con JOIN a citas y pacientes para contexto; apunta a
--        la cita 1 (la que tiene dos transiciones en el historial).
--     d) Nueva Consulta 6: ranking de pacientes frecuentes (HAVING).
--     e) Encabezado oficial y resultados esperados por consulta.
-- =========================================================================

USE gestion_citas_medicas;

-- -------------------------------------------------------------------------
-- Consulta 1: Agenda completa de citas con todo el contexto
-- Necesidad: recepción necesita el listado general con paciente, médico,
-- especialidad y consultorio (INNER JOIN de 5 tablas).
-- Resultado esperado: 11 filas, de la más antigua a la más futura.
-- -------------------------------------------------------------------------
SELECT c.id_cita,
       c.fecha,
       c.hora_inicio,
       c.hora_fin,
       CONCAT(p.nombre, ' ', p.apellido) AS paciente,
       CONCAT(m.nombre, ' ', m.apellido) AS medico,
       e.nombre                          AS especialidad,
       co.nombre                         AS consultorio,
       c.estado
FROM citas c
INNER JOIN pacientes p      ON c.id_paciente     = p.id_paciente
INNER JOIN medicos m        ON c.id_medico       = m.id_medico
INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
INNER JOIN consultorios co  ON c.id_consultorio  = co.id_consultorio
ORDER BY c.fecha ASC, c.hora_inicio ASC;

-- -------------------------------------------------------------------------
-- Consulta 2: Citas programadas en los próximos 7 días
-- Necesidad: agenda semanal de recepción (filtro por estado + rango de
-- fechas relativo a hoy + orden cronológico).
-- Resultado esperado: 4 filas (citas 7, 8, 9 y 10).
-- -------------------------------------------------------------------------
SELECT c.id_cita,
       CONCAT(p.nombre, ' ', p.apellido) AS paciente,
       c.fecha,
       c.hora_inicio,
       c.estado
FROM citas c
INNER JOIN pacientes p ON c.id_paciente = p.id_paciente
WHERE c.estado = 'Programada'
  AND c.fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY c.fecha, c.hora_inicio;

-- -------------------------------------------------------------------------
-- Consulta 3: Citas ATENDIDAS por médico (agregación + LEFT JOIN)
-- Necesidad: indicador de productividad médica.
-- OJO al truco: la condición de estado va en el ON del LEFT JOIN (no en el
-- WHERE) para que los médicos sin citas atendidas aparezcan con 0.
-- Resultado esperado: 6 filas → Carlos Ramírez 1, Ernesto Castillo 1,
--                     y cuatro médicos con 0.
-- -------------------------------------------------------------------------
SELECT CONCAT(m.nombre, ' ', m.apellido) AS medico,
       e.nombre                          AS especialidad,
       m.estado,
       COUNT(c.id_cita)                  AS citas_atendidas
FROM medicos m
INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
LEFT JOIN citas c           ON c.id_medico = m.id_medico
                           AND c.estado = 'Atendida'
GROUP BY m.id_medico, m.nombre, m.apellido, e.nombre, m.estado
ORDER BY citas_atendidas DESC, medico;

-- -------------------------------------------------------------------------
-- Consulta 4: Pacientes sin ninguna cita registrada
-- Necesidad: validar la regla de negocio "todo paciente debe tener al menos
-- una cita" (LEFT JOIN + filtro IS NULL).
-- Resultado esperado: 0 filas → el resultado VACÍO confirma que la carga
-- cumple la regla; si mañana se inserta un paciente sin citas, aparecerá aquí.
-- -------------------------------------------------------------------------
SELECT p.id_paciente,
       CONCAT(p.nombre, ' ', p.apellido) AS paciente,
       p.documento
FROM pacientes p
LEFT JOIN citas c ON p.id_paciente = c.id_paciente
WHERE c.id_cita IS NULL;

-- -------------------------------------------------------------------------
-- Consulta 5: Historial completo de una cita con contexto
-- Necesidad: auditoría de una cita puntual; la cita 1 tiene dos transiciones.
-- JOIN historial → citas → pacientes, en orden cronológico de cambio.
-- Resultado esperado: 2 filas (Programada→Confirmada y Confirmada→Atendida).
-- -------------------------------------------------------------------------
SELECT h.id_historial,
       c.id_cita,
       CONCAT(p.nombre, ' ', p.apellido) AS paciente,
       h.estado_anterior,
       h.estado_nuevo,
       h.observacion,
       h.fecha_cambio
FROM historial_citas h
INNER JOIN citas c     ON h.id_cita     = c.id_cita
INNER JOIN pacientes p ON c.id_paciente = p.id_paciente
WHERE h.id_cita = 1
ORDER BY h.id_historial;

-- -------------------------------------------------------------------------
-- Consulta 6: Ranking de pacientes frecuentes (2 o más citas)
-- Necesidad: identificar pacientes recurrentes para programas de seguimiento.
-- GROUP BY + HAVING (filtro sobre el agregado) + ORDER BY descendente.
-- Resultado esperado: 3 filas → Juan Martínez 3, María López 2, Pedro Rodríguez 2.
-- -------------------------------------------------------------------------
SELECT CONCAT(p.nombre, ' ', p.apellido) AS paciente,
       COUNT(c.id_cita) AS total_citas,
       MAX(c.fecha)     AS ultima_cita
FROM pacientes p
INNER JOIN citas c ON p.id_paciente = c.id_paciente
GROUP BY p.id_paciente, p.nombre, p.apellido
HAVING COUNT(c.id_cita) >= 2
ORDER BY total_citas DESC, paciente;