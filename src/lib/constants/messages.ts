export const MESSAGES = {
	ERRORS: {
		FETCH_FAILED: 'Failed to fetch articles',
		CREATE_FAILED: 'Failed to create article',
		UPDATE_FAILED: 'Failed to update article',
		DELETE_FAILED: 'Failed to delete article',
		SAVE_FAILED: 'Failed to save article'
	},
	LOADING: {
		ARTICLES: 'Loading articles...',
		MORE_ARTICLES: 'Loading more articles...'
	},
	EMPTY_STATES: {
		NO_ARTICLES: 'No articles found.',
		NO_MORE_ARTICLES: 'No more articles to load'
	}
} as const;
