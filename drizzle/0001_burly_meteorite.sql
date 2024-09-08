ALTER TABLE `course` ADD `register_timestamp` integer;--> statement-breakpoint
ALTER TABLE `course` ADD `register_group_register_timestamp` integer;--> statement-breakpoint
ALTER TABLE `course` ADD `ects_amount` integer DEFAULT 0 NOT NULL;