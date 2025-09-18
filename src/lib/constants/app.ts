export const ARTICLE_STATUS = {
	PUBLISHED: 'Published',
	DRAFT: 'Draft',
	ALL: 'All'
} as const;

export const USER_ROLES = {
	EDITOR: 'editor',
	VIEWER: 'viewer'
} as const;

export const THEMES = {
	LIGHT: 'light',
	DARK: 'dark'
} as const;

export const STORAGE_KEYS = {
	THEME: 'theme',
	ROLE: 'role'
} as const;
