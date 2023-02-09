import { env } from "$env/dynamic/private";
import type { Schedule, User } from "$lib/Types";
import { MongoClient, ObjectId, type Filter } from "mongodb";

const client = new MongoClient(env.MONGODB_URI ?? "mongodb+srv://127.0.0.1/univox");
const connection = client.connect();

type ServerUser = User & { passwordHash: string };

export async function findUser(filter: Filter<ServerUser>) {
    await connection;
    const db = client.db();
    const users = db.collection<ServerUser>("users");

    return users.findOne(filter);
}

export async function createUser(user: ServerUser): Promise<void> {
    await connection;
    const db = client.db();

    const users = db.collection<ServerUser>("users");
    if (await users.findOne({ da: user.da })) {
        console.error("A user with this 'da' already exists.");
        return;
    }

    await db.collection<Schedule>("schedules").insertOne({ _id: user.scheduleID, periods: [] });
    await users.insertOne(user);
}

export async function updateUserPassword(userId: ObjectId, passwordHash: string): Promise<void> {
    await connection;
    const db = client.db();

    const users = db.collection<ServerUser>("users");
    if (!(await users.findOne({ _id: userId }))) {
        console.error("No user with this id was found.");
        return;
    }

    await users.updateOne({ _id: userId }, { $set: { passwordHash } });
}
