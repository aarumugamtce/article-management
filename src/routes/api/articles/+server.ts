import { json } from '@sveltejs/kit';
import { articles, addArticle, updateArticle, deleteArticle } from '$lib/stores/articles';
import { AirtableAPI } from '$lib/server/airtable';
import type { ArticleInput } from '$lib/types';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const airtableAPI = new AirtableAPI(
	env.API_BASE_URL || 'https://api.airtable.com/v0',
	env.AIRTABLE_BASE_ID || '',
	env.AIRTABLE_TABLE_ID || '',
	env.AIRTABLE_API_KEY || ''
);

const useMockAPI = env.USE_MOCK_API !== 'false' || !env.AIRTABLE_API_KEY;

const handleError = async (error: unknown, context: string) => {
	const { logError, handleApiError } = await import('$lib/utils/errorHandler');
	logError(error, context);
	return json({ error: handleApiError(error) }, { status: 500 });
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const search = url.searchParams.get('search') || '';
		const status = url.searchParams.get('status') || '';

		if (useMockAPI) {
			const data = articles.get();
			let filtered = data.filter(
				(art) =>
					(!search || art.title.toLowerCase().includes(search.toLowerCase())) &&
					(!status || art.status === status)
			);

			const total = filtered.length;
			filtered = filtered.slice((page - 1) * limit, page * limit);
			return json({ articles: filtered, total, page, limit });
		}

		const result = await airtableAPI.getArticles({ page, limit, search, status });
		return json(result);
	} catch (error) {
		return handleError(error, 'GET /api/articles');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: ArticleInput = await request.json();
		const { sanitizeArticleData } = await import('$lib/utils/sanitize');
		const sanitizedArticle = sanitizeArticleData(body);

		const result = useMockAPI
			? addArticle(sanitizedArticle)
			: await airtableAPI.createArticle(sanitizedArticle);

		return json(result, { status: 201 });
	} catch (error) {
		return handleError(error, 'POST /api/articles');
	}
};

export const PUT: RequestHandler = async ({ request, url }) => {
	try {
		const id = parseInt(url.searchParams.get('id') || '0');
		const body: ArticleInput = await request.json();
		const { sanitizeArticleData } = await import('$lib/utils/sanitize');
		const sanitizedArticle = sanitizeArticleData(body);

		if (useMockAPI) {
			const updatedArticle = { id, createdAt: new Date().toISOString(), ...sanitizedArticle };
			updateArticle(updatedArticle);
			return json(updatedArticle);
		}

		const result = await airtableAPI.updateArticle(id, sanitizedArticle);
		return json(result);
	} catch (error) {
		return handleError(error, 'PUT /api/articles');
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	try {
		const id = parseInt(url.searchParams.get('id') || '0');

		if (useMockAPI) {
			deleteArticle(id);
		} else {
			await airtableAPI.deleteArticle(id);
		}

		return json({ success: true });
	} catch (error) {
		return handleError(error, 'DELETE /api/articles');
	}
};
