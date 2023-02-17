import { MONGODB_URI } from "$env/static/private";
import type { User } from "$lib/Types";
import bcryptjs from "bcryptjs";
import mongoose, { type FilterQuery } from "mongoose";
import { ScheduleSchema, TokenSchema, UserSchema, type ServerUser } from "./types";

// Connection
if (mongoose.connection.readyState !== 1) {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGODB_URI);
}

// Models
const Tokens = mongoose.model("tokens", TokenSchema);
const Users = mongoose.model("users", UserSchema);
const Schedules = mongoose.model("schedules", ScheduleSchema);

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
    if (!token) {
        return null;
    }
    const userId = (await Tokens.findOne({ token }))?.userId;
    if (userId) {
        return findUserById(userId);
    }
    return null;
}

export async function getUserIdFromToken(
    token: string | undefined
): Promise<mongoose.Types.ObjectId | null> {
    if (!token) {
        return null;
    }
    return (await Tokens.findOne({ token }))?.userId ?? null;
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
export async function getFriends(userId: mongoose.Types.ObjectId): Promise<User[] | null> {
    const user = await findUserById(userId);
    if (!user) {
        return null;
    }

    const friends: User[] = [];
    for (const friendId of user.friends) {
        const friend = await findUserById(friendId);
        if (friend) {
            friends.push(friend);
        }
    }

    return friends;
}

export async function addFriend(
    userId: mongoose.Types.ObjectId,
    friendId: mongoose.Types.ObjectId
): Promise<boolean> {
    if (!(await findUserById(userId))) {
        console.error("No user with this id was found.");
        return false;
    }

    await Users.findByIdAndUpdate(userId, {
        $set: { friends: [friendId] },
    });
    return true;
}
