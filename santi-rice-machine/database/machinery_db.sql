-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2026 at 11:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `machinery_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `consumables`
--

CREATE TABLE `consumables` (
  `id` int(11) NOT NULL,
  `consumable_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consumables`
--

INSERT INTO `consumables` (`id`, `consumable_name`, `created_at`) VALUES
(1, 'c1', '2026-02-27 07:28:07'),
(2, 'all', '2026-02-27 07:37:19'),
(3, 'try', '2026-02-27 08:52:37'),
(4, 'jc1', '2026-02-27 09:32:37');

-- --------------------------------------------------------

--
-- Table structure for table `consumable_entries`
--

CREATE TABLE `consumable_entries` (
  `id` int(11) NOT NULL,
  `entry_date` date NOT NULL,
  `machine_code` varchar(100) NOT NULL,
  `machine_description` text NOT NULL,
  `consumable_name` varchar(255) NOT NULL,
  `opening` decimal(10,2) DEFAULT 0.00,
  `dealer_entry` varchar(55) DEFAULT '0.00',
  `purchase_entry` decimal(10,2) DEFAULT 0.00,
  `use_entry` decimal(10,2) DEFAULT 0.00,
  `staff` varchar(150) NOT NULL,
  `closing_entry` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consumable_entries`
--

INSERT INTO `consumable_entries` (`id`, `entry_date`, `machine_code`, `machine_description`, `consumable_name`, `opening`, `dealer_entry`, `purchase_entry`, `use_entry`, `staff`, `closing_entry`, `created_at`) VALUES
(1, '2026-02-03', 'p1', 'power machine', 'c1', 15.00, '0.00', 45.00, 14.00, 'dfgvsdgfsd', 14.00, '2026-02-27 07:28:48'),
(2, '2026-02-26', 'ram', 'saam', 'all', 111.00, '0.00', 11.00, 11.00, 'bbbbbbbbbb', 111.00, '2026-02-27 07:37:59'),
(3, '2026-02-05', 'try', 'try', 'try', 7.00, '0.00', 7777777.00, 99999999.99, 'asd', 7777.00, '2026-02-27 08:53:24'),
(4, '2026-02-10', 'j1', 'joydip', 'jc1', 12.00, 'sanju baba', 4.00, 5.00, 'jaggu', 33.00, '2026-02-27 09:45:11'),
(5, '2026-02-27', 'jay', 'kumar', 'jc1', 1.00, 'ariobnda', 1.00, 1.00, 'tony', 1.00, '2026-02-27 10:04:22');

-- --------------------------------------------------------

--
-- Table structure for table `machines`
--

CREATE TABLE `machines` (
  `id` int(11) NOT NULL,
  `machine_code` varchar(100) NOT NULL,
  `machine_description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `machines`
--

INSERT INTO `machines` (`id`, `machine_code`, `machine_description`, `created_at`) VALUES
(1, '', '', '2026-02-27 07:26:17'),
(2, 'p1', 'power machine', '2026-02-27 07:26:17'),
(3, 'ram', 'saam', '2026-02-27 07:32:30'),
(4, 'jay', 'kumar', '2026-02-27 07:36:28'),
(5, 'try', 'try', '2026-02-27 08:52:07'),
(6, 'wqe', 'wqe', '2026-02-27 09:21:35'),
(7, 'j1', 'joydip', '2026-02-27 09:27:57');

-- --------------------------------------------------------

--
-- Table structure for table `sub_consumables`
--

CREATE TABLE `sub_consumables` (
  `id` int(11) NOT NULL,
  `consumable_id` int(11) NOT NULL,
  `sub_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_consumables`
--

INSERT INTO `sub_consumables` (`id`, `consumable_id`, `sub_name`, `created_at`) VALUES
(1, 1, 'dfedew', '2026-02-27 07:29:24'),
(2, 1, 'sdfs', '2026-02-27 07:29:24'),
(3, 2, 'nnnnnnnnnn', '2026-02-27 07:38:42'),
(4, 2, 'aaaaaaaaaaaaaaa', '2026-02-27 07:38:42'),
(5, 2, 'qqqqqqqqqqqqqq', '2026-02-27 07:38:42'),
(6, 4, 'jm1', '2026-02-27 09:36:07'),
(7, 4, 'jm3', '2026-02-27 09:36:21');

-- --------------------------------------------------------

--
-- Table structure for table `work_entry`
--

CREATE TABLE `work_entry` (
  `id` int(11) NOT NULL,
  `machine_code` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `work` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `staff` varchar(150) NOT NULL,
  `work_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_entry`
--

INSERT INTO `work_entry` (`id`, `machine_code`, `description`, `work`, `notes`, `staff`, `work_date`, `created_at`) VALUES
(2, 'p2', '', 'dw', 'dwqdwq', 'dwqd', '2026-02-27', '2026-02-27 07:26:58'),
(4, 'p1', 'power machine', 'sdfsf', 'dsada', 'sadasd', '2026-02-27', '2026-02-27 07:27:10'),
(6, 'ram', 'saam', 'nothing', 'right', 'left', '2026-02-27', '2026-02-27 07:34:51'),
(7, 'jay', 'kumar', 'lol', 'nooooop', 'why', '2026-02-27', '2026-02-27 07:36:51'),
(8, 'try', 'try', 'try', 'try', 'try', '2026-02-27', '2026-02-27 08:52:26'),
(9, 'j1', 'joydip', 'hoogly', 'office', 'jaggu', '2026-02-27', '2026-02-27 09:28:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `consumables`
--
ALTER TABLE `consumables`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consumable_entries`
--
ALTER TABLE `consumable_entries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `machines`
--
ALTER TABLE `machines`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `machine_code` (`machine_code`);

--
-- Indexes for table `sub_consumables`
--
ALTER TABLE `sub_consumables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `consumable_id` (`consumable_id`,`sub_name`);

--
-- Indexes for table `work_entry`
--
ALTER TABLE `work_entry`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `consumables`
--
ALTER TABLE `consumables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `consumable_entries`
--
ALTER TABLE `consumable_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `machines`
--
ALTER TABLE `machines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sub_consumables`
--
ALTER TABLE `sub_consumables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `work_entry`
--
ALTER TABLE `work_entry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sub_consumables`
--
ALTER TABLE `sub_consumables`
  ADD CONSTRAINT `fk_consumable` FOREIGN KEY (`consumable_id`) REFERENCES `consumables` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
