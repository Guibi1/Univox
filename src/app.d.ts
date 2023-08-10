import { usersTable } from "$lib/server/schemas/users";
import type { Group, Notification, Schedule } from "$lib/types";
import type { InferModel } from "drizzle-orm";
import type { AuthRequest, User } from "lucia";

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
		type Auth = import("$lib/server/lucia").Auth;
		type DatabaseUserAttributes = Omit<InferModel<typeof usersTable>, "userId">;
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
