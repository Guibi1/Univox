import { writable } from "svelte/store";

interface User {
    id: string;
    username: string;
}

function createUserStore() {
    const { subscribe, set } = writable<User | null>();

    function login(username: string, password: string) {
        set({
            id: "id",
            username,
        });
    }

    function signup(fname: string, lname: string, username: string, password: string) {
        set({
            id: "id",
            username,
        });
    }

    function signout() {
        set(null);
    }

    return {
        subscribe,
        login,
        signup,
        signout,
    };
}

const user = createUserStore();
export default user;
