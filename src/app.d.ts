import type { Auth as LuciaAuth } from "$lib/server/db";
import { usersTable } from "$lib/server/schemas/users";
import type { Notification, Schedule, ServerUser } from "$lib/types";
import type { InferModel } from "drizzle-orm";
import type { AuthRequest, User } from "lucia-auth";

declare global {
    namespace App {
        interface Locals {
            auth: AuthRequest;
            user: ServerUser;
            schedule: Schedule;
            friends: User[];
            groups: Group[];
            notifications: Notification[];
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
