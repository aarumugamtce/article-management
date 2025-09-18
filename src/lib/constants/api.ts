import { ENV } from '$lib/config/env';

export const API_CONFIG = {
	USE_MOCK_API: ENV.USE_MOCK_API ?? true
} as const;

export const PAGINATION = {
	DEFAULT_LIMIT: 10,
	DEFAULT_PAGE: 1
} as const;

export const DEBOUNCE_DELAY = 300; // in milli seconds

export const OBSERVER_CONFIG = {
	THRESHOLD: 0.1,
	ROOT_MARGIN: '0px'
} as const;
