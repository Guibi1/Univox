import type { Notification, Schedule, ServerUser, User } from "$lib/Types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare global {
    namespace App {
        interface Locals {
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

export {};
