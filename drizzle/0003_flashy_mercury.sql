CREATE TABLE `project_team_members` (
	`projectId` int NOT NULL,
	`teamMemberId` int NOT NULL,
	`customRole` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`bio` text,
	`imageUrl` text,
	`imageKey` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `projects` ADD `discipline` enum('scenic_design','experiential_design','rendering','scenic_models') DEFAULT 'scenic_design' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `subcategory` varchar(100);--> statement-breakpoint
ALTER TABLE `project_team_members` ADD CONSTRAINT `project_team_members_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_team_members` ADD CONSTRAINT `project_team_members_teamMemberId_team_members_id_fk` FOREIGN KEY (`teamMemberId`) REFERENCES `team_members`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `project_idx` ON `project_team_members` (`projectId`);--> statement-breakpoint
CREATE INDEX `team_member_idx` ON `project_team_members` (`teamMemberId`);--> statement-breakpoint
CREATE INDEX `discipline_idx` ON `projects` (`discipline`);