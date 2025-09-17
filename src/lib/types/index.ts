export interface Article {
	id: number;
	title: string;
	status: 'Published' | 'Draft';
	author: string;
	createdAt: string; // ISO string
}
