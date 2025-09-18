import type { ArticleInput } from '$lib/types';

export const sanitizeString = (input: string): string => {
	if (!input) return '';
	return input
		.replace(/[<>"'\/]/g, (match) => {
			const map: Record<string, string> = {
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#x27;',
				'/': '&#x2F;'
			};
			return map[match];
		})
		.trim();
};

export const sanitizeArticleData = (data: ArticleInput): ArticleInput => ({
	title: sanitizeString(data.title),
	author: sanitizeString(data.author),
	status: data.status // Status is controlled enum, no need to sanitize
});
