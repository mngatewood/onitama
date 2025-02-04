import { expect, test } from '@playwright/test';

test.describe('user can select a pawn', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gamePawn.${workerInfo.project.name}.png` });
	});

	test.describe('when an action card is selected', () => {

		test('valid pawns have a hover state', async ({ page }) => {

		});

		test('invalid pawns do not have a hover state', async ({ page }) => {

		});

		test('the user cannot select a pawn on a space that is not highlighted', async ({ page }) => {

		});

		test('the user can select a highlighted pawn space:', async ({ page }) => {

			// All other pawn spaces are un - highlighted.
			// All valid spaces for the selected action and pawn are highlighted.
			// A valid space cannot be occupied by any of the user’s other pawns and is not highlighted.
			// A pawn can jump over other pawns, regardless of color.
			// All highlighted spaces that are occupied by any of the opponent’s pawns are highlighted in a different color.

		});

	});	

});