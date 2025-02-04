import { expect, test } from '@playwright/test';

test.describe('home page is displayed', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/home.${workerInfo.project.name}.png` });
	});

	test('home page has a title heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Onitama' })).toBeVisible();
	});

	test('home page has Register button', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
	});

	test('home page has Login button', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Login'})).toBeVisible();
	});

	test('home page has Demo button', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Guide'})).toBeVisible();
	});

	test('home page has dark mode toggle button', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Switch to light / dark version' })).toBeVisible();
	});

	test('no other buttons are visible', async ({ page }) => {
		await expect(page.getByRole('button')).toHaveCount(4);
	});

});