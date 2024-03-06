-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2023 at 03:11 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tooyen`
--

-- --------------------------------------------------------

--
-- Table structure for table `fridge_config`
--

CREATE TABLE `fridge_config` (
  `Username` varchar(32) NOT NULL,
  `Email` varchar(32) NOT NULL,
  `Initial_datetime` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `Temp` int(11) NOT NULL DEFAULT 4
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `fridge_config`
--

INSERT INTO `fridge_config` (`Username`, `Email`, `Initial_datetime`, `Temp`) VALUES
('CPE INTER', 'allaboutbeauty@kmutt.ac.th', '2023-10-30 21:05:28.000000', -3);

-- --------------------------------------------------------

--
-- Table structure for table `item_information`
--

CREATE TABLE `item_information` (
  `Item_ID` varchar(16) NOT NULL,
  `Item_Name` varchar(32) NOT NULL,
  `Tag_ID` varchar(16) NOT NULL,
  `Last_Purchase` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `item_information`
--

INSERT INTO `item_information` (`Item_ID`, `Item_Name`, `Tag_ID`, `Last_Purchase`) VALUES
('ITM_001', 'Apple', 'TAG_001', '2023-12-11 17:46:20.000000'),
('ITM_002', 'Avocado', 'TAG_001', '2023-12-11 06:46:03.000000'),
('ITM_003', 'Banana', 'TAG_001', '2023-12-11 06:46:03.000000'),
('ITM_004', 'Bell Pepper', 'TAG_002', '2023-12-10 23:48:39.000000'),
('ITM_005', 'Blueberry', 'TAG_001', '2023-12-11 06:57:12.000000'),
('ITM_006', 'Brocoli', 'TAG_002', '2023-12-11 06:25:41.000000'),
('ITM_007', 'Cabbage', 'TAG_002', '2023-12-11 00:16:05.000000'),
('ITM_008', 'Carrot', 'TAG_002', NULL),
('ITM_009', 'Cauliflower', 'TAG_002', NULL),
('ITM_010', 'Cherry', 'TAG_001', '2023-12-11 06:46:03.000000'),
('ITM_011', 'Corn', 'TAG_001', '2023-12-11 03:48:10.000000'),
('ITM_012', 'Egg', 'TAG_003', '2023-12-11 17:35:59.000000'),
('ITM_013', 'Garlic', 'TAG_002', NULL),
('ITM_014', 'Ginger', 'TAG_002', NULL),
('ITM_015', 'Grape', 'TAG_001', '2023-12-10 17:13:04.000000'),
('ITM_016', 'Grapefruit', 'TAG_001', NULL),
('ITM_017', 'Kiwi', 'TAG_001', NULL),
('ITM_018', 'Leek', 'TAG_002', NULL),
('ITM_019', 'Lemon', 'TAG_001', NULL),
('ITM_020', 'Lime', 'TAG_002', NULL),
('ITM_021', 'Onion', 'TAG_002', NULL),
('ITM_022', 'Orange', 'TAG_001', '2023-12-11 06:46:03.000000'),
('ITM_023', 'Pineapple', 'TAG_001', NULL),
('ITM_024', 'Potato', 'TAG_002', NULL),
('ITM_025', 'Pumpkin', 'TAG_002', NULL),
('ITM_026', 'Radish', 'TAG_002', NULL),
('ITM_027', 'Strawberry', 'TAG_001', NULL),
('ITM_028', 'Tomato', 'TAG_002', '2023-12-10 23:00:59.000000'),
('ITM_029', 'Watermelon', 'TAG_001', NULL),
('ITM_030', 'Cucumber', 'TAG_002', NULL),
('ITM_031', 'Chilly', 'TAG_002', NULL),
('ITM_032', 'Eggplant', 'TAG_002', NULL),
('ITM_033', 'Celery', 'TAG_002', NULL),
('ITM_034', 'Spring Onion', 'TAG_002', NULL),
('ITM_035', 'Coriander', 'TAG_002', NULL),
('ITM_036', 'Basil', 'TAG_002', '2023-12-10 23:49:49.000000'),
('ITM_037', 'Mushroom', 'TAG_002', NULL),
('ITM_039', 'Mango', 'TAG_001', NULL),
('ITM_040', 'Peach', 'TAG_001', NULL),
('ITM_041', 'Papaya', 'TAG_001', '2023-12-11 21:06:53.000000'),
('ITM_042', 'Lychee', 'TAG_001', NULL),
('ITM_043', 'Passion Fruit', 'TAG_001', '2023-12-11 21:06:57.000000'),
('ITM_044', 'Raspberry', 'TAG_001', '2023-12-10 23:49:49.000000'),
('ITM_045', 'Durian', 'TAG_001', NULL),
('ITM_046', 'Jackfruit', 'TAG_001', NULL),
('ITM_047', 'Pomegranate', 'TAG_001', NULL),
('ITM_048', 'Dragonfruit', 'TAG_001', '2023-12-10 23:50:21.000000'),
('ITM_049', 'Coconut', 'TAG_001', '2023-12-11 00:16:05.000000'),
('ITM_050', 'Pear', 'TAG_001', NULL),
('ITM_051', 'Melon', 'TAG_001', NULL),
('ITM_052', 'Salmon', 'TAG_003', NULL),
('ITM_053', 'Chicken', 'TAG_003', '2023-12-11 06:37:30.000000'),
('ITM_054', 'Pork', 'TAG_003', '2023-12-11 17:46:20.000000'),
('ITM_055', 'Beef', 'TAG_003', '2023-12-11 17:46:20.000000'),
('ITM_056', 'Duck', 'TAG_003', NULL),
('ITM_057', 'Fish', 'TAG_003', '2023-12-11 17:46:20.000000'),
('ITM_058', 'Shrimp', 'TAG_003', '2023-12-11 17:59:55.000000'),
('ITM_059', 'Lobster', 'TAG_003', NULL),
('ITM_060', 'Shellfish', 'TAG_003', NULL),
('ITM_061', 'Lamb', 'TAG_003', '2023-12-10 23:48:39.000000'),
('ITM_062', 'Crab', 'TAG_003', '2023-12-11 00:16:05.000000'),
('ITM_063', 'Ham', 'TAG_003', NULL),
('ITM_064', 'Sausage', 'TAG_003', NULL),
('ITM_065', 'Beans', 'TAG_002', '2023-12-11 04:19:12.000000'),
('ITM_066', 'Yogurt', 'TAG_004', NULL),
('ITM_067', 'Butter', 'TAG_004', NULL),
('ITM_068', 'Cheese', 'TAG_004', '2023-12-11 00:16:05.000000'),
('ITM_069', 'Milk', 'TAG_004', '2023-12-10 23:46:16.000000'),
('ITM_070', 'Oats', 'TAG_005', '2023-12-11 04:20:32.000000'),
('ITM_071', 'Orange Juice', 'TAG_006', '2023-12-11 17:46:20.000000'),
('ITM_076', 'Sugar Cane', 'TAG_001', NULL),
('ITM_077', 'Mayom', 'TAG_001', '2023-12-11 17:59:20.000000'),
('ITM_078', 'Mamuanghao Manaoho', 'TAG_001', '2023-12-11 06:37:30.000000'),
('ITM_079', 'Baby Carrots', 'TAG_002', NULL),
('ITM_080', 'Starfruit', 'TAG_001', '2023-12-11 17:46:20.000000'),
('ITM_081', 'Jujube', 'TAG_001', '2023-12-11 18:04:25.000000');

--
-- Triggers `item_information`
--
DELIMITER $$
CREATE TRIGGER `tg_item_info_insert` BEFORE INSERT ON `item_information` FOR EACH ROW BEGIN
  INSERT INTO seq__item_info VALUES (NULL);
  SET NEW.Item_ID = CONCAT('ITM_', LPAD(LAST_INSERT_ID(), 3, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `item_in_fridge`
--

CREATE TABLE `item_in_fridge` (
  `Inv_ID` varchar(16) NOT NULL,
  `Item_ID` varchar(16) NOT NULL,
  `Cart_ID` varchar(16) NOT NULL,
  `Loc_ID` varchar(16) NOT NULL,
  `Set_Dur` int(16) NOT NULL,
  `Quantity` int(16) NOT NULL,
  `Add_Date` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `Ex_Date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `item_in_fridge`
--

INSERT INTO `item_in_fridge` (`Inv_ID`, `Item_ID`, `Cart_ID`, `Loc_ID`, `Set_Dur`, `Quantity`, `Add_Date`, `Ex_Date`) VALUES
('INV_003', 'ITM_028', 'CRT_005', 'LOC_010', 4, 1, '2023-12-10 23:00:59.062000', '2023-12-08 23:00:59.062000'),
('INV_012', 'ITM_069', 'CRT_007', 'LOC_008', 3, 1, '2023-12-10 23:46:16.204000', '2023-12-13 23:46:16.204000'),
('INV_013', 'ITM_004', 'CRT_008', 'LOC_004', 2, 1, '2023-12-10 23:48:39.952000', '2023-12-12 23:48:39.952000'),
('INV_019', 'ITM_044', 'CRT_009', 'LOC_009', 1, 1, '2023-12-10 23:49:49.328000', '2023-12-11 23:49:49.328000'),
('INV_020', 'ITM_062', 'CRT_009', 'LOC_006', 2, 2, '2023-12-10 23:49:49.328000', '2023-12-12 23:49:49.328000'),
('INV_039', 'ITM_006', 'CRT_012', 'LOC_008', 5, 5, '2023-12-11 06:25:41.551000', '2023-12-16 06:25:41.551000'),
('INV_041', 'ITM_055', 'CRT_012', 'LOC_001', 10, 7, '2023-12-11 06:25:41.552000', '2023-12-21 06:25:41.552000'),
('INV_047', 'ITM_055', 'CRT_013', 'LOC_001', 1, 5, '2023-12-11 06:37:30.163000', '2023-12-12 06:37:30.163000'),
('INV_052', 'ITM_002', 'CRT_014', 'LOC_010', 1, 2, '2023-12-11 06:46:03.025000', '2023-12-12 06:46:03.025000'),
('INV_053', 'ITM_003', 'CRT_014', 'LOC_006', 1, 7, '2023-12-11 06:46:03.025000', '2023-12-12 06:46:03.025000'),
('INV_054', 'ITM_005', 'CRT_014', 'LOC_005', 1, 5, '2023-12-11 06:46:03.026000', '2023-12-12 06:46:03.026000'),
('INV_055', 'ITM_010', 'CRT_014', 'LOC_002', 1, 10, '2023-12-11 06:46:03.026000', '2023-12-12 06:46:03.026000'),
('INV_058', 'ITM_071', 'CRT_014', 'LOC_005', 1, 3, '2023-12-11 06:46:03.027000', '2023-12-12 06:46:03.027000'),
('INV_062', 'ITM_001', 'CRT_017', 'LOC_002', 3, 8, '2023-12-11 17:46:20.882000', '2023-12-14 17:46:20.882000'),
('INV_063', 'ITM_054', 'CRT_017', 'LOC_009', 10, 8, '2023-12-11 17:46:20.882000', '2023-12-21 17:46:20.882000'),
('INV_071', 'ITM_041', 'CRT_018', 'LOC_010', 12, 8, '2023-12-11 21:06:53.007000', '2023-12-23 21:06:53.007000'),
('INV_072', 'ITM_043', 'CRT_018', 'LOC_001', 12, 4, '2023-12-11 21:06:57.849000', '2023-12-23 21:06:57.849000');

