// API Configuration
export const API_CONFIG = {
	USE_MOCK_API: true,
	BACKEND_URL: 'https://api.example.com',
	ENDPOINTS: {
		ARTICLES: '/api/articles'
	}
} as const;

// Pagination
export const PAGINATION = {
	DEFAULT_LIMIT: 10,
	DEFAULT_PAGE: 1
} as const;

// Debounce Timing
export const DEBOUNCE_DELAY = 300;

// Intersection Observer
export const OBSERVER_CONFIG = {
	THRESHOLD: 0.1,
	ROOT_MARGIN: '0px'
} as const;

// Article Status
export const ARTICLE_STATUS = {
	PUBLISHED: 'Published',
	DRAFT: 'Draft',
	ALL: 'All'
} as const;

// User Roles
export const USER_ROLES = {
	EDITOR: 'editor',
	VIEWER: 'viewer'
} as const;

// Themes
export const THEMES = {
	LIGHT: 'light',
	DARK: 'dark'
} as const;

// UI Messages
export const MESSAGES = {
	ERRORS: {
		FETCH_FAILED: 'Failed to fetch articles',
		CREATE_FAILED: 'Failed to create article',
		UPDATE_FAILED: 'Failed to update article',
		DELETE_FAILED: 'Failed to delete article',
		SAVE_FAILED: 'Failed to save article'
	},
	LOADING: {
		ARTICLES: 'Loading articles...',
		MORE_ARTICLES: 'Loading more articles...'
	},
	EMPTY_STATES: {
		NO_ARTICLES: 'No articles found.',
		NO_MORE_ARTICLES: 'No more articles to load'
	}
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
	AUTH_TOKEN: 'authToken',
	THEME: 'theme',
	ROLE: 'role'
} as const;
