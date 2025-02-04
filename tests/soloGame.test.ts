import { expect, test } from '@playwright/test';

test.describe('user can play a solo game', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/soloGame.${workerInfo.project.name}.png` });
	});

	test('The game lobby displays a Play Solo Game button', async ({ page }) => {

	});	

	test('The game lobby displays a Start Online Game button', async ({ page }) => {

	});	

	test('when the user clicks the Play Solo Game button, a new game created', async ({ page }) => {
		// new game added to database
		// game page is displayed
		// all cards are dealt
		// all pawns in their starting positions
		// solo game modal is displayed
	});

	test.describe('the game will complete its turns', () => {

		test.describe('a victory is possible', () => {

			test('the game will select a card that will result in a victory', async ({ page }) => {
				
			});

			test('the game will select a pawn that will result in a victory', async ({ page }) => {
				
			});

			test('the game will select a move that will result in a victory', async ({ page }) => {
				
			});

		});

		test.describe('a defeated pawn is possible', () => {

			test('the game will select a card that will result in a defeated pawn', async ({ page }) => {
				
			});

			test('the game will select a pawn that will result in a defeated pawn', async ({ page }) => {
				
			});

			test('the game will select a move that will result in a defeated pawn', async ({ page }) => {
				
			});

		});

		test.describe('one or more of the games pawns are threatened', () => {

			test('the game will select a card that will allow a threatened pawn to move', async ({ page }) => {
				
			});

			test('the game will select a pawn that will allow a threatened pawn to move', async ({ page }) => {
				
			});

			test('the game will select a move that will allow a threatened pawn to move', async ({ page }) => {
				
			});

		});

		test.describe('only one of the two actions are valid', () => {

			test('the game will select the card that is valid', async ({ page }) => {
				
			});

			test('the game will select a valid pawn', async ({ page }) => {
				
			});

			test('the game will select a valid move', async ({ page }) => {
				
			});

		});

		test.describe('neither of the two actions are valid', () => {

			test('the game will select the card at random', async ({ page }) => {
				
			});

			test('the game will pass and the game will proceed to the player', async ({ page }) => {
				
			});

		});

		test.describe('both of the two actions are valid', () => {

			test('the game will select a card at random', async ({ page }) => {
				
			});

			test('the game will select a valid pawn', async ({ page }) => {

			});

			test('the game will select a valid move', async ({ page }) => {

			});

		});

	});

});