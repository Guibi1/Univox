import { index, int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const groupsTable = mysqlTable("groups", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
});

export const groupUsersTable = mysqlTable(
    "group_users",
    {
        id: serial("id").primaryKey(),
        userId: varchar("userid", { length: 15 }).notNull(),
        groupId: int("groupid").notNull(),
    },
    (groupUser) => ({
        userIndex: index("useridx").on(groupUser.userId),
        groupIndex: index("groupidx").on(groupUser.groupId),
    })
);
