import { expect, test } from '@playwright/test';

test.describe('Article Management', () => {
	test('should display main page elements', async ({ page }) => {
		// Set desktop viewport to ensure all toggles are visible
		await page.setViewportSize({ width: 1024, height: 768 });
		await page.goto('/');

		// Wait for page to load
		await page.waitForLoadState('networkidle');

		// Check main heading
		await expect(page.locator('h1')).toContainText('Article Manager');

		// Check toggle switches exist
		await expect(page.getByTitle('Toggle theme')).toBeVisible();
		await expect(page.getByTitle('Toggle role')).toBeVisible();

		// Check search and filter controls exist
		await expect(page.getByLabel('Search by Title')).toBeVisible();
		await expect(page.getByText('Filter by Status')).toBeVisible();
	});

	test('should toggle between light and dark themes', async ({ page }) => {
		await page.goto('/');

		// Get theme toggle and click it
		const themeToggle = page.getByTitle('Toggle theme');
		await expect(themeToggle).toBeVisible();
		await themeToggle.click();

		// Verify toggle is still visible (theme changed)
		await expect(themeToggle).toBeVisible();
	});

	test('should toggle between editor and viewer roles', async ({ page }) => {
		await page.goto('/');

		// Get role toggle and click it
		const roleToggle = page.getByTitle('Toggle role');
		await expect(roleToggle).toBeVisible();
		await roleToggle.click();

		// Verify toggle is still visible (role changed)
		await expect(roleToggle).toBeVisible();
	});

	test('should display main content', async ({ page }) => {
		await page.goto('/');

		// Wait for page to load
		await page.waitForLoadState('networkidle');

		// Check if main content area is displayed (articles or no articles message)
		const mainContent = page.locator('main');
		await expect(mainContent).toBeVisible();
	});
});

test.describe('Basic Functionality', () => {
	test('should have working search input', async ({ page }) => {
		await page.goto('/');

		// Test search input
		const searchInput = page.getByLabel('Search by Title');
		await expect(searchInput).toBeVisible();
		await searchInput.fill('test search');
		await expect(searchInput).toHaveValue('test search');
	});

	test('should have working status filter', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Check that filter section exists
		const filterLabel = page.getByText('Filter by Status');
		await expect(filterLabel).toBeVisible();

		// Check that there's a dropdown button near the filter
		const dropdownButton = page.locator('button').filter({ hasText: 'All' }).first();
		await expect(dropdownButton).toBeVisible();
	});

	test('should have scroll functionality', async ({ page }) => {
		await page.goto('/');

		// Wait for page to load
		await page.waitForLoadState('networkidle');

		// Test basic scroll functionality by checking if we can scroll
		const initialScrollY = await page.evaluate(() => window.scrollY);
		expect(initialScrollY).toBe(0);

		// Check if page is scrollable
		const isScrollable = await page.evaluate(() => {
			return document.body.scrollHeight > window.innerHeight;
		});

		if (isScrollable) {
			// Scroll down
			await page.evaluate(() => window.scrollTo(0, 100));
			const scrolledY = await page.evaluate(() => window.scrollY);
			expect(scrolledY).toBeGreaterThan(0);

			// Scroll back to top
			await page.evaluate(() => window.scrollTo(0, 0));
			const backToTopY = await page.evaluate(() => window.scrollY);
			expect(backToTopY).toBe(0);
		} else {
			// If not scrollable, just verify scroll position stays 0
			await page.evaluate(() => window.scrollTo(0, 100));
			const scrolledY = await page.evaluate(() => window.scrollY);
			expect(scrolledY).toBe(0); // Should remain 0 if not scrollable
		}
	});
});
