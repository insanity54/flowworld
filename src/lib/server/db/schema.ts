import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const poses = sqliteTable('poses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  rarity: integer('rarity').notNull().default(1),
  difficulty: text('difficulty').notNull().default('beginner'),
  mirror: text('mirror'),
});

export const poseNeighbors = sqliteTable('pose_neighbors', {
  poseId: text('pose_id').notNull().references(() => poses.id, { onDelete: 'cascade' }),
  neighborId: text('neighbor_id').notNull().references(() => poses.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.poseId, table.neighborId] }),
  index('idx_pose_neighbors_pose').on(table.poseId),
]);

export const flows = sqliteTable('flows', {
  id: text('id').primaryKey(),
  poseId: text('pose_id').notNull().references(() => poses.id),
  channel: text('channel').notNull().default('global42'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
}, (table) => [
  index('idx_flows_created').on(table.createdAt),
  index('idx_flows_channel').on(table.channel),
]);
