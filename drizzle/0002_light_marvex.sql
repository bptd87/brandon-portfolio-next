ALTER TABLE `projectImages` MODIFY COLUMN `imageUrl` text;--> statement-breakpoint
ALTER TABLE `projectImages` MODIFY COLUMN `imageKey` text;--> statement-breakpoint
ALTER TABLE `projectImages` ADD `videoUrl` text;--> statement-breakpoint
ALTER TABLE `projectImages` ADD `imageType` enum('production','rendering','video') DEFAULT 'production' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `designNotes` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `creativeTeam` json;--> statement-breakpoint
ALTER TABLE `projects` ADD `viewCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `likeCount` int DEFAULT 0 NOT NULL;