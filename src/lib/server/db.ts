import { MONGODB_URI } from "$env/static/private";
import type { User } from "$lib/Types";
import mongoose, { type FilterQuery } from "mongoose";

import { ScheduleSchema, UserSchema, type ServerUser } from "./types";

// Connection
if (mongoose.connection.readyState !== 1) {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGODB_URI);
}

// Models
const Users = mongoose.model("users", UserSchema);
const Schedules = mongoose.model("schedules", ScheduleSchema);

// Helpers
export async function findUser(filter: FilterQuery<User>) {
    return Users.findOne(filter);
}

export async function createUser(user: ServerUser): Promise<void> {
    if (await findUser({ da: user.da })) {
        console.error("A user with this 'da' already exists.");
        return;
    }

    await Schedules.create({ _id: user.scheduleID, periods: [] });
    await Users.create(user);
}

export async function updateUserPassword(
    userId: mongoose.Types.ObjectId,
    passwordHash: string
): Promise<void> {
    if (!(await findUser({ _id: userId }))) {
        console.error("No user with this id was found.");
        return;
    }

    await Users.updateOne({ _id: userId }, { $set: { passwordHash } });
}
