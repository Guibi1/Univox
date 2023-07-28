import { relations } from "drizzle-orm";
import { index, int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const groupsTable = mysqlTable("groups", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
});

export const groupUsersTable = mysqlTable(
    "group_users",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),
        groupId: int("group_id").notNull(),
    },
    (groupUser) => ({
        userIndex: index("user_idx").on(groupUser.userId),
        groupIndex: index("group_idx").on(groupUser.groupId),
    })
);

export const groupUsersRelations = relations(groupUsersTable, ({ one }) => ({
    groupId: one(groupsTable, { fields: [groupUsersTable.groupId], references: [groupsTable.id] }),
    userId: one(usersTable, { fields: [groupUsersTable.userId], references: [usersTable.id] }),
}));