--
-- Triggers `item_in_fridge`
--
DELIMITER $$
CREATE TRIGGER `tg_inv_insert` BEFORE INSERT ON `item_in_fridge` FOR EACH ROW BEGIN
  INSERT INTO seq__inv VALUES (NULL);
  SET NEW.Inv_ID = CONCAT('INV_', LPAD(LAST_INSERT_ID(), 3, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `Loc_ID` varchar(16) NOT NULL,
  `Loc_Num` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`Loc_ID`, `Loc_Num`) VALUES
('LOC_001', 1),
('LOC_002', 2),
('LOC_003', 3),
('LOC_004', 4),
('LOC_005', 5),
('LOC_006', 6),
('LOC_007', 7),
('LOC_008', 8),
('LOC_009', 9),
('LOC_010', 10);

--
-- Triggers `location`
--
DELIMITER $$
CREATE TRIGGER `tg_loc_insert` BEFORE INSERT ON `location` FOR EACH ROW BEGIN
  INSERT INTO seq__loc VALUES (NULL);
  SET NEW.Loc_ID = CONCAT('LOC_', LPAD(LAST_INSERT_ID(), 3, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `recipe_book`
--

CREATE TABLE `recipe_book` (
  `Recipe_ID` varchar(16) NOT NULL,
  `Recipe_Name` varchar(32) NOT NULL,
  `Country` varchar(16) DEFAULT NULL,
  `Difficulty` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `Image` varchar(255) NOT NULL DEFAULT 'default.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `recipe_book`
--

INSERT INTO `recipe_book` (`Recipe_ID`, `Recipe_Name`, `Country`, `Difficulty`, `Image`) VALUES
('RCP_001', 'Omelette', 'Non-Specify', 'Beginner', 'omelette.png'),
('RCP_002', 'Tom Yum Kung', 'Thailand', 'Intermediate', 'tomyumkung.png'),
('RCP_007', 'My favorite shimp\'s donuts', 'Cameroon', 'Beginner', 'default.png'),
('RCP_008', 'Fried shrimp', 'Canada', 'Beginner', 'default.png'),
('RCP_009', 'Garlic shrimp', 'Brazil', 'Intermediate', 'default.png');

--
-- Triggers `recipe_book`
--
DELIMITER $$
CREATE TRIGGER `tg_recipe_insert` BEFORE INSERT ON `recipe_book` FOR EACH ROW BEGIN
  INSERT INTO seq__recipe VALUES (NULL);
  SET NEW.Recipe_ID = CONCAT('RCP_', LPAD(LAST_INSERT_ID(), 3, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `recipe_ing`
--

CREATE TABLE `recipe_ing` (
  `Recipe_ID` varchar(16) NOT NULL,
  `Item_ID` varchar(16) NOT NULL,
  `Quantity` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `recipe_ing`
--

INSERT INTO `recipe_ing` (`Recipe_ID`, `Item_ID`, `Quantity`) VALUES
('RCP_001', 'ITM_012', 2),
('RCP_002', 'ITM_031', 1),
('RCP_002', 'ITM_037', 1),
('RCP_002', 'ITM_058', 3),
('RCP_007', 'ITM_010', 2),
('RCP_007', 'ITM_012', 4),
('RCP_007', 'ITM_058', 10),
('RCP_008', 'ITM_013', 1),
('RCP_008', 'ITM_031', 1),
('RCP_008', 'ITM_058', 10),
('RCP_009', 'ITM_013', 5),
('RCP_009', 'ITM_031', 2),
('RCP_009', 'ITM_058', 10);

-- --------------------------------------------------------

--
-- Table structure for table `seq__cart`
--

CREATE TABLE `seq__cart` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `seq__cart`
--

INSERT INTO `seq__cart` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18);

-- --------------------------------------------------------

--
-- Table structure for table `seq__inv`
--

CREATE TABLE `seq__inv` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `seq__inv`
--

INSERT INTO `seq__inv` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31),
(32),
(33),
(34),
(35),
(36),
(37),
(38),
(39),
(40),
(41),
(42),
(43),
(44),
(45),
(46),
(47),
(48),
(49),
(50),
(51),
(52),
(53),
(54),
(55),
(56),
(57),
(58),
(59),
(60),
(61),
(62),
(63),
(64),
(65),
(66),
(67),
(68),
(69),
(70),
(71),
(72);

-- --------------------------------------------------------

--
-- Table structure for table `seq__item_info`
--

CREATE TABLE `seq__item_info` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `seq__item_info`
--

INSERT INTO `seq__item_info` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31),
(32),
(33),
(34),
(35),
(36),
(37),
(39),
(40),
(41),
(42),
(43),
(44),
(45),
(46),
(47),
(48),
(49),
(50),
(51),
(52),
(53),
(54),
(55),
(56),
(57),
(58),
(59),
(60),
(61),
(62),
(63),
(64),
(65),
(66),
(67),
(68),
(69),
(70),
(71),
(72),
(73),
(74),
(75),
(76),
(77),
(78),
(79),
(80),
(81);

-- --------------------------------------------------------

--
-- Table structure for table `seq__loc`
--

CREATE TABLE `seq__loc` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `seq__loc`
--

INSERT INTO `seq__loc` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);

-- --------------------------------------------------------

--
-- Table structure for table `seq__recipe`
--

CREATE TABLE `seq__recipe` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `seq__recipe`
--

INSERT INTO `seq__recipe` (`id`) VALUES
(1),
(2),
(4),
(5),
(6),
(7),
(8),
(9);

-- --------------------------------------------------------

--
-- Table structure for table `seq__tag`
--

CREATE TABLE `seq__tag` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `seq__tag`
--

INSERT INTO `seq__tag` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6);

-- --------------------------------------------------------

--
-- Table structure for table `shop_cart`
--

CREATE TABLE `shop_cart` (
  `Cart_ID` varchar(16) NOT NULL,
  `Create_Date` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `Finish_Date` datetime(6) DEFAULT NULL,
  `Cart_Status` enum('Pending','Completed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `shop_cart`
--

INSERT INTO `shop_cart` (`Cart_ID`, `Create_Date`, `Finish_Date`, `Cart_Status`) VALUES
('CRT_001', '2023-10-30 02:15:50.000000', '2023-11-19 17:33:49.000000', 'Completed'),
('CRT_002', '2023-11-19 17:33:49.885014', '2023-12-09 15:11:47.000000', 'Completed'),
('CRT_003', '2023-12-09 15:11:47.227507', '2023-12-10 16:07:32.000000', 'Completed'),
('CRT_004', '2023-12-10 16:07:32.596863', '2023-12-10 22:11:27.000000', 'Completed'),
('CRT_005', '2023-12-10 22:11:27.473244', '2023-12-10 23:42:14.000000', 'Completed'),
('CRT_006', '2023-12-10 23:42:14.250238', '2023-12-10 23:43:32.000000', 'Completed'),
('CRT_007', '2023-12-10 23:43:32.071014', '2023-12-10 23:46:16.000000', 'Completed'),
('CRT_008', '2023-12-10 23:46:16.224899', '2023-12-10 23:48:39.000000', 'Completed'),
('CRT_009', '2023-12-10 23:48:39.965918', '2023-12-10 23:49:49.000000', 'Completed'),
('CRT_010', '2023-12-10 23:49:49.351546', '2023-12-10 23:50:21.000000', 'Completed'),
('CRT_011', '2023-12-10 23:50:21.953188', '2023-12-11 00:16:05.000000', 'Completed'),
('CRT_012', '2023-12-11 00:16:05.147095', '2023-12-11 06:25:41.000000', 'Completed'),
('CRT_013', '2023-12-11 06:25:41.582855', '2023-12-11 06:37:30.000000', 'Completed'),
('CRT_014', '2023-12-11 06:37:30.194036', '2023-12-11 06:46:03.000000', 'Completed'),
('CRT_015', '2023-12-11 06:46:03.047236', '2023-12-11 06:47:08.000000', 'Completed'),
('CRT_016', '2023-12-11 06:47:08.702004', '2023-12-11 17:35:59.000000', 'Completed'),
('CRT_017', '2023-12-11 17:35:59.104410', '2023-12-11 17:46:20.000000', 'Completed'),
('CRT_018', '2023-12-11 17:46:20.906566', NULL, 'Pending');

--
-- Triggers `shop_cart`
--
DELIMITER $$
CREATE TRIGGER `tg_cart_insert` BEFORE INSERT ON `shop_cart` FOR EACH ROW BEGIN
  INSERT INTO seq__cart VALUES (NULL);
  SET NEW.Cart_ID = CONCAT('CRT_', LPAD(LAST_INSERT_ID(), 3, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `shop_list`
--

CREATE TABLE `shop_list` (
  `Cart_ID` varchar(16) NOT NULL,
  `Item_ID` varchar(16) NOT NULL,
  `Status` enum('Pending','Confirmed','Canceled') NOT NULL DEFAULT 'Pending',
  `Qty` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `shop_list`
--

INSERT INTO `shop_list` (`Cart_ID`, `Item_ID`, `Status`, `Qty`) VALUES
('CRT_001', 'ITM_028', 'Confirmed', 7),
('CRT_001', 'ITM_044', 'Confirmed', 2),
('CRT_001', 'ITM_058', 'Confirmed', 4),
('CRT_001', 'ITM_062', 'Confirmed', 5),
('CRT_001', 'ITM_069', 'Confirmed', 2),
('CRT_002', 'ITM_003', 'Confirmed', 5),
('CRT_002', 'ITM_005', 'Confirmed', 5),
('CRT_002', 'ITM_006', 'Confirmed', 3),
('CRT_002', 'ITM_048', 'Canceled', 1),
('CRT_002', 'ITM_058', 'Confirmed', 5),
('CRT_002', 'ITM_061', 'Confirmed', 10),
('CRT_002', 'ITM_062', 'Canceled', 5),
('CRT_003', 'ITM_004', 'Confirmed', 6),
('CRT_003', 'ITM_006', 'Confirmed', 3),
('CRT_003', 'ITM_036', 'Confirmed', 2),
('CRT_003', 'ITM_062', 'Confirmed', 2),
('CRT_004', 'ITM_001', 'Confirmed', 1),
('CRT_005', 'ITM_003', 'Canceled', 1),
('CRT_005', 'ITM_012', 'Confirmed', 5),
('CRT_005', 'ITM_044', 'Canceled', 1),
('CRT_006', 'ITM_012', 'Confirmed', 6),
('CRT_007', 'ITM_003', 'Confirmed', 1),
('CRT_007', 'ITM_005', 'Confirmed', 1),
('CRT_007', 'ITM_044', 'Confirmed', 1),
('CRT_007', 'ITM_058', 'Confirmed', 1),
('CRT_007', 'ITM_062', 'Confirmed', 1),
('CRT_007', 'ITM_069', 'Confirmed', 1),
('CRT_008', 'ITM_004', 'Confirmed', 1),
('CRT_008', 'ITM_061', 'Confirmed', 1),
('CRT_009', 'ITM_003', 'Confirmed', 1),
('CRT_009', 'ITM_005', 'Confirmed', 1),
('CRT_009', 'ITM_006', 'Confirmed', 2),
('CRT_009', 'ITM_036', 'Confirmed', 1),
('CRT_009', 'ITM_044', 'Confirmed', 1),
('CRT_009', 'ITM_062', 'Confirmed', 2),
('CRT_010', 'ITM_001', 'Confirmed', 1),
('CRT_010', 'ITM_048', 'Confirmed', 1),
('CRT_011', 'ITM_001', 'Canceled', 1),
('CRT_011', 'ITM_002', 'Confirmed', 1),
('CRT_011', 'ITM_005', 'Confirmed', 2),
('CRT_011', 'ITM_007', 'Confirmed', 1),
('CRT_011', 'ITM_010', 'Confirmed', 3),
('CRT_011', 'ITM_049', 'Confirmed', 2),
('CRT_011', 'ITM_057', 'Confirmed', 1),
('CRT_011', 'ITM_062', 'Confirmed', 1),
('CRT_011', 'ITM_068', 'Confirmed', 1),
('CRT_012', 'ITM_001', 'Confirmed', 3),
('CRT_012', 'ITM_002', 'Canceled', 2),
('CRT_012', 'ITM_006', 'Confirmed', 5),
('CRT_012', 'ITM_022', 'Confirmed', 5),
('CRT_012', 'ITM_055', 'Confirmed', 10),
('CRT_012', 'ITM_071', 'Confirmed', 2),
('CRT_012', 'ITM_077', 'Canceled', 3),
('CRT_013', 'ITM_002', 'Canceled', 3),
('CRT_013', 'ITM_003', 'Confirmed', 10),
('CRT_013', 'ITM_005', 'Confirmed', 5),
('CRT_013', 'ITM_022', 'Confirmed', 5),
('CRT_013', 'ITM_028', 'Canceled', 5),
('CRT_013', 'ITM_053', 'Confirmed', 5),
('CRT_013', 'ITM_055', 'Confirmed', 15),
('CRT_013', 'ITM_057', 'Confirmed', 3),
('CRT_013', 'ITM_071', 'Confirmed', 10),
('CRT_013', 'ITM_078', 'Confirmed', 5),
('CRT_014', 'ITM_001', 'Confirmed', 5),
('CRT_014', 'ITM_002', 'Confirmed', 3),
('CRT_014', 'ITM_003', 'Confirmed', 10),
('CRT_014', 'ITM_005', 'Confirmed', 5),
('CRT_014', 'ITM_010', 'Confirmed', 10),
('CRT_014', 'ITM_022', 'Confirmed', 5),
('CRT_014', 'ITM_055', 'Confirmed', 15),
('CRT_014', 'ITM_071', 'Confirmed', 20),
('CRT_015', 'ITM_012', 'Confirmed', 4),
('CRT_016', 'ITM_012', 'Confirmed', 10),
('CRT_017', 'ITM_001', 'Confirmed', 10),
('CRT_017', 'ITM_005', 'Canceled', 10),
('CRT_017', 'ITM_022', 'Canceled', 10),
('CRT_017', 'ITM_054', 'Confirmed', 15),
('CRT_017', 'ITM_055', 'Confirmed', 20),
('CRT_017', 'ITM_057', 'Confirmed', 5),
('CRT_017', 'ITM_071', 'Confirmed', 20),
('CRT_017', 'ITM_080', 'Confirmed', 10);

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `Tag_ID` varchar(16) NOT NULL,
  `Tag_Name` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`Tag_ID`, `Tag_Name`) VALUES
('TAG_001', 'Fruit'),
('TAG_002', 'Vegetable'),
('TAG_003', 'Protein'),
('TAG_004', 'Dairy'),
('TAG_005', 'Grains'),
('TAG_006', 'Drinks');

--
-- Triggers `tag`
--
DELIMITER $$
CREATE TRIGGER `tg_tag_insert` BEFORE INSERT ON `tag` FOR EACH ROW BEGIN
  INSERT INTO seq__tag VALUES (NULL);
  SET NEW.Tag_ID = CONCAT('TAG_', LPAD(LAST_INSERT_ID(), 3, '0'));
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `item_information`
--
ALTER TABLE `item_information`
  ADD PRIMARY KEY (`Item_ID`),
  ADD KEY `tag_id_from_category` (`Tag_ID`);

--
-- Indexes for table `item_in_fridge`
--
ALTER TABLE `item_in_fridge`
  ADD PRIMARY KEY (`Inv_ID`),
  ADD KEY `fridge_cart_id_from_cart` (`Cart_ID`),
  ADD KEY `fridge_loc_id_from_location` (`Loc_ID`),
  ADD KEY `fridge_item_id_from_info` (`Item_ID`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`Loc_ID`);

--
-- Indexes for table `recipe_book`
--
ALTER TABLE `recipe_book`
  ADD PRIMARY KEY (`Recipe_ID`);

--
-- Indexes for table `recipe_ing`
--
ALTER TABLE `recipe_ing`
  ADD PRIMARY KEY (`Recipe_ID`,`Item_ID`),
  ADD KEY `recipe_item_id_from_item_info` (`Item_ID`);

--
-- Indexes for table `seq__cart`
--
ALTER TABLE `seq__cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seq__inv`
--
ALTER TABLE `seq__inv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seq__item_info`
--
ALTER TABLE `seq__item_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seq__loc`
--
ALTER TABLE `seq__loc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seq__recipe`
--
ALTER TABLE `seq__recipe`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seq__tag`
--
ALTER TABLE `seq__tag`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shop_cart`
--
ALTER TABLE `shop_cart`
  ADD PRIMARY KEY (`Cart_ID`);

--
-- Indexes for table `shop_list`
--
ALTER TABLE `shop_list`
  ADD PRIMARY KEY (`Cart_ID`,`Item_ID`),
  ADD KEY `item_id_from_item_info` (`Item_ID`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`Tag_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `seq__cart`
--
ALTER TABLE `seq__cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `seq__inv`
--
ALTER TABLE `seq__inv`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `seq__item_info`
--
ALTER TABLE `seq__item_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `seq__loc`
--
ALTER TABLE `seq__loc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `seq__recipe`
--
ALTER TABLE `seq__recipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `seq__tag`
--
ALTER TABLE `seq__tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item_information`
--
ALTER TABLE `item_information`
  ADD CONSTRAINT `tag_id_from_category` FOREIGN KEY (`Tag_ID`) REFERENCES `tag` (`Tag_ID`);

--
-- Constraints for table `item_in_fridge`
--
ALTER TABLE `item_in_fridge`
  ADD CONSTRAINT `fridge_cart_id_from_cart` FOREIGN KEY (`Cart_ID`) REFERENCES `shop_cart` (`Cart_ID`),
  ADD CONSTRAINT `fridge_item_id_from_item_info` FOREIGN KEY (`Item_ID`) REFERENCES `item_information` (`Item_ID`),
  ADD CONSTRAINT `fridge_loc_id_from_location` FOREIGN KEY (`Loc_ID`) REFERENCES `location` (`Loc_ID`);

--
-- Constraints for table `recipe_ing`
--
ALTER TABLE `recipe_ing`
  ADD CONSTRAINT `recipe_id_from_book` FOREIGN KEY (`Recipe_ID`) REFERENCES `recipe_book` (`Recipe_ID`),
  ADD CONSTRAINT `recipe_item_id_from_item_info` FOREIGN KEY (`Item_ID`) REFERENCES `item_information` (`Item_ID`);

--
-- Constraints for table `shop_list`
--
ALTER TABLE `shop_list`
  ADD CONSTRAINT `cart_id_from_cart` FOREIGN KEY (`Cart_ID`) REFERENCES `shop_cart` (`Cart_ID`),
  ADD CONSTRAINT `item_id_from_item_info` FOREIGN KEY (`Item_ID`) REFERENCES `item_information` (`Item_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
