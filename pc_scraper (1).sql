-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2026 at 08:57 AM
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
-- Database: `pc_scraper`
--

-- --------------------------------------------------------

--
-- Table structure for table `hardware_detail`
--

CREATE TABLE `hardware_detail` (
  `id` int(11) NOT NULL,
  `cpu` varchar(50) NOT NULL,
  `ram` varchar(20) NOT NULL,
  `int_gpu` varchar(70) NOT NULL,
  `ext_gpu` varchar(70) NOT NULL,
  `storages` varchar(2048) NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hardware_detail`
--

INSERT INTO `hardware_detail` (`id`, `cpu`, `ram`, `int_gpu`, `ext_gpu`, `storages`, `uid`) VALUES
(20, 'Intel(R) Core(TM) i9-14900HX', '64 GB DDR5', 'Intel(R) UHD Graphics 2 GB', 'NVIDIA GeForce RTX 4060 Laptop GPU 8 GB', 'T-FORCE TM8FFQ001T | Disk | 953.87 GB,MTFDKBA1T0QFM-1BD1AABGB | Disk | 953.87 GB', 30);

-- --------------------------------------------------------

--
-- Table structure for table `network_tester`
--

CREATE TABLE `network_tester` (
  `id` int(11) NOT NULL,
  `role` varchar(35) NOT NULL,
  `domain_ip` varchar(128) NOT NULL,
  `domain` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `network_tester`
--

INSERT INTO `network_tester` (`id`, `role`, `domain_ip`, `domain`) VALUES
(1, 'stream', '192.178.174.91', 'YouTube'),
(2, 'stream', '57.144.242.1', 'Facebook'),
(3, 'stream', '39.59.185.111', 'OBS Project'),
(4, 'stream', '104.16.143.22', 'Steam Labs'),
(5, 'stream', '34.120.111.11', 'VMix'),
(6, 'dev', '20.205.243.166', 'Github'),
(7, 'dev', '23.185.0.4', 'Docker'),
(8, 'dev', '142.250.143.113', 'Google'),
(9, 'dev', '108.158.46.70', 'Brave'),
(10, 'dev', '199.36.158.100', 'Flutter'),
(11, 'test', '162.159.129.53', 'Postman'),
(12, 'test', '151.101.2.132', 'JMeter'),
(13, 'test', '185.199.111.153', 'Selenium'),
(14, 'test', '20.205.213.166', 'Github'),
(15, 'test', '65.9.168.59', 'Atlassian'),
(16, 'normal', '192.178.174.91', 'Youtube'),
(17, 'normal', '142.250.143.133', 'Google'),
(18, 'normal', '57.144.243.32', 'Whatsapp'),
(19, 'normal', '223.224.20.146', 'Windows Update'),
(20, 'normal', '13.107.6.156', 'Office 365');

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `otp` varchar(128) NOT NULL,
  `track` varchar(20) NOT NULL,
  `attempts` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `uid` int(11) NOT NULL,
  `state` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otp_codes`
--

INSERT INTO `otp_codes` (`id`, `otp`, `track`, `attempts`, `created_at`, `expires_at`, `uid`, `state`) VALUES
(258, '$2y$10$m92cYBccPzxmx4FisvtDDubB6xCnsjS/ryCWJz68ebiTHQbTAZVee', 'mail', 0, '2026-05-10 07:18:59', '2026-05-10 07:48:59', 30, 'used'),
(259, '$2y$10$DF.P8iz.pCYGY0PPj2ifDeqV1U9jtL1Fstah4bAHEdwBx6TzhwKm6', 'sms', 0, '2026-05-10 12:15:34', '2026-05-10 12:45:34', 30, 'used'),
(260, '$2y$10$wBwrBW9BykiBgbDUeas.O.FrUTdIb8HhdG9B8V/dG6TUx22OTUYGq', 'sms', 0, '2026-05-13 01:54:00', '2026-05-13 02:24:00', 30, 'used'),
(261, '$2y$10$SuuFiqD/F.WuvmXUOIPl8.SbPKf1b2EvJYwmw5TZmCTkUChNzU/Ui', 'mail', 0, '2026-05-13 02:12:58', '2026-05-13 02:42:57', 30, 'used'),
(262, '$2y$10$.pdOok3j3WzG5.Cp4ducZ.aSdjGkHIK.dDEwCMzf8Q/.rlfCZSqm.', 'mail', 0, '2026-05-13 02:16:31', '2026-05-13 02:46:31', 30, 'used'),
(263, '$2y$10$dV7v.YCvttM12o7jOUK/f.qd5bnS3uXC2XXFveRmksoFuYHGWFxIu', 'mail', 0, '2026-05-13 04:46:07', '2026-05-13 05:16:07', 30, 'used'),
(264, '$2y$10$W9OIkqnPy72sCTvsu9naieWvB5Xl83OrFLmVKRlZi.TEgnLejJ3uq', 'mail', 0, '2026-05-13 07:22:50', '2026-05-13 07:52:50', 30, 'used'),
(265, '$2y$10$Ts1BIK028R8RC3U96x3PAejzAI38A5EXWnYW1ORWlhKlDU50pmPT.', 'sms', 0, '2026-05-13 10:44:20', '2026-05-13 11:14:20', 30, 'used'),
(266, '$2y$10$l2p59r86IsVfsX2pfKnDOOd1KAux82xHfer.WqI4qu7JVmp34KQ52', 'mail', 0, '2026-05-13 22:49:06', '2026-05-13 23:19:06', 30, 'used'),
(267, '$2y$10$TYiddWB1k69ZEEiYdKU./esZ8qXJs0k9Piyth95EL0QYfXW3VrFUG', 'mail', 0, '2026-05-14 03:57:19', '2026-05-14 04:27:19', 30, 'used'),
(268, '$2y$10$OwqI6ZjcpIkl5uG1BIOF.OnAcncU6Neyi9WxEnyON2ile7tHPlMUG', 'mail', 0, '2026-05-14 06:28:13', '2026-05-14 06:58:13', 30, 'used'),
(269, '$2y$10$cDf2MyZTJ.BnNZGrDqWyPeY12O9pwjbYBTlhDSImFKYki2ngP412u', 'sms', 0, '2026-05-14 07:54:12', '2026-05-14 08:24:12', 30, 'not-used|active'),
(270, '$2y$10$hXzNboyoh8cl328Dae.zdetbtS1C.C5buZKtn4MhNHUAR1faWke5a', 'sms', 0, '2026-05-14 07:54:32', '2026-05-14 08:24:32', 30, 'not-used|active'),
(271, '$2y$10$y6EUID34mkd82DK06382MudS3U2uUbh6esE6PYG0i95wfxa4jFvMK', 'mail', 0, '2026-05-14 07:56:06', '2026-05-14 08:26:06', 30, 'used'),
(272, '$2y$10$zVapog8geEJjPkflhhRiWeNoKz7vu/JrkE5Gtl2uOW13AfSGt5Y4a', 'mail', 0, '2026-05-14 08:40:32', '2026-05-14 09:10:32', 30, 'used'),
(273, '$2y$10$TEf1pfIA5tqx2eohowh95uu5us6HfdOUpNHwzRo2.avomgGXrCbV.', 'mail', 0, '2026-05-14 09:24:13', '2026-05-14 09:54:13', 30, 'used'),
(274, '$2y$10$hoXpRHczWjRG1msj/UIaZu.5MQTIdxb1QJSTfoI9XvVjJhWudE57q', 'mail', 0, '2026-05-14 13:58:51', '2026-05-14 14:28:51', 30, 'used'),
(275, '$2y$10$wdmmpz3gN2Syre/zAzbqUO22vjB8WwLIB5D03d0FQ1uyt9ikE04Bq', 'mail', 0, '2026-05-14 16:31:09', '2026-05-14 17:01:09', 30, 'used'),
(276, '$2y$10$QS9kyokqmrOol5y4Ov8mGOqYFV5dlpYKP/rqsZf4xwLBJMWsszPDG', 'mail', 0, '2026-05-14 21:42:31', '2026-05-14 22:12:31', 30, 'used'),
(277, '$2y$10$2H8T9sOXfo/3oSupuE9ocu1MbQdwuq1ytxGhPSKJhah1hwHTyOD6e', 'mail', 0, '2026-05-15 00:27:38', '2026-05-15 00:57:38', 30, 'used'),
(278, '$2y$10$UA82xSz69Vw9BpIzXfPrYeKMprAxY1.353sLFx.Xb/fpCpBbRY2by', 'mail', 0, '2026-05-15 04:50:21', '2026-05-15 05:20:21', 30, 'used'),
(279, '$2y$10$E3mh/9uRVCnBZp.7wwOdDOfHOmNcd8jJBXFL7HZzWWYdlZRU0FM3S', 'mail', 0, '2026-05-15 04:53:29', '2026-05-15 05:23:29', 30, 'used'),
(280, '$2y$10$7FqUBzCN3e1Kmq4NK5TYJ.YUCnfO10Yy9Jn1rnl2UD16ZfG.DJHiq', 'mail', 0, '2026-05-15 04:58:10', '2026-05-15 05:28:10', 30, 'used'),
(281, '$2y$10$l6WsNjSou/VvgB35ktwJAudrY/mdq4lcqskn7VQNxzBYGxlDdTgoW', 'mail', 0, '2026-05-15 05:02:22', '2026-05-15 05:32:22', 30, 'used'),
(282, '$2y$10$GT4oqPtFfXmi9hGUP7gnuuhWujyE3AN9KrWducIPAeH.k11pxCfya', 'mail', 0, '2026-05-15 05:11:39', '2026-05-15 05:41:39', 30, 'used'),
(283, '$2y$10$W30yAYo6Tzg/.TO6Fk7hKOz4B5AzAD1rBv0ccsGWnmW0ufEMCeEyu', 'mail', 0, '2026-05-15 05:16:50', '2026-05-15 05:46:50', 30, 'used'),
(284, '$2y$10$OQoQsE5zX4zIZmeve7c69.QNZwizkKjEgbbWsw2BM8gMdaqFHZTwa', 'mail', 0, '2026-05-15 05:19:09', '2026-05-15 05:49:08', 30, 'used');

-- --------------------------------------------------------

--
-- Table structure for table `software_detail`
--

CREATE TABLE `software_detail` (
  `id` int(11) NOT NULL,
  `device_name` varchar(50) NOT NULL,
  `win_version` varchar(70) NOT NULL,
  `build_version` varchar(70) NOT NULL,
  `last_up` varchar(40) NOT NULL,
  `license` varchar(65) NOT NULL,
  `activation` varchar(70) NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `software_detail`
--

INSERT INTO `software_detail` (`id`, `device_name`, `win_version`, `build_version`, `last_up`, `license`, `activation`, `uid`) VALUES
(20, 'SUPUN-PC', 'Microsoft Windows 11 Pro', '10.0.26200', '21-04-2026', 'Activated/Genuine', 'Windows(R) Operating System, RETAIL channel', 30);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `email` varchar(120) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `uname` varchar(50) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `last_time` varchar(40) DEFAULT NULL,
  `last_ip` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `lname`, `email`, `pass`, `uname`, `telephone`, `last_time`, `last_ip`) VALUES
(30, 'Nimsara', 'Madushani', 'supun200202@gmail.com', '$2a$12$K7U1QEwvGPgZD4u1cgBsq.234Kj308aVe1De51opXhqabbiQEK4Zy', 'Supun-2002', '0761571745', '15/05/2026-10:49:30 AM', '10.16.142.89'),
(31, 'Saluka', 'Dias', 'gunnery2002@gmail.com', '$2y$10$cIcTDWuYCxozkp5DiSrA4ubL8dCLkQnM9eCoFR5mIn7HbhQwDGYkO', 'Supun-2001', '0773221716', NULL, NULL),
(32, '', '', '', '$2y$10$ovf1CrL51EIwZHo2gFb94.5mbBxVCA3oYJspYRMA8RI.KNJbrkyCW', '', '', '0', '0'),
(33, '', '', '', '$2y$10$7KmOfgDebJlpm5SAGa3X7eUBOuncbqYzEgYZNeZtMpntiW0aF9Qpi', '', '', '0', '0'),
(34, '', '', '', '$2y$10$lDPadOnzYZDpHBoIcV6J9uoedptY5rHyYIrK/RCorHbIOHyJSPPBG', '', '', '0', '0'),
(35, '', '', '', '$2y$10$9uNBiyqKj0MHiHaYwVzpueAzFMF6lf976TFG5XYCuRiGmdLiQtmKe', '', '', '0', '0'),
(36, '', '', '', '$2y$10$ta3aFg7b8vB7cmXUI8Fq2OOV4Yw5YzHPl9NUlG2CCFkg90uXsFM.K', '', '', '0', '0'),
(37, '', '', '', '$2y$10$TMNJaVK9/IJh6/PrIDTLXuyE/G/UOXr/hXU7cYfhmUEhONZykpuIG', '', '', '0', '0'),
(38, '', '', '', '$2y$10$KAa..MJ3GX/s2e41XprVgOYiL/JHaKcqne7aazYcngrjUaTgfvy0.', '', '', '0', '0'),
(39, '', '', '', '$2y$10$91QBWn2b6uUVJXQ.M8y08O9YJvueNxgWvl3qZRyzLLCQZUdz8Vdle', '', '', '0', '0'),
(40, '', '', '', '$2y$10$un.XV2FhlcvKyUVwdyKuMeD5J3vEPTUI0uj.4z.hPljE8QVkfe1Je', '', '', '0', '0'),
(41, '', '', '', '$2y$10$8IPR.SZIkVWUUaDgnOYGJOAZvH/FXlNR5Zf5ukk9/OjLn92YBv56C', '', '', '0', '0'),
(42, '', '', '', '$2y$10$w70Psuev3y2Y1euebTeCeeuhfrpD9Gnz9SeT5/GGGk8umDqdhIPv.', '', '', '0', '0'),
(43, '', '', '', '$2y$10$3UR0Jl6J1LT1/WK.sT8d0ev9F279MTywpQRzeq7arVrpvG2pi4rw6', '', '', '0', '0'),
(44, '', '', '', '$2y$10$sVABJn3LtI9y2CWlUJr3cO9E/rxtlAl61/386THXOQzstFwLKCNiO', '', '', '0', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hardware_detail`
--
ALTER TABLE `hardware_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `network_tester`
--
ALTER TABLE `network_tester`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `software_detail`
--
ALTER TABLE `software_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hardware_detail`
--
ALTER TABLE `hardware_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `network_tester`
--
ALTER TABLE `network_tester`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=285;

--
-- AUTO_INCREMENT for table `software_detail`
--
ALTER TABLE `software_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hardware_detail`
--
ALTER TABLE `hardware_detail`
  ADD CONSTRAINT `hardware_detail_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`);

--
-- Constraints for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD CONSTRAINT `otp_codes_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`);

--
-- Constraints for table `software_detail`
--
ALTER TABLE `software_detail`
  ADD CONSTRAINT `software_detail_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
