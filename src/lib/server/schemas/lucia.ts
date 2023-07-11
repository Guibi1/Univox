import { bigint, boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const session = mysqlTable("auth_session", {
    id: varchar("id", { length: 128 }).primaryKey(),
    userId: varchar("user_id", { length: 15 })
        .notNull()
        .references(() => usersTable.id),
    activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
    idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
});

export const key = mysqlTable("auth_key", {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 15 })
        .notNull()
        .references(() => usersTable.id),
    primaryKey: boolean("primary_key").notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    expires: bigint("expires", { mode: "number" }),
});
