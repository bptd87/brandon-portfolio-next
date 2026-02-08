CREATE TABLE `tutorialProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tutorialSlug` varchar(255) NOT NULL,
	`watched` boolean NOT NULL DEFAULT false,
	`watchedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tutorialProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tutorialProgress` ADD CONSTRAINT `tutorialProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_idx` ON `tutorialProgress` (`userId`);--> statement-breakpoint
CREATE INDEX `tutorial_idx` ON `tutorialProgress` (`tutorialSlug`);