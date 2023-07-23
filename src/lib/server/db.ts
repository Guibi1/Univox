import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME } from "$env/static/private";
import type {
    Book,
    Group,
    Lesson,
    Notification,
    NotificationKind,
    Period,
    Schedule,
} from "$lib/types";
import { connect } from "@planetscale/database";
import chalk from "chalk";
import { and, eq, getTableColumns, inArray, like, ne, notLike, or } from "drizzle-orm";
import type { MySqlUpdateSetSource } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import type { User } from "lucia-auth";
import { auth } from "./auth";
import { booksTable } from "./schemas/books";
import { friendsTable } from "./schemas/friends";
import { groupUsersTable, groupsTable } from "./schemas/groups";
import { notificationsTable } from "./schemas/notifications";
import { lessonsTable, periodsTable, schedulesTable } from "./schemas/schedules";
import { usersTable } from "./schemas/users";

const log = (...text: unknown[]) =>
    console.log(chalk.bgBlue(" INFO "), chalk.magenta("[database]"), chalk.blue("➜ "), ...text);
const warn = (...text: unknown[]) =>
    console.warn(chalk.bgRed(" WARNING "), chalk.magenta("[database]"), chalk.red("➜ "), ...text);

const db = drizzle(
    connect({
        host: DATABASE_HOST,
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
    })
);

//////////////////////
// -*-*- USER -*-*- //
//////////////////////

/**
 * Finds the requested user in the database and returns it
 * @param id The user id
 * @returns The requested user, or null if it doesn't exist
 */
export async function getUser(id: string): Promise<User | null> {
    try {
        return await auth.getUser(id);
    } catch {
        log("A user couldn't be found");
        return null;
    }
}

/**
 * Modifies the user's database entry
 * @param user The user to update
 * @param data The data to modify
 * @returns True if the operation succeded, false otherwise
 */
export async function updateUser(
    user: User,
    data: Partial<Lucia.UserAttributes>
): Promise<boolean> {
    try {
        await auth.updateUserAttributes(user.id, data);
        return true;
    } catch {
        warn("The function 'updateUser' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Searches the database to find users that match the query
 * @param user The current user
 * @param query The search query
 * @returns An array of 5 matching users, or less
 */
export async function searchUsers(
    user: User,
    query: string,
    limit = 5,
    sameSchool = true
): Promise<User[]> {
    query = sanitizeQuery(query);
    query = normalizeQuery(query);

    // TODO: Make sure the user isnt a friend
    return await db
        .select()
        .from(usersTable)
        .where(
            and(
                ne(usersTable.id, user.id),
                or(
                    eq(usersTable.da, query),
                    eq(usersTable.email, query),
                    eq(usersTable.firstName, query),
                    eq(usersTable.lastName, query)
                ),
                (sameSchool ? like : notLike)(usersTable.email, `%@${user.email.split("@").at(1)}`)
            )
        )
        .limit(limit);
}

/////////////////////////
// -*-*- FRIENDS -*-*- //
/////////////////////////

/**
 * Fetches the latests friends
 * @param user The current user
 * @returns An array of friends
 */
export async function getFriendsId(user: User): Promise<string[]> {
    const result = await db
        .select({ a: friendsTable.userId, b: friendsTable.friendId })
        .from(friendsTable)
        .where(or(eq(friendsTable.friendId, user.id), eq(friendsTable.userId, user.id)));

    return result.map(({ a, b }) => (user.id !== a ? a : b));
}

/**
 * Fetches the latests friends
 * @param user The current user
 * @returns An array of friends
 */
export async function getFriends(user: User): Promise<User[]> {
    return [
        ...(await db
            .select(getTableColumns(usersTable))
            .from(friendsTable)
            .where(eq(friendsTable.userId, user.id))
            .innerJoin(usersTable, eq(usersTable.id, friendsTable.friendId))),
        ...(await db
            .select(getTableColumns(usersTable))
            .from(friendsTable)
            .where(eq(friendsTable.friendId, user.id))
            .innerJoin(usersTable, eq(usersTable.id, friendsTable.userId))),
    ];
}

/**
 * Makes two user friends by adding each other in their friendlist
 * @param user The current user
 * @param friendId The friend to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addFriend(user: User, friendId: string): Promise<boolean> {
    if (user.id === friendId) return false;
    if ((await getFriends(user)).some((u) => u.id === friendId)) return false;

    try {
        await db.insert(friendsTable).values({ userId: user.id, friendId });
        return true;
    } catch {
        warn("The function 'addFriend' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Unfriends two user by removing each other from their respective friendlist
 * @param user The current user
 * @param friendId The friend to remove
 * @returns True if the operation succeded, false otherwise
 */
export async function deleteFriend(user: User, friendId: string): Promise<boolean> {
    if (user.id === friendId) return false;

    try {
        await db
            .delete(friendsTable)
            .where(
                or(
                    and(eq(friendsTable.userId, user.id), eq(friendsTable.friendId, friendId)),
                    and(eq(friendsTable.userId, friendId), eq(friendsTable.friendId, user.id))
                )
            );
        return true;
    } catch {
        warn("The function 'deleteFriend' was called but failed to update the user's data");
        return false;
    }
}

////////////////////////
// -*-*- Groups -*-*- //
////////////////////////

/**
 * Fetches a group's data from de the database
 * @param id The group id
 * @returns The group data
 */
export async function getGroup(id: number): Promise<Group | null> {
    try {
        const result = await db
            .select({
                id: groupsTable.id,
                name: groupsTable.name,
                userId: groupUsersTable.userId,
            })
            .from(groupsTable)
            .where(eq(groupsTable.id, id))
            .innerJoin(groupUsersTable, eq(groupUsersTable.groupId, groupsTable.id));
        return result.reduce<Group | null>((prev, v) => {
            if (!prev) return { id: v.id, name: v.name, usersId: [v.userId] };
            prev.usersId.push(v.userId);
            return prev;
        }, null);
    } catch {
        log("A group couldn't be found");
        return null;
    }
}

/**
 * Fetches all the user's groups and their data
 * @param user The target user
 * @returns An array of groups in which the user is
 */
export async function getGroups(user: User): Promise<Group[]> {
    const result = await db
        .select()
        .from(groupUsersTable)
        .where(eq(groupUsersTable.userId, user.id))
        .innerJoin(groupsTable, eq(groupUsersTable.groupId, groupsTable.id));

    return Array.from(
        result
            .reduce((groups, result) => {
                const group = groups.get(result.groups.id) ?? { ...result.groups, usersId: [] };
                group.usersId.push(result.group_users.userId);
                groups.set(result.groups.id, group);
                return groups;
            }, new Map<number, Group>())
            .values()
    );
}

/**
 * Creates a new group containing the user and the specified friends
 * @param user The current user
 * @param friendsId The friends to add to the new group
 * @returns True if the operation succeded, false otherwise
 */
export async function createGroup(user: User, friendsId: string[]): Promise<boolean> {
    if (friendsId.some((id) => user.id === id)) return false;
    if (friendsId.length !== new Set(friendsId).size) return false;

    try {
        const group = await db.insert(groupsTable).values({ name: "Nouveau groupe" });

        await db.insert(groupUsersTable).values(
            [user.id, ...friendsId].map((id) => ({
                groupId: group.insertId as unknown as number,
                userId: id,
            }))
        );
        return true;
    } catch {
        warn("The function 'createGroup' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Adds a friend to an existing group
 * @param user The current user
 * @param group The targeted group
 * @param friendsId The friends to add to the group
 * @returns True if the operation succeded, false otherwise
 */
export async function addToGroup(user: User, group: Group, friendsId: string[]): Promise<boolean> {
    if (!group.usersId.some((id) => user.id === id)) return false;

    try {
        await db.insert(groupUsersTable).values(
            [user.id, ...friendsId].map((id) => ({
                groupId: group.id,
                userId: id,
            }))
        );
        return true;
    } catch {
        warn("The function 'addToGroup' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Removes a user from a group
 * @param user The current user
 * @param groupId The targeted group's id
 * @returns True if the operation succeded, false otherwise
 */
export async function quitGroup(user: User, groupId: number): Promise<boolean> {
    try {
        await db
            .delete(groupUsersTable)
            .where(and(eq(groupUsersTable.userId, user.id), eq(groupUsersTable.groupId, groupId)));

        return true;
    } catch {
        warn("The function 'quitGroup' was called but failed to update the user's data");
        return false;
    }
}

/**
 *
 * @param user The current user
 * @param group The targeted group to rename
 * @param data The data to modify
 * @returns True if the operation succeded, false otherwise
 *
 */
export async function updateGroup(
    user: User,
    group: Group,
    data: MySqlUpdateSetSource<typeof groupsTable>
): Promise<boolean> {
    if (!group.usersId.some((id) => id === user.id)) {
        return false;
    }

    try {
        await db.update(groupsTable).set(data).where(eq(groupsTable.id, group.id));

        return true;
    } catch {
        warn("The function 'updateGroup' was called but failed to update the group's data");
        return false;
    }
}

//////////////////////////
// -*-*- SCHEDULE -*-*- //
//////////////////////////

/**
 * Fetches the user's latest schedule
 * @param user The targeted user
 * @returns The user's schedule
 */
export async function getSchedule(user: User, empty = false): Promise<Schedule> {
    const result = (
        await db
            .select({ id: schedulesTable.id })
            .from(schedulesTable)
            .where(eq(schedulesTable.userId, user.id))
            .limit(1)
    ).at(0);

    if (!result) {
        await db.insert(schedulesTable).values({ userId: user.id });
        return getSchedule(user, empty);
    }

    if (empty) return { id: result.id, periods: [], lessons: [] };

    const periods = await db
        .select()
        .from(periodsTable)
        .where(eq(periodsTable.scheduleId, result.id));

    const lessons = await db
        .select()
        .from(lessonsTable)
        .where(eq(lessonsTable.scheduleId, result.id));

    return { id: result.id, periods, lessons };
}

/**
 * Adds all the provided periods to the user's schedule
 * @param user The targeted user
 * @param periods The array of periods to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addPeriodsToSchedule(
    user: User,
    periods: Omit<Period, "id">[]
): Promise<boolean> {
    const schedule = await getSchedule(user, true);

    try {
        await db
            .insert(periodsTable)
            .values(periods.map((p) => ({ ...p, scheduleId: schedule.id })));

        return true;
    } catch {
        warn("The function 'addPeriodsToSchedule' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Adds all the provided lessons to the user's schedule
 * @param user The targeted user
 * @param lessons The array of lessons to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addClassesToSchedule(
    user: User,
    lessons: Omit<Lesson, "id">[]
): Promise<boolean> {
    const schedule = await getSchedule(user, true);

    try {
        await db
            .insert(lessonsTable)
            .values(lessons.map((l) => ({ ...l, scheduleId: schedule.id })));

        return true;
    } catch {
        warn("The function 'addLessonsToSchedule' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Deletes all classes in the user's schedule
 * @param user The targeted user
 * @returns True if the operation succeeded, false otherwise
 */
export async function deleteAllClassesInSchedule(user: User): Promise<boolean> {
    const schedule = await getSchedule(user, true);

    try {
        await db.delete(lessonsTable).where(eq(lessonsTable.scheduleId, schedule.id));

        return true;
    } catch {
        warn(
            "The function 'deleteAllClassesInSchedule' was called but failed to update the user's data"
        );
        return false;
    }
}

/**
 * Deletes a period in the user's schedule by its id
 * @param user The targeted user
 * @param period The period object to delete
 * @returns True if the operation succeeded, false otherwise
 */
export async function deletePeriodFromSchedule(user: User, period: Period): Promise<boolean> {
    try {
        await db.delete(periodsTable).where(eq(periodsTable.id, period.id));

        return true;
    } catch {
        warn("The function 'deletePeriodById' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Fetches all the book codes in the user's schedule
 * @param user The targeted user
 * @returns An array of all the book codes
 */
export async function getClassCodes(user: User): Promise<string[]> {
    const schedule = await getSchedule(user, true);

    return (
        await db
            .selectDistinct({ code: lessonsTable.code })
            .from(lessonsTable)
            .where(eq(lessonsTable.scheduleId, schedule.id))
    ).map((r) => r.code);
}

//////////////////////
// -*-*- BOOK -*-*- //
//////////////////////

/**
 * Fetches the book with the provided ID
 * @param bookId The targeted book's ID
 * @returns The requested book or null if it doesn't exist
 */
export async function getBook(bookId: number): Promise<Book | null> {
    const book = (await db.select().from(booksTable).where(eq(booksTable.id, bookId)).limit(1)).at(
        0
    );

    if (!book) {
        log("A book couldn't be found");
        return null;
    }
    return book;
}

/**
 * Fetches the user's books
 * @param user The targeted user
 * @returns An array of all the user's books
 */
export async function getBooks(user: User): Promise<Book[]> {
    return await db.select().from(booksTable).where(eq(booksTable.userId, user.id));
}

/**
 * Fetches all the book codes in the database
 * @param user The targeted user
 * @returns An array of all the book codes
 */
export async function getBookCodes(user: User): Promise<string[]> {
    return (
        await db
            .selectDistinct({ code: booksTable.code })
            .from(booksTable)
            .where(ne(booksTable.userId, user.id))
    ).map((o) => o.code);
}

/**
 * Searches the database to find books that match the query
 * @param user The current user
 * @param query The search query
 * @param codes An array of book codes
 * @returns An array of 5 corresponding books, or less
 */
export async function searchBooks(
    user: User,
    query: string,
    codes: string[],
    limit = 5
): Promise<Book[]> {
    query = sanitizeQuery(query);
    query = normalizeQuery(query);

    return await db
        .select()
        .from(booksTable)
        .where(
            and(
                ne(booksTable.userId, user.id),
                codes.length > 0 ? inArray(booksTable.code, codes) : undefined,
                or(
                    eq(booksTable.isbn, query),
                    eq(booksTable.title, query),
                    eq(booksTable.author, query)
                )
            )
        )
        .limit(limit);
}

/**
 * Adds a new book listing to the database
 * @param book The book to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addBookListing(user: User, book: Omit<Book, "id">): Promise<boolean> {
    if (user.id !== book.userId) {
        return false;
    }

    try {
        await db.insert(booksTable).values(book);
        log("New book created");
        return true;
    } catch {
        warn("Failed to create a book");
        return false;
    }
}

/**
 * Adds a new book listing to the database
 * @param book The book to add
 * @returns True if the operation succeded, false otherwise
 */
export async function deleteBookListing(user: User, bookId: number): Promise<boolean> {
    try {
        const query = await db
            .delete(booksTable)
            .where(and(eq(booksTable.id, bookId), eq(booksTable.userId, user.id)));

        if (query.rowsAffected === 0) {
            return false;
        }

        // TODO: Delete the image

        log("Book deleted");
        return true;
    } catch {
        warn("Failed to delete a book");
        return false;
    }
}

//////////////////////////////
// -*-*- NOTIFICATION -*-*- //
//////////////////////////////

/**
 * Fetches the user's latest notifications
 * @param user The target user
 * @returns An array of notification
 */
export async function getNotifications(user: User): Promise<Notification[]> {
    return await db
        .select({
            id: notificationsTable.id,
            kind: notificationsTable.kind,
            details: notificationsTable.details,
            sender: getTableColumns(usersTable),
        })
        .from(notificationsTable)
        .where(eq(notificationsTable.userId, user.id))
        .innerJoin(usersTable, eq(notificationsTable.senderId, usersTable.id));
}

/**
 * Sends a notification to the specified user
 * @param user The current user
 * @param kind The kind of notification
 * @param receiverId The user that will receive the notification
 * @returns True if the operation succeded, false otherwise
 */
export async function sendNotification(
    user: User,
    receiverId: string,
    kind: NotificationKind,
    details: unknown
): Promise<boolean> {
    const receiver = await getUser(receiverId);
    if (!receiver) return false;

    // If the notification is already sent
    if (await getNotificationIfItExists(user, kind, receiver)) {
        return false;
    }

    // If the other user already sent a friend request
    if (kind === "FriendRequest") {
        const otherUserRequest = await getNotificationIfItExists(receiver, kind, user);
        if (otherUserRequest) {
            if (await addFriend(user, receiver.id)) {
                await deleteNotification(user, otherUserRequest.id);
                return true;
            }
            return false;
        }
    }

    try {
        await db
            .insert(notificationsTable)
            .values({ userId: receiverId, senderId: user.id, kind, details });
        return true;
    } catch {
        warn("The function 'sendNotification' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Deletes a notification from the user's account
 * @param user The current user
 * @param notificationId The ID of the targeted notification
 * @returns True if the operation succeded, false otherwise
 */
export async function deleteNotification(user: User, notificationId: number): Promise<boolean> {
    try {
        await db
            .delete(notificationsTable)
            .where(
                and(
                    eq(notificationsTable.id, notificationId),
                    eq(notificationsTable.userId, user.id)
                )
            );
        return true;
    } catch {
        warn("The function 'deleteNotification' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Find a corresponding notification if it exists
 * @param user The current user
 * @param kind The kind of notification
 * @param receiverId The user that will receive the notification
 * @returns The notification if it has been found
 */
export async function getNotificationIfItExists(
    sender: User,
    kind: NotificationKind,
    receiver: User
): Promise<Notification | null> {
    return (
        (
            await db
                .select({
                    id: notificationsTable.id,
                    kind: notificationsTable.kind,
                    details: notificationsTable.details,
                    sender: getTableColumns(usersTable),
                })
                .from(notificationsTable)
                .where(
                    and(
                        eq(notificationsTable.userId, receiver.id),
                        eq(notificationsTable.senderId, sender.id),
                        eq(notificationsTable.kind, kind)
                    )
                )
                .innerJoin(usersTable, eq(notificationsTable.senderId, usersTable.id))
                .limit(1)
        ).at(0) ?? null
    );
}

/////////////////////////////////////
// -*-*- QUERY NORMALIZATION -*-*- //
/////////////////////////////////////

/**
 * Removes any ambigous caracters from a query
 * @param query The string to sanitize
 * @returns The sanitized query
 */
function sanitizeQuery(query: string): string {
    return query.replace(/\./g, "").replace(/\\/g, "\\\\").trim();
}

/**
 * Makes a query match accents as well
 * @param query The string to normalize
 * @returns The normalized query
 */
function normalizeQuery(query: string): string {
    return query
        .replace(/a/g, "[a,á,à,ä,â]")
        .replace(/A/g, "[A,a,á,à,ä,â]")
        .replace(/e/g, "[e,é,ë,è]")
        .replace(/E/g, "[E,e,é,ë,è]")
        .replace(/i/g, "[i,í,ï,ì]")
        .replace(/I/g, "[I,i,í,ï,ì]")
        .replace(/o/g, "[o,ó,ö,ò]")
        .replace(/O/g, "[O,o,ó,ö,ò]")
        .replace(/u/g, "[u,ü,ú,ù]")
        .replace(/U/g, "[U,u,ü,ú,ù]");
}
