import { dev } from '$app/environment';

// Use SvelteKit's built-in dev flag instead of process.env
export const ENV = {
	NODE_ENV: dev ? 'development' : 'production',
	API_BASE_URL: 'https://api.airtable.com/v0', // Always use Airtable URL
	USE_MOCK_API: true, // Default to mock, override in server
	ENABLE_ANALYTICS: false,
	LOG_LEVEL: dev ? 'info' : 'error'
} as const;

export const isDevelopment = dev;
export const isProduction = !dev;
