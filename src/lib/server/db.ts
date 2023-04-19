import { MONGODB_URI } from "$env/static/private";
import {
    NotificationKind,
    type Book,
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
import Tokens from "./models/tokens";
import Users from "./models/users";

const log = (...text: unknown[]) =>
    console.log(chalk.bgBlue(" INFO "), chalk.italic("database"), chalk.blue("➜ "), ...text);
const warn = (...text: unknown[]) =>
    console.warn(chalk.bgRed(" WARNING "), chalk.italic("database"), chalk.red("➜ "), ...text);

// Connection
mongoose.set("strictQuery", false);
if (mongoose.connection.readyState !== 1) {
    mongoose
        .connect(MONGODB_URI ?? "mongodb://127.0.0.1:27017/univox")
        .then(() => log("Connected to MongoDB!"))
        .catch(() => warn("Couldn't connect to MongoDB"));
}

// Helpers: Token
export async function createToken(user: ServerUser) {
    const token: string = await bcryptjs.hash(user.da + Date(), 5);
    await Tokens.create({ token, userId: user._id });
    log("New user token created");
    return token;
}

export async function deleteToken(token: string) {
    await Tokens.findOneAndRemove({ token });
    log("User token deleted");
}

export async function getUserFromToken(token: string | undefined): Promise<ServerUser | null> {
    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return null;
    }
    return getServerUser(userId);
}

export async function getUserIdFromToken(
    token: string | undefined
): Promise<mongoose.Types.ObjectId | null> {
    if (!token) return null;

    const doc = await Tokens.findOne({ token });
    if (!doc) return null;
    doc.lastAccessedDate = Date.now();
    doc.save();
    return doc?.userId ?? null;
}

// Helpers: User
export function serverUserToUser(serverUser: ServerUser): User {
    const cleanUser = { ...serverUser } as User & {
        passwordHash?: string;
        friendsId?: mongoose.Types.ObjectId[];
        notificationsId?: mongoose.Types.ObjectId[];
        settingsId?: mongoose.Types.ObjectId;
        scheduleId?: mongoose.Types.ObjectId;
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

export async function getServerUser(id: mongoose.Types.ObjectId): Promise<ServerUser | null> {
    const doc: mongoose.Document<ServerUser> | null = await Users.findById(id);
    if (!doc) {
        log("A user couldn't be found");
        return null;
    }
    return { ...doc.toObject() };
}

export async function getUser(id: mongoose.Types.ObjectId): Promise<User | null> {
    const doc: mongoose.Document<ServerUser> | null = await Users.findById(id);
    if (!doc) {
        log("A user couldn't be found");
        return null;
    }
    return serverUserToUser({ ...doc.toObject() });
}

export async function findUser(filter: FilterQuery<ServerUser>): Promise<User | null> {
    const doc: mongoose.Document<ServerUser> | null = await Users.findOne(filter);
    if (!doc) {
        log("A user couldn't be found");
        return null;
    }
    return serverUserToUser({ ...doc.toObject() });
}

export async function compareUserPassword(
    da: string,
    password: string
): Promise<ServerUser | null> {
    const user = await Users.findOne({ da });
    if (user && (await bcryptjs.compare(password, user.passwordHash))) {
        return user;
    }
    return null;
}

export async function createUser(user: User, password: string): Promise<ServerUser | null> {
    if ((await findUser({ da: user.da })) !== null) {
        warn("The function 'createUser' was called with a 'da' that was already in the database");
        return null;
    }

    const scheduleId: mongoose.Types.ObjectId = (await Schedules.create({}))._id;
    const settingsId: mongoose.Types.ObjectId = (await Settings.create({}))._id;
    const doc: mongoose.Document<ServerUser> = await Users.create({
        ...user,
        scheduleId,
        settingsId,
        passwordHash: await bcryptjs.hash(password ?? "", 11),
    });
    log("New user created!");
    return { ...doc.toObject() };
}

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

export async function searchUsers(user: ServerUser, query: string): Promise<User[]> {
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
    ).map((user: mongoose.HydratedDocument<ServerUser>) =>
        serverUserToUser({ ...user.toObject() })
    );
}

// Helpers: Friends
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

export async function addFriend(
    user: ServerUser,
    friendId: mongoose.Types.ObjectId
): Promise<boolean> {
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

export async function deleteFriend(
    user: ServerUser,
    friendId: mongoose.Types.ObjectId
): Promise<boolean> {
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

// Helpers: Groups

export async function getGroup(id: mongoose.Types.ObjectId): Promise<Group | null> {
    const doc = await Groups.findById(id);
    if (!doc) {
        log("A group couldn't be found");
        return null;
    }
    const group = { ...doc.toObject(), passwordHash: null };
    return group as Group;
}

export async function getGroups(user: ServerUser): Promise<Group[]> {
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

export async function createGroup(
    user: User,
    friendsId: mongoose.Types.ObjectId[]
): Promise<boolean> {
    if (friendsId.includes(user._id)) return false;
    if (friendsId.length !== new Set(friendsId).size) return false;

    try {
        await Groups.create({ usersId: [...friendsId, user._id] });
        return true;
    } catch {
        warn("The function 'createGroup' was called but failed to update the user's data");
        return false;
    }
}

export async function addToGroup(
    user: User,
    group: Group,
    friendId: mongoose.Types.ObjectId
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

export async function quitGroup(user: User, group: Group): Promise<boolean> {
    if (!group.usersId.includes(user._id)) return false;

    try {
        if (group.usersId.length < 3) {
            await Groups.findByIdAndDelete(group);
        } else {
            await Groups.findByIdAndUpdate(group, { $pull: { usersId: user._id } });
        }

        // TODO: Remove the group from the users' list
        return true;
    } catch {
        warn("The function 'quitGroup' was called but failed to update the user's data");
        return false;
    }
}

// Helpers: Schedule
export async function getSchedule(user: ServerUser): Promise<Schedule> {
    const doc: mongoose.Document<Schedule> | null = await Schedules.findById(user.scheduleId);
    if (!doc) {
        warn("A schedule couldn't be found");
        return { _id: user.scheduleId, classes: [], periods: [] };
    }
    return { ...doc.toObject() };
}

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

// Helpers: Book
export async function getBook(bookId: mongoose.Types.ObjectId): Promise<Book | null> {
    const doc: mongoose.Document<Book> | null = await Books.findById(bookId);
    if (!doc) {
        log("A book couldn't be found");
        return null;
    }
    return { ...doc.toObject() };
}

export async function getBooks(user: ServerUser): Promise<Book[]> {
    return (await Books.find({ sellerId: user._id })).map((b: mongoose.Document<Book>) => ({
        ...b.toObject(),
    }));
}

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
    ).map((book: mongoose.Document<Book>) => ({ ...book.toObject() }));
}

export async function addBookListing(book: Book): Promise<boolean> {
    await Books.create(book);
    log("New book created");
    return true;
}

// Heplers: Notifications
export async function getNotifications(user: ServerUser): Promise<Notification[]> {
    const doc: mongoose.Document<Notification>[] = await Notifications.find({
        _id: { $in: user.notificationsId },
    }).populate("sender");

    return doc.map((notification) => {
        const n = notification.toObject() as Notification;
        return { ...n, sender: serverUserToUser(n.sender as ServerUser) };
    });
}

export async function sendNotification(
    user: ServerUser,
    kind: NotificationKind,
    receiverId: mongoose.Types.ObjectId
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

export async function deleteNotification(
    user: ServerUser,
    notificationId: mongoose.Types.ObjectId
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

// Helpers: Settings
export async function getSettings(user: ServerUser): Promise<Settings | null> {
    const doc: mongoose.Document<Settings> | null = await Settings.findById(user.settingsId);
    if (!doc) {
        warn("User's settings couldn't be found");
        return null;
    }
    return { ...doc.toObject() };
}

export async function setSettings(user: ServerUser, settings: Settings): Promise<boolean> {
    try {
        await Settings.findByIdAndUpdate(user.settingsId, { $set: settings });
        return true;
    } catch {
        warn("The function 'setSettings' was called but failed to update the user's data");
        return false;
    }
}

// Helpers: Query normalization
export function arrayIdToString<T extends { _id: mongoose.Types.ObjectId }>(arr: T[]): T[] {
    return arr.map((i) => objectIdToString(i));
}

export function objectIdToString<T extends { _id: mongoose.Types.ObjectId }>(object: T): T {
    if (typeof object !== "object" || object === null) return object;

    const keys = Object.keys(object) as Array<keyof T>;
    keys.forEach((key) => {
        const value = object[key];

        if (value instanceof Types.ObjectId) {
            object[key] = value.toHexString() as T[keyof T];
        } else if (Array.isArray(value)) {
            object[key] = arrayIdToString(value) as T[keyof T];
        }
    });

    return { ...object };
}

function sanitizeQuery(query: string): string {
    return query.replace(/\./g, "").trim();
}

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
