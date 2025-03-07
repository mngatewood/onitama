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
		await expect(page.locator("#pass-button")).toBeVisible();
		await expect(page.getByText("The selected card contains no valid actions")).toBeVisible();
	});

	test('when the Pass button is clicked, the game moves to the next player', async ({ page }) => {
		await updateInvalidActionGame();
		await page.reload();
		await page.locator(".card").locator("nth=4").click();
		await page.locator("#pass-button").click();
		await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=1")).toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=2")).toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=4")).not.toHaveClass(/shadow-amber-300/);
		await expect(page.locator(".card").locator("nth=5")).not.toHaveClass(/shadow-amber-300/);
	});

});