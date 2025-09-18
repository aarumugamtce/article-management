import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeArticleData } from '../../../src/lib/utils/sanitize';

describe('Sanitize Utilities', () => {
	describe('sanitizeString', () => {
		it('should escape HTML characters', () => {
			const input = '<script>alert("xss")</script>';
			const result = sanitizeString(input);
			expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
		});

		it('should handle empty string', () => {
			expect(sanitizeString('')).toBe('');
		});

		it('should trim whitespace', () => {
			expect(sanitizeString('  test  ')).toBe('test');
		});

		it('should escape quotes and slashes', () => {
			const input = `"Hello's world"/path`;
			const result = sanitizeString(input);
			expect(result).toBe('&quot;Hello&#x27;s world&quot;&#x2F;path');
		});
	});

	describe('sanitizeArticleData', () => {
		it('should sanitize all article fields', () => {
			const input = {
				title: '<script>alert("title")</script>',
				author: '"Malicious" Author',
				status: 'Published' as const
			};

			const result = sanitizeArticleData(input);

			expect(result.title).toBe('&lt;script&gt;alert(&quot;title&quot;)&lt;&#x2F;script&gt;');
			expect(result.author).toBe('&quot;Malicious&quot; Author');
			expect(result.status).toBe('Published');
		});

		it('should preserve type structure', () => {
			const input = {
				title: 'Normal Title',
				author: 'Normal Author',
				status: 'Draft' as const
			};

			const result = sanitizeArticleData(input);

			expect(result).toEqual({
				title: 'Normal Title',
				author: 'Normal Author',
				status: 'Draft'
			});
		});
	});
});
