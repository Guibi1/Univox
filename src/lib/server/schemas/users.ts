import type { InferModel } from "drizzle-orm";
import { mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable(
    "auth_user",
    {
        id: varchar("id", { length: 15 }).primaryKey(),
        da: varchar("da", { length: 7 }).notNull(),
        email: varchar("email", { length: 128 }).notNull(),
        firstName: varchar("first_name", { length: 128 }).notNull(),
        lastName: varchar("last_name", { length: 128 }).notNull(),
        avatar: varchar("avatar", { length: 64 }).notNull(),
    },
    (user) => ({
        daIndex: uniqueIndex("da_idx").on(user.da),
    })
);

export type User = InferModel<typeof usersTable>;
