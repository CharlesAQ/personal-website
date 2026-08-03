CREATE TABLE `journal_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`mood` text DEFAULT '平静' NOT NULL,
	`entry_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `software` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`version` text DEFAULT '' NOT NULL,
	`platform` text DEFAULT 'Windows' NOT NULL,
	`official_url` text NOT NULL,
	`download_url` text NOT NULL,
	`file_name` text DEFAULT '' NOT NULL,
	`file_size` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);