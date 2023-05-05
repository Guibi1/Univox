import { MONGODB_URI } from "$env/static/private";
import {
    NotificationKind,
    type Book,
    type Class,
    type Group,
    type Notification,
    type Period,
    type Schedule,
    type ServerUser,
    type User,
} from "$lib/Types";
import bcryptjs from "bcryptjs";
import chalk from "chalk";
import mongoose, { Types, type FilterQuery } from "mongoose";
import Books from "./models/books";
import Groups from "./models/groups";
import Notifications from "./models/notifications";
import Schedules from "./models/schedules";
import Settings from "./models/settings";
import Tokens, { type Token } from "./models/tokens";
import Users from "./models/users";
import * as storageBucket from "./storageBucket";

const log = (...text: unknown[]) =>
    console.log(chalk.bgBlue(" INFO "), chalk.magenta("[database]"), chalk.blue("➜ "), ...text);
const warn = (...text: unknown[]) =>
    console.warn(chalk.bgRed(" WARNING "), chalk.magenta("[database]"), chalk.red("➜ "), ...text);

/**
 * Connects the app to the database if its not already connected
 */
mongoose.set("strictQuery", false);
if (mongoose.connection.readyState !== 1) {
    mongoose
        .connect(MONGODB_URI ?? "mongodb://127.0.0.1:27017/univox")
        .then(() => log("Connected"))
        .then(() => storageBucket.connect())
        .catch(() => warn("Couldn't connect"));
}

///////////////////////
// -*-*- TOKEN -*-*- //
///////////////////////

/**
 * Creates a token that authentifies the user
 * @param user The logged in user
 * @returns The new session token
 */
export async function createToken(user: ServerUser) {
    const token: string = await bcryptjs.hash(user.da + Date(), 5);
    await Tokens.create({ token, userId: user._id });
    log("New user token created");
    return token;
}

/**
 * Removes an existing token
 * @param token The token to delete
 */
export async function deleteToken(token: string) {
    await Tokens.findOneAndRemove({ token });
    log("User token deleted");
}

/**
 * Finds the user that logged in with the provided token
 * @param token The user's token
 * @returns The corresponding server user
 */
export async function getUserFromToken(token: string | undefined): Promise<ServerUser | null> {
    const userId = await getUserIdFromToken(token);
    if (userId) {
        return await getServerUser(userId);
    }
    return null;
}

/**
 * Finds the ID of the user that logged in with the provided token
 * @param token The user's token
 * @returns The corresponding user ID
 */
export async function getUserIdFromToken(
    token: string | undefined
): Promise<Types.ObjectId | null> {
    if (!token) return null;

    const doc: mongoose.HydratedDocument<Token> | null = await Tokens.findOne({
        token,
    });
    if (!doc) {
        return null;
    }

    // Update the last accessed date
    doc.lastAccessedDate = new Date();
    doc.save();

    return doc.userId;
}

//////////////////////
// -*-*- USER -*-*- //
//////////////////////

/**
 * Casts a server user to a normal user by deleting the unwanted properties
 * @param serverUser The server user to cast
 * @returns The casted user
 */
export function serverUserToUser(serverUser: ServerUser): User {
    const cleanUser = { ...serverUser } as User & {
        passwordHash?: string;
        friendsId?: Types.ObjectId[];
        notificationsId?: Types.ObjectId[];
        settingsId?: Types.ObjectId;
        scheduleId?: Types.ObjectId;
        __v?: number;
    };

    delete cleanUser.passwordHash;
    delete cleanUser.friendsId;
    delete cleanUser.notificationsId;
    delete cleanUser.settingsId;
    delete cleanUser.scheduleId;
    delete cleanUser.__v;

    return cleanUser;
}

/**
 * Finds the requested user in the database and returns it as a server user
 * @param id The user id
 * @returns The requested server user, or null if it doesn't exist
 */
export async function getServerUser(id: Types.ObjectId | string): Promise<ServerUser | null> {
    const doc: mongoose.HydratedDocument<ServerUser> | null = await Users.findById(id);
    if (!doc) {
        log("A user couldn't be found");
        return null;
    }
    return { ...doc.toObject() };
}

/**
 * Finds the requested user in the database and returns it as a normal user
 * @param id The user id
 * @returns The requested user, or null if it doesn't exist
 */
export async function getUser(id: Types.ObjectId | string): Promise<User | null> {
    const user = await getServerUser(id);
    if (!user) {
        log("A user couldn't be found");
        return null;
    }
    return serverUserToUser(user);
}

/**
 * Finds one matching user in the database and returns it as a normal user
 * @param filter Filters to match a specific user
 * @returns The requested user, or null if it wasn't found
 */
export async function findUser(filter: FilterQuery<ServerUser>): Promise<User | null> {
    const doc: mongoose.HydratedDocument<ServerUser> | null = await Users.findOne(filter);
    if (!doc) {
        log("A user couldn't be found");
        return null;
    }
    return serverUserToUser({ ...doc.toObject() });
}

/**
 * Tests the provided login credentials to confirm a login attempt
 * @param da The provided DA
 * @param password The provided password
 * @returns The server user with the provided credentials, or null if no user matched them
 */
export async function compareUserPassword(
    email: string,
    password: string
): Promise<ServerUser | null> {
    const user = await Users.findOne({ email });
    if (user && (await bcryptjs.compare(password, user.passwordHash))) {
        return user;
    }
    return null;
}

/**
 * Creates a new user in the databases
 * @param user The new user to create
 * @param password The user's password
 * @returns The newly created server user
 */
export async function createUser(user: User, password: string): Promise<ServerUser | null> {
    if ((await findUser({ da: user.da })) !== null) {
        warn("The function 'createUser' was called with a 'da' that was already in the database");
        return null;
    }

    const scheduleId: Types.ObjectId = (await Schedules.create({}))._id;
    const settingsId: Types.ObjectId = (await Settings.create({}))._id;
    const doc: mongoose.HydratedDocument<ServerUser> = await Users.create({
        ...user,
        scheduleId,
        settingsId,
        passwordHash: await bcryptjs.hash(password ?? "", 11),
    });
    log("New user created!");
    return { ...doc.toObject() };
}

/**
 * Modifies the user's password
 * @param user The user to update
 * @param password The new password
 * @returns True if the operation succeded, false otherwise
 */
export async function updateUserPassword(user: User, password: string): Promise<boolean> {
    try {
        await Users.findByIdAndUpdate(user, {
            $set: { passwordHash: await bcryptjs.hash(password, 11) },
        });
        return true;
    } catch {
        warn("The function 'updateUserPassword' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Modifies the user's database entry
 * @param user The user to update
 * @param data The data to modify
 * @returns True if the operation succeded, false otherwise
 */
export async function updateUser(
    user: ServerUser,
    data: mongoose.AnyKeys<ServerUser>
): Promise<boolean> {
    try {
        await Users.findByIdAndUpdate(user, { $set: data });
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
export async function searchUsers(user: ServerUser, query: string): Promise<ServerUser[]> {
    query = sanitizeQuery(query);
    query = normalizeQuery(query);

    return (
        await Users.find({
            $and: [
                { _id: { $ne: user._id } },
                { _id: { $not: { $in: user?.friendsId } } },
                {
                    $or: [
                        { da: { $eq: query } },
                        { firstName: { $regex: query, $options: "i" } },
                        { lastName: { $regex: query, $options: "i" } },
                    ],
                },
            ],
        }).limit(5)
    ).map((user: mongoose.HydratedDocument<ServerUser>) => ({ ...user.toObject() }));
}

/////////////////////////
// -*-*- FRIENDS -*-*- //
/////////////////////////

/**
 * Fetches the latests friends
 * @param user The current user
 * @returns An array of friends
 */
export async function getFriends(user: ServerUser): Promise<User[]> {
    const friends: User[] = [];
    for (const friendId of user.friendsId) {
        const friend = await getUser(friendId);
        if (friend) {
            friends.push(friend);
        } else {
            warn("The user's friendsId seems to contain a deleted user");
        }
    }

    return friends;
}

/**
 * Makes two user friends by adding each other in their friendlist
 * @param user The current user
 * @param friendId The friend to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addFriend(user: ServerUser, friendId: Types.ObjectId): Promise<boolean> {
    if (user._id === friendId) return false;
    if (user.friendsId.includes(friendId)) return false;

    try {
        await Users.findByIdAndUpdate(user, {
            $push: { friendsId: friendId },
        });
        await Users.findByIdAndUpdate(friendId, {
            $push: { friendsId: user._id },
        });
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
export async function deleteFriend(user: ServerUser, friendId: Types.ObjectId): Promise<boolean> {
    if (user._id === friendId) return false;
    if (user.friendsId.includes(friendId)) return false;

    try {
        await Users.findByIdAndUpdate(user, {
            $pull: { friendsId: friendId },
        });
        await Users.findByIdAndUpdate(friendId, {
            $pull: { friendsId: user._id },
        });
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
export async function getGroup(id: Types.ObjectId | string): Promise<Group | null> {
    const doc = await Groups.findById(id);
    if (!doc) {
        log("A group couldn't be found");
        return null;
    }
    const group = { ...doc.toObject() };
    return group as Group;
}

/**
 * Fetches all the user's groups and their data
 * @param user The target user
 * @returns An array of groups in which the user is
 */
export async function getGroups(user: ServerUser): Promise<Group[]> {
    console.log("🚀 ~ file: db.ts:376 ~ getGroups ~ user.groupsId:", user.groupsId);
    const groups: Group[] = [];
    for (const groupId of user.groupsId) {
        const group = await getGroup(groupId);
        if (group) {
            groups.push(group);
        } else {
            warn("The user's groupsId seems to contain a deleted group");
        }
    }
    return groups;
}

/**
 * Creates a new group containing the user and the specified friends
 * @param user The current user
 * @param friendsId The friends to add to the new group
 * @returns True if the operation succeded, false otherwise
 */
export async function createGroup(user: ServerUser, friendsId: Types.ObjectId[]): Promise<boolean> {
    if (friendsId.includes(user._id)) return false;
    if (friendsId.length !== new Set(friendsId).size) return false;

    try {
        const groupId: Types.ObjectId = (
            await Groups.create({
                name: "Nouveau groupe",
                usersId: [...friendsId, user._id],
            })
        )._id;

        for (const id of [user._id, ...friendsId]) {
            await Users.findByIdAndUpdate(id, {
                $push: { groupsId: groupId },
            });
        }
        log("New group created");
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
 * @param friendId The friend to add to the group
 * @returns True if the operation succeded, false otherwise
 */
export async function addToGroup(
    user: ServerUser,
    group: Group,
    friendId: Types.ObjectId
): Promise<boolean> {
    if (!group.usersId.includes(user._id)) return false;
    if (!group.usersId.includes(friendId)) return false;

    try {
        await Groups.findByIdAndUpdate(group, { $push: { usersId: friendId } });
        return true;
    } catch {
        warn("The function 'addToGroup' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Removes a user from a group
 * @param user The current user
 * @param group The targeted group
 * @returns True if the operation succeded, false otherwise
 */
export async function quitGroup(user: User, group: Group): Promise<boolean> {
    if (!group.usersId.some((id) => id.equals(user._id))) return false;

    try {
        if (group.usersId.length < 3) {
            await Groups.findByIdAndDelete(group);

            for (const id of group.usersId) {
                await Users.findByIdAndUpdate(id, { $pull: { groupsId: group._id } });
            }
        } else {
            await Groups.findByIdAndUpdate(group, { $pull: { usersId: user._id } });
            await Users.findByIdAndUpdate(user, { $pull: { groupsId: group._id } });
        }

        return true;
    } catch {
        warn("The function 'quitGroup' was called but failed to update the user's data");
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
export async function getSchedule(user: ServerUser): Promise<Schedule> {
    const doc: mongoose.HydratedDocument<Schedule> | null = await Schedules.findById(
        user.scheduleId
    );
    if (!doc) {
        warn("A schedule couldn't be found");
        return { _id: user.scheduleId, classes: [], periods: [] };
    }
    return { ...doc.toObject() };
}

/**
 * Adds all the provided periods to the user's schedule
 * @param user The targeted user
 * @param periods The array of periods to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addPeriodsToSchedule(user: ServerUser, periods: Period[]): Promise<boolean> {
    if (!user.settingsId) return false;

    try {
        await Schedules.findByIdAndUpdate(user.scheduleId, {
            $push: { periods: periods },
        });
        return true;
    } catch {
        warn("The function 'addPeriodsToSchedule' was called but failed to update the user's data");
        return false;
    }
}

/**
 * Adds all the provided classes to the user's schedule
 * @param user The targeted user
 * @param classes The array of classes to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addClassesToSchedule(user: ServerUser, classes: Class[]): Promise<boolean> {
    if (!user.settingsId) return false;

    try {
        await Schedules.findByIdAndUpdate(user.scheduleId, {
            $push: { classes: classes },
        });
        return true;
    } catch {
        warn("The function 'addClassesToSchedule' was called but failed to update the user's data");
        return false;
    }
}

//////////////////////
// -*-*- BOOK -*-*- //
//////////////////////

/**
 * Fetches the book with the provided ID
 * @param bookId The targeted book's ID
 * @returns The requested book or null if it doesn't exist
 */
export async function getBook(bookId: Types.ObjectId | string): Promise<Book | null> {
    const doc: mongoose.HydratedDocument<Book> | null = await Books.findById(bookId);
    if (!doc) {
        log("A book couldn't be found");
        return null;
    }
    return { ...doc.toObject() };
}

/**
 * Fetches the user's books
 * @param user The targeted user
 * @returns An array of all the user's books
 */
export async function getBooks(user: ServerUser): Promise<Book[]> {
    return (await Books.find({ sellerId: user._id })).map((b: mongoose.Document<Book>) => ({
        ...b.toObject(),
    }));
}

/**
 * Searches the database to find books that match the query
 * @param user The current user
 * @param query The search query
 * @param codes An array of book codes
 * @returns An array of 5 corresponding books, or less
 */
export async function searchBooks(
    user: ServerUser,
    query: string,
    codes: string[]
): Promise<Book[]> {
    query = sanitizeQuery(query);
    query = normalizeQuery(query);

    return (
        await Books.find({
            $and: [
                { sellerId: { $ne: user._id } },
                ...(codes.length > 0 ? [{ code: { $in: codes } }] : []),
                ...(query.length > 0
                    ? [
                          {
                              $or: [
                                  { ISBN: { $eq: query } },
                                  { title: { $regex: query, $options: "i" } },
                                  { author: { $regex: query, $options: "i" } },
                              ],
                          },
                      ]
                    : []),
            ],
        }).limit(15)
    ).map((book: mongoose.HydratedDocument<Book>) => ({ ...book.toObject() }));
}

/**
 * Adds a new book listing to the database
 * @param book The book to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addBookListing(book: Book): Promise<boolean> {
    await Books.create(book);
    log("New book created");
    return true;
}

//////////////////////////////
// -*-*- NOTIFICATION -*-*- //
//////////////////////////////

/**
 * Fetches the user's latest notifications
 * @param user The target user
 * @returns An array of notification
 */
export async function getNotifications(user: ServerUser): Promise<Notification[]> {
    const doc: mongoose.HydratedDocument<Notification>[] = await Notifications.find({
        _id: { $in: user.notificationsId },
    }).populate("sender");

    return doc.map((notification) => {
        const n = notification.toObject() as Notification;
        return { ...n, sender: serverUserToUser(n.sender as ServerUser) };
    });
}

/**
 * Sends a notification to the specified user
 * @param user The current user
 * @param kind The kind of notification
 * @param receiverId The user that will receive the notification
 * @returns True if the operation succeded, false otherwise
 */
export async function sendNotification(
    user: ServerUser,
    kind: NotificationKind,
    receiverId: Types.ObjectId | string
): Promise<boolean> {
    const receiver = await getServerUser(receiverId);
    if (!receiver) return false;

    if (kind == NotificationKind.FriendRequest && (await friendRequestExists(user, receiver))) {
        return false;
    }

    try {
        const notificationId = (await Notifications.create({ kind, sender: user._id }))._id;
        await Users.findByIdAndUpdate(receiverId, {
            $push: { notificationsId: notificationId },
        });
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
export async function deleteNotification(
    user: ServerUser,
    notificationId: Types.ObjectId | string
): Promise<boolean> {
    if (!user.notificationsId.some((id) => id.equals(notificationId))) return false;

    try {
        await Users.findByIdAndUpdate(user._id, {
            $pull: { notificationsId: notificationId },
        });
        return true;
    } catch {
        warn("The function 'deleteNotification' was called but failed to update the user's data");
        return false;
    }
}

export async function friendRequestExists(
    sender: ServerUser,
    receiver: ServerUser
): Promise<boolean> {
    return (await getNotifications(receiver)).some(
        (n) => n.kind == NotificationKind.FriendRequest && n.sender._id.equals(sender._id)
    );
}

//////////////////////////
// -*-*- SETTINGS -*-*- //
//////////////////////////

/**
 * Fetches the user's latest settings
 * @param user The current user
 * @returns The user's settings
 */
export async function getSettings(user: ServerUser): Promise<Settings | null> {
    const doc: mongoose.HydratedDocument<Settings> | null = await Settings.findById(
        user.settingsId
    );

    if (!doc) {
        warn("User's settings couldn't be found");
        return null;
    }
    return { ...doc.toObject() };
}

/**
 * Updates the user's settings in the database
 * @param user The target user
 * @param settings The new settings
 * @returns True if the operation succeded, false otherwise
 */
export async function setSettings(user: ServerUser, settings: Settings): Promise<boolean> {
    try {
        await Settings.findByIdAndUpdate(user.settingsId, { $set: settings });
        return true;
    } catch {
        warn("The function 'setSettings' was called but failed to update the user's data");
        return false;
    }
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
