import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { STORAGE_KEYS, USER_ROLES } from '$lib/constants';
import type { Role } from '$lib/types';

const getInitialRole = (): Role => {
	if (!browser) return USER_ROLES.EDITOR;
	return (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || USER_ROLES.EDITOR;
};

const createRoleStore = () => {
	const { subscribe, set } = writable<Role>(getInitialRole());

	return {
		subscribe,
		set: (role: Role) => {
			set(role);
			if (browser) localStorage.setItem(STORAGE_KEYS.ROLE, role);
		}
	};
};

export const roleStore = createRoleStore();

export const setRole = (role: Role) => roleStore.set(role);
