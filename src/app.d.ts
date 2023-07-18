import type { Auth as LuciaAuth } from "$lib/server/auth";
import { usersTable } from "$lib/server/schemas/users";
import type { Notification } from "$lib/types";
import type { InferModel } from "drizzle-orm";
import type { AuthRequest, User } from "lucia-auth";

declare global {
    namespace App {
        interface Locals {
            auth: AuthRequest;
            user: User;
            getSchedule: (refresh = false) => Promise<Schedule>;
            getFriends: (refresh = false) => Promise<User[]>;
            getGroups: (refresh = false) => Promise<Group[]>;
            getNotifications: (refresh = false) => Promise<Notification[]>;
        }
        // interface Error {}
        // interface PageData {}
        // interface Platform {}
    }
}

/// <reference types="lucia" />
declare global {
    namespace Lucia {
        type Auth = LuciaAuth;
        type UserAttributes = Omit<InferModel<typeof usersTable>, "id">;
    }
}

export {};
