import { index, json, mysqlEnum, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const notificationsTable = mysqlTable(
    "notifications",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),
        senderId: varchar("user_id", { length: 15 }).notNull(),
        kind: mysqlEnum("kind", ["FriendRequest", "GroupRequest"]).notNull(),
        details: json("details"),
    },
    (notification) => ({
        userIndex: index("user_idx").on(notification.userId),
    })
);
