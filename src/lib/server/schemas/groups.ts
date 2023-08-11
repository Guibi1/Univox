import { index, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const groupsTable = mysqlTable("groups", {
    id: varchar("id", { length: 16 }).primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
});

export const groupUsersTable = mysqlTable(
    "group_users",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),
        groupId: varchar("group_id", { length: 16 }).notNull(),
},
    (groupUser) => ({
        userIndex: index("user_idx").on(groupUser.userId),
        groupIndex: index("group_idx").on(groupUser.groupId),
    })
);
