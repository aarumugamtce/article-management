import { describe, it, expect } from 'vitest';

function validateArticleForm(title: string, author: string) {
	const errors: Record<string, string> = {};
	if (!title.trim()) errors.title = 'Title is required';
	if (!author.trim()) errors.author = 'Author is required';
	return { isValid: Object.keys(errors).length === 0, errors };
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString();
}

describe('Validation Utilities', () => {
	describe('validateArticleForm', () => {
		it('should validate required fields', () => {
			const result1 = validateArticleForm('', '');
			expect(result1.isValid).toBe(false);
			expect(result1.errors.title).toBe('Title is required');
			expect(result1.errors.author).toBe('Author is required');

			const result2 = validateArticleForm('Test Title', 'Test Author');
			expect(result2.isValid).toBe(true);
			expect(Object.keys(result2.errors)).toHaveLength(0);

			const result3 = validateArticleForm('   ', '   ');
			expect(result3.isValid).toBe(false);
		});
	});

	describe('formatDate', () => {
		it('should format ISO date string to locale date', () => {
			const isoDate = '2024-05-01T12:00:00Z';
			const formatted = formatDate(isoDate);
			expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
		});
	});
});
