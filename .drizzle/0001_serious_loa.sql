DROP TABLE `schedules`;--> statement-breakpoint
ALTER TABLE `auth_user` RENAME COLUMN `firstName` TO `first_name`;--> statement-breakpoint
ALTER TABLE `auth_user` RENAME COLUMN `lastName` TO `last_name`;--> statement-breakpoint
DROP INDEX `schedule_idx` ON `period_lessons`;--> statement-breakpoint
DROP INDEX `schedule_idx` ON `period_schedules`;--> statement-breakpoint
ALTER TABLE `period_lessons` ADD `user_id` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `period_schedules` ADD `user_id` varchar(15) NOT NULL;--> statement-breakpoint
CREATE INDEX `sender_idx` ON `notifications` (`sender_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `period_lessons` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `period_schedules` (`user_id`);--> statement-breakpoint
ALTER TABLE `period_lessons` DROP COLUMN `schedule_id`;--> statement-breakpoint
ALTER TABLE `period_schedules` DROP COLUMN `schedule_id`;