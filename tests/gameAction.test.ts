import { expect, test } from '@playwright/test';

test.describe('user can select an action', () => {

	test.beforeEach(async ({ page }) => {
		test.skip();
		await page.goto('/login');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameAction.${workerInfo.project.name}.png` });
	});

	test.describe('when it is the users turn', () => {

		test('cards have a hover state', async ({ page }) => {
			
		})
	
		test('the user can click either of the two cards dealt in front of them', async ({ page }) => {
			// The card is highlighted to indicate it is selected.
			// All other cards are un - highlighted.
			// The game turn status component reads “Action chosen.Please select a pawn to take the action.”
			// All pawn spaces that can complete the chosen action are highlighted.
			// All pawn spaces that cannot complete the chosen action are un - highlighted.
			// All other spaces are un - highlighted.
		});

		test.describe('neither action card is valid', () => {

			test('a warning modal is displayed', async ({ page }) => {

				// You have no valid actions to take.  Please choose a card to spend and click the Pass button.

			});

			test('the Pass button is disabled until a card is selected', async ({ page }) => {

			});

			test('the user can select a card to spend', async ({ page }) => {

			});

			test('after a card is selected, the Pass button is enabled', async ({ page }) => {

			});

			test('when the Pass button is clicked, the game moves to the next player', async ({ page }) => {

			});

		});

	});


});