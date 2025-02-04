import { expect, test } from '@playwright/test';

test.describe('user can join a game', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/joinGame.${workerInfo.project.name}.png` });
	});

	test('when the user is in the game lobby, a list of pending games is displayed', async ({ page }) => {

	});

	test('the list of pending games is sorted from oldest to newest', async ({ page }) => {

	});

	test('when the user clicks the Join button for a pending game, the game page is displayed', async ({ page }) => {

	});

	test('when another user joins the game, waiting for another player modal closes', async ({ page }) => {

	});

	test('all pawns are in their starting position', async ({ page }) => {

	});

	test('each player is dealt two random action cards', async ({ page }) => {

	});

	test('one neutral card is dealt to the side of the game board', async ({ page }) => {

	});

	test('if the neutral card is blue, the blue player goes first', async ({ page }) => {

	});

	test('if the neutral card is red, the red player goes first', async ({ page }) => {

	});

	test('an Exit Game icon is displayed.', async ({ page }) => {

	});

});