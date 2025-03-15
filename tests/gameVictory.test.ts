import { expect, test } from '@playwright/test';
import { 
	clearTestData, 
	startTestGame, 
	getEmail, 
	logoutUser,
	updateGameVictoryAction
} from './test-helpers';

const email = getEmail();

const localhost = 'http://localhost:3000/';

test.describe('game ends when a victory condition is met', () => {

	test.beforeEach(async ({ page }) => {
		await clearTestData();
		await startTestGame({ page }, email);
		updateGameVictoryAction();
		await page.waitForTimeout(500);
		await page.reload();
	});

	test.afterEach(async ({ page }) => {
		await logoutUser({ page });
		await page.waitForTimeout(500);
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/gameVictory.${workerInfo.project.name}.png` });
	});

	test.describe('opponent master is defeated', () => {

		test('a victory modal is displayed with Exit Game and Play Again buttons', async ({ page }) => {
			await page.locator(".card").locator("nth=4").click();
			await page.locator("#space-7").click();
			await page.locator("#space-1").click();

			await expect(page.getByRole('heading', { name: 'Congratulations!' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Exit', exact: true })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Play Again' })).toBeVisible();
		});

		test.describe('when the Exit Game button is clicked', () => {

			test('all players in the current game are redirected to the game lobby', async ({ page }) => {
				await page.locator(".card").locator("nth=4").click();
				await page.locator("#space-7").click();
				await page.locator("#space-1").click();
				await page.getByRole('button', { name: 'Exit', exact: true }).click();

				await expect(page.getByRole('heading', { name: 'Game Lobby', exact: true })).toBeVisible();
				expect (page.url()).toBe(localhost);
			});

		});

		test.describe('when the Play Again button is clicked', () => {

			test('the board is refreshed and new cards are dealt', async ({ page }) => {
				await page.locator(".card").locator("nth=4").click();
				await page.locator("#space-7").click();
				await page.locator("#space-1").click();
				await page.waitForTimeout(1000);
				await page.getByRole('button', { name: 'Play Again', exact: true }).click();
				await page.waitForTimeout(2000);

				await expect(page.locator('.player')).toHaveCount(2);
				await expect(page.locator('.player-color')).toHaveCount(2);
				await expect(page.locator('.card')).toHaveCount(6);
				await expect(page.locator('.self-card')).toHaveCount(2);
				await expect(page.locator('.opponent-card')).toHaveCount(2);
				await expect(page.locator('.neutral-card')).toHaveCount(1);
				await expect(page.locator('.placeholder-card')).toHaveCount(1);

				await expect(page.locator("#space-1.student, #space-2.student, #space-3.student, #space-4.student, #space-5.student, #space-6.student, #space-7.student, #space-8.student, #space-9.student, #space-10.student, #space-11.student, #space-12.student, #space-13.student, #space-14.student, #space-15.student")).toHaveCount(4);
				await expect(page.locator("#space-1.master, #space-2.master, #space-3.master, #space-4.master, #space-5.master")).toHaveCount(1);
				await expect(page.locator("#space-21.student, #space-22.student, #space-23.student, #space-24.student, #space-25.student")).toHaveCount(4);
				await expect(page.locator("#space-21.master, #space-22.master, #space-23.master, #space-24.master, #space-25.master")).toHaveCount(1);
				await expect(page.locator(".space.blue")).toHaveCount(5);
				await expect(page.locator(".space.empty")).toHaveCount(15);
			});

		});

	});	

	test.describe('opponent throne is overtaken', () => {

		test('a victory modal is displayed with Exit Game and Play Again buttons', async ({ page }) => {
			await page.locator(".card").locator("nth=4").click();
			await page.locator("#space-7").click();
			await page.locator("#space-3").click();

			await expect(page.getByRole('heading', { name: 'Congratulations!' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Exit', exact: true })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Play Again' })).toBeVisible();
		});

	});	

});