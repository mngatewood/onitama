import { expect, test } from '@playwright/test';
import { clearTestData, 
	startTestGame, 
	getEmail, 
	logoutUser,
	updateInvalidActionGame
} from './test-helpers';

const email = getEmail();

test.describe.configure({ mode: 'parallel' });

test.describe('user can select an action', () => {

	test.beforeEach(async ({ page }) => {
		await clearTestData();
		await startTestGame({page}, email);
	});

	test.afterEach(async ({ page }) => {
		await logoutUser({ page });
		await page.waitForTimeout(500);
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameAction.${workerInfo.project.name}.png` });
	});

	test('cards have a hover state', async ({ page }) => {
		// First card should be a placeholder and should not have hover state
		await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/hover:scale-125/);
		await expect(page.locator(".card").locator("nth=1")).toHaveClass(/hover:scale-125/);
		await expect(page.locator(".card").locator("nth=2")).toHaveClass(/hover:scale-125/);
		await expect(page.locator(".card").locator("nth=3")).toHaveClass(/hover:scale-125/);
		await expect(page.locator(".card").locator("nth=4")).toHaveClass(/hover:scale-125/);
		await expect(page.locator(".card").locator("nth=5")).toHaveClass(/hover:scale-125/);
	})

	test('the first players cards are highlighted', async ({ page }) => {
		// Only the first player's cards are highlighted
		await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=4")).toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=5")).toHaveClass(/shadow-amber-300/);
	});
	
	test('the user is notified that a card has been selected and prompted to select a pawn', async ({ page }) => {
		await expect(page.getByText('Card selected. Please select a highlighted pawn or click a card to see other available pawns and targets.')).not.toBeVisible();
		await page.locator(".card").locator("nth=4").click();
		await expect(page.getByText('Card selected. Please select a highlighted pawn or click a card to see other available pawns and targets.')).toBeVisible();
		await expect(page.locator(".card").locator("nth=4")).toHaveClass(/hover:scale-125/);
	});

	test('the correct pawns and targets are highlighted on the board', async ({ page }) => {
		await page.locator(".card").locator("nth=4").click();

		// First row should be unaffected
		await expect(page.locator("#space-1")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-2")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-3")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-4")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-5")).not.toHaveClass(/targeted/);

		// Two spaces in the first three rows should be highlighted due to opponent taking turn
		await expect(page.locator("#space-1.action, #space-2.action, #space-3.action, #space-4.action, #space-5.action, #space-6.action, #space-7.action, #space-8.action, #space-9.action, #space-10.action, #space-11.action, #space-12.action, #space-13.action, #space-14.action, #space-15.action")).toHaveCount(2);
		await expect(page.locator("#space-1.student, #space-2.student, #space-3.student, #space-4.student, #space-5.student, #space-6.student, #space-7.student, #space-8.student, #space-9.student, #space-10.student, #space-11.student, #space-12.student, #space-13.student, #space-14.student, #space-15.student")).toHaveCount(4);
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

		// Fourth row should all be targeted, but not highlighted
		await expect(page.locator("#space-16")).toHaveClass(/targeted/);
		await expect(page.locator("#space-17")).toHaveClass(/targeted/);
		await expect(page.locator("#space-18")).toHaveClass(/targeted/);
		await expect(page.locator("#space-19")).toHaveClass(/targeted/);
		await expect(page.locator("#space-20")).toHaveClass(/targeted/);
		await expect(page.locator("#space-16")).toHaveClass(/not-highlighted/);
		await expect(page.locator("#space-17")).toHaveClass(/not-highlighted/);
		await expect(page.locator("#space-18")).toHaveClass(/not-highlighted/);
		await expect(page.locator("#space-19")).toHaveClass(/not-highlighted/);
		await expect(page.locator("#space-20")).toHaveClass(/not-highlighted/);

		// Fifth row should all be highlighted, but not targeted
		await expect(page.locator("#space-21")).toHaveClass(/highlighted/);
		await expect(page.locator("#space-22")).toHaveClass(/highlighted/);
		await expect(page.locator("#space-23")).toHaveClass(/highlighted/);
		await expect(page.locator("#space-24")).toHaveClass(/highlighted/);
		await expect(page.locator("#space-25")).toHaveClass(/highlighted/);
		await expect(page.locator("#space-21")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-22")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-23")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-24")).not.toHaveClass(/targeted/);
		await expect(page.locator("#space-25")).not.toHaveClass(/targeted/);
	});

	test('the user is notified that the selected card has no valid actions', async ({ page }) => {
		await updateInvalidActionGame();
		await page.reload();
		await page.locator(".card").locator("nth=4").click();
		await expect(page.locator("#pass-button")).not.toBeVisible();
		await expect(page.getByText("The selected card contains no valid actions")).toBeVisible();
	});

});