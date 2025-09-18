import type { Article, ArticleInput } from '$lib/types';
import type { ArticleFilters, ArticleResponse } from '../api/articles';
import { MESSAGES } from '$lib/constants';
import { AppError } from '$lib/utils/errorHandler';

interface AirtableRecord {
	id: string;
	fields: {
		Title: string;
		Status: 'Published' | 'Draft';
		Author: string;
		CreatedAt: string;
	};
}

const errorMap = {
	GET: MESSAGES.ERRORS.FETCH_FAILED,
	POST: MESSAGES.ERRORS.CREATE_FAILED,
	PATCH: MESSAGES.ERRORS.UPDATE_FAILED,
	DELETE: MESSAGES.ERRORS.DELETE_FAILED
};

export class AirtableAPI {
	private baseUrl: string;
	private headers: Record<string, string>;
	private idMapping = new Map<number, string>();

	constructor(baseUri: string, baseId: string, tableId: string, apiKey: string) {
		this.baseUrl = `${baseUri}/${baseId}/${tableId}`;
		this.headers = {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		};
	}

	async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
		const allArticles = await this.fetchAllArticles(filters);
		const pageSize = Math.min(filters.limit || 10, 100);
		const page = filters.page || 1;
		const startIndex = (page - 1) * pageSize;
		const paginatedArticles = allArticles.slice(startIndex, startIndex + pageSize);

		return {
			articles: paginatedArticles,
			total: allArticles.length,
			page,
			limit: pageSize
		};
	}

	async createArticle(article: ArticleInput): Promise<Article> {
		const data = await this.request('POST', '', {
			fields: { Title: article.title, Status: article.status, Author: article.author }
		});
		return this.mapRecordToArticle(data);
	}

	async updateArticle(id: number, article: ArticleInput): Promise<Article> {
		const airtableId = await this.getAirtableId(id);
		const data = await this.request('PATCH', `/${airtableId}`, {
			fields: { Title: article.title, Status: article.status, Author: article.author }
		});
		return this.mapRecordToArticle(data);
	}

	async deleteArticle(id: number): Promise<void> {
		const airtableId = await this.getAirtableId(id);
		await this.request('DELETE', `/${airtableId}`);
	}

	private async request(method: string, path: string, body?: any) {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers: this.headers,
			...(body && { body: JSON.stringify(body) })
		});

		if (!response.ok) {
			throw new AppError(
				errorMap[method as keyof typeof errorMap],
				`${method}_ERROR`,
				response.status
			);
		}

		return method !== 'DELETE' ? response.json() : undefined;
	}

	private buildParams(filters: ArticleFilters) {
		const params = new URLSearchParams();
		params.set('pageSize', '100');
		params.set('sort[0][field]', 'CreatedAt');
		params.set('sort[0][direction]', 'desc');

		const filterFormulas = [];
		if (filters.search) {
			filterFormulas.push(`SEARCH(LOWER("${filters.search}"), LOWER({Title}))`);
		}
		if (filters.status && filters.status !== 'All') {
			filterFormulas.push(`{Status} = "${filters.status}"`);
		}
		if (filterFormulas.length) {
			params.set('filterByFormula', `AND(${filterFormulas.join(', ')})`);
		}

		return params;
	}

	private async fetchAllArticles(filters: ArticleFilters): Promise<Article[]> {
		const params = this.buildParams(filters);
		const data = await this.request('GET', `?${params}`);
		return data.records.map((record: AirtableRecord) => {
			const article = this.mapRecordToArticle(record);
			this.idMapping.set(article.id, record.id);
			return article;
		});
	}

	private mapRecordToArticle(record: AirtableRecord): Article {
		return {
			id: this.hashAirtableId(record.id),
			title: record.fields.Title,
			status: record.fields.Status,
			author: record.fields.Author,
			createdAt: record.fields.CreatedAt
		};
	}

	private hashAirtableId(airtableId: string): number {
		let hash = 0;
		for (let i = 0; i < airtableId.length; i++) {
			hash = ((hash << 5) - hash + airtableId.charCodeAt(i)) & 0x7fffffff;
		}
		return hash;
	}

	private async getAirtableId(numericId: number): Promise<string> {
		const airtableId = this.idMapping.get(numericId);
		if (airtableId) return airtableId;

		await this.fetchAllArticles({});
		const mappedId = this.idMapping.get(numericId);
		if (!mappedId) throw new AppError(`Article not found: ${numericId}`, 'NOT_FOUND_ERROR', 404);
		return mappedId;
	}
}
