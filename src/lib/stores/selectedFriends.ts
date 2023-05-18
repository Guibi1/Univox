import type { User } from "$lib/Types";
import { writable } from "svelte/store";
// Initialize the store with an empty array
export const selectedFriends = writable<User[]>([]);
