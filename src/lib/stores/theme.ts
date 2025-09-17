import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

const themeStore = writable<Theme>('light');

export function getTheme() {
	let value: Theme = 'light';
	themeStore.subscribe((v) => (value = v))();
	return value;
}

export function setTheme(newTheme: Theme) {
	themeStore.set(newTheme);
}

export { themeStore };
