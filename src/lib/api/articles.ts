import type { Article } from '$lib/types';
import { API_CONFIG, MESSAGES, STORAGE_KEYS } from '$lib/constants';
import { articles } from '$lib/stores/articles';

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

class ArticleAPI {
	async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
		// Use client-side data for static build
		const allArticles = articles.get();
		let filteredArticles = allArticles;

		// Apply search filter
		if (filters.search) {
			filteredArticles = filteredArticles.filter((article) =>
				article.title.toLowerCase().includes(filters.search!.toLowerCase())
			);
		}

		// Apply status filter
		if (filters.status && filters.status !== 'All') {
			filteredArticles = filteredArticles.filter((article) => article.status === filters.status);
		}

		const page = filters.page || 1;
		const limit = filters.limit || 10;
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		return {
			articles: filteredArticles.slice(startIndex, endIndex),
			total: filteredArticles.length,
			page,
			limit
		};
	}

	async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		const { addArticle } = await import('$lib/stores/articles');
		addArticle(article);

		// Return the created article
		const allArticles = articles.get();
		return allArticles[allArticles.length - 1];
	}

	async updateArticle(id: number, article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		const { updateArticle } = await import('$lib/stores/articles');
		const existingArticle = articles.get().find((a) => a.id === id);
		if (!existingArticle) throw new Error('Article not found');

		const updatedArticle = { ...existingArticle, ...article };
		updateArticle(updatedArticle);
		return updatedArticle;
	}

	async deleteArticle(id: number): Promise<void> {
		const { deleteArticle } = await import('$lib/stores/articles');
		deleteArticle(id);
	}
}

// For real backend API
class ExternalArticleAPI {
	constructor(private baseUrl: string) {}

	async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
		const params = new URLSearchParams();

		if (filters.page) params.set('page', filters.page.toString());
		if (filters.limit) params.set('limit', filters.limit.toString());
		if (filters.search) params.set('search', filters.search);
		if (filters.status) params.set('status', filters.status);

		const response = await fetch(`${this.baseUrl}/articles?${params}`, {
			headers: {
				Authorization: `Bearer ${this.getAuthToken()}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) throw new Error(MESSAGES.ERRORS.FETCH_FAILED);
		return response.json();
	}

	async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		const response = await fetch(`${this.baseUrl}/articles`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.getAuthToken()}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(article)
		});

		if (!response.ok) throw new Error(MESSAGES.ERRORS.CREATE_FAILED);
		return response.json();
	}

	async updateArticle(id: number, article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		const response = await fetch(`${this.baseUrl}/articles/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${this.getAuthToken()}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(article)
		});

		if (!response.ok) throw new Error(MESSAGES.ERRORS.UPDATE_FAILED);
		return response.json();
	}

	async deleteArticle(id: number): Promise<void> {
		const response = await fetch(`${this.baseUrl}/articles/${id}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${this.getAuthToken()}` }
		});

		if (!response.ok) throw new Error(MESSAGES.ERRORS.DELETE_FAILED);
	}

	private getAuthToken(): string {
		return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || '';
	}
}

// Configuration - switch between mock and real API
export const articleAPI = API_CONFIG.USE_MOCK_API
	? new ArticleAPI()
	: new ExternalArticleAPI(API_CONFIG.BACKEND_URL);
