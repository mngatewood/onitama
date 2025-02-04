import { expect, test } from '@playwright/test';

test.describe('game ends when a victory condition is met', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameVictory.${workerInfo.project.name}.png` });
	});

	test.describe('opponent master is defeated', () => {

		test('a victory modal is displayed', async ({ page }) => {
			// The modal will have an Exit Game button and Play Again button.
		});

		test.describe('when the Exit Game button is clicked', () => {

			test('all players in the current game are redirected to the game lobby', async ({ page }) => {

			});

		});

		test.describe('when the Play Again button is clicked', () => {

			test('Play Again button is highlighted', async ({ page }) => {

			});

			test('when second player clicks Play Again, the game restarts', async ({ page }) => {
				// The game end modal will close.
				// The board will be reset with all pawns in their starting position.
				// The winning player’s score will be increased by one.
				// Five new cards will be dealt at random.
				// The game turn status component will update in the same manner as in new game start.			});

			});
		});

	});	

	test.describe('opponent temple is overtaken', () => {

		test('a victory modal is displayed', async ({ page }) => {
			// The modal will have an Exit Game button and Play Again button.
		});

		test.describe('when the Exit Game button is clicked', () => {

			test('all players in the current game are redirected to the game lobby', async ({ page }) => {

			});

		});

		test.describe('when the Play Again button is clicked', () => {

			test('Play Again button is highlighted', async ({ page }) => {

			});

			test('when second player clicks Play Again, the game restarts', async ({ page }) => {
				// The game end modal will close.
				// The board will be reset with all pawns in their starting position.
				// The winning player’s score will be increased by one.
				// Five new cards will be dealt at random.
				// The game turn status component will update in the same manner as in new game start.			});

			});
		});

	});	

});