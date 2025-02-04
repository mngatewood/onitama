import { expect, test } from '@playwright/test';

test.describe('user can logout', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/logout.${workerInfo.project.name}.png` });
	});

	test('account icon is visible when in the game lobby', async ({ page }) => {

	});

	test('When the user clicks the account icon, the account management modal is displayed', async ({ page }) => {

	});

	test('account management modal displays a Logout button', async ({ page }) => {

	});

	test('when the user clicks the Logout button, a modal appears', async ({ page }) => {

	});

	test('when the user clicks the Logout button, the user is logged out', async ({ page }) => {

	});

	test('when the user is logged out, they are redirected to the home page', async ({ page }) => {

	});

	test('when the user clicks the Cancel button, the account management modal closes', async ({ page }) => {

	});

});