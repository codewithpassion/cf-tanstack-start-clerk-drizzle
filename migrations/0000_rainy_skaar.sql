CREATE TABLE `demo` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE INDEX `demo_demo_idx` ON `demo` (`id`);