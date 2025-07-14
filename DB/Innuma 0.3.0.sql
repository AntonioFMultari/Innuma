-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: innuma
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attività`
--

DROP TABLE IF EXISTS `attività`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attività` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Tariffa` decimal(10,2) DEFAULT NULL,
  `Descrizione` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Colore` char(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attività`
--

LOCK TABLES `attività` WRITE;
/*!40000 ALTER TABLE `attività` DISABLE KEYS */;
/*!40000 ALTER TABLE `attività` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `_dataInizio` datetime DEFAULT NULL,
  `_dataFine` datetime DEFAULT NULL,
  `Titolo` char(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NomeCliente` char(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Fattura` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento_attivita`
--

DROP TABLE IF EXISTS `evento_attivita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_attivita` (
  `ID_Evento` int NOT NULL,
  `ID_Attivita` int NOT NULL,
  PRIMARY KEY (`ID_Evento`,`ID_Attivita`),
  KEY `ID_Attivita` (`ID_Attivita`),
  CONSTRAINT `evento_attivita_ibfk_1` FOREIGN KEY (`ID_Evento`) REFERENCES `evento` (`ID`),
  CONSTRAINT `evento_attivita_ibfk_2` FOREIGN KEY (`ID_Attivita`) REFERENCES `attività` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_attivita`
--

LOCK TABLES `evento_attivita` WRITE;
/*!40000 ALTER TABLE `evento_attivita` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento_attivita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spese`
--

DROP TABLE IF EXISTS `spese`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spese` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Descrizione` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Uscita` decimal(10,2) DEFAULT NULL,
  `_data` date DEFAULT NULL,
  `ID_Evento` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_spese_evento` (`ID_Evento`),
  CONSTRAINT `fk_spese_evento` FOREIGN KEY (`ID_Evento`) REFERENCES `evento` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spese`
--

LOCK TABLES `spese` WRITE;
/*!40000 ALTER TABLE `spese` DISABLE KEYS */;
/*!40000 ALTER TABLE `spese` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-13 16:33:32
