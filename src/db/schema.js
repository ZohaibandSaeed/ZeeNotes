import { pgTable, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const stickyNotes = pgTable('sticky_notes', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  color: varchar('color', { length: 20 }).notNull().default('bg-yellow-200'),
  shape: varchar('shape', { length: 20 }).notNull().default('square'),
  positionOrder: integer('position_order').notNull().default(0),
  x: integer('x').notNull().default(0),
  y: integer('y').notNull().default(0),
  width: integer('width').notNull().default(256),
  height: integer('height').notNull().default(256),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const diaryFiles = pgTable('diary_files', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  contentHtml: text('content_html'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  id: integer('id').primaryKey().default(1),
  appPassword: varchar('app_password', { length: 255 }).notNull(),
});
