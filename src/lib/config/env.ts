import { browser } from '$app/environment';

export const ENV = {
	NODE_ENV: browser ? 'browser' : process.env.NODE_ENV || 'development',
	API_BASE_URL: browser ? '' : process.env.API_BASE_URL || 'http://localhost:5173',
	ENABLE_ANALYTICS: browser ? false : process.env.ENABLE_ANALYTICS === 'true',
	LOG_LEVEL: browser ? 'error' : process.env.LOG_LEVEL || 'info'
} as const;

export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';
