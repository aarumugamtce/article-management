import type { Article } from '$lib/types';
import { base } from '$app/paths';
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

// Article API client - uses SvelteKit routes
class ArticleAPI {
	async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
		const params = new URLSearchParams();
		if (filters.page) params.set('page', filters.page.toString());
		if (filters.limit) params.set('limit', filters.limit.toString());
		if (filters.search) params.set('search', filters.search);
		if (filters.status) params.set('status', filters.status);

		const response = await fetch(`${base}/api/articles?${params}`);
		if (!response.ok)
			throw new AppError(MESSAGES.ERRORS.FETCH_FAILED, 'FETCH_ERROR', response.status);
		return response.json();
	}

	async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		const response = await fetch(`${base}/api/articles`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(article)
		});
		if (!response.ok)
			throw new AppError(MESSAGES.ERRORS.CREATE_FAILED, 'CREATE_ERROR', response.status);
		return response.json();
	}

	async updateArticle(id: number, article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		const response = await fetch(`${base}/api/articles?id=${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(article)
		});
		if (!response.ok)
			throw new AppError(MESSAGES.ERRORS.UPDATE_FAILED, 'UPDATE_ERROR', response.status);
		return response.json();
	}

	async deleteArticle(id: number): Promise<void> {
		const response = await fetch(`${base}/api/articles?id=${id}`, {
			method: 'DELETE'
		});
		if (!response.ok)
			throw new AppError(MESSAGES.ERRORS.DELETE_FAILED, 'DELETE_ERROR', response.status);
	}
}

// Single API instance - server routes handle mock vs Airtable
export const articleAPI = new ArticleAPI();
