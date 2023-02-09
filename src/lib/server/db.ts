import { env } from "$env/dynamic/private";
import { Weekday, type User } from "$lib/Types";
import dayjs from "dayjs";
import mongoose, { Schema, type FilterQuery } from "mongoose";

if (mongoose.connection.readyState === 0) {
    mongoose.set("strictQuery", false);
    mongoose.connect(env.MONGODB_URI ?? "mongodb+srv://127.0.0.1/univox");
}

const Users = mongoose.model(
    "users",
    new Schema({
        da: String,
        passwordHash: String,
        email: String,
        firstName: String,
        lastName: String,
        scheduleID: mongoose.Types.ObjectId,
    })
);

const Schedules = mongoose.model(
    "schedules",
    new Schema({
        periods: [
            {
                id: String,
                name: String,
                group: Number,
                local: String,
                type: ["T", "L"],
                teacher: String,
                virtual: Boolean,
                weekday: Weekday,
                timeStart: dayjs.Dayjs,
                timeEnd: dayjs.Dayjs,
            },
        ],
    })
);

type ServerUser = User & { passwordHash: string };

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
