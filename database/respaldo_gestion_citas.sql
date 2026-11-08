-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_citas_medicas
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id_cita` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  `id_consultorio` int NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `motivo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('Programada','Confirmada','Cancelada','Atendida') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Programada',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cita`),
  KEY `fk_cita_paciente` (`id_paciente`),
  KEY `fk_cita_medico` (`id_medico`),
  KEY `fk_cita_consultorio` (`id_consultorio`),
  KEY `idx_citas_fecha` (`fecha`),
  KEY `idx_citas_estado` (`estado`),
  CONSTRAINT `fk_cita_consultorio` FOREIGN KEY (`id_consultorio`) REFERENCES `consultorios` (`id_consultorio`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cita_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cita_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_horas` CHECK ((`hora_fin` > `hora_inicio`))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,5,1,1,'2026-09-17','08:30:00','09:00:00','Dolor lumbar','Atendida','2026-09-27 23:59:11'),(3,3,6,2,'2026-09-07','10:00:00','10:30:00','Consulta general de rutina','Atendida','2026-09-27 23:59:11'),(4,1,1,1,'2026-09-27','08:00:00','08:30:00','Consulta general de rutina','Atendida','2026-09-27 23:59:11'),(5,3,2,2,'2026-09-28','10:00:00','10:30:00','Control de crecimiento','Confirmada','2026-09-27 23:59:11'),(6,8,1,1,'2026-09-29','16:00:00','16:30:00','Consulta general','Confirmada','2026-09-27 23:59:11'),(7,2,3,3,'2026-09-30','09:00:00','09:30:00','Chequeo cardiológico','Confirmada','2026-09-27 23:59:11'),(8,4,5,1,'2026-10-01','11:00:00','11:30:00','Valoración ginecológica','Programada','2026-09-27 23:59:11'),(9,6,4,2,'2026-10-06','09:00:00','09:30:00','Revisión de lunar','Programada','2026-09-27 23:59:11'),(10,1,4,2,'2026-10-04','08:00:00','08:30:00','Consulta dermatológica','Programada','2026-09-27 23:59:11'),(11,2,1,1,'2026-10-05','09:30:00','10:00:00','Seguimiento tratamiento','Programada','2026-09-27 23:59:11');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultorios`
--

DROP TABLE IF EXISTS `consultorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultorios` (
  `id_consultorio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubicacion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_consultorio`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultorios`
--

LOCK TABLES `consultorios` WRITE;
/*!40000 ALTER TABLE `consultorios` DISABLE KEYS */;
INSERT INTO `consultorios` VALUES (1,'Consultorio 101','Piso 1 - Torre A'),(2,'Consultorio 102','Piso 1 - Torre A'),(3,'Consultorio 201','Piso 2 - Torre B');
/*!40000 ALTER TABLE `consultorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id_especialidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_especialidad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` VALUES (1,'Medicina General','Atención primaria y valoración inicial del paciente'),(2,'Pediatría','Atención médica para niños y adolescentes'),(3,'Cardiología','Diagnóstico y tratamiento de enfermedades del corazón'),(4,'Dermatología','Diagnóstico y tratamiento de enfermedades de la piel'),(5,'Ginecología','Salud del sistema reproductor femenino');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_citas`
--

DROP TABLE IF EXISTS `historial_citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_citas` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_cita` int NOT NULL,
  `estado_anterior` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado_nuevo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observacion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_cambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `fk_historial_cita` (`id_cita`),
  CONSTRAINT `fk_historial_cita` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_citas`
--

LOCK TABLES `historial_citas` WRITE;
/*!40000 ALTER TABLE `historial_citas` DISABLE KEYS */;
INSERT INTO `historial_citas` VALUES (1,1,'Programada','Confirmada','Paciente confirmó por teléfono','2026-09-27 23:59:13'),(2,1,'Confirmada','Atendida','Consulta realizada sin novedades','2026-09-27 23:59:13'),(4,3,'Programada','Confirmada','Confirmación en recepción','2026-09-27 23:59:13'),(5,3,'Confirmada','Atendida','Atendido antes de la inactivación del médico','2026-09-27 23:59:13'),(6,4,'Programada','Confirmada','Paciente confirmó por teléfono','2026-09-27 23:59:13'),(7,5,'Programada','Confirmada','Confirmación vía correo','2026-09-27 23:59:13'),(29,7,'Programada','Confirmada','Paciente confirmó asistencia telefónicamente','2026-09-28 01:21:49'),(30,4,'Confirmada','Atendida','Consulta realizada sin novedades','2026-09-28 01:21:49');
/*!40000 ALTER TABLE `historial_citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos`
--

DROP TABLE IF EXISTS `medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos` (
  `id_medico` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_especialidad` int NOT NULL,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Activo',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_medico`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_medicos_especialidad` (`id_especialidad`),
  CONSTRAINT `fk_medico_especialidad` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos`
--

LOCK TABLES `medicos` WRITE;
/*!40000 ALTER TABLE `medicos` DISABLE KEYS */;
INSERT INTO `medicos` VALUES (1,'Carlos','Ramírez','10001001','3001110001','carlos.ramirez@clinica.com',1,'Activo','2026-09-27 23:52:52'),(2,'Laura','Gómez','10001002','3001110002','laura.gomez@clinica.com',2,'Activo','2026-09-27 23:52:52'),(3,'Andrés','Pérez','10001003','3001110003','andres.perez@clinica.com',3,'Activo','2026-09-27 23:52:52'),(4,'Marcela','Torres','10001004','3001110004','marcela.torres@clinica.com',4,'Activo','2026-09-27 23:52:52'),(5,'Diana','Suárez','10001005','3001110005','diana.suarez@clinica.com',5,'Activo','2026-09-27 23:52:52'),(6,'Ernesto','Castillo','10001006','3001110006','ernesto.castillo@clinica.com',1,'Inactivo','2026-09-27 23:52:52');
/*!40000 ALTER TABLE `medicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id_paciente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_paciente`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `correo` (`correo`),
  CONSTRAINT `chk_fecha_nacimiento` CHECK (((`fecha_nacimiento` >= _cp850'1900-01-01') and (`fecha_nacimiento` < _cp850'2100-01-01')))
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,'Juan','Martínez','20001001','1990-05-14','3102220001','juan.martinez@correo.com','Cra 10 #20-30','2026-09-27 23:59:10'),(2,'María','López','20001002','1985-11-02','3102220002','maria.lopez@correo.com','Cll 15 #8-22','2026-09-27 23:59:10'),(3,'Pedro','Rodríguez','20001003','2015-03-21','3102220003','pedro.rodriguez@colegio.edu.co','Cra 5 #12-10','2026-09-27 23:59:10'),(4,'Sofía','Hernández','20001004','1998-07-09','3102220004','sofia.hernandez@correo.com','Cll 30 #4-55','2026-09-27 23:59:10'),(5,'Camilo','Vargas','20001005','1975-01-30','3102220005','camilo.vargas@correo.com','Cra 18 #9-40','2026-09-27 23:59:10'),(6,'Valentina','Ríos','20001006','2002-09-17','3102220006','valentina.rios@correo.com','Cll 22 #6-15','2026-09-27 23:59:10'),(7,'Andrés','Moreno','20001007','1992-12-25','3102220007','andres.moreno@correo.com','Cra 7 #14-60','2026-09-27 23:59:10'),(8,'Isabel','Castro','20001008','1988-04-05','3102220008','isabel.castro@correo.com','Cll 40 #2-18','2026-09-27 23:59:10');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_pacientes_fecha_ins` BEFORE INSERT ON `pacientes` FOR EACH ROW BEGIN
    IF NEW.fecha_nacimiento > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Integridad de dominio: la fecha de nacimiento no puede ser futura';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_pacientes_fecha_upd` BEFORE UPDATE ON `pacientes` FOR EACH ROW BEGIN
    IF NEW.fecha_nacimiento > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Integridad de dominio: la fecha de nacimiento no puede ser futura';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-27 20:29:44
