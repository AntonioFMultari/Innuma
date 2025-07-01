-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: innuma
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
-- Table structure for table `bilancio`
--

DROP TABLE IF EXISTS `bilancio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bilancio` (
  `bil_Id` int NOT NULL AUTO_INCREMENT,
  `tipologia` char(20) DEFAULT NULL,
  `prezzo` decimal(10,2) DEFAULT NULL,
  `fat_Id` int DEFAULT NULL,
  PRIMARY KEY (`bil_Id`),
  KEY `fk_fat_ID` (`fat_Id`),
  CONSTRAINT `fk_fat_ID` FOREIGN KEY (`fat_Id`) REFERENCES `fattura` (`fat_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bilancio`
--

LOCK TABLES `bilancio` WRITE;
/*!40000 ALTER TABLE `bilancio` DISABLE KEYS */;
/*!40000 ALTER TABLE `bilancio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clienteinnuma`
--

DROP TABLE IF EXISTS `clienteinnuma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clienteinnuma` (
  `email` char(30) NOT NULL,
  `nome` char(15) DEFAULT NULL,
  `cognome` char(20) DEFAULT NULL,
  `pwd` char(50) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clienteinnuma`
--

LOCK TABLES `clienteinnuma` WRITE;
/*!40000 ALTER TABLE `clienteinnuma` DISABLE KEYS */;
/*!40000 ALTER TABLE `clienteinnuma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clienti`
--

DROP TABLE IF EXISTS `clienti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clienti` (
  `cliente_Id` int NOT NULL AUTO_INCREMENT,
  `nome` char(15) DEFAULT NULL,
  `cognome` char(20) DEFAULT NULL,
  `email` char(50) DEFAULT NULL,
  `cF` char(16) DEFAULT NULL,
  PRIMARY KEY (`cliente_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clienti`
--

LOCK TABLES `clienti` WRITE;
/*!40000 ALTER TABLE `clienti` DISABLE KEYS */;
/*!40000 ALTER TABLE `clienti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comissioni`
--

DROP TABLE IF EXISTS `comissioni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comissioni` (
  `cliente_Id` int DEFAULT NULL,
  `evento_Id` int DEFAULT NULL,
  KEY `uniq_cliente_ID` (`cliente_Id`),
  KEY `uniq_evento_ID` (`evento_Id`),
  CONSTRAINT `uniq_cliente_ID` FOREIGN KEY (`cliente_Id`) REFERENCES `clienti` (`cliente_Id`),
  CONSTRAINT `uniq_evento_ID` FOREIGN KEY (`evento_Id`) REFERENCES `evento` (`evento_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comissioni`
--

LOCK TABLES `comissioni` WRITE;
/*!40000 ALTER TABLE `comissioni` DISABLE KEYS */;
/*!40000 ALTER TABLE `comissioni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `evento_Id` int NOT NULL AUTO_INCREMENT,
  `tipologia` char(20) DEFAULT NULL,
  `evento_data` datetime DEFAULT NULL,
  `cliente_Id` int DEFAULT NULL,
  PRIMARY KEY (`evento_Id`),
  KEY `fk_cliente_ID` (`cliente_Id`),
  CONSTRAINT `fk_cliente_ID` FOREIGN KEY (`cliente_Id`) REFERENCES `clienti` (`cliente_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fattura`
--

DROP TABLE IF EXISTS `fattura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fattura` (
  `fat_Id` int NOT NULL AUTO_INCREMENT,
  `fat_data` date DEFAULT NULL,
  `prezzo` decimal(10,2) DEFAULT NULL,
  `cliente_Id` int DEFAULT NULL,
  `evento_Id` int DEFAULT NULL,
  PRIMARY KEY (`fat_Id`),
  KEY `unq_cliente_ID` (`cliente_Id`),
  KEY `fk_evento_ID` (`evento_Id`),
  CONSTRAINT `fk_evento_ID` FOREIGN KEY (`evento_Id`) REFERENCES `evento` (`evento_Id`),
  CONSTRAINT `unq_cliente_ID` FOREIGN KEY (`cliente_Id`) REFERENCES `clienti` (`cliente_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fattura`
--

LOCK TABLES `fattura` WRITE;
/*!40000 ALTER TABLE `fattura` DISABLE KEYS */;
/*!40000 ALTER TABLE `fattura` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-01 18:29:43
