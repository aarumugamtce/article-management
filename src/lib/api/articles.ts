import type { Article } from '$lib/types';
import { API_CONFIG, MESSAGES, STORAGE_KEYS } from '$lib/constants';

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
  private baseUrl = API_CONFIG.ENDPOINTS.ARTICLES;

  async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    
    return response.json();
  }

  async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  }

  async updateArticle(id: number, article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    const response = await fetch(`${this.baseUrl}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  }

  async deleteArticle(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}?id=${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete article');
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
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  }

  async createArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    const response = await fetch(`${this.baseUrl}/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(article)
    });
    
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  }

  async updateArticle(id: number, article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> {
    const response = await fetch(`${this.baseUrl}/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(article)
    });
    
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  }

  async deleteArticle(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
    });
    
    if (!response.ok) throw new Error('Failed to delete article');
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}

// Configuration - switch between mock and real API
const USE_MOCK_API = true; // Set to false for real backend
const BACKEND_URL = 'https://api.example.com';

export const articleAPI = USE_MOCK_API 
  ? new ArticleAPI() 
  : new ExternalArticleAPI(BACKEND_URL);