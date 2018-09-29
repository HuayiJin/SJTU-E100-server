-- MySQL dump 10.13  Distrib 5.7.23, for Linux (x86_64)
--
-- Host: localhost    Database: localtest
-- ------------------------------------------------------
-- Server version	5.7.23-0ubuntu0.16.04.1

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
-- Table structure for table `ALERT_DATA_TEST`
--

DROP TABLE IF EXISTS `ALERT_DATA_TEST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ALERT_DATA_TEST` (
  `timestamp` datetime NOT NULL,
  `car_VIN` varchar(45) NOT NULL,
  `motor_controller_temperature` int(11) DEFAULT NULL,
  `drive_motor_temperature` int(11) DEFAULT NULL,
  `drive_system_failure` int(11) DEFAULT NULL,
  `dcdc_temperature` int(11) DEFAULT NULL,
  `dcdc_status` int(11) DEFAULT NULL,
  `vcu_controller_alert` int(11) DEFAULT NULL,
  `total_battery_voltage` int(11) DEFAULT NULL,
  `battery_cell_max_temperature` int(11) DEFAULT NULL,
  `battery_cell_min_temperature` int(11) DEFAULT NULL,
  `battery_cell_max_voltage` int(11) DEFAULT NULL,
  `battery_cell_min_voltate` int(11) DEFAULT NULL,
  `high_voltage_interlock_state` int(11) DEFAULT NULL,
  `insulation_resistance_value` int(11) DEFAULT NULL,
  `collision_signal_state` int(11) DEFAULT NULL,
  `energy_storage_system_failure` int(11) DEFAULT NULL,
  `brake_system_failure` int(11) DEFAULT NULL,
  PRIMARY KEY (`car_VIN`,`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ALERT_DATA_TEST`
--

LOCK TABLES `ALERT_DATA_TEST` WRITE;
/*!40000 ALTER TABLE `ALERT_DATA_TEST` DISABLE KEYS */;
/*!40000 ALTER TABLE `ALERT_DATA_TEST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BATTERY_REALTIME_DATA_TEST`
--

DROP TABLE IF EXISTS `BATTERY_REALTIME_DATA_TEST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BATTERY_REALTIME_DATA_TEST` (
  `timestamp` datetime NOT NULL,
  `car_VIN` varchar(45) NOT NULL,
  `power_battery_number` int(11) DEFAULT NULL,
  `power_battery_info_0` varchar(250) DEFAULT NULL,
  `power_battery_info_1` varchar(250) DEFAULT NULL,
  `power_battery_info_2` varchar(250) DEFAULT NULL,
  `power_battery_info_3` varchar(250) DEFAULT NULL,
  `extra_battery_info` varchar(250) DEFAULT NULL,
  `high_voltage_battery_current` float DEFAULT NULL,
  `battery_power_SOC` float DEFAULT NULL,
  `residual_energy` float DEFAULT NULL,
  `total_battery_voltage` float DEFAULT NULL,
  `max_single_temperature` int(11) DEFAULT NULL,
  `min_single_temperature` int(11) DEFAULT NULL,
  `max_single_voltage` float DEFAULT NULL,
  `min_single_voltage` float DEFAULT NULL,
  `insulation_resistance_value` float DEFAULT NULL,
  `battery_equalization_activation` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`timestamp`,`car_VIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BATTERY_REALTIME_DATA_TEST`
--

LOCK TABLES `BATTERY_REALTIME_DATA_TEST` WRITE;
/*!40000 ALTER TABLE `BATTERY_REALTIME_DATA_TEST` DISABLE KEYS */;
/*!40000 ALTER TABLE `BATTERY_REALTIME_DATA_TEST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CAR_REALTIME_DATA_TEST`
--

DROP TABLE IF EXISTS `CAR_REALTIME_DATA_TEST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CAR_REALTIME_DATA_TEST` (
  `timestamp` datetime NOT NULL,
  `car_VID` varchar(45) NOT NULL,
  `car_start_end_time` varchar(45) DEFAULT NULL,
  `cumulative_mileage` float DEFAULT NULL,
  `location_status` varchar(45) DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `velocity` float DEFAULT NULL COMMENT '\n',
  `direction` float DEFAULT NULL,
  `motor_controller_temperature` int(11) DEFAULT NULL,
  `drive_motor_rpm` int(11) DEFAULT NULL,
  `drive_motor_temperature` int(11) DEFAULT NULL,
  `motor_bus_current` float DEFAULT NULL,
  `accelerator_pedal_stroke` int(11) DEFAULT NULL,
  `brake_pedal_status` varchar(20) DEFAULT NULL,
  `power_system_ready` varchar(20) DEFAULT NULL,
  `emergency_poweroff_request` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`car_VID`,`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CAR_REALTIME_DATA_TEST`
--

LOCK TABLES `CAR_REALTIME_DATA_TEST` WRITE;
/*!40000 ALTER TABLE `CAR_REALTIME_DATA_TEST` DISABLE KEYS */;
/*!40000 ALTER TABLE `CAR_REALTIME_DATA_TEST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CAR_REGISTER_TEST`
--

DROP TABLE IF EXISTS `CAR_REGISTER_TEST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CAR_REGISTER_TEST` (
  `timestamp` datetime NOT NULL,
  `car_VIN` varchar(45) NOT NULL,
  `registration_time` datetime NOT NULL,
  `vehicle_type` varchar(45) NOT NULL,
  `energy_storing_type` varchar(45) NOT NULL,
  `drive_motor_type` varchar(45) NOT NULL,
  `drive_motor_rated_power` int(11) NOT NULL,
  `drive_motor_rated_rpm` int(11) NOT NULL,
  `drive_motor_rated_torque` int(11) NOT NULL,
  `drive_motor_number` int(11) NOT NULL,
  `drive_motor_position` varchar(45) NOT NULL,
  `drive_motor_cooling_method` varchar(45) NOT NULL,
  `e_car_endurance_mileage` int(11) NOT NULL,
  `e_car_top_speed` int(11) NOT NULL,
  `power_battery_number` int(11) NOT NULL,
  `power_battery_info_0` varchar(250) NOT NULL,
  `power_battery_info_1` varchar(250) DEFAULT NULL,
  `power_battery_info_2` varchar(250) DEFAULT NULL,
  `power_battery_info_3` varchar(250) DEFAULT NULL,
  `extra_field` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`car_VIN`,`timestamp`),
  UNIQUE KEY `car_VIN_UNIQUE` (`car_VIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CAR_REGISTER_TEST`
--

LOCK TABLES `CAR_REGISTER_TEST` WRITE;
/*!40000 ALTER TABLE `CAR_REGISTER_TEST` DISABLE KEYS */;
INSERT INTO `CAR_REGISTER_TEST` VALUES ('2018-09-22 00:00:00','CAR00001','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,2000,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00002','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,2000,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00003','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,2000,545,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00005','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,2000,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00011','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,2000,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00015','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,2000,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00023','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',134,2000,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00033','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,2000,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','',''),('2018-09-22 00:15:00','CAR00042','2018-09-22 00:00:00','chundiandong','lidianchi','zhiliudianji',200,3242,300,1,'qianzhimoshi','yeleng',200,120,1,'{test:test}','','','','');
/*!40000 ALTER TABLE `CAR_REGISTER_TEST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OTHER_REALTIME_DATA_TEST`
--

DROP TABLE IF EXISTS `OTHER_REALTIME_DATA_TEST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OTHER_REALTIME_DATA_TEST` (
  `timestamp` datetime NOT NULL,
  `car_VIN` varchar(45) NOT NULL,
  `key_status` varchar(20) DEFAULT NULL,
  `gear_position` varchar(20) DEFAULT NULL,
  `vehicle_operating_mode` varchar(45) DEFAULT NULL,
  `driving_mode` varchar(45) DEFAULT NULL,
  `motor_status` varchar(45) DEFAULT NULL,
  `motor_torque` varchar(45) DEFAULT NULL,
  `motor_controller_voltage` varchar(45) DEFAULT NULL,
  `motor_controller_current` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`timestamp`,`car_VIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OTHER_REALTIME_DATA_TEST`
--

LOCK TABLES `OTHER_REALTIME_DATA_TEST` WRITE;
/*!40000 ALTER TABLE `OTHER_REALTIME_DATA_TEST` DISABLE KEYS */;
/*!40000 ALTER TABLE `OTHER_REALTIME_DATA_TEST` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-24 21:57:40
