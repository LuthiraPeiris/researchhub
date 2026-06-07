-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: researchhub
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `bio` text,
  `university_or_organization` varchar(150) DEFAULT NULL,
  `role` enum('student','researcher','engineer','admin') DEFAULT 'student',
  `status` enum('active','inactive','blocked') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Luthira Peiris','luthira@gmail.com','$2b$10$VTrLYqjRdYTyJIuVLMgWRuPLjyP7P13ryEJbQi4jje2fPQI.iFR0i','/uploads/1780766709995-89448875f5a974958e6b7711c4c390e8.jpg',NULL,'Sabaragamuwa University','student','active','2026-06-03 16:56:20','2026-06-07 12:28:22'),(4,'Admin','admin@gmail.com','$2b$10$tDVr/wij/.ATH/RDr2vzz.3bFGyxo8Dlu/VXkw/xZ9lLzBr4Nojx6',NULL,NULL,'Sabaragamuwa University','admin','active','2026-06-06 04:08:55','2026-06-06 04:10:20'),(5,'Avishka','avishka@gmail.com','$2b$10$6CISGsL5w6sPknv/1CLk5.OyyO0S8HU9lDXi8Xkk6WwXk06nSVbZa',NULL,NULL,'Sabaragamuwa University','student','active','2026-06-06 05:07:18','2026-06-06 05:07:18'),(6,'Methma','methma@gmail.com','$2b$10$dqp8PfizA4m6/xwauSc0oOEbdq9fwR8s9lgu1m/rgWuVW36nf.cb.',NULL,NULL,'Sabaragamuwa University','researcher','active','2026-06-06 06:40:28','2026-06-06 06:40:28'),(7,'Thidushan','thidushan@gmail.com','$2b$10$Tw6ZLJh5m/GmHYIVHD24e.BGWJZh8X2lerw/ecBh0LqBnDIzvyCIS',NULL,NULL,'Sabaragamuwa University','student','active','2026-06-06 06:43:41','2026-06-06 06:43:41'),(8,'Jayasara','jayasara@gmail.com','$2b$10$bCWVmyEav9Q8RaLpuf2YAuhcepQkgJdS.9e0RYSFp/YTjMLaLA5t6',NULL,NULL,'Sabaragamuwa University','student','active','2026-06-06 19:10:27','2026-06-06 19:10:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-07 18:39:08
