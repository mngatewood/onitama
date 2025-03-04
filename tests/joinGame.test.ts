import { expect, test } from '@playwright/test';
import { 
	localhost, 
	getEmail, 
	registerUser, 
	loginUser, 
	logoutUser, 
	clearTestData, 
	convertTimeStringToDate, 
	createNewGame
} from './test-helpers';

const email = getEmail();

test.describe.configure({ mode: 'parallel' });

test.describe('user can join a game', () => {

	test.beforeEach(async ({ page }) => {
		await clearTestData();
		await registerUser({ page }, email);
		await page.goto('/');
	});

	// test.afterEach(async ({ page }) => {
	// 	await logoutUser({ page });
	// 	await page.waitForTimeout(500);
	// });

	test('take a screenshot', async ({ page }, workerInfo) => {
		await loginUser({ page }, email);
		await page.screenshot({ path: `./test-results/joinGame.${workerInfo.project.name}.png` });
	});

	test('when the first user is in the game lobby, there should not be any test games', async ({ page }) => {
		await loginUser({ page }, email);
		await expect(page.getByText('TestW@@+')).not.toBeVisible();
	});

	test('when the user is in the game lobby, a list of pending games is displayed', async ({ page }) => {
		await createNewGame();
		await loginUser({ page }, email);
		await page.waitForTimeout(500);
		await expect(page.getByText('TestW@@+')).toBeVisible();
		await expect(page.getByText('TestW@@+')).toHaveCount(1);
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toBeVisible();
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toHaveCount(1);
	});

	test('the list of pending games is sorted from newest to oldest', async ({ page }) => {
		await createNewGame();
		await createNewGame();
		await createNewGame();
		await loginUser({ page }, email);
		await page.waitForTimeout(500);
		await expect(page.getByText('TestW@@+')).toHaveCount(3);
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toHaveCount(3);

		const [first, second, third] = await Promise.all([
			page.locator('div').filter({ hasText: /^TestW\@\@\+/ }).locator('.game-created-at').nth(0).textContent(),
			page.locator('div').filter({ hasText: /^TestW\@\@\+/ }).locator('.game-created-at').nth(1).textContent(),
			page.locator('div').filter({ hasText: /^TestW\@\@\+/ }).locator('.game-created-at').nth(2).textContent(),
		]);

		if (first !== null && second !== null && third !== null) {
			const firstDate = convertTimeStringToDate(first);
			const secondDate = convertTimeStringToDate(second);
			const thirdDate = convertTimeStringToDate(third);
			expect(firstDate >= secondDate && secondDate >= thirdDate).toBe(true);
		} else {
			expect(false).toBe(true);
		}
	});

	test('when the user clicks the Join button for a pending game, the game page is displayed', async ({ page }) => {
		await createNewGame();
		await loginUser({ page }, email);
		await page.locator('.game-join-entry').filter({ hasText: "TestW@@+" }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('#board')).toBeVisible();
		await expect(page.locator('#board')).toHaveCount(1);
		await expect(page.locator('.space')).toHaveCount(25);
		await expect(page.locator('.not-highlighted')).toHaveCount(25);
		await expect(page.locator('.red.student')).toHaveCount(4);
		await expect(page.locator('.red.master')).toHaveCount(1);
		await expect(page.locator('.blue.student')).toHaveCount(4);
		await expect(page.locator('.blue.master')).toHaveCount(1);
	});

	test('when another user joins the game, waiting for another player modal closes', async ({ page }) => {
		test.skip();
	});

	test('all pawns are in their starting position', async ({ page }) => {
		await createNewGame();
		await loginUser({ page }, email);
		await page.locator('.game-join-entry').filter({ hasText: "TestW@@+" }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.space').locator('nth=0')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=0')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=1')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=1')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=2')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=2')).toHaveClass(/master/);
		await expect(page.locator('.space').locator('nth=3')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=3')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=4')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=4')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=20')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=20')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=21')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=21')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=22')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=22')).toHaveClass(/master/);
		await expect(page.locator('.space').locator('nth=23')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=23')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=24')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=24')).toHaveClass(/student/);
	});

	test('the game correctly indicates whose turn it is', async ({ page }) => {
		await createNewGame("red");
		await loginUser({ page }, email);
		await page.locator('.game-join-entry').filter({ hasText: "TestW@@+" }).click();
		await page.waitForTimeout(500);

		await expect(page.locator(".player-color").locator("nth=0")).toHaveClass(/!shadow-amber-300 !shadow-md/);
		await expect(page.locator(".player-color").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
		await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
		await expect(page.locator(".card").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
		await expect(page.locator(".card").locator("nth=2")).toHaveClass(/!shadow-amber-300 !shadow-md/);
		await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
		await expect(page.locator(".card").locator("nth=4")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
	});

	test('an Exit Game link is displayed.', async ({ page }) => {
		await createNewGame();
		await loginUser({ page }, email);
		await page.locator('.game-join-entry').filter({ hasText: "TestW@@+" }).click();

		await expect (page.getByRole('link', { name: 'Exit Game' })).toBeVisible();
		await page.waitForTimeout(500);
	});

	test('when the user clicks the Exit Game link, a confirmation modal is displayed', async ({ page }) => {
		await createNewGame();
		await loginUser({ page }, email);
		await page.locator('.game-join-entry').filter({ hasText: "TestW@@+" }).click();
		await page.waitForTimeout(500);
		await page.getByRole('link', { name: 'Exit Game' }).click();

		await expect(page.getByText('Are you sure you want to exit the game?')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Exit Game' })).toBeVisible();
	});

	test('when the user clicks cancel while the exit confirmation modal is displayed, the game is displayed', async ({ page }) => {
		const game = await createNewGame();
		await loginUser({ page }, email);
		await page.locator('.game-join-entry').filter({ hasText: "TestW@@+" }).click();
		await page.waitForTimeout(500);
		await page.getByRole('link', { name: 'Exit Game' }).click();
		await page.getByRole('button', { name: 'Cancel' }).click();
		await expect(page.getByRole('link', { name: 'Exit Game' })).toBeVisible();
		await expect(page).toHaveURL(`${localhost}play/${game.id}`);
	});

	test('when the user clicks exit while the exit confirmation modal is displayed, the lobby is displayed', async ({ page }) => {
		await createNewGame();
		await loginUser({ page }, email);
		await page.locator('.game-join-entry').filter({ hasText: "TestW@@+" }).click();
		await page.waitForTimeout(500);
		await page.getByRole('link', { name: 'Exit Game' }).click();
		await page.getByRole('button', { name: 'Exit Game' }).click();

		await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
		await expect(page.getByText('Game Lobby')).toBeVisible();
		await expect(page).toHaveURL(localhost);
	});

});