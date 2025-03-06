import { expect, test } from '@playwright/test';
import {
	clearTestData,
	startTestGame,
	logoutUser,
	getEmail,
	updateBoardForInvalidPawnTest
} from './test-helpers';

const email = getEmail();

test.describe('user can move a pawn', () => {

	test.beforeEach(async ({ page }) => {
		await clearTestData();
		await startTestGame({page}, email);
		updateBoardForInvalidPawnTest();
		await page.reload();
		await page.waitForTimeout(500);
	});

	// test.afterEach(async ({ page }) => {
	// 	await logoutUser({ page });
	// 	await page.waitForTimeout(500);
	// });

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameMove.${workerInfo.project.name}.png` });
	});

	test.describe('when pawn is selected', () => {

		test('valid spaces have a hover state', async ({ page }) => {
			await page.locator(".card").locator("nth=5").click();
			await page.locator("#space-23").click();
			await expect(page.locator("#space-19")).toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-22")).toHaveCSS("cursor", "pointer");
		});

		test('invalid spaces do not have a hover state', async ({ page }) => {
			await page.locator(".card").locator("nth=5").click();
			await page.locator("#space-23").click();

			await expect(page.locator("#space-16")).not.toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-17")).not.toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-18")).not.toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-20")).not.toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-21")).not.toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-23")).not.toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-24")).not.toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-25")).not.toHaveCSS("cursor", "pointer");
		});

		test('the user cannot select a space that is not highlighted', async ({ page }) => {
			await page.locator(".card").locator("nth=5").click();
			await page.locator("#space-23").click();
			await page.locator("#space-16").click();

			// No change: only 23 is highlighted
			await expect(page.locator("#space-16")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-17")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-18")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-20")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-21")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-22")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-23")).toHaveClass(/highlighted/);
			await expect(page.locator("#space-24")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-25")).toHaveClass(/not-highlighted/);
		});

		test.describe('the user selects a targeted space', () => {

			test('the selected space is highlighted', async ({ page }) => {
				await page.locator(".card").locator("nth=5").click();
				await page.locator("#space-23").click();
				await page.locator("#space-22").click();

				await expect(page.locator("#space-22")).toHaveClass(/selected-target/);
			});

			test('the space from which the pawn originated is highlighted', async ({ page }) => {
				await page.locator(".card").locator("nth=5").click();
				await page.locator("#space-23").click();
				await page.locator("#space-22").click();

				await expect(page.locator("#space-23")).toHaveClass(/highlighted/);
			});
			
			test('no other spaces are highlighted', async ({ page }) => {
				await page.locator(".card").locator("nth=5").click();
				await page.locator("#space-23").click();
				await page.locator("#space-22").click();
				
				await expect(page.locator("#space-16")).toHaveClass(/not-highlighted/);
				await expect(page.locator("#space-17")).toHaveClass(/not-highlighted/);
				await expect(page.locator("#space-18")).toHaveClass(/not-highlighted/);
				await expect(page.locator("#space-19")).toHaveClass(/not-highlighted/);
				await expect(page.locator("#space-20")).toHaveClass(/not-highlighted/);
				await expect(page.locator("#space-21")).toHaveClass(/not-highlighted/);
				await expect(page.locator("#space-24")).toHaveClass(/not-highlighted/);
				await expect(page.locator("#space-25")).toHaveClass(/not-highlighted/);
			});

			test('the Confirm and Cancel buttons are visible along with a message', async ({ page }) => {
				await page.locator(".card").locator("nth=5").click();
				await page.locator("#space-23").click();
				await page.locator("#space-22").click();

				await expect(page.getByText("Target selected. Click Confirm to end your turn or Cancel to reset the board.")).toBeVisible();
				await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
				await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
			});

			test.describe('the user clicks Cancel', () => {
				
				test('the board is reset', async ({ page }) => {
					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-22").click();
					await page.getByRole('button', { name: 'Cancel' }).click();
	
					// First row should be unaffected
					await expect(page.locator("#space-1")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-2")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-3")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-4")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-5")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-1")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-2")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-3")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-4")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-5")).toHaveClass(/not-highlighted/);

					// Second row should be unaffected
					await expect(page.locator("#space-6")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-7")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-8")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-9")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-10")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-6")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-7")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-8")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-9")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-10")).toHaveClass(/not-highlighted/);

					// Third row should be unaffected
					await expect(page.locator("#space-11")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-12")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-13")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-14")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-15")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-11")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-12")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-13")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-14")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-15")).toHaveClass(/not-highlighted/);

					// Fourth row, fifth column should be targeted, but none highlighted
					await expect(page.locator("#space-16")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-17")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-18")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-19")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-20")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-16")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-17")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-18")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-19")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-20")).toHaveClass(/not-highlighted/);

					// Fifth row: First three unaffected, fourth targeted, fifth highlighted
					await expect(page.locator("#space-21")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-22")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-23")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-24")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-25")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-21")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-22")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-23")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-24")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-25")).toHaveClass(/not-highlighted/);
				});

				test('a notification is displayed', async ({ page }) => {
					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-22").click();
					await page.getByRole('button', { name: 'Cancel' }).click();
	
					await expect(page.getByText("The board has been reset.  Please select a card.")).toBeVisible();
					await expect(page.getByRole('button', { name: 'Confirm' })).not.toBeVisible();
					await expect(page.getByRole('button', { name: 'Cancel' })).not.toBeVisible();
				});

			});

			test.describe('the user clicks Confirm', () => {

				test('the board is updated', async ({ page }) => {
					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-22").click();
					await page.getByRole('button', { name: 'Confirm' }).click();

					// First row should be unaffected
					await expect(page.locator("#space-1")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-2")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-3")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-4")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-5")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-1")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-2")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-3")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-4")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-5")).toHaveClass(/not-highlighted/);

					// Second row should be unaffected
					await expect(page.locator("#space-6")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-7")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-8")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-9")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-10")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-6")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-7")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-8")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-9")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-10")).toHaveClass(/not-highlighted/);

					// Third row should be unaffected
					await expect(page.locator("#space-11")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-12")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-13")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-14")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-15")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-11")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-12")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-13")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-14")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-15")).toHaveClass(/not-highlighted/);

					// Fourth row, fifth column should be targeted, but none highlighted
					await expect(page.locator("#space-16")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-17")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-18")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-19")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-20")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-16")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-17")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-18")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-19")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-20")).toHaveClass(/not-highlighted/);

					// Fifth row: First three unaffected, fourth targeted, fifth highlighted
					await expect(page.locator("#space-21")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-22")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-23")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-24")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-25")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-21")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-22")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-23")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-24")).toHaveClass(/not-highlighted/);
					await expect(page.locator("#space-25")).toHaveClass(/not-highlighted/);

					// Red pawns
					await expect(page.locator("#space-1")).toHaveClass(/red/);
					await expect(page.locator("#space-1")).toHaveClass(/student/);
					await expect(page.locator("#space-2")).toHaveClass(/red/);
					await expect(page.locator("#space-2")).toHaveClass(/student/);
					await expect(page.locator("#space-3")).toHaveClass(/red/);
					await expect(page.locator("#space-3")).toHaveClass(/master/);
					await expect(page.locator("#space-5")).toHaveClass(/red/);
					await expect(page.locator("#space-5")).toHaveClass(/student/);
					await expect(page.locator("#space-19")).toHaveClass(/red/);
					await expect(page.locator("#space-19")).toHaveClass(/student/);

					// Blue pawns
					await expect(page.locator("#space-24")).toHaveClass(/blue/);
					await expect(page.locator("#space-24")).toHaveClass(/student/);
					await expect(page.locator("#space-25")).toHaveClass(/blue/);
					await expect(page.locator("#space-25")).toHaveClass(/student/);
					await expect(page.locator("#space-22")).toHaveClass(/blue/);
					await expect(page.locator("#space-22")).toHaveClass(/master/);
				});
				
				test('the turn is ended', async ({ page }) => {
					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-22").click();
					await page.getByRole('button', { name: 'Confirm' }).click();

					await expect(page.getByText("Your turn has ended. Please wait for your opponent to take their turn.")).toBeVisible();
					await expect(page.getByText("Waiting for your opponent to complete their turn...")).toBeVisible();
					await expect(page.locator(".player-color").locator("nth=0")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".player-color").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=2")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=4")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				});

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

		});

	});

});