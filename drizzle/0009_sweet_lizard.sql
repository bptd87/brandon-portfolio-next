CREATE TABLE `paintRecipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`notes` text,
	`targetColor` varchar(7) NOT NULL,
	`mixingRecipe` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paintRecipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `paintRecipes` ADD CONSTRAINT `paintRecipes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_idx` ON `paintRecipes` (`userId`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `paintRecipes` (`createdAt`);