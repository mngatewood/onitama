import { expect, test } from '@playwright/test';

test.describe('user can create a new game', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/newGame.${workerInfo.project.name}.png` });
	});

	test('when the user is in the game lobby, a New Game button is displayed', async ({ page }) => {

	})

	test('when the New Game button is clicked, a new game is added to the database', async ({ page }) => {

	})

	test('when a game is created, the game page is displayed with a modal', async ({ page }) => {

	})

	test('the modal reads “Waiting for another player to join.”', async ({ page }) => {

	})

	test('the modal displays an Exit Game button', async ({ page }) => {

	})

	test('when the user clicks the Exit Game button, they are redirected to the game lobby', async ({ page }) => {

	})


});