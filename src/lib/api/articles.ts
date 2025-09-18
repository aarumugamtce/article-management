import type { Article, ArticleInput } from '$lib/types';
import { base } from '$app/paths';
import { browser } from '$app/environment';
import { articles, addArticle, updateArticle, deleteArticle } from '$lib/stores/articles';
import { sanitizeArticleData } from '$lib/utils/sanitize';
import { MESSAGES } from '$lib/constants';
import { AppError } from '$lib/utils/errorHandler';

export interface ArticleFilters {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
}

export interface ArticleResponse {
	articles: Article[];
	total: number;
	page: number;
	limit: number;
}

// Check if we're specifically on GitHub Pages (not in CI/testing)
const isGitHubPages = () => {
	return (
		browser &&
		window.location.hostname.endsWith('.github.io') &&
		!window.location.hostname.includes('localhost')
	);
};

const errorMap = {
	GET: MESSAGES.ERRORS.FETCH_FAILED,
	POST: MESSAGES.ERRORS.CREATE_FAILED,
	PUT: MESSAGES.ERRORS.UPDATE_FAILED,
	DELETE: MESSAGES.ERRORS.DELETE_FAILED
};

const request = async (url: string, options?: RequestInit) => {
	const response = await fetch(url, options);
	if (!response.ok) {
		const method = (options?.method || 'GET') as keyof typeof errorMap;
		throw new AppError(errorMap[method], `${method}_ERROR`, response.status);
	}
	return response.json();
};

const buildParams = (filters: ArticleFilters) => {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined) params.set(key, value.toString());
	});
	return params.toString();
};

// Client-side operations for static deployment
const clientSideAPI = {
	getArticles: async (filters: ArticleFilters = {}): Promise<ArticleResponse> => {
		const { page = 1, limit = 10, search = '', status = '' } = filters;

		const data = articles.get();
		let filtered = data.filter(
			(art) =>
				(!search || art.title.toLowerCase().includes(search.toLowerCase())) &&
				(!status || art.status === status)
		);

		const total = filtered.length;
		filtered = filtered.slice((page - 1) * limit, page * limit);
		return { articles: filtered, total, page, limit };
	},

	createArticle: async (article: ArticleInput): Promise<Article> => {
		const sanitizedArticle = sanitizeArticleData(article);
		return addArticle(sanitizedArticle);
	},

	updateArticle: async (id: number, article: ArticleInput): Promise<Article> => {
		const sanitizedArticle = sanitizeArticleData(article);
		const updatedArticle = { id, createdAt: new Date().toISOString(), ...sanitizedArticle };
		updateArticle(updatedArticle);
		return updatedArticle;
	},

	deleteArticle: async (id: number): Promise<void> => {
		deleteArticle(id);
	}
};

// Server-side operations for full deployment
const serverSideAPI = {
	getArticles: (filters: ArticleFilters = {}): Promise<ArticleResponse> =>
		request(`${base}/api/articles?${buildParams(filters)}`),

	createArticle: (article: ArticleInput): Promise<Article> =>
		request(`${base}/api/articles`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(article)
		}),

	updateArticle: (id: number, article: ArticleInput): Promise<Article> =>
		request(`${base}/api/articles?id=${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(article)
		}),

	deleteArticle: async (id: number): Promise<void> => {
		await request(`${base}/api/articles?id=${id}`, { method: 'DELETE' });
	}
};

export const articleAPI = {
	getArticles: async (filters: ArticleFilters = {}): Promise<ArticleResponse> => {
		return isGitHubPages()
			? clientSideAPI.getArticles(filters)
			: serverSideAPI.getArticles(filters);
	},

	createArticle: async (article: ArticleInput): Promise<Article> => {
		return isGitHubPages()
			? clientSideAPI.createArticle(article)
			: serverSideAPI.createArticle(article);
	},

	updateArticle: async (id: number, article: ArticleInput): Promise<Article> => {
		return isGitHubPages()
			? clientSideAPI.updateArticle(id, article)
			: serverSideAPI.updateArticle(id, article);
	},

	deleteArticle: async (id: number): Promise<void> => {
		return isGitHubPages() ? clientSideAPI.deleteArticle(id) : serverSideAPI.deleteArticle(id);
	}
};
