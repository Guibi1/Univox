import type { Notification, Schedule, ServerUser, User } from "$lib/Types";
import type { Auth as LuciaAuth } from "$lib/server/lucia";
import type { AuthRequest } from "lucia-auth";

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
        type UserAttributes = {
            da: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    }
}

export {};
