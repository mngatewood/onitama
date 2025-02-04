import { expect, test } from '@playwright/test';

test.describe('user can view the demo', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameDemo.${workerInfo.project.name}.png` });
	});

	test('demo button is displayed on the home page and game lobby', async ({ page }) => {

	});	

	test.describe('user clicks the demo button', () => {

		test('a new game board is displayed', async ({ page }) => {
			// all pawns in their starting positions and all five cards dealt.
		});

		test('Exit Demo and Next buttons are displayed', async ({ page }) => {
			
		})

		test('when the user clicks the Exit Demo button, the demo is closed', async ({ page }) => {
			
		})

		test.describe('demo page 1', () => {

			test('Previous button is not displayed', async ({ page }) => {

			});

			test('an overview of the game is displayed', async ({ page }) => {
				// Flavor text
				// How to play and victory conditions
				// List of steps
				// 1. Select an action
				// 2. Select a pawn
				// 3. Move selected pawn
				// 4. Confirm action
			});

		});

		test.describe('demo page 2', () => {

			test('Previous button is displayed', async ({ page }) => {

			});

			test('when the user clicks the Previous button, the demo moves to the previous page', async ({ page }) => {

			});

			test('when the user clicks the Next button, the demo moves to the next page', async ({ page }) => {

			});

			test('an overview of Step 1 is displayed', async ({ page }) => {
				// Select an action
			});

		});

		test.describe('demo page 3', () => {

			test('when the user clicks the Previous button, the demo moves to the previous page', async ({ page }) => {

			});

			test('when the user clicks the Next button, the demo moves to the next page', async ({ page }) => {

			});

			test('an overview of Step 2 is displayed', async ({ page }) => {
				// Select a pawn
			});

		});

		test.describe('demo page 4', () => {

			test('when the user clicks the Previous button, the demo moves to the previous page', async ({ page }) => {

			});

			test('when the user clicks the Next button, the demo moves to the next page', async ({ page }) => {

			});

			test('an overview of Step 3 is displayed', async ({ page }) => {
				// Select a space to move the pawn
			});

		});

		test.describe('demo page 5', () => {

			test('when the user clicks the Previous button, the demo moves to the previous page', async ({ page }) => {

			});

			test('when the user clicks the Next button, the demo moves to the next page', async ({ page }) => {

			});

			test('an overview of Step 4 is displayed', async ({ page }) => {
				// Confirm action
			});

		});

		test.describe('demo page 6', () => {

			test('when the user clicks the Previous button, the demo moves to the previous page', async ({ page }) => {

			});

			test('the Next buttons is not displayed', async ({ page }) => {

			});

			test('an overview of the game end is displayed', async ({ page }) => {
				// Victory conditions
				// Exit Game or Play Again
				// Exit game at any time with exit button
			});

		});

	});	

});