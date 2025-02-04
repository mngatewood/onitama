import { expect, test } from '@playwright/test';

test.describe('user can move a pawn', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameMove.${workerInfo.project.name}.png` });
	});

	test.describe('when pawn is selected', () => {

		test('valid spaces have a hover state', async ({ page }) => {

		});

		test('invalid spaces do not have a hover state', async ({ page }) => {

		});

		test('the user cannot select a space that is not highlighted', async ({ page }) => {

		});

		test.describe('the user selects a highlighted space', () => {

			test('the selected space is rendered with the selected pawn and remains highlighted', async ({ page }) => {
				
			});

			test('the space from which the pawn originated is rendered as a highlighted empty space', async ({ page }) => {
				
			});
			
			test('no other spaces are highlighted', async ({ page }) => {
				
			});

			test('the game turn status text is updated', async ({ page }) => {
				// it reads “Turn completed. Click * check mark * to confirm or * X * to cancel.
			});

			test.describe('the selected space is occupied by an opponent student pawn', () => {
				
				test('the defeated pawn is removed from the board', async ({ page }) => {
					
				});
				
				test('the defeated pawn is rendered beside the board', async ({ page }) => {
					
				});

			});
			
			test.describe('the selected space is occupied by an opponent master pawn', () => {
				
				test('the defeated pawn is removed from the board', async ({ page }) => {
					
				});
				
				test('the defeated pawn is rendered beside the board', async ({ page }) => {
					
				});

				test('the defeated pawn is highlighted to indicate victory', async ({ page }) => {
					
				});

			});
			
			test.describe('the selected space is the opponent temple', () => {
				
				test('the selected space is highlighted in a special color to indicate victory', async ({ page }) => {
					
				});

			});

			test('a * check mark * button and * X * button are displayed next to the board', async ({ page }) => {
				
			});

			test.describe('the user clicks the * check mark * button', () => {
				
				test('no cards are highlighted', async ({ page }) => {
					
				});

				test('the origin and destination spaces remain highlighted', async ({ page }) => {
					
				});

				test('no other spaces are highlighted', async ({ page }) => {
					
				});

				test('the neutral card is moved to the player hand', async ({ page }) => {
					
				});

				test('the selected card is moved to the neutral card space', async ({ page }) => {
					
				});

				test('the new neutral card is rendered upside-down (facing opponent)', async ({ page }) => {
					
				});

				test('the game turn status text is updated', async ({ page }) => {
					// Turn completed. Waiting for the other player to complete their turn.
				});

			});
			
			test.describe('the user clicks the * X * button', () => {
				
				test('no cards or spaces are highlighted', async ({ page }) => {
					
				});

				test('all pawns return to their previous positions', async ({ page }) => {
					
				});

				test('the game turn status text is updated', async ({ page }) => {
					// “Action cancelled. Please select an action card.
				});

			});

		});

	});

});