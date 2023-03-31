import { MONGODB_URI } from "$env/static/private";
import type { Book, Period, Schedule, User } from "$lib/Types";
import bcryptjs from "bcryptjs";
import mongoose, { type FilterQuery } from "mongoose";
import Books from "./models/books";
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
export async function createToken(user: User) {
    const token: string = await bcryptjs.hash(user.da + Date(), 5);
    await Tokens.create({ token, userId: user._id });
    return token;
}

export async function deleteToken(token: string) {
    await Tokens.findOneAndRemove({ token });
}

export async function getUserFromToken(token: string | undefined): Promise<User | null> {
    const userId = await getUserIdFromToken(token);
    if (userId) {
        return findUserById(userId);
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
export async function findUser(filter: FilterQuery<User>): Promise<User | null> {
    const doc = await Users.findOne(filter);
    if (!doc) {
        return null;
    }
    const user = { ...doc.toObject(), passwordHash: null };
    return user as User;
}

export async function findUserById(id: mongoose.Types.ObjectId): Promise<User | null> {
    const doc = await Users.findById(id);
    if (!doc) {
        return null;
    }
    const user = { ...doc.toObject(), passwordHash: null };
    return user as User;
}

export async function compareUserPassword(da: string, password: string): Promise<User | null> {
    const user = (await Users.findOne({ da }))?.toObject();
    const passwordHash = user?.passwordHash;
    if (passwordHash && (await bcryptjs.compare(password.toString(), passwordHash))) {
        return user;
    }
    return null;
}

export async function createUser(user: User, password: string): Promise<boolean> {
    if (await findUser({ da: user.da })) {
        console.error("A user with this 'da' already exists.");
        return false;
    }

    await Schedules.create({ _id: user.scheduleId, periods: [] });
    await Settings.create({ _id: user.settingsId });
    await Users.create({ ...user, passwordHash: await bcryptjs.hash(password ?? "", 11) });
    return true;
}

export async function updateUserPassword(
    userId: mongoose.Types.ObjectId,
    password: string
): Promise<boolean> {
    if (!(await findUserById(userId))) {
        console.error("No user with this id was found.");
        return false;
    }

    await Users.findByIdAndUpdate(userId, {
        $set: { passwordHash: await bcryptjs.hash(password, 11) },
    });
    return true;
}

export async function searchUsers(user: User, query: string): Promise<User[]> {
    query = sanitizeQuery(query);
    if (query.length < 4) return [];
    query = normalizeQuery(query);

    return await Users.find({
        $and: [
            { _id: { $ne: user._id } },
            { _id: { $not: { $in: user.friendsId } } },
            {
                $or: [
                    { da: { $eq: query } },
                    { firstName: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" } },
                ],
            },
        ],
    })
        .limit(5)
        .exec();
}

// Helpers: Friends
export async function getFriends(user: User): Promise<User[]> {
    const friends: User[] = [];
    for (const friendId of user.friendsId) {
        const friend = await findUserById(friendId);
        if (friend) {
            friends.push(friend);
        }
    }

    return friends;
}

export async function addFriend(user: User, friendId: mongoose.Types.ObjectId): Promise<boolean> {
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
    user: User,
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

// Helpers: Schedule
export async function getSchedule(user: User): Promise<Schedule> {
    // TODO: Raise error when null
    return (
        (await findScheduleById(user.scheduleId)) || {
            _id: new mongoose.Types.ObjectId(),
            periods: [],
        }
    );
}

export async function findScheduleById(
    scheduleId: mongoose.Types.ObjectId
): Promise<Schedule | null> {
    const doc = await Schedules.findById(scheduleId);
    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
}

export async function addPeriodsToSchedule(
    scheduleId: mongoose.Types.ObjectId,
    periods: Period[]
): Promise<boolean> {
    if (!(await findScheduleById(scheduleId))) {
        console.error("No schedule with this id was found.");
        return false;
    }

    console.log("🚀 ~ file: db.ts:183 ~ periods:", periods)
    await Schedules.findByIdAndUpdate(scheduleId, {
        $push: { periods: periods },
    });
    return true;
}

// Helpers: Book
export async function findBookById(bookId: mongoose.Types.ObjectId): Promise<Book | null> {
    const doc = await Books.findById(bookId);
    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
}

export async function searchBooks(user: User, query: string, codes: string[]): Promise<Book[]> {
    query = sanitizeQuery(query);
    query = normalizeQuery(query);

    return await Books.find({
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
    })
        .limit(15)
        .exec();
}

export async function addBookListing(book: Book): Promise<boolean> {
    await Books.create(book);
    return true;
}

// Helpers: Settings
export async function getSettings(user: User): Promise<Settings | null> {
    const doc = await Settings.findById(user.settingsId);
    if (!doc) {
        return null;
    }
    return doc.toObject() as Settings;
}

export async function setSettings(user: User, settings: Settings): Promise<boolean> {
    if (!settings) return false;
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
