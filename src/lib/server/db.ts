import { MONGODB_URI } from "$env/static/private";
import type {
    Book,
    Group,
    Notification,
    NotificationKind,
    Period,
    Schedule,
    ServerUser,
    User,
} from "$lib/Types";
import bcryptjs from "bcryptjs";
import mongoose, { type FilterQuery } from "mongoose";
import Books from "./models/books";
import Groups from "./models/groups";
import Notifications from "./models/notifications";
import Schedules from "./models/schedules";
import Settings from "./models/settings";
import Tokens from "./models/tokens";
import Users from "./models/users";

// Connection
mongoose.set("strictQuery", false);
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(MONGODB_URI ?? "mongodb://127.0.0.1:27017/univox");
}

// Helpers: Token
export async function createToken(user: ServerUser) {
    const token: string = await bcryptjs.hash(user.da + Date(), 5);
    await Tokens.create({ token, userId: user._id });
    return token;
}

export async function deleteToken(token: string) {
    await Tokens.findOneAndRemove({ token });
}

export async function getUserFromToken(token: string | undefined): Promise<ServerUser | null> {
    const userId = await getUserIdFromToken(token);
    if (userId) {
        return getServerUser(userId);
    }
    return null;
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
        return null;
    }
    return { ...doc.toObject() };
}

export async function getUser(id: mongoose.Types.ObjectId): Promise<User | null> {
    const doc: mongoose.Document<ServerUser> | null = await Users.findById(id);
    if (!doc) {
        return null;
    }
    return serverUserToUser({ ...doc.toObject() });
}

export async function findUser(filter: FilterQuery<User>): Promise<User | null> {
    const doc = await Users.findOne(filter);
    if (!doc) {
        return null;
    }
    return serverUserToUser({ ...doc.toObject() });
}

export async function findUserById(id: mongoose.Types.ObjectId): Promise<User | null> {
    const doc = await Users.findById(id);
    if (!doc) {
        return null;
    }
    const user = { ...doc.toObject(), passwordHash: null };
    return user as User;
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
        console.error("A user with this 'da' already exists.");
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
    return { ...doc.toObject() };
}

export async function updateUserPassword(user: ServerUser, password: string): Promise<boolean> {
    if (!(await getUser(user._id))) {
        console.error("No user with this id was found.");
        return false;
    }

    await Users.findByIdAndUpdate(user, {
        $set: { passwordHash: await bcryptjs.hash(password, 11) },
    });
    return true;
}

export async function updateUser(
    user: ServerUser,
    data: mongoose.AnyKeys<ServerUser>
): Promise<boolean> {
    if (!(await getUser(user._id))) {
        return false;
    }

    await Users.findByIdAndUpdate(user, { $set: data });
    return true;
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

    await Users.findByIdAndUpdate(user, {
        $push: { friendsId: friendId },
    });
    await Users.findByIdAndUpdate(friendId, {
        $push: { friendsId: user._id },
    });
    return true;
}

export async function deleteFriend(
    user: ServerUser,
    friendId: mongoose.Types.ObjectId
): Promise<boolean> {
    //Faut voir si pop fonctionne
    if (user._id === friendId) return false;
    if (user.friendsId.includes(friendId)) return false;

    await Users.findByIdAndUpdate(user, {
        $pull: { friendsId: friendId },
    });
    await Users.findByIdAndUpdate(friendId, {
        $pull: { friendsId: user._id },
    });
    return true;
}

// Helpers: Groups

export async function getGroup(id: mongoose.Types.ObjectId): Promise<Group | null> {
    const doc = await Groups.findById(id);
    if (!doc) {
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

    await Groups.findByIdAndUpdate(group, { $push: { usersId: friendId } });
    return true;
}

export async function quitGroup(user: User, group: Group): Promise<boolean> {
    if (!group.usersId.includes(user._id)) return false;

    try {
        if (group.usersId.length < 3) {
            await Groups.findByIdAndDelete(group);
        } else {
            await Groups.findByIdAndUpdate(group, { $pull: { usersId: user._id } });
        }
    } catch {
        return false;
    }

    return true;
}

// Helpers: Schedule
export async function getSchedule(user: ServerUser): Promise<Schedule | null> {
    const doc: mongoose.Document<Schedule> | null = await Schedules.findById(user.scheduleId);
    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
}

export async function addPeriodsToSchedule(user: ServerUser, periods: Period[]): Promise<boolean> {
    if (!user.settingsId) return false;

    await Schedules.findByIdAndUpdate(user.scheduleId, {
        $push: { periods: periods },
    });
    return true;
}

// Helpers: Book
export async function findBookById(bookId: mongoose.Types.ObjectId): Promise<Book | null> {
    const doc: mongoose.Document<Book> | null = await Books.findById(bookId);
    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
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
    return true;
}

// Heplers: Notifications
export async function getNotifications(user: ServerUser): Promise<Notification[]> {
    const doc: mongoose.Document<Schedule>[] = await Notifications.find({
        _id: { $in: user.notificationsId },
    }).populate("sender");

    return doc.map((notification) => {
        const n = notification.toObject();
        return { ...n, sender: serverUserToUser(n.sender as ServerUser) };
    });
}

export async function sendNotification(
    user: ServerUser,
    kind: NotificationKind,
    receiverId: mongoose.Types.ObjectId
): Promise<boolean> {
    const notificationId = (await Notifications.create({ kind, sender: user._id }))._id;
    await Users.findByIdAndUpdate(receiverId, {
        $push: { notificationsId: notificationId },
    });

    return true;
}

export async function deleteNotification(
    user: ServerUser,
    notificationId: mongoose.Types.ObjectId
): Promise<boolean> {
    if (!user.notificationsId.some((id) => id.equals(notificationId))) return false;

    await Users.findByIdAndUpdate(user._id, {
        $pull: { notificationsId: notificationId },
    });

    return true;
}

// Helpers: Settings
export async function getSettings(user: ServerUser): Promise<Settings | null> {
    const doc: mongoose.Document<Settings> | null = await Settings.findById(user.settingsId);

    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
}

export async function setSettings(user: ServerUser, settings: Settings): Promise<boolean> {
    await Settings.findByIdAndUpdate(user.settingsId, { $set: settings });
    return true;
}

// Helpers: Query normalization
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
