import { MONGODB_URI } from "$env/static/private";
import type { Period, Schedule, User } from "$lib/Types";
import bcryptjs from "bcryptjs";
import mongoose, { type FilterQuery } from "mongoose";
import { ScheduleSchema, TokenSchema, UserSchema, type ServerUser } from "./types";

// Connection
mongoose.set("strictQuery", false);
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(MONGODB_URI ?? "mongodb://127.0.0.1:27017/univox");
}

// Models
const Tokens = mongoose.models["tokens"] ?? mongoose.model("tokens", TokenSchema);
const Users = mongoose.models["users"] ?? mongoose.model("users", UserSchema);
const Schedules = mongoose.models["schedules"] ?? mongoose.model("schedules", ScheduleSchema);

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

export async function createUser(user: ServerUser): Promise<boolean> {
    if (await findUser({ da: user.da })) {
        console.error("A user with this 'da' already exists.");
        return false;
    }

    await Schedules.create({ _id: user.scheduleId, periods: [] });
    await Users.create(user);
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

// Helpers: Friends
export async function getFriends(user: User): Promise<User[]> {
    const friends: User[] = [];
    for (const friendId of user.friends) {
        const friend = await findUserById(friendId);
        if (friend) {
            friends.push(friend);
        }
    }

    return friends;
}

export async function addFriend(user: User, friendId: mongoose.Types.ObjectId): Promise<boolean> {
    await Users.findByIdAndUpdate(user, {
        $set: { friends: [friendId] },
    });
    return true;
}

// Helpers: Schedule
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
        console.error("No user with this id was found.");
        return false;
    }

    await Schedules.findByIdAndUpdate(scheduleId, {
        $push: { periods: periods },
    });
    return true;
}
