import { relations } from "drizzle-orm";
import { index, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const friendsTable = mysqlTable(
    "friends",
    {
        id: serial("id").primaryKey(),
        userId: varchar("userid", { length: 15 }).notNull(),
        friendId: varchar("friendid", { length: 15 }).notNull(),
    },
    (friend) => ({
        userIndex: index("useridx").on(friend.userId),
    })
);

export const friendsRelations = relations(friendsTable, ({ one }) => ({
    user: one(usersTable, { fields: [friendsTable.id], references: [usersTable.id] }),
    friend: one(usersTable, { fields: [friendsTable.friendId], references: [usersTable.id] }),
}));
