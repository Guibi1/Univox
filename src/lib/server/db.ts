import { MONGODB_URI } from "$env/static/private";
import type {
    Book,
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
import Notifications from "./models/notifications";
import Schedules from "./models/schedules";
import Settings from "./models/settings";
import Tokens, { type Token } from "./models/tokens";
import Users from "./models/users";

/**
 * Connects the app to the database if its not already connected
 */
mongoose.set("strictQuery", false);
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(MONGODB_URI ?? "mongodb://127.0.0.1:27017/univox");
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
    return token;
}

/**
 * Removes an existing token
 * @param token The token to delete
 */
export async function deleteToken(token: string) {
    await Tokens.findOneAndRemove({ token });
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
): Promise<mongoose.Types.ObjectId | null> {
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
    const cleanUser = serverUser as User & {
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

/**
 * Finds the requested user in the database and returns it as a server user
 * @param id The user id
 * @returns The requested server user, or null if it doesn't exist
 */
export async function getServerUser(id: mongoose.Types.ObjectId): Promise<ServerUser | null> {
    const doc: mongoose.HydratedDocument<ServerUser> | null = await Users.findById(id);
    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
}

/**
 * Finds the requested user in the database and returns it as a normal user
 * @param id The user id
 * @returns The requested user, or null if it doesn't exist
 */
export async function getUser(id: mongoose.Types.ObjectId): Promise<User | null> {
    const user = await getServerUser(id);
    if (!user) {
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
    da: string,
    password: string
): Promise<ServerUser | null> {
    const user = await Users.findOne({ da });
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
        console.error("A user with this 'da' already exists.");
        return null;
    }

    const scheduleId: mongoose.Types.ObjectId = (await Schedules.create({}))._id;
    const settingsId: mongoose.Types.ObjectId = (await Settings.create({}))._id;
    const doc: mongoose.HydratedDocument<ServerUser> = await Users.create({
        ...user,
        scheduleId,
        settingsId,
        passwordHash: await bcryptjs.hash(password ?? "", 11),
    });
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
        return false;
    }
}

/**
 * Searches the database to find users that match the query
 * @param user The current user
 * @param query The search query
 * @returns An array of matching server user
 */
export async function searchUsers(user: ServerUser, query: string): Promise<ServerUser[]> {
    query = sanitizeQuery(query);
    if (query.length < 4) return [];
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

// -*-*- FRIENDS -*-*-
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

/**
 * Unfriends two user by removing each other from their respective friendlist
 * @param user The current user
 * @param friendId The friend to remove
 * @returns True if the operation succeded, false otherwise
 */
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

//////////////////////////
// -*-*- SCHEDULE -*-*- //
//////////////////////////

/**
 * Fetches the user's latest schedule
 * @param user The targeted user
 * @returns The user's schedule
 */
export async function getSchedule(user: ServerUser): Promise<Schedule | null> {
    const doc: mongoose.HydratedDocument<Schedule> | null = await Schedules.findById(
        user.scheduleId
    );
    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
}

/**
 * Adds all the provided periods to the user's schedule
 * @param user The targeted user
 * @param periods An array of periods to add
 * @returns True if the operation succeded, false otherwise
 */
export async function addPeriodsToSchedule(user: ServerUser, periods: Period[]): Promise<boolean> {
    if (!user.settingsId) return false;

    await Schedules.findByIdAndUpdate(user.scheduleId, {
        $push: { periods: periods },
    });
    return true;
}

// -*-*- BOOK -*-*-
/**
 * Fetches the book with the provided ID
 * @param bookId The targeted book's ID
 * @returns The requested book or null if it doesn't exist
 */
export async function getBook(bookId: mongoose.Types.ObjectId): Promise<Book | null> {
    const doc: mongoose.HydratedDocument<Book> | null = await Books.findById(bookId);
    if (!doc) {
        return null;
    }
    return { ...doc.toObject() };
}

/**
 * Searches for corresponding books in the database
 * @param user The current user
 * @param query The search query
 * @param codes The search filters
 * @returns An array of matching books
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

    return doc.map((n) => ({ ...n.toObject() }));
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
    receiverId: mongoose.Types.ObjectId
): Promise<boolean> {
    try {
        const notificationId = (await Notifications.create({ kind, sender: user._id }))._id;
        await Users.findByIdAndUpdate(receiverId, {
            $push: { notificationsId: notificationId },
        });

        return true;
    } catch {
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
    notificationId: mongoose.Types.ObjectId
): Promise<boolean> {
    if (!user.notificationsId.some((id) => id.equals(notificationId))) return false;

    await Users.findByIdAndUpdate(user._id, {
        $pull: { notificationsId: notificationId },
    });

    return true;
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
