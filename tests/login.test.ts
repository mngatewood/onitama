import { expect, test } from '@playwright/test';

test.describe('user can login', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/login.${workerInfo.project.name}.png` });
	});

	test('when the user clicks the Login button, the Login page is displayed', async ({ page }) => {

	});

	test('when the user clicks Cancel, they are redirected to the home page', async ({ page }) => {

	});

	test('Data validation', async ({ page }) => {

	});

	test('email is required and must be valid', async ({ page }) => {

	});

	test('password is required and must be at least 8 characters', async ({ page }) => {

	});

	test('if validation fails, an error message is displayed', async ({ page }) => {

	});

	test('submit button is inactive until all required fields pass validation', async ({ page }) => {

	});

	test('Submit button is active if all required fields pass validation', async ({ page }) => {

	});

	test('when the user clicks submit, the user is logged in and redirected to the game lobby', async ({ page }) => {

	});

	test('when a user joins the game lobby, all pending games older than 15 minutes are deleted', async ({ page }) => {

	});

});