export interface Article {
	id: number;
	title: string;
	status: 'Published' | 'Draft';
	author: string;
	createdAt: string; // ISO string
}

export type ArticleInput = Omit<Article, 'id' | 'createdAt'>;
export type Role = 'viewer' | 'editor';
export type Theme = 'light' | 'dark';
