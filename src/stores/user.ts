import { writable } from 'svelte/store';

interface User {
	id: string;
	username: string;
}

function createUserStore() {
	const { subscribe, set } = writable<User | null>();

	function login(username: string, password: string) {
		console.log('🚀 ~ file: user.ts:12 ~ login ~ username', username);

		set({
			id: 'id',
			username
		});
	}

	function signout() {
		set(null);
	}

	return {
		subscribe,
		login,
		signout
	};
}

const user = createUserStore();
export default user;
