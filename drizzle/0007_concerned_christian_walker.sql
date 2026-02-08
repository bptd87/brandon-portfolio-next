CREATE TABLE `scenicDirectory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`url` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`categorySlug` varchar(100) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenicDirectory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tutorials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`youtubeUrl` varchar(500) NOT NULL,
	`youtubeId` varchar(50),
	`description` text,
	`category` enum('getting-started','2d-drafting','3d-modeling','rendering','advanced') NOT NULL DEFAULT 'getting-started',
	`difficultyLevel` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`duration` int,
	`thumbnailUrl` varchar(500),
	`displayOrder` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tutorials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `category_idx` ON `scenicDirectory` (`categorySlug`);--> statement-breakpoint
CREATE INDEX `enabled_idx` ON `scenicDirectory` (`enabled`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `tutorials` (`category`);--> statement-breakpoint
CREATE INDEX `difficulty_idx` ON `tutorials` (`difficultyLevel`);--> statement-breakpoint
CREATE INDEX `enabled_idx` ON `tutorials` (`enabled`);