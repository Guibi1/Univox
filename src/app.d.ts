import type { Notification, Schedule, ServerUser, User as OldUser } from "$lib/Types";
import type { Auth as LuciaAuth } from "$lib/server/lucia";
import type { User } from "$lib/server/schemas/users";
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
        type UserAttributes = Omit<User, "id">;
    }
}

export {};
