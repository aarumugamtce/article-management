import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { STORAGE_KEYS, THEMES } from '$lib/constants';
import type { Theme } from '$lib/types';

const getInitialTheme = (): Theme => {
	if (!browser) return THEMES.LIGHT;

	const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
	if (stored) return stored;

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
};

const createThemeStore = () => {
	const { subscribe, set } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		set: (theme: Theme) => {
			set(theme);
			if (browser) localStorage.setItem(STORAGE_KEYS.THEME, theme);
		}
	};
};

export const themeStore = createThemeStore();

export const setTheme = (theme: Theme) => themeStore.set(theme);
