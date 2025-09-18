import { json } from '@sveltejs/kit';
import { articles, addArticle, updateArticle, deleteArticle } from '$lib/stores/articles';
import { AirtableAPI } from '$lib/server/airtable';
import { API_CONFIG } from '$lib/constants';
import type { Article } from '$lib/types';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Initialize Airtable API with server-side secrets
const airtableAPI = new AirtableAPI(
	env.API_BASE_URL || 'https://api.airtable.com/v0',
	env.AIRTABLE_BASE_ID || '',
	env.AIRTABLE_TABLE_ID || '',
	env.AIRTABLE_API_KEY || ''
);

export const GET: RequestHandler = async ({ url }) => {
	if (env.USE_MOCK_API !== 'false') {
		// Use mock data
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const search = url.searchParams.get('search')?.toLowerCase() || '';
		const status = url.searchParams.get('status') || '';

		const data = articles.get();
		let filtered = data.filter(
			(art) =>
				(search ? art.title.toLowerCase().includes(search) : true) &&
				(status ? art.status === status : true)
		);

		const total = filtered.length;
		filtered = filtered.slice((page - 1) * limit, page * limit);
		return json({ articles: filtered, total, page, limit });
	} else {
		// Use Airtable API
		const filters = {
			page: parseInt(url.searchParams.get('page') || '1'),
			limit: parseInt(url.searchParams.get('limit') || '10'),
			search: url.searchParams.get('search') || undefined,
			status: url.searchParams.get('status') || undefined
		};
		const result = await airtableAPI.getArticles(filters);
		return json(result);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const body: Omit<Article, 'id' | 'createdAt'> = await request.json();
	const { sanitizeArticleData } = await import('$lib/utils/sanitize');

	// Sanitize input to prevent XSS
	const sanitizedArticle = sanitizeArticleData(body);

	if (env.USE_MOCK_API !== 'false') {
		addArticle(sanitizedArticle);
		return json({ success: true }, { status: 201 });
	} else {
		const result = await airtableAPI.createArticle(sanitizedArticle);
		return json(result, { status: 201 });
	}
};

export const PUT: RequestHandler = async ({ request, url }) => {
	const id = parseInt(url.searchParams.get('id') || '0');
	const body: Omit<Article, 'id' | 'createdAt'> = await request.json();
	const { sanitizeArticleData } = await import('$lib/utils/sanitize');

	// Sanitize input to prevent XSS
	const sanitizedArticle = sanitizeArticleData(body);

	if (env.USE_MOCK_API !== 'false') {
		updateArticle({ id, createdAt: new Date().toISOString(), ...sanitizedArticle });
		return json({ success: true });
	} else {
		const result = await airtableAPI.updateArticle(id, sanitizedArticle);
		return json(result);
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = parseInt(url.searchParams.get('id') || '0');

	if (env.USE_MOCK_API !== 'false') {
		deleteArticle(id);
		return json({ success: true });
	} else {
		await airtableAPI.deleteArticle(id);
		return json({ success: true });
	}
};
