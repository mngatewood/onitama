import { expect, test } from '@playwright/test';
import {
	clearTestData,
	startTestGame,
	logoutUser,
	getEmail,
	updateInvalidPawnGame
} from './test-helpers';

const email = getEmail();

test.describe('user can move a pawn', () => {

	test.beforeEach(async ({ page }) => {
		await clearTestData();
		await startTestGame({page}, email);
		updateInvalidPawnGame();
		await page.waitForTimeout(500);
		await page.reload();
	});

	test.afterEach(async ({ page }) => {
		await logoutUser({ page });
		await page.waitForTimeout(500);
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameMove.${workerInfo.project.name}.png` });
	});

	test.describe('when pawn is selected', () => {

		test('valid spaces have a hover state', async ({ page }) => {
			await page.locator(".card").locator("nth=5").click();
			await page.locator("#space-23").click();
			await expect(page.locator("#space-19")).toHaveCSS("cursor", "pointer");
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
				await page.locator("#space-19").click();

				await expect(page.locator("#space-19")).toHaveClass(/selected-target/);
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

			test.describe('the user selects a valid target', () => {

				test('the board is updated', async ({ page }) => {
					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-19").click();

					// First row should be unaffected
					await expect(page.locator("#space-1")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-2")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-3")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-4")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-5")).not.toHaveClass(/targeted/);

					// Two spaces in the first three rows should be highlighted due to opponent taking turn
					await expect(page.locator("#space-1.action, #space-2.action, #space-3.action, #space-4.action, #space-5.action, #space-6.action, #space-7.action, #space-8.action, #space-9.action, #space-10.action, #space-11.action, #space-12.action, #space-13.action, #space-14.action, #space-15.action")).toHaveCount(2);
					await expect(page.locator("#space-1.student, #space-2.student, #space-3.student, #space-4.student, #space-5.student, #space-6.student, #space-7.student, #space-8.student, #space-9.student, #space-10.student, #space-11.student, #space-12.student, #space-13.student, #space-14.student, #space-15.student")).toHaveCount(3);
					await expect(page.locator("#space-1.master, #space-2.master, #space-3.master, #space-4.master, #space-5.master, #space-6.master, #space-7.master, #space-8.master, #space-9.master, #space-10.master #space-11.master, #space-12.master, #space-13.master, #space-14.master, #space-15.master")).toHaveCount(1);
					await expect(page.locator("#space-1.not-highlighted, #space-2.not-highlighted, #space-3.not-highlighted, #space-4.not-highlighted, #space-5.not-highlighted, #space-6.not-highlighted, #space-7.not-highlighted, #space-8.not-highlighted, #space-9.not-highlighted, #space-10.not-highlighted, #space-11.not-highlighted, #space-12.not-highlighted, #space-13.not-highlighted, #space-14.not-highlighted, #space-15.not-highlighted")).toHaveCount(13);

					// Second row should not be targeted
					await expect(page.locator("#space-6")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-7")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-8")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-9")).not.toHaveClass(/targeted/);
					await expect(page.locator("#space-10")).not.toHaveClass(/targeted/);

					// Third row should not be targeted
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
					// Red will take their turn after clicking action
					await expect(page.locator("#space-1.student, #space-2.student, #space-4.student, #space-5.student")).toHaveCount(2);
					await expect(page.locator("#space-1.red, #space-2.red, #space-3.red, #space-4.red, #space-5.red")).toHaveCount(4);
					await expect(page.locator("#space-3")).toHaveClass(/master/);

					// Blue pawns
					await expect(page.locator("#space-24")).toHaveClass(/student/);
					await expect(page.locator("#space-24")).toHaveClass(/blue/);
					await expect(page.locator("#space-25")).toHaveClass(/student/);
					await expect(page.locator("#space-25")).toHaveClass(/blue/);
					await expect(page.locator("#space-19")).toHaveClass(/blue/);
					await expect(page.locator("#space-19")).toHaveClass(/master/);
				});
				
				test('the turn is ended', async ({ page }) => {
					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-19").click();

					// Red will immediately take their turn
					await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
					await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
				});

				test('the cards are updated and player names are rendered correctly', async ({ page }) => {
					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-19").click();

					await expect(page.locator(".card").locator("nth=0").locator("nth=0")).toHaveClass(/placeholder-card/);
					await expect(page.locator(".card").locator("nth=3").locator("nth=0")).toHaveClass(/neutral-card/);
					await expect(page.locator(".card").locator("nth=4")).toContainText("Mantis");
					await expect(page.locator(".card").locator("nth=5")).toContainText("Rabbit");
					await expect(page.locator(".player-color").locator("nth=0")).toContainText("Virtual Opponent");
					await expect(page.locator(".player-color").locator("nth=1")).toContainText("青TestW@@+青");
				});

			});

			test.describe('the selected space is occupied by an opponent student pawn', () => {
				
				test('the defeated pawn is removed from the board', async ({ page }) => {
					// test game board should start with 5 red pawns and 3 blue pawns
					await expect (page.locator("#board").locator(".red")).toHaveCount(5);
					await expect (page.locator("#board").locator(".blue")).toHaveCount(3);

					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-19").click();

					await expect(page.locator("#space-19")).toHaveClass(/blue/)
					await expect(page.locator("#space-19")).not.toHaveClass(/red/)
					await expect(page.locator("#board").locator(".red.student")).toHaveCount(3);
					await expect(page.locator("#board").locator(".blue")).toHaveCount(3);
				});
				
				test('the defeated pawn is rendered beside the board', async ({ page }) => {
					await expect (page.locator("#defeated-pawns > div").first().locator(".sil")).toHaveCount(4);
					await expect (page.locator("#defeated-pawns > div").locator("nth=1").locator(".sil")).toHaveCount(2);

					await page.locator(".card").locator("nth=5").click();
					await page.locator("#space-23").click();
					await page.locator("#space-19").click();

					await expect(page.locator("#defeated-pawns > div").first().locator(".sil")).toHaveCount(3);
					await expect(page.locator("#defeated-pawns > div").first().locator(".red")).toHaveCount(1);
					await expect(page.locator("#defeated-pawns > div").first().locator(".blue")).toHaveCount(0);
					await expect(page.locator("#defeated-pawns > div").locator("nth=1").locator(".sil")).toHaveCount(2);
					await expect(page.locator("#defeated-pawns > div").locator("nth=1").locator(".red")).toHaveCount(0);
					await expect(page.locator("#defeated-pawns > div").locator("nth=1").locator(".blue")).toHaveCount(2);
				});

			});
			
		});

	});

});