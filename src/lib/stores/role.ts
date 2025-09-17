import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Role = 'viewer' | 'editor';

function getInitialRole(): Role {
	if (!browser) return 'editor';
	const stored = localStorage.getItem('role') as Role;
	return stored || 'editor';
}

const roleStore = writable<Role>(getInitialRole());

export function getRole() {
	let value: Role = 'editor';
	roleStore.subscribe((v) => (value = v))();
	return value;
}

export function setRole(newRole: Role) {
	roleStore.set(newRole);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('role', newRole);
	}
}

export { roleStore };
