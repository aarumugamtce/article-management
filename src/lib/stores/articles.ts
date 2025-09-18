import type { Article, ArticleInput } from '$lib/types';
import articlesData from '$lib/data/articles.json';

let nextId = Math.max(...articlesData.map((a) => a.id)) + 1;

export const articles = {
	value: articlesData as Article[],
	get: () => articles.value,
	set: (newArticles: Article[]) => {
		articles.value = newArticles;
	}
};

export const addArticle = (newArticle: ArticleInput): Article => {
	const createdArticle = { ...newArticle, id: nextId++, createdAt: new Date().toISOString() };
	articles.value = [createdArticle, ...articles.value];
	return createdArticle;
};

export const updateArticle = (updated: Article) => {
	const index = articles.value.findIndex((a) => a.id === updated.id);
	if (index !== -1) {
		articles.value[index] = updated;
		articles.value = [...articles.value];
	}
};

export const deleteArticle = (id: number) => {
	articles.value = articles.value.filter((a) => a.id !== id);
};
