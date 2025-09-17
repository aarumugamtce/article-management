import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

// Industry standard: Respect user's system preference, fallback to dark
function getInitialTheme(): Theme {
	if (!browser) return 'dark';

	// Check localStorage first
	const stored = localStorage.getItem('theme') as Theme;
	if (stored) return stored;

	// Check system preference (industry standard)
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}

	// Default to dark
	return 'dark';
}

const themeStore = writable<Theme>(getInitialTheme());

export function getTheme() {
	let value: Theme = 'dark';
	themeStore.subscribe((v) => (value = v))();
	return value;
}

export function setTheme(newTheme: Theme) {
	themeStore.set(newTheme);
	// Persist to localStorage (industry standard)
	if (browser) {
		localStorage.setItem('theme', newTheme);
	}
}

export { themeStore };
