CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text
);
--> statement-breakpoint
CREATE TABLE `course` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`course_type_id` integer,
	`semester_id` integer,
	FOREIGN KEY (`course_type_id`) REFERENCES `course_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`semester_id`) REFERENCES `semester`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `course_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text
);
--> statement-breakpoint
CREATE TABLE `semester` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year` integer NOT NULL,
	`is_summer_semester` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `semester_year_is_summer_semester_unique` ON `semester` (`year`,`is_summer_semester`);