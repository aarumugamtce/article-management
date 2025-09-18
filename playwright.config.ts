import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		timeout: 120000,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'e2e',
	timeout: 30000,
	use: {
		baseURL: process.env.GITHUB_ACTIONS
			? 'http://localhost:4173/article-management'
			: 'http://localhost:4173'
	}
});
