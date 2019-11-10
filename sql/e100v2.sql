-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: e100
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `E100_TABLE`
--

DROP TABLE IF EXISTS `E100_TABLE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `E100_TABLE` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `car_VIN` varchar(45) NOT NULL,
  `create_time` datetime NOT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `vehicle_operating_mode` varchar(40) DEFAULT NULL,
  `brake_pedal_status` varchar(40) DEFAULT NULL,
  `accelerator_pedal_stroke` float DEFAULT NULL,
  `gear_position` varchar(20) DEFAULT NULL,
  `key_status` varchar(20) DEFAULT NULL,
  `driving_mode` varchar(40) DEFAULT NULL,
  `velocity` float DEFAULT NULL,
  `motor_status` varchar(40) DEFAULT NULL,
  `motor_torque` float DEFAULT NULL,
  `drive_motor_rpm` float DEFAULT NULL,
  `motor_controller_current` float DEFAULT NULL,
  `motor_controller_voltage` float DEFAULT NULL,
  `drive_motor_temperature` float DEFAULT NULL,
  `motor_controller_temperature` float DEFAULT NULL,
  `high_voltage_battery_current` float DEFAULT NULL,
  `total_battery_voltage` float DEFAULT NULL,
  `max_single_voltage` float DEFAULT NULL,
  `min_single_voltage` float DEFAULT NULL,
  `cumulative_mileage` float DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `VIN_time` (`car_VIN`,`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `E100_TABLE`
--

LOCK TABLES `E100_TABLE` WRITE;
/*!40000 ALTER TABLE `E100_TABLE` DISABLE KEYS */;
/*!40000 ALTER TABLE `E100_TABLE` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-09 13:55:36
