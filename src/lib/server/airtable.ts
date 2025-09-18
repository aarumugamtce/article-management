import type { Article } from '$lib/types';
import type { ArticleFilters, ArticleResponse } from '../api/articles';
import { MESSAGES } from '$lib/constants';

interface AirtableRecord {
	id: string;
	fields: {
		Title: string;
		Status: 'Published' | 'Draft';
		Author: string;
		CreatedAt: string;
	};
}

interface AirtableResponse {
	records: AirtableRecord[];
	offset?: string;
}

export class AirtableAPI {
	private baseUrl: string;
	private headers: Record<string, string>;
	private idMapping = new Map<number, string>(); // Store numeric ID -> Airtable record ID mapping

	constructor(
		baseUri: string,
		private baseId: string,
		private tableId: string,
		private apiKey: string
	) {
		this.baseUrl = `${baseUri}/${baseId}/${tableId}`;
		this.headers = {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		};
	}

	async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
		const params = new URLSearchParams();

		// Airtable pagination - use pageSize only, no manual offset
		const pageSize = Math.min(filters.limit || 10, 100);
		params.set('pageSize', pageSize.toString());

		// Airtable filtering
		const filterFormulas = [];
		if (filters.search) {
			filterFormulas.push(`SEARCH(LOWER("${filters.search}"), LOWER({Title}))`);
		}
		if (filters.status && filters.status !== 'All') {
			filterFormulas.push(`{Status} = "${filters.status}"`);
		}

		if (filterFormulas.length > 0) {
			params.set('filterByFormula', `AND(${filterFormulas.join(', ')})`);
		}

		// Sort by creation date (newest first)
		params.set('sort[0][field]', 'CreatedAt');
		params.set('sort[0][direction]', 'desc');

		const response = await fetch(`${this.baseUrl}?${params}`, {
			headers: this.headers
		});

		if (!response.ok) {
			throw new Error(MESSAGES.ERRORS.FETCH_FAILED);
		}

		const data: AirtableResponse = await response.json();
		const articles = data.records.map((record) => {
			const article = this.mapRecordToArticle(record);
			// Store the mapping for future updates/deletes
			this.idMapping.set(article.id, record.id);
			return article;
		});

		// For pagination simulation, get all records if page > 1
		let allArticles = articles;
		if (filters.page && filters.page > 1) {
			// Fetch all records to simulate pagination
			allArticles = await this.getAllArticles(filters);
			const startIndex = (filters.page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			allArticles = allArticles.slice(startIndex, endIndex);
		}

		// Get actual total count
		const actualTotal = await this.getTotalCount(filters);

		return {
			articles: allArticles,
			total: actualTotal,
			page: filters.page || 1,
			limit: pageSize
		};
	}

	async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({
				fields: {
					Title: article.title,
					Status: article.status,
					Author: article.author
				}
			})
		});

		if (!response.ok) {
			throw new Error(MESSAGES.ERRORS.CREATE_FAILED);
		}

		const data: AirtableRecord = await response.json();
		return this.mapRecordToArticle(data);
	}

	async updateArticle(id: number, article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
		// Convert numeric ID to Airtable record ID (you'll need to store this mapping)
		const airtableId = await this.getAirtableId(id);

		const response = await fetch(`${this.baseUrl}/${airtableId}`, {
			method: 'PATCH',
			headers: this.headers,
			body: JSON.stringify({
				fields: {
					Title: article.title,
					Status: article.status,
					Author: article.author
				}
			})
		});

		if (!response.ok) {
			throw new Error(MESSAGES.ERRORS.UPDATE_FAILED);
		}

		const data: AirtableRecord = await response.json();
		return this.mapRecordToArticle(data);
	}

	async deleteArticle(id: number): Promise<void> {
		const airtableId = await this.getAirtableId(id);

		const response = await fetch(`${this.baseUrl}/${airtableId}`, {
			method: 'DELETE',
			headers: this.headers
		});

		if (!response.ok) {
			throw new Error(MESSAGES.ERRORS.DELETE_FAILED);
		}
	}

	private mapRecordToArticle(record: AirtableRecord): Article {
		return {
			id: this.hashAirtableId(record.id), // Convert Airtable ID to numeric
			title: record.fields.Title,
			status: record.fields.Status,
			author: record.fields.Author,
			createdAt: record.fields.CreatedAt
		};
	}

	private hashAirtableId(airtableId: string): number {
		// Simple hash function to convert Airtable ID to number
		let hash = 0;
		for (let i = 0; i < airtableId.length; i++) {
			const char = airtableId.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash);
	}

	private async getAllArticles(filters: ArticleFilters): Promise<Article[]> {
		const params = new URLSearchParams();
		params.set('pageSize', '100'); // Max page size

		// Apply filters
		const filterFormulas = [];
		if (filters.search) {
			filterFormulas.push(`SEARCH(LOWER("${filters.search}"), LOWER({Title}))`);
		}
		if (filters.status && filters.status !== 'All') {
			filterFormulas.push(`{Status} = "${filters.status}"`);
		}
		if (filterFormulas.length > 0) {
			params.set('filterByFormula', `AND(${filterFormulas.join(', ')})`);
		}

		// Sort by creation date
		params.set('sort[0][field]', 'CreatedAt');
		params.set('sort[0][direction]', 'desc');

		const response = await fetch(`${this.baseUrl}?${params}`, {
			headers: this.headers
		});

		if (!response.ok) {
			throw new Error(MESSAGES.ERRORS.FETCH_FAILED);
		}

		const data: AirtableResponse = await response.json();
		return data.records.map((record) => this.mapRecordToArticle(record));
	}

	private async getTotalCount(filters: ArticleFilters): Promise<number> {
		const params = new URLSearchParams();
		params.set('pageSize', '1'); // Just get one record to check total

		// Apply same filters as main query
		const filterFormulas = [];
		if (filters.search) {
			filterFormulas.push(`SEARCH(LOWER("${filters.search}"), LOWER({Title}))`);
		}
		if (filters.status && filters.status !== 'All') {
			filterFormulas.push(`{Status} = "${filters.status}"`);
		}
		if (filterFormulas.length > 0) {
			params.set('filterByFormula', `AND(${filterFormulas.join(', ')})`);
		}

		// Get all records to count them (Airtable doesn't provide total count directly)
		const allRecords = await this.getAllArticles(filters);
		return allRecords.length;
	}

	private async getAirtableId(numericId: number): Promise<string> {
		// Check if we have the mapping in memory
		const airtableId = this.idMapping.get(numericId);
		if (airtableId) {
			return airtableId;
		}

		// If not in memory, fetch all records to populate the mapping
		await this.getAllArticles({});
		const mappedId = this.idMapping.get(numericId);
		if (!mappedId) {
			throw new Error(`Article not found: ${numericId}`);
		}
		return mappedId;
	}
}
