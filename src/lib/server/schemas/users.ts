import { mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable(
    "auth_user",
    {
        id: varchar("id", { length: 15 }).primaryKey(),
        da: varchar("da", { length: 7 }).notNull(),
        email: varchar("email", { length: 256 }).notNull(),
        firstName: varchar("firstName", { length: 256 }).notNull(),
        lastName: varchar("lastName", { length: 256 }).notNull(),
        avatar: varchar("avatar", { length: 256 }).notNull(),
    },
    (users) => ({
        daIndex: uniqueIndex("da_idx").on(users.da),
    })
);
