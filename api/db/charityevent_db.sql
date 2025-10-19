/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50622
Source Host           : localhost:3306
Source Database       : charityevent_db

Target Server Type    : MYSQL
Target Server Version : 50622
File Encoding         : 65001

Date: 2025-10-19 13:07:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `CategoryID` int(10) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) NOT NULL,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `CategoryName` (`CategoryName`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES ('7', 'Art Exhibition');
INSERT INTO `categories` VALUES ('4', 'Concert');
INSERT INTO `categories` VALUES ('8', 'Food Festival');
INSERT INTO `categories` VALUES ('2', 'Fun Run');
INSERT INTO `categories` VALUES ('1', 'Gala Dinner');
INSERT INTO `categories` VALUES ('3', 'Silent Auction');
INSERT INTO `categories` VALUES ('6', 'Sports Tournament');
INSERT INTO `categories` VALUES ('5', 'Workshop');

-- ----------------------------
-- Table structure for contact
-- ----------------------------
DROP TABLE IF EXISTS `contact`;
CREATE TABLE `contact` (
  `ContactID` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(255) NOT NULL,
  `ContactEmail` varchar(255) NOT NULL,
  `FeedBack` text,
  `SubmissionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ContactID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of contact
-- ----------------------------
INSERT INTO `contact` VALUES ('1', '张三', 'zhangsan@email.com', '你们的慈善活动非常棒！我参加了上个月的募捐活动，组织得很好，希望以后能参加更多类似的活动。', '2024-01-15 10:30:00');
INSERT INTO `contact` VALUES ('2', '李四', 'lisi@company.com', '我想了解更多关于志愿者机会的信息。请问如何成为你们的长期志愿者？需要什么条件？', '2024-01-16 14:22:15');
INSERT INTO `contact` VALUES ('3', '王五', 'wangwu123@gmail.com', '我对儿童教育项目很感兴趣，能否提供更多关于贫困儿童助学计划的详细信息？谢谢！', '2024-01-18 09:45:30');
INSERT INTO `contact` VALUES ('4', '赵六', 'zhaoliu_tech@hotmail.com', '建议增加线上捐款渠道，目前只支持银行转账不太方便。希望可以考虑支付宝和微信支付。', '2024-01-20 16:10:45');
INSERT INTO `contact` VALUES ('5', 'Sarah Johnson', 'sarah.j@example.com', 'I attended your charity run last month and it was amazing! The organization was perfect and the atmosphere was very positive. Looking forward to the next event!', '2024-01-22 11:20:00');
INSERT INTO `contact` VALUES ('6', '陈小明', 'chenxiaoming@qq.com', '网站上的活动信息更新不够及时，有些活动已经结束了但还在显示。建议加强信息维护。', '2024-01-25 13:15:20');
INSERT INTO `contact` VALUES ('7', '刘芳', 'liufang_work@163.com', '我们公司想与贵机构合作举办员工慈善日活动，请提供合作流程和相关资料。谢谢！', '2024-01-28 15:40:10');
INSERT INTO `contact` VALUES ('8', 'Michael Brown', 'm.brown@company.org', 'Do you have any English version materials about your charity programs? I would like to share with my international colleagues.', '2024-01-30 08:55:35');
INSERT INTO `contact` VALUES ('9', '黄美丽', 'huangmeili@outlook.com', '感谢你们为社区做出的贡献！我每月都会定期捐款，希望款项使用更加透明化。', '2024-02-01 17:25:50');
INSERT INTO `contact` VALUES ('10', 'David Smith', 'david.smith@email.com', 'The registration process for the charity gala was smooth and easy. Great job on the website user experience!', '2024-02-03 10:10:15');
INSERT INTO `contact` VALUES ('11', '周涛', 'zhoutao_business@sina.com', '建议增加企业社会责任项目的合作机会，我们公司有预算支持慈善事业。', '2024-02-05 14:35:40');
INSERT INTO `contact` VALUES ('12', 'tert', 'h.wu.31@student.scu.edu.au', '5645756475467', '2025-10-15 12:46:50');
INSERT INTO `contact` VALUES ('13', 'tert', 'h.wu.31@student.scu.edu.au', '1312312313123123', '2025-10-15 12:47:00');
INSERT INTO `contact` VALUES ('14', 'tert', 'h.wu.31@student.scu.edu.au', 'yrtyrtyrtyrty', '2025-10-15 14:11:37');
INSERT INTO `contact` VALUES ('15', 'tert', 'h.wu.31@student.scu.edu.au', '654645645645', '2025-10-15 23:14:47');

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `EventID` int(10) NOT NULL AUTO_INCREMENT,
  `EventName` varchar(255) NOT NULL,
  `EventImage` varchar(255) DEFAULT NULL,
  `EventDate` date NOT NULL,
  `Location` varchar(255) NOT NULL,
  `Description` text,
  `TicketPrice` decimal(8,2) DEFAULT '0.00',
  `CurrentAttendees` int(10) DEFAULT '0',
  `GoalAttendees` int(10) NOT NULL,
  `CurrentStatus` tinyint(1) DEFAULT '1',
  `CategoryID` int(10) DEFAULT NULL,
  PRIMARY KEY (`EventID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` VALUES ('1', 'Annual Charity Gala 2025', 'assets/img/event_img/1.jpg', '2025-11-15', 'Sydney Opera House', 'Join us for an elegant evening of dining and entertainment to support children education.', '150.00', '45', '200', '1', '1');
INSERT INTO `events` VALUES ('2', 'Sunrise Fun Run', 'assets/img/event_img/2.jpg', '2025-10-20', 'Melbourne Park', 'Start your day with a refreshing 5km run to raise funds for cancer research.', '25.00', '120', '300', '1', '2');
INSERT INTO `events` VALUES ('3', 'Art for Hope Exhibition', 'assets/img/event_img/3.jpg', '2025-12-05', 'Brisbane Art Gallery', 'Featuring local artists with all proceeds supporting mental health initiatives.', '0.00', '80', '150', '1', '7');
INSERT INTO `events` VALUES ('4', 'Gourmet Giving Festival', 'assets/img/event_img/4.jpg', '2025-11-30', 'Adelaide Showground', 'Taste dishes from top chefs while supporting food security programs.', '45.00', '200', '400', '1', '8');
INSERT INTO `events` VALUES ('5', 'Tennis Charity Open', 'assets/img/event_img/5.jpg', '2025-10-10', 'Perth Tennis Club', 'Amateur tennis tournament with all entry fees donated to youth sports programs.', '30.00', '60', '100', '1', '6');
INSERT INTO `events` VALUES ('6', 'Symphony of Hope', 'assets/img/event_img/6.jpg', '2025-12-20', 'Melbourne Concert Hall', 'An evening of classical music to raise funds for medical research.', '75.00', '150', '250', '1', '4');
INSERT INTO `events` VALUES ('7', 'Silent Auction Extravaganza', 'assets/img/event_img/7.jpg', '2025-11-25', 'Online Event', 'Bid on exclusive items and experiences from the comfort of your home.', '0.00', '95', '200', '1', '3');
INSERT INTO `events` VALUES ('8', 'Digital Skills Workshop', 'assets/img/event_img/8.jpg', '2025-10-15', 'Sydney Tech Hub', 'Learn essential digital skills while supporting tech education for underprivileged youth.', '20.00', '30', '80', '1', '5');
INSERT INTO `events` VALUES ('9', 'Community Coding Workshop', 'assets/img/event_img/9.jpg', '2025-08-15', 'Canberra Innovation Hub', 'A hands-on workshop for aspiring developers to learn the basics of web development, supporting tech literacy programs.', '25.00', '50', '50', '1', '5');
INSERT INTO `events` VALUES ('10', 'Riverfront Music Fest', 'assets/img/event_img/10.jpg', '2025-10-04', 'Brisbane Riverstage', 'An outdoor concert featuring the best local bands. All proceeds will benefit musicians in need.', '55.00', '415', '1000', '1', '4');
INSERT INTO `events` VALUES ('11', 'Charity Volleyball Match', 'assets/img/event_img/11.jpg', '2025-09-05', 'Gold Coast Beach', 'Watch local celebrities and athletes compete in a friendly beach volleyball tournament for environmental causes.', '15.00', '133', '120', '1', '6');
INSERT INTO `events` VALUES ('12', 'Starlight Gala Dinner', 'assets/img/event_img/12.jpg', '2025-11-22', 'Crown Towers, Melbourne', 'Our most prestigious event of the year. A night of fine dining and auctions to fund our Starlight Children Program.', '250.00', '88', '300', '1', '1');
INSERT INTO `events` VALUES ('13', 'Taste of Tasmania Charity Drive', 'assets/img/event_img/13.jpg', '2025-12-28', 'Hobart Waterfront', 'A weekend-long food and wine festival showcasing local produce. A portion of every sale supports Tasmanian wildlife conservation.', '10.00', '451', '2000', '1', '8');
INSERT INTO `events` VALUES ('14', 'Art & Soul Auction (Postponed)', 'assets/img/event_img/14.jpg', '2025-11-01', 'Online Event', 'This event has been postponed. Please check back later for a new date. Originally for supporting emerging artists.', '0.00', '10', '150', '0', '3');
INSERT INTO `events` VALUES ('15', 'City to Bay Fun Run 2026', 'assets/img/event_img/15.jpg', '2026-03-15', 'Adelaide City Center', 'The annual city-to-bay run is back! Join thousands to raise money for major health research foundations.', '40.00', '36', '1500', '1', '2');
INSERT INTO `events` VALUES ('16', 'test', '/images/event-1760680234701-532605768.png', '2025-10-05', 'charity', 'test', '2.00', '1', '1', '1', '4');

-- ----------------------------
-- Table structure for registrations
-- ----------------------------
DROP TABLE IF EXISTS `registrations`;
CREATE TABLE `registrations` (
  `RegistrationID` int(10) NOT NULL AUTO_INCREMENT,
  `EventID` int(10) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `ContactEmail` varchar(255) NOT NULL,
  `NumberOfTickets` int(10) NOT NULL,
  `RegistrationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RegistrationID`),
  KEY `EventID` (`EventID`),
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of registrations
-- ----------------------------
INSERT INTO `registrations` VALUES ('1', '1', 'Alice Johnson', 'alice.j@example.com', '2', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('2', '1', 'Bob Williams', 'bob.w@example.com', '1', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('3', '2', 'Charlie Brown', 'charlie.b@example.com', '4', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('4', '2', 'Diana Prince', 'diana.p@example.com', '2', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('5', '4', 'Ethan Hunt', 'ethan.h@example.com', '5', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('6', '5', 'Fiona Glenanne', 'fiona.g@example.com', '2', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('7', '7', 'George Costanza', 'george.c@example.com', '1', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('8', '10', 'Helen Troy', 'helen.t@example.com', '3', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('9', '12', 'Ian Malcolm', 'ian.m@example.com', '2', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('10', '15', 'Jane Doe', 'jane.d@example.com', '1', '2025-10-12 12:39:16');
INSERT INTO `registrations` VALUES ('11', '11', 'RETT', 'user@example.com).', '7', '2025-10-13 20:44:56');
INSERT INTO `registrations` VALUES ('12', '11', 'GHF', 'user@example.com).', '1', '2025-10-13 20:45:22');
INSERT INTO `registrations` VALUES ('13', '10', 'EW', 'Euser@example.com', '6', '2025-10-13 20:45:50');
INSERT INTO `registrations` VALUES ('14', '10', 'rwe', 'user@example.com).', '18', '2025-10-13 20:58:14');
INSERT INTO `registrations` VALUES ('15', '9', 'rew', 'user@example.com', '13', '2025-10-13 21:03:36');
INSERT INTO `registrations` VALUES ('16', '1', 'John', 'user@example.com', '1', '2025-10-13 21:16:59');
INSERT INTO `registrations` VALUES ('17', '11', 'tert', '2274238777@qq.com', '1', '2025-10-14 14:03:42');
INSERT INTO `registrations` VALUES ('18', '11', 'tert', '2274238777@qq.com', '7', '2025-10-14 14:12:40');
INSERT INTO `registrations` VALUES ('19', '11', 'tert', '2274238777@qq.com', '1', '2025-10-14 14:12:56');
INSERT INTO `registrations` VALUES ('20', '11', 'tert', '2274238777@qq.com', '1', '2025-10-14 14:13:01');
INSERT INTO `registrations` VALUES ('21', '11', 'tert', '2274238777@qq.com', '1', '2025-10-14 14:25:08');
INSERT INTO `registrations` VALUES ('22', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 14:25:35');
INSERT INTO `registrations` VALUES ('23', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 14:26:35');
INSERT INTO `registrations` VALUES ('24', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 14:36:43');
INSERT INTO `registrations` VALUES ('25', '11', 'eqw ', 'h.wu.31@student.scu.edu.au', '3', '2025-10-14 14:36:50');
INSERT INTO `registrations` VALUES ('26', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 14:43:13');
INSERT INTO `registrations` VALUES ('27', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 14:46:29');
INSERT INTO `registrations` VALUES ('28', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 14:51:16');
INSERT INTO `registrations` VALUES ('29', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:03:07');
INSERT INTO `registrations` VALUES ('30', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:04:50');
INSERT INTO `registrations` VALUES ('31', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:05:01');
INSERT INTO `registrations` VALUES ('32', '10', 'eqw', '2274238777@qq.com', '1', '2025-10-14 15:06:40');
INSERT INTO `registrations` VALUES ('33', '10', 'eqw', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:06:52');
INSERT INTO `registrations` VALUES ('34', '10', 'eqw', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:07:25');
INSERT INTO `registrations` VALUES ('35', '11', 'eqw', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:10:47');
INSERT INTO `registrations` VALUES ('36', '11', 'eqw', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:19:49');
INSERT INTO `registrations` VALUES ('37', '11', 'eqw', 'h.wu.31@student.scu.edu.au', '1', '2025-10-14 15:19:55');
INSERT INTO `registrations` VALUES ('38', '11', 'eqw', 'h.wu.31@student.scu.edu.au', '12', '2025-10-14 15:20:48');
INSERT INTO `registrations` VALUES ('39', '11', 'tert', '2274238777@qq.com', '1', '2025-10-14 15:21:36');
INSERT INTO `registrations` VALUES ('40', '10', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 14:13:24');
INSERT INTO `registrations` VALUES ('41', '10', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 14:42:26');
INSERT INTO `registrations` VALUES ('42', '10', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 14:55:55');
INSERT INTO `registrations` VALUES ('43', '10', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 14:59:47');
INSERT INTO `registrations` VALUES ('44', '10', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 14:59:55');
INSERT INTO `registrations` VALUES ('45', '10', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 15:01:33');
INSERT INTO `registrations` VALUES ('46', '10', 'ewe', 'h.wu.31@student.scu.edu.au', '2', '2025-10-15 15:01:46');
INSERT INTO `registrations` VALUES ('47', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 15:04:25');
INSERT INTO `registrations` VALUES ('48', '11', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 15:05:27');
INSERT INTO `registrations` VALUES ('49', '11', 'eqw', '2274238777@qq.com', '1', '2025-10-15 15:06:38');
INSERT INTO `registrations` VALUES ('50', '10', 'eqw', '2274238777@qq.com', '1', '2025-10-15 15:11:06');
INSERT INTO `registrations` VALUES ('51', '10', 'tert', '2274238777@qq.com', '1', '2025-10-15 15:11:18');
INSERT INTO `registrations` VALUES ('52', '10', 'tert', 'h.wu.31@student.scu.edu.au', '16', '2025-10-15 15:11:31');
INSERT INTO `registrations` VALUES ('53', '10', 'tert', '2274238777@qq.com', '99', '2025-10-15 15:11:48');
INSERT INTO `registrations` VALUES ('54', '11', 'tert', '2274238777@qq.com', '1', '2025-10-15 15:12:04');
INSERT INTO `registrations` VALUES ('55', '11', 'tert', '2274238777@qq.com', '16', '2025-10-15 15:12:10');
INSERT INTO `registrations` VALUES ('56', '11', 'tert', '2274238777@qq.com', '1', '2025-10-15 15:21:44');
INSERT INTO `registrations` VALUES ('57', '9', 'tert', '2274238777@qq.com', '1', '2025-10-15 15:26:13');
INSERT INTO `registrations` VALUES ('58', '9', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 15:26:21');
INSERT INTO `registrations` VALUES ('59', '15', 'tert', 'h.wu.31@student.scu.edu.au', '1', '2025-10-15 18:10:38');
INSERT INTO `registrations` VALUES ('60', '10', 'rew', '2274238777@qq.com', '12', '2025-10-15 18:36:53');
INSERT INTO `registrations` VALUES ('61', '10', 'rew', '2274238777@qq.com', '7', '2025-10-15 18:37:09');
INSERT INTO `registrations` VALUES ('62', '10', 'rew', '2274238777@qq.com', '1', '2025-10-15 23:04:57');
INSERT INTO `registrations` VALUES ('63', '10', 'rew', '2274238777@qq.com', '1', '2025-10-15 23:05:03');
INSERT INTO `registrations` VALUES ('64', '10', 'rew', '2274238777@qq.com', '1', '2025-10-15 23:06:44');
INSERT INTO `registrations` VALUES ('65', '10', 'rew', '2274238777@qq.com', '1', '2025-10-15 23:14:39');
INSERT INTO `registrations` VALUES ('66', '16', 'rew', '2274238777@qq.com', '1', '2025-10-17 13:54:04');
INSERT INTO `registrations` VALUES ('67', '13', 'rew', '2274238777@qq.com', '1', '2025-10-17 17:26:00');
