CREATE TABLE `books` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`title` varchar(128) NOT NULL,
	`isbn` varchar(16) NOT NULL,
	`image` varchar(256),
	`author` varchar(128) NOT NULL,
	`price` smallint NOT NULL,
	`state` varchar(128) NOT NULL,
	`code` varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `friends` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`friend_id` varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `group_users` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`group_id` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_key` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`primary_key` boolean NOT NULL,
	`hashed_password` varchar(255),
	`expires` bigint
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` varchar(128) PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`active_expires` bigint NOT NULL,
	`idle_expires` bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`sender_id` varchar(15) NOT NULL,
	`kind` enum('FriendRequest','GroupRequest') NOT NULL,
	`details` json
);
--> statement-breakpoint
CREATE TABLE `period_lessons` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`schedule_id` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`time_start` datetime NOT NULL,
	`time_end` datetime NOT NULL,
	`code` varchar(32) NOT NULL,
	`group` smallint NOT NULL,
	`local` varchar(32) NOT NULL,
	`is_theory` boolean NOT NULL,
	`teacher` varchar(128) NOT NULL,
	`is_virtual` boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE `period_schedules` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`schedule_id` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`time_start` datetime NOT NULL,
	`time_end` datetime NOT NULL
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userid` varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` varchar(15) PRIMARY KEY NOT NULL,
	`da` varchar(7) NOT NULL,
	`email` varchar(128) NOT NULL,
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`avatar` varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `books` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `friends` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `group_users` (`user_id`);--> statement-breakpoint
CREATE INDEX `group_idx` ON `group_users` (`group_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `schedule_idx` ON `period_lessons` (`schedule_id`);--> statement-breakpoint
CREATE INDEX `schedule_idx` ON `period_schedules` (`schedule_id`);--> statement-breakpoint
CREATE INDEX `useridx` ON `schedules` (`userid`);--> statement-breakpoint
CREATE UNIQUE INDEX `da_idx` ON `auth_user` (`da`);