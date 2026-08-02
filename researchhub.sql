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
-- Table structure for table `badges`
--

DROP TABLE IF EXISTS `badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badges` (
  `badge_id` int NOT NULL AUTO_INCREMENT,
  `badge_name` varchar(100) NOT NULL,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  `criteria` text,
  PRIMARY KEY (`badge_id`),
  UNIQUE KEY `unique_badge_name` (`badge_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badges`
--

LOCK TABLES `badges` WRITE;
/*!40000 ALTER TABLE `badges` DISABLE KEYS */;
INSERT INTO `badges` VALUES (1,'First Solution','Submitted the first solution','CheckCircle','submit_first_solution'),(2,'Problem Solver','Had a solution verified','Trophy','first_verified_solution'),(3,'Helpful Contributor','Reached 50 reputation points','Star','reach_50_points'),(4,'Expert Contributor','Reached 100 reputation points','Award','reach_100_points'),(5,'Popular Solution','A solution received 5 likes','Flame','solution_5_likes'),(6,'Community Helper','Posted 10 comments','MessageSquare','post_10_comments');
/*!40000 ALTER TABLE `badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `unique_comment_like` (`comment_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
INSERT INTO `comment_likes` VALUES (2,2,5,'2026-06-06 10:42:04'),(5,5,9,'2026-08-01 11:21:11');
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_parent_comment` (`parent_comment_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_parent_comment` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (2,4,6,NULL,'I like to know more about this.','2026-06-06 07:15:04','2026-06-06 07:15:04'),(3,3,7,NULL,'Hey how are you buddy??','2026-06-06 16:48:18','2026-06-06 16:48:18'),(4,3,7,3,'I was talking about the mess. do not think about it that much','2026-06-06 16:48:47','2026-06-06 16:48:47'),(5,7,5,NULL,'def validate_composition(expression, defined_functions):\n    # BUG: Only checks the first function name found, not all of them\n    for func in defined_functions:\n        if func in expression:\n            return True\n    return False','2026-08-01 11:20:27','2026-08-01 11:20:27'),(7,7,5,NULL,'i have a thought','2026-08-01 20:58:21','2026-08-01 20:58:21');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fields`
--

DROP TABLE IF EXISTS `fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fields` (
  `field_id` int NOT NULL AUTO_INCREMENT,
  `field_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`field_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fields`
--

LOCK TABLES `fields` WRITE;
/*!40000 ALTER TABLE `fields` DISABLE KEYS */;
INSERT INTO `fields` VALUES (2,'Software Engineering',NULL),(3,'Artificial Intelligence',NULL),(4,'Cybersecurity',NULL),(5,'Data Science',NULL),(6,'IoT',NULL),(7,'Computer Networks',NULL),(8,'Embedded Systems',NULL);
/*!40000 ALTER TABLE `fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knowledge_archive`
--

DROP TABLE IF EXISTS `knowledge_archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knowledge_archive` (
  `archive_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `summary` text,
  `final_solution_id` int DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`archive_id`),
  UNIQUE KEY `post_id` (`post_id`),
  KEY `final_solution_id` (`final_solution_id`),
  CONSTRAINT `knowledge_archive_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `knowledge_archive_ibfk_2` FOREIGN KEY (`final_solution_id`) REFERENCES `solutions` (`solution_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knowledge_archive`
--

LOCK TABLES `knowledge_archive` WRITE;
/*!40000 ALTER TABLE `knowledge_archive` DISABLE KEYS */;
INSERT INTO `knowledge_archive` VALUES (2,4,'Solved problem: Artisitic photography',2,'2026-06-06 07:59:27'),(3,2,'Solved problem: Software testing issue in React app',4,'2026-06-06 12:06:19'),(4,3,'Solved problem: Bio medical examination test',5,'2026-06-06 13:41:43'),(5,5,'My name is Jayasara. This is the solution to this problem',NULL,'2026-06-06 19:13:15');
/*!40000 ALTER TABLE `knowledge_archive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_preferences`
--

DROP TABLE IF EXISTS `notification_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_preferences` (
  `preference_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `comment_notifications` tinyint(1) DEFAULT '1',
  `solution_notifications` tinyint(1) DEFAULT '1',
  `badge_notifications` tinyint(1) DEFAULT '1',
  `verification_notifications` tinyint(1) DEFAULT '1',
  `system_notifications` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`preference_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `notification_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_preferences`
--

LOCK TABLES `notification_preferences` WRITE;
/*!40000 ALTER TABLE `notification_preferences` DISABLE KEYS */;
INSERT INTO `notification_preferences` VALUES (1,3,1,1,1,1,1,'2026-06-07 10:33:29'),(5,5,1,1,1,1,1,'2026-06-07 08:06:48'),(90,9,1,1,1,1,1,'2026-08-01 11:20:27');
/*!40000 ALTER TABLE `notification_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `actor_user_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `type` enum('comment','solution','badge','verification','system') DEFAULT 'system',
  `is_read` tinyint(1) DEFAULT '0',
  `reference_id` int DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_notifications_actor` (`actor_user_id`),
  CONSTRAINT `fk_notifications_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (4,3,NULL,'A new solution was submitted for your problem: Software testing issue in React app','solution',1,4,'solution','2026-06-06 12:05:21'),(7,3,NULL,'Your solution was marked as solved by the problem owner.','verification',1,5,'solution','2026-06-06 13:41:43'),(8,3,NULL,'A new solution was submitted for your problem: Software Engineering is getting replaced by the AI.','solution',1,6,'solution','2026-06-06 19:12:43'),(10,3,NULL,'A new solution was submitted for your problem: Software Engineering is getting replaced by the AI.','solution',1,7,'solution','2026-06-06 19:58:26'),(11,3,NULL,'A new solution was submitted for your problem: Software Engineering is getting replaced by the AI.','solution',1,8,'solution','2026-06-07 08:07:22'),(13,9,NULL,'A new comment was added to your post: Function Composition Validator','comment',1,5,'comment','2026-08-01 11:20:27'),(14,9,NULL,'A new solution was submitted for your problem: Function Composition Validator','solution',1,10,'solution','2026-08-01 11:25:57'),(15,9,5,'A new comment was added to your post: Function Composition Validator','comment',1,6,'comment','2026-08-01 20:03:58'),(16,9,5,'A new solution was submitted for your problem: Function Composition Validator','solution',0,11,'solution','2026-08-01 20:43:59'),(17,9,5,'A new solution was submitted for your problem: Function Composition Validator','solution',0,12,'solution','2026-08-01 20:50:35'),(18,9,5,'A new comment was added to your post: Function Composition Validator','comment',0,7,'comment','2026-08-01 20:58:21'),(19,9,5,'A new solution was submitted for your problem: Function Composition Validator','solution',0,13,'solution','2026-08-01 21:03:22'),(20,3,5,'A new solution was submitted for your problem: Software testing issue in React app','solution',0,14,'solution','2026-08-02 06:23:49');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_attachments`
--

DROP TABLE IF EXISTS `post_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_attachments` (
  `attachment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `s3_key` varchar(1024) NOT NULL,
  `mime_type` varchar(150) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attachment_id`),
  KEY `fk_post_attachment_post` (`post_id`),
  CONSTRAINT `fk_post_attachment_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_attachments`
--

LOCK TABLES `post_attachments` WRITE;
/*!40000 ALTER TABLE `post_attachments` DISABLE KEYS */;
INSERT INTO `post_attachments` VALUES (1,8,'Test222.pdf','posts/8/eb469ad1-5950-4313-8e52-63ea7688cb65-test222.pdf','application/pdf',74837,'2026-08-01 16:53:03');
/*!40000 ALTER TABLE `post_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `post_type` enum('problem','research','experiment','question') DEFAULT 'problem',
  `field_id` int DEFAULT NULL,
  `difficulty_level` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
  `status` enum('open','in_progress','solved','closed') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_archived` tinyint DEFAULT '0',
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `field_id` (`field_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,3,'Software testing issue in React app','I am having a problem with software testing and validation in my React application.','problem',NULL,'intermediate','solved','2026-06-06 05:06:09','2026-06-06 12:06:19',0),(3,6,'Bio medical examination test','I have created a bio medical exam preparation test. so that you can refer to that to gain some knowledge.','research',NULL,'beginner','solved','2026-06-06 06:42:21','2026-06-06 13:41:43',0),(4,7,'Artisitic photography','I like to teach you the photograpy of the world.','problem',NULL,'beginner','solved','2026-06-06 07:03:06','2026-06-06 07:59:27',0),(5,3,'Software Engineering is getting replaced by the AI.','is this true? ','problem',3,'beginner','solved','2026-06-06 17:44:13','2026-06-06 19:13:15',0),(6,5,'ESP32 WiFi reconnect issue','My ESP32 disconnects from WiFi and does not reconnect automatically.','problem',6,'beginner','open','2026-06-28 05:41:04','2026-06-28 05:41:04',0),(7,9,'Function Composition Validator','Given a string representing a function composition expression (e.g., \"f(g(x))\"), validate whether all function names used are defined in a provided dictionary. Return true if all functions exist, otherwise false.','problem',2,'advanced','open','2026-08-01 11:17:23','2026-08-01 11:17:23',0),(8,5,'Count Vowels','Write a function that counts the number of vowels (a, e, i, o, u) in a given string. Count both uppercase and lowercase vowels.\n\nInput: \"Hello World\"\nOutput: 3 (e, o, o)','problem',5,'beginner','open','2026-08-01 16:52:59','2026-08-01 16:52:59',0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reputation`
--

DROP TABLE IF EXISTS `reputation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reputation` (
  `reputation_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_points` int DEFAULT '0',
  `level` varchar(50) DEFAULT 'Beginner',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`reputation_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `reputation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reputation`
--

LOCK TABLES `reputation` WRITE;
/*!40000 ALTER TABLE `reputation` DISABLE KEYS */;
INSERT INTO `reputation` VALUES (3,3,10,'Beginner','2026-06-06 13:41:43'),(4,4,0,'Beginner','2026-06-06 04:08:55'),(5,5,26,'Beginner','2026-08-02 06:23:49'),(6,6,10,'Beginner','2026-06-06 07:59:27'),(7,7,10,'Beginner','2026-06-06 12:06:19'),(11,8,17,'Beginner','2026-06-06 19:58:26'),(18,9,0,'Beginner','2026-08-01 11:13:07'),(22,10,0,'Beginner','2026-08-01 17:09:36');
/*!40000 ALTER TABLE `reputation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reputation_events`
--

DROP TABLE IF EXISTS `reputation_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reputation_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `points` int NOT NULL,
  `event_type` varchar(100) NOT NULL,
  `reference_type` varchar(50) NOT NULL,
  `reference_id` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `unique_reputation_event` (`user_id`,`event_type`,`reference_type`,`reference_id`),
  CONSTRAINT `reputation_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reputation_events`
--

LOCK TABLES `reputation_events` WRITE;
/*!40000 ALTER TABLE `reputation_events` DISABLE KEYS */;
INSERT INTO `reputation_events` VALUES (1,8,3,'submit_solution','solution',6,'Submitted a solution','2026-06-06 19:12:43'),(2,8,10,'verified_solution','solution',6,'Solution was verified','2026-06-06 19:13:15'),(3,8,1,'solution_like_received','solution_like',6000003,'Solution received a like','2026-06-06 19:13:18'),(4,8,3,'submit_solution','solution',7,'Submitted a solution','2026-06-06 19:58:26'),(5,5,3,'submit_solution','solution',8,'Submitted a solution','2026-06-07 08:07:22'),(6,5,3,'submit_solution','solution',9,'Submitted a solution','2026-06-07 08:10:02'),(7,5,1,'post_comment','comment',5,'Posted a comment','2026-08-01 11:20:27'),(8,5,2,'comment_like_received','comment_like',5000009,'Comment received a like','2026-08-01 11:21:11'),(9,5,3,'submit_solution','solution',10,'Submitted a solution','2026-08-01 11:25:57'),(10,5,1,'post_comment','comment',6,'Posted a comment','2026-08-01 20:03:58'),(11,5,3,'submit_solution','solution',11,'Submitted a solution','2026-08-01 20:43:59'),(12,5,3,'submit_solution','solution',12,'Submitted a solution','2026-08-01 20:50:35'),(13,5,1,'post_comment','comment',7,'Posted a comment','2026-08-01 20:58:21'),(14,5,3,'submit_solution','solution',13,'Submitted a solution','2026-08-01 21:03:22'),(15,5,3,'submit_solution','solution',14,'Submitted a solution','2026-08-02 06:23:49');
/*!40000 ALTER TABLE `reputation_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_posts`
--

DROP TABLE IF EXISTS `saved_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_posts` (
  `saved_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`saved_id`),
  UNIQUE KEY `unique_saved_post` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `saved_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `saved_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_posts`
--

LOCK TABLES `saved_posts` WRITE;
/*!40000 ALTER TABLE `saved_posts` DISABLE KEYS */;
INSERT INTO `saved_posts` VALUES (1,3,3,'2026-06-06 14:43:02');
/*!40000 ALTER TABLE `saved_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solution_attachments`
--

DROP TABLE IF EXISTS `solution_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solution_attachments` (
  `attachment_id` int NOT NULL AUTO_INCREMENT,
  `solution_id` int NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `s3_key` varchar(1024) NOT NULL,
  `mime_type` varchar(150) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attachment_id`),
  KEY `fk_solution_attachment_solution` (`solution_id`),
  CONSTRAINT `fk_solution_attachment_solution` FOREIGN KEY (`solution_id`) REFERENCES `solutions` (`solution_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solution_attachments`
--

LOCK TABLES `solution_attachments` WRITE;
/*!40000 ALTER TABLE `solution_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `solution_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solution_likes`
--

DROP TABLE IF EXISTS `solution_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solution_likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `solution_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `unique_solution_like` (`solution_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `solution_likes_ibfk_1` FOREIGN KEY (`solution_id`) REFERENCES `solutions` (`solution_id`) ON DELETE CASCADE,
  CONSTRAINT `solution_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solution_likes`
--

LOCK TABLES `solution_likes` WRITE;
/*!40000 ALTER TABLE `solution_likes` DISABLE KEYS */;
INSERT INTO `solution_likes` VALUES (2,4,5,'2026-06-06 13:43:17'),(3,2,5,'2026-06-06 13:54:39'),(4,4,7,'2026-06-06 14:07:38');
/*!40000 ALTER TABLE `solution_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solutions`
--

DROP TABLE IF EXISTS `solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solutions` (
  `solution_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `solution_text` text NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `selected_by_user_id` int DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `like_count` int DEFAULT '0',
  PRIMARY KEY (`solution_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `selected_by_user_id` (`selected_by_user_id`),
  CONSTRAINT `solutions_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `solutions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `solutions_ibfk_3` FOREIGN KEY (`selected_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solutions`
--

LOCK TABLES `solutions` WRITE;
/*!40000 ALTER TABLE `solutions` DISABLE KEYS */;
INSERT INTO `solutions` VALUES (2,4,6,'I have given the most suitable answer to this. like i have to know more about this research and the market gap of the world.',1,7,'2026-06-06 07:59:27','2026-06-06 07:15:38',0),(3,3,7,'This is the solution that i found in the post.',0,NULL,NULL,'2026-06-06 08:23:44',0),(4,2,7,'This is the solution to this',1,3,'2026-06-06 12:06:19','2026-06-06 12:05:21',0),(5,3,3,'This is Luthira\'s solution. is this right?',1,6,'2026-06-06 13:41:43','2026-06-06 13:40:07',0),(7,5,8,'I like to do this first. this is the second solution from Jayasara That is about to publish.',0,NULL,NULL,'2026-06-06 19:58:26',0),(9,5,5,'This is the solution by Avihska. TAke this and that',0,NULL,NULL,'2026-06-07 08:10:01',0),(10,7,5,'def tokenize(source_code):\r\n    import re\r\n    \r\n    # Pattern: identifiers, numbers, operators, parentheses, and braces\r\n    pattern = r\'([a-zA-Z_][a-zA-Z0-9_]*|\\d+|[+\\-*/=<>!]+|[(){}])\'\r\n    \r\n    tokens = re.findall(pattern, source_code)\r\n    \r\n    # Remove whitespace-only tokens (they aren\'t captured anyway)\r\n    return tokens',0,NULL,NULL,'2026-08-01 11:25:57',0),(13,7,5,'def validate_composition(expr, funcs):\r\n    return all(t in funcs or t in [\'x\', \'\'] for t in \'\'.join(c for c in expr if c.isalpha()).split(\'x\'))',0,NULL,NULL,'2026-08-01 21:03:22',0);
/*!40000 ALTER TABLE `solutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_badges`
--

DROP TABLE IF EXISTS `user_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_badges` (
  `user_badge_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `badge_id` int NOT NULL,
  `awarded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_badge_id`),
  UNIQUE KEY `unique_user_badge` (`user_id`,`badge_id`),
  KEY `badge_id` (`badge_id`),
  CONSTRAINT `user_badges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_badges_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`badge_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_badges`
--

LOCK TABLES `user_badges` WRITE;
/*!40000 ALTER TABLE `user_badges` DISABLE KEYS */;
INSERT INTO `user_badges` VALUES (1,3,1,'2026-06-06 18:53:45'),(2,8,1,'2026-06-06 19:12:43'),(4,8,2,'2026-06-06 19:13:15'),(7,6,1,'2026-06-06 19:16:47'),(8,7,1,'2026-06-06 19:16:47'),(10,3,2,'2026-06-06 19:16:47'),(11,6,2,'2026-06-06 19:16:47'),(12,7,2,'2026-06-06 19:16:47'),(18,5,1,'2026-06-07 08:07:22');
/*!40000 ALTER TABLE `user_badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_fields`
--

DROP TABLE IF EXISTS `user_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_fields` (
  `user_field_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `field_id` int NOT NULL,
  PRIMARY KEY (`user_field_id`),
  KEY `user_id` (`user_id`),
  KEY `field_id` (`field_id`),
  CONSTRAINT `user_fields_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_fields_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_fields`
--

LOCK TABLES `user_fields` WRITE;
/*!40000 ALTER TABLE `user_fields` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_settings` (
  `setting_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `theme` varchar(20) DEFAULT 'light',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
INSERT INTO `user_settings` VALUES (1,3,'light','2026-06-09 06:44:36'),(8,5,'light','2026-08-02 03:35:01'),(120,9,'light','2026-08-01 20:24:26');
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_skills`
--

DROP TABLE IF EXISTS `user_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_skills` (
  `user_skill_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_skill_id`),
  UNIQUE KEY `unique_user_skill` (`user_id`,`skill_name`),
  CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_skills`
--

LOCK TABLES `user_skills` WRITE;
/*!40000 ALTER TABLE `user_skills` DISABLE KEYS */;
INSERT INTO `user_skills` VALUES (1,5,'React','2026-06-28 07:41:06'),(2,5,'IoT','2026-06-28 07:41:06'),(3,5,'Database','2026-06-28 07:41:06');
/*!40000 ALTER TABLE `user_skills` ENABLE KEYS */;
UNLOCK TABLES;

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
  `password_hash` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `bio` text,
  `university_or_organization` varchar(150) DEFAULT NULL,
  `role` enum('student','researcher','engineer','admin') DEFAULT 'student',
  `status` enum('active','inactive','blocked') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `google_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Luthira Peiris','luthira@gmail.com','$2b$10$VTrLYqjRdYTyJIuVLMgWRuPLjyP7P13ryEJbQi4jje2fPQI.iFR0i','/uploads/1780766709995-89448875f5a974958e6b7711c4c390e8.jpg',NULL,'Sabaragamuwa University','student','active','2026-06-03 16:56:20','2026-06-07 12:28:22',NULL),(4,'Admin','admin@gmail.com','$2b$10$tDVr/wij/.ATH/RDr2vzz.3bFGyxo8Dlu/VXkw/xZ9lLzBr4Nojx6',NULL,NULL,'Sabaragamuwa University','admin','active','2026-06-06 04:08:55','2026-06-06 04:10:20',NULL),(5,'Avishka','avishka@gmail.com','$2b$10$6CISGsL5w6sPknv/1CLk5.OyyO0S8HU9lDXi8Xkk6WwXk06nSVbZa','/uploads/s3/profile-pictures/67aac1dc-7aa4-4dae-93ed-6a860e38994a-images.jpg',NULL,'Sabaragamuwa University','student','active','2026-06-06 05:07:18','2026-08-01 16:49:41',NULL),(6,'Methma','methma@gmail.com','$2b$10$dqp8PfizA4m6/xwauSc0oOEbdq9fwR8s9lgu1m/rgWuVW36nf.cb.',NULL,NULL,'Sabaragamuwa University','researcher','active','2026-06-06 06:40:28','2026-06-06 06:40:28',NULL),(7,'Thidushan','thidushan@gmail.com','$2b$10$Tw6ZLJh5m/GmHYIVHD24e.BGWJZh8X2lerw/ecBh0LqBnDIzvyCIS','/uploads/1785321256580-327676652.jpg',NULL,'Sabaragamuwa University','student','active','2026-06-06 06:43:41','2026-07-29 10:34:16',NULL),(8,'Jayasara','jayasara@gmail.com','$2b$10$bCWVmyEav9Q8RaLpuf2YAuhcepQkgJdS.9e0RYSFp/YTjMLaLA5t6',NULL,NULL,'Sabaragamuwa University','student','active','2026-06-06 19:10:27','2026-06-06 19:10:27',NULL),(9,'thimaya','thimaya@gmail.com','$2b$10$npwVgWzE6g9h/7nJ8CfeiOLAsGTREicMT8JqywcHFwfQd5bQW/Fr6',NULL,NULL,'Colombo university','student','active','2026-08-01 11:13:07','2026-08-01 11:13:07',NULL),(10,'Luthira Peiris','luthirapeiris1@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocJNbu2cnSgiuTkJW0jQzzqz5B9f0M0oxthD429zlCSbx04vIA=s96-c',NULL,NULL,'student','active','2026-08-01 17:09:36','2026-08-01 17:09:36','114273527997997136618');
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

-- Dump completed on 2026-08-02 22:51:16
