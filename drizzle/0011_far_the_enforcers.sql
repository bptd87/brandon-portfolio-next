CREATE TABLE `collaborators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`role` enum('director','scenic_designer','costume_designer','lighting_designer','sound_designer','projection_designer','theatre_company','partner_company') NOT NULL,
	`bio` text,
	`portfolioUrl` text,
	`instagramHandle` varchar(100),
	`instagramUrl` text,
	`websiteUrl` text,
	`imageUrl` text,
	`imageKey` text,
	`featured` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaborators_id` PRIMARY KEY(`id`),
	CONSTRAINT `collaborators_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `project_collaborators` (
	`projectId` int NOT NULL,
	`collaboratorId` int NOT NULL,
	`customRole` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE `project_collaborators` ADD CONSTRAINT `project_collaborators_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_collaborators` ADD CONSTRAINT `project_collaborators_collaboratorId_collaborators_id_fk` FOREIGN KEY (`collaboratorId`) REFERENCES `collaborators`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `role_idx` ON `collaborators` (`role`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `collaborators` (`slug`);--> statement-breakpoint
CREATE INDEX `featured_idx` ON `collaborators` (`featured`);--> statement-breakpoint
CREATE INDEX `project_idx` ON `project_collaborators` (`projectId`);--> statement-breakpoint
CREATE INDEX `collaborator_idx` ON `project_collaborators` (`collaboratorId`);