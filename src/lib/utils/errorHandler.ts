import { MESSAGES } from '$lib/constants';

export class AppError extends Error {
	constructor(
		message: string,
		public code?: string,
		public statusCode?: number
	) {
		super(message);
		this.name = 'AppError';
	}
}

export const isRetryableError = (error: unknown): boolean => {
	if (error instanceof AppError && error.statusCode) {
		return [408, 429, 500, 502, 503, 504].includes(error.statusCode);
	}
	return error instanceof TypeError && error.message.includes('fetch');
};

export const handleApiError = (error: unknown): string => {
	if (error instanceof AppError) return error.message;
	if (error instanceof Error) return error.message;
	return MESSAGES.ERRORS.FETCH_FAILED;
};

export const logError = (error: unknown, context?: string): void => {
	console.error('Error:', {
		message: error instanceof Error ? error.message : 'Unknown error',
		context,
		timestamp: new Date().toISOString()
	});
};
