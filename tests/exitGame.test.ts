import { expect, test } from '@playwright/test';

test.describe('user can exit a game', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/exitGame.${workerInfo.project.name}.png` });
	});

	test('when the user clicks the exit game icon, a modal will appear', async ({ page }) => {

	});

	test('when the user clicks on the Cancel button, the model will close', async ({ page }) => {

	});

	test('when the user clicks the Exit Game button, all users in the current game will be redirected to the game lobby', async ({ page }) => {

	});

});