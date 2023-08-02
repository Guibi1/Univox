import { relations } from "drizzle-orm";
import { booksTable } from "./books";
import { friendsTable } from "./friends";
import { groupUsersTable, groupsTable } from "./groups";
import { notificationsTable } from "./notifications";
import { lessonsTable, periodsTable } from "./schedules";
import { usersTable } from "./users";

export const booksRelations = relations(booksTable, ({ one }) => ({
    user: one(usersTable, { fields: [booksTable.userId], references: [usersTable.id] }),
}));

export const friendsRelations = relations(friendsTable, ({ one }) => ({
    user: one(usersTable, { fields: [friendsTable.userId], references: [usersTable.id] }),
    friend: one(usersTable, { fields: [friendsTable.friendId], references: [usersTable.id] }),
}));

export const groupsRelations = relations(groupsTable, ({ many }) => ({
    users: many(groupUsersTable),
}));

export const groupUsersRelations = relations(groupUsersTable, ({ one }) => ({
    group: one(groupsTable, { fields: [groupUsersTable.groupId], references: [groupsTable.id] }),
    user: one(usersTable, { fields: [groupUsersTable.userId], references: [usersTable.id] }),
}));

export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [notificationsTable.userId],
        references: [usersTable.id],
        relationName: "receiver",
    }),
    sender: one(usersTable, {
        fields: [notificationsTable.senderId],
        references: [usersTable.id],
        relationName: "sender",
    }),
}));

export const periodsRelations = relations(periodsTable, ({ one }) => ({
    schedule: one(usersTable, { fields: [periodsTable.userId], references: [usersTable.id] }),
}));

export const lessonsRelations = relations(lessonsTable, ({ one }) => ({
    schedule: one(usersTable, { fields: [lessonsTable.userId], references: [usersTable.id] }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
    books: many(booksTable),
    // friends: many(friendsTable),
    groups: many(groupUsersTable),
    notifications: many(notificationsTable, { relationName: "receiver" }),
    notificationsSent: many(notificationsTable, { relationName: "sender" }),
    periods: many(periodsTable),
    lessons: many(lessonsTable),
}));
