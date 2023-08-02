import { index, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const friendsTable = mysqlTable(
    "friends",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),
        friendId: varchar("friend_id", { length: 15 }).notNull(),
    },
    (friend) => ({
        userIndex: index("user_idx").on(friend.userId),
    })
);
