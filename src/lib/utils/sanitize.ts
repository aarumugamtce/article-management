/**
 * XSS Protection utilities
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
	if (!input) return '';

	return input
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;')
		.trim();
}

/**
 * Sanitize article data before processing
 */
export function sanitizeArticleData<
	T extends {
		title: string;
		author: string;
		status: string;
	}
>(data: T): T {
	return {
		...data,
		title: sanitizeString(data.title),
		author: sanitizeString(data.author),
		status: sanitizeString(data.status)
	} as T;
}
