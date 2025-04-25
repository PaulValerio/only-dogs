// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable1 = pgTableCreator((name) => `only-dogs_${name}`);

export const image = createTable1(
  "image",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name_image: d.varchar({ length: 256 }).notNull(),
    url: d.varchar({ length: 1024 }).notNull(),
    userId: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_image_idx").on(t.name_image)],
);

export const createTable2 = pgTableCreator((name) => `only-dogs_${name}`);

export const dog_info = createTable2(
  "dog_info",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name_dog: d.varchar({ length: 256 }).notNull(),
    age: d.integer().notNull(),
    gender: d.varchar({ length: 10 }).notNull(),
    breed: d.varchar({ length: 256 }).notNull(),
    location: d.varchar({ length: 256 }).notNull(),
    userId: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_dog_idx").on(t.name_dog)],
);
