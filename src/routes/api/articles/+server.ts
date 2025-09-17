import { json } from '@sveltejs/kit';
import { articles, addArticle, updateArticle, deleteArticle } from '$lib/stores/articles';
import type { Article } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const status = url.searchParams.get('status') || '';

  let data = articles.get();

  let filtered = data.filter((art) =>
    (search ? art.title.toLowerCase().includes(search) : true) &&
    (status ? art.status === status : true)
  );

  const total = filtered.length;
  filtered = filtered.slice((page - 1) * limit, page * limit);

  return json({ articles: filtered, total, page, limit });
};

export const POST: RequestHandler = async ({ request }) => {
  const body: Omit<Article, 'id' | 'createdAt'> = await request.json();
  addArticle(body);
  return json({ success: true }, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, url }) => {
  const id = parseInt(url.searchParams.get('id') || '0');
  const body: Omit<Article, 'id' | 'createdAt'> = await request.json();
  updateArticle({ id, createdAt: new Date().toISOString(), ...body });
  return json({ success: true });
};

export const DELETE: RequestHandler = async ({ url }) => {
  const id = parseInt(url.searchParams.get('id') || '0');
  deleteArticle(id);
  return json({ success: true });
};