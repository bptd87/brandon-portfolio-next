CREATE TABLE `experiential_gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int,
	`sort_order` int NOT NULL DEFAULT 0,
	`alt_text` text,
	`display_title` text,
	`active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experiential_gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `model_gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int,
	`sort_order` int NOT NULL DEFAULT 0,
	`alt_text` text,
	`display_title` text,
	`active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `model_gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rendering_gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int,
	`sort_order` int NOT NULL DEFAULT 0,
	`alt_text` text,
	`display_title` text,
	`active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rendering_gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `articles` DROP INDEX `articles_slug_unique`;--> statement-breakpoint
ALTER TABLE `categories` DROP INDEX `categories_name_unique`;--> statement-breakpoint
ALTER TABLE `categories` DROP INDEX `categories_slug_unique`;--> statement-breakpoint
ALTER TABLE `collaborators` DROP INDEX `collaborators_slug_unique`;--> statement-breakpoint
ALTER TABLE `news` DROP INDEX `news_slug_unique`;--> statement-breakpoint
ALTER TABLE `projects` DROP INDEX `projects_slug_unique`;--> statement-breakpoint
ALTER TABLE `tags` DROP INDEX `tags_name_unique`;--> statement-breakpoint
ALTER TABLE `tags` DROP INDEX `tags_slug_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_openId_unique`;--> statement-breakpoint
ALTER TABLE `projectImages` ADD `title` varchar(255);--> statement-breakpoint
ALTER TABLE `experiential_gallery` ADD CONSTRAINT `experiential_gallery_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `model_gallery` ADD CONSTRAINT `model_gallery_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rendering_gallery` ADD CONSTRAINT `rendering_gallery_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;