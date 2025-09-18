import { describe, it, expect, beforeEach } from 'vitest';
import {
	articles,
	addArticle,
	updateArticle,
	deleteArticle
} from '../../../src/lib/stores/articles';
import type { Article } from '../../../src/lib/types';

describe('Articles Store', () => {
	beforeEach(() => {
		// Reset articles to initial state
		articles.value.length = 0;
		articles.value.push(
			{
				id: 1,
				title: 'Test Article 1',
				status: 'Published',
				author: 'Jane Doe',
				createdAt: '2024-05-01T12:00:00Z'
			},
			{
				id: 2,
				title: 'Test Article 2',
				status: 'Draft',
				author: 'John Smith',
				createdAt: '2024-06-01T12:00:00Z'
			}
		);
	});

	it('should add new article', () => {
		const initialCount = articles.get().length;

		addArticle({
			title: 'New Article',
			status: 'Draft',
			author: 'Test Author'
		});

		const updatedArticles = articles.get();
		expect(updatedArticles).toHaveLength(initialCount + 1);

		const newArticle = updatedArticles[0]; // New articles are now added to the beginning
		expect(newArticle.title).toBe('New Article');
		expect(newArticle.status).toBe('Draft');
		expect(newArticle.author).toBe('Test Author');
		expect(newArticle.id).toBeGreaterThan(0);
		expect(newArticle.createdAt).toBeDefined();
	});

	it('should update existing article', () => {
		const updatedArticle: Article = {
			id: 1,
			title: 'Updated Title',
			status: 'Published',
			author: 'Updated Author',
			createdAt: '2024-05-01T12:00:00Z'
		};

		updateArticle(updatedArticle);

		const articles_list = articles.get();
		const found = articles_list.find((a) => a.id === 1);

		expect(found).toBeDefined();
		expect(found?.title).toBe('Updated Title');
		expect(found?.author).toBe('Updated Author');
	});

	it('should delete article', () => {
		const initialCount = articles.get().length;

		deleteArticle(1);

		const updatedArticles = articles.get();
		expect(updatedArticles).toHaveLength(initialCount - 1);
		expect(updatedArticles.find((a) => a.id === 1)).toBeUndefined();
	});

	it('should handle update of non-existent article', () => {
		const initialArticles = [...articles.get()];

		updateArticle({
			id: 999,
			title: 'Non-existent',
			status: 'Draft',
			author: 'Nobody',
			createdAt: '2024-01-01T00:00:00Z'
		});

		// Should remain unchanged
		expect(articles.get()).toEqual(initialArticles);
	});

	it('should handle delete of non-existent article', () => {
		const initialArticles = [...articles.get()];

		deleteArticle(999);

		// Should remain unchanged
		expect(articles.get()).toEqual(initialArticles);
	});
});
