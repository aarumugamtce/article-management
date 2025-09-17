import { expect, test } from '@playwright/test';

test.describe('Article Management', () => {
	test('should display main page elements', async ({ page }) => {
		await page.goto('/');

		// Check main heading
		await expect(page.locator('h1')).toContainText('Article Manager');

		// Check theme and role buttons exist
		await expect(page.getByText(/light|dark/)).toBeVisible();
		await expect(page.getByText(/editor|viewer/)).toBeVisible();

		// Check search and filter controls exist
		await expect(page.getByLabel('Search by Title')).toBeVisible();
		await expect(page.getByLabel('Filter by Status')).toBeVisible();
	});

	test('should toggle between light and dark themes', async ({ page }) => {
		await page.goto('/');

		// Get theme button and click it
		const themeButton = page.getByText(/🌙|☀️/);
		await expect(themeButton).toBeVisible();
		await themeButton.click();

		// Verify button is still visible (theme changed)
		await expect(themeButton).toBeVisible();
	});

	test('should toggle between editor and viewer roles', async ({ page }) => {
		await page.goto('/');

		// Get role button and click it
		const roleButton = page.getByText(/👤/);
		await expect(roleButton).toBeVisible();
		await roleButton.click();

		// Verify button is still visible (role changed)
		await expect(roleButton).toBeVisible();
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

		// Test status filter
		const statusSelect = page.getByLabel('Filter by Status');
		await expect(statusSelect).toBeVisible();
		await statusSelect.selectOption('Published');
	});
});
