import { expect, test } from '@playwright/test';
import {
	clearTestData,
	startTestGame,
	logoutUser,
	getEmail,
	updateInvalidPawnGame
} from './test-helpers';

const email = getEmail();

test.describe('user can select a pawn', () => {

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
		await page.screenshot({ path: `./test-results/gamePawn.${workerInfo.project.name}.png` });
	});

	test.describe('when an action card is selected', () => {

		test('valid pawns have a pointer cursor', async ({ page }) => {
			await page.locator(".card").locator("nth=4").click();
			await expect(page.locator("#space-23")).toHaveCSS("cursor", "pointer");
			await expect(page.locator("#space-24")).toHaveCSS("cursor", "pointer");
		});

		test('invalid pawns do not have a hover state', async ({ page }) => {
			await page.locator(".card").locator("nth=4").click();
			await expect(page.locator("#space-25")).not.toHaveCSS("cursor", "pointer");
		});

		test('the user can select a highlighted pawn space:', async ({ page }) => {
			await page.locator(".card").locator("nth=4").click();
			await page.locator("#space-23").click();

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
			await expect(page.locator("#space-19")).toHaveClass(/targeted/);
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
			await expect(page.locator("#space-23")).toHaveClass(/highlighted/);
			await expect(page.locator("#space-24")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-25")).toHaveClass(/not-highlighted/);
		});

		test('the user cannot select a pawn on a space that is not highlighted', async ({ page }) => {
			await page.locator(".card").locator("nth=5").click();
			await page.locator("#space-25").click();

			// Fourth row: last two columns should be targeted, but none highlighted
			await expect(page.locator("#space-16")).not.toHaveClass(/targeted/);
			await expect(page.locator("#space-17")).not.toHaveClass(/targeted/);
			await expect(page.locator("#space-18")).not.toHaveClass(/targeted/);
			await expect(page.locator("#space-19")).toHaveClass(/targeted/);
			await expect(page.locator("#space-20")).toHaveClass(/targeted/);
			await expect(page.locator("#space-16")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-17")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-18")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-19")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-20")).toHaveClass(/not-highlighted/);

			// Fifth row: third and fourth columns should be highlighted, others not highlighted
			await expect(page.locator("#space-21")).not.toHaveClass(/targeted/);
			await expect(page.locator("#space-22")).toHaveClass(/targeted/);
			await expect(page.locator("#space-23")).not.toHaveClass(/targeted/);
			await expect(page.locator("#space-24")).not.toHaveClass(/targeted/);
			await expect(page.locator("#space-25")).not.toHaveClass(/targeted/);
			await expect(page.locator("#space-21")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-22")).toHaveClass(/not-highlighted/);
			await expect(page.locator("#space-23")).toHaveClass(/highlighted/);
			await expect(page.locator("#space-24")).toHaveClass(/highlighted/);
			await expect(page.locator("#space-25")).toHaveClass(/not-highlighted/);
		});	

		test('a friendly pawn cannot be targeted', async ({ page }) => {
			await page.locator(".card").locator("nth=5").click();
			await page.locator("#space-23").click();

			await expect(page.locator("#space-25")).not.toHaveClass(/targeted/);
		});	

		test('an opposing pawn can be targeted', async ({ page }) => {
			await page.locator(".card").locator("nth=5").click();
			await page.locator("#space-23").click();

			await expect(page.locator("#space-19")).toHaveClass(/targeted/);
			const opponentSpaceTargetColor = await page.locator('#space-19').evaluate(el => window.getComputedStyle(el, ':after').color);
			expect(opponentSpaceTargetColor).toBe("rgb(255, 255, 255)");
			const emptySpaceTargetColor = await page.locator('#space-22').evaluate(el => window.getComputedStyle(el, ':after').color);
			expect(emptySpaceTargetColor).toBe("rgb(0, 0, 0)");

		});	

	});	

});