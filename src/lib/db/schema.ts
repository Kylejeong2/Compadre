// used to create tables in the postgres schema
// to make changes run this: npx drizzle-kit generate || npx drizzle-kit migrate || npx drizzle-kit push

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const $compadres = pgTable('compadres', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    imageUrl: text('imageUrl'),
    userId: text('user_id').notNull(), // TODO: add Mem0 stuff + daily room
});

export type CompadreType = typeof $compadres.$inferInsert;