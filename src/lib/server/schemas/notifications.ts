import { index, json, mysqlEnum, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const notificationsTable = mysqlTable(
    "notifications",
    {
        id: serial("id").primaryKey(),
        userId: varchar("userid", { length: 15 }).notNull(),
        senderId: varchar("senderid", { length: 15 }).notNull(),
        kind: mysqlEnum("kind", ["FriendRequest", "GroupRequest"]).notNull(),
        details: json("details"),
    },
    (notification) => ({
        userIndex: index("useridx").on(notification.userId),
    })
);
