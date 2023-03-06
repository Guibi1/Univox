import type { User } from "$lib/Types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare global {
    namespace App {
        interface Locals {
            user: User | null;
        }
        // interface Error {}
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
