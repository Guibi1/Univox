import type { Auth as LuciaAuth } from "$lib/server/lucia";
import { usersTable } from "$lib/server/schemas/users";
import type { Notification, User as OldUser, Schedule, ServerUser } from "$lib/types";
import type { InferModel } from "drizzle-orm";
import type { AuthRequest } from "lucia-auth";

declare global {
    namespace App {
        interface Locals {
            auth: AuthRequest;
            user: ServerUser;
            schedule: Schedule;
            friends: OldUser[];
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
