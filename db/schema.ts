import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const software = sqliteTable("software", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  version: text("version").notNull().default(""),
  platform: text("platform").notNull().default("Windows"),
  officialUrl: text("official_url").notNull(),
  downloadUrl: text("download_url").notNull(),
  fileName: text("file_name").notNull().default(""),
  fileSize: integer("file_size").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const journalEntries = sqliteTable("journal_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind", { enum: ["dev", "diary"] }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  tags: text("tags").notNull().default(""),
  mood: text("mood").notNull().default("平静"),
  entryDate: text("entry_date").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const bookmarks = sqliteTable("bookmarks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("其他"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
