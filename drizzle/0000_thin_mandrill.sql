CREATE TABLE `flows` (
	`id` text PRIMARY KEY NOT NULL,
	`pose_id` text NOT NULL,
	`channel` text DEFAULT 'global42' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`pose_id`) REFERENCES `poses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_flows_created` ON `flows` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_flows_channel` ON `flows` (`channel`);--> statement-breakpoint
CREATE TABLE `pose_neighbors` (
	`pose_id` text NOT NULL,
	`neighbor_id` text NOT NULL,
	PRIMARY KEY(`pose_id`, `neighbor_id`),
	FOREIGN KEY (`pose_id`) REFERENCES `poses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`neighbor_id`) REFERENCES `poses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_pose_neighbors_pose` ON `pose_neighbors` (`pose_id`);--> statement-breakpoint
CREATE TABLE `poses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`rarity` integer DEFAULT 1 NOT NULL,
	`difficulty` text DEFAULT 'beginner' NOT NULL,
	`mirror` text
);
