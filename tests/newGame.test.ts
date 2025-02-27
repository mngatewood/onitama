import { expect, test } from '@playwright/test';
import { localhost, getEmail, registerUser, loginUser, logoutUser, createOldGame,createNewGame, clearTestData } from './test-helpers';

const email = getEmail();

test.describe('user can create a new game', () => {

	test.beforeAll(async ({ page }) => {
		await clearTestData();
		await registerUser({ page }, email);
	});

	test.beforeEach(async ({ page }) => {
		await loginUser({ page }, email);
		await page.goto('/');
	});

	test('when the user is in the game lobby, a New Game button is displayed', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
	});

	test('when a game is created, the game page is displayed with a modal', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByText('Waiting for another player to join...')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Exit Game' })).toBeVisible();
	});

	test('when a game is created, the starting board is displayed', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
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

	test('when a game is created, card placeholders are displayed', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.player')).toHaveCount(2);
		await expect(page.locator('.player-color')).toHaveCount(2);
		await expect(page.locator('.card')).toHaveCount(6);
		await expect(page.locator('.player-card')).toHaveCount(5);
		await expect(page.locator('.card-placeholder')).toHaveCount(1);
	});

	test('when a game is created, defeated pawns placeholders are displayed', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('#defeated-pawns')).toBeVisible();
		await expect(page.locator('.defeated-pawn')).toHaveCount(8);
	});

	test('when a game is created, player colors are displayed', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.player-color')).toHaveCount(2);
		await expect(page.locator('.player-color.bg-red-900')).toHaveCount(1);
		await expect(page.locator('.player-color.bg-blue-900')).toHaveCount(1);
	});

	test('when the user clicks the Exit Game button, they are redirected to the game lobby', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: 'Exit Game' }).click();
		await page.waitForTimeout(500);
		expect(page.getByText('Are you sure you want to exit the game? Any progress will be lost.')).toBeVisible();
		expect(page.getByRole('button', { name: 'Exit Game' })).toBeVisible();
		await page.getByRole('button', { name: 'Exit Game' }).click();
		await page.waitForTimeout(1000);
		expect(page.url()).toBe(localhost);
	});

	test('when a user joins the game lobby, all pending games older than 15 minutes are deleted', async ({ page }) => {
		await logoutUser({page});
		await createOldGame();
		await createNewGame();
		await loginUser({ page }, email);
		await page.goto('/');
		await page.waitForTimeout(500);
		await expect(page.locator('.game-join-entry')).toHaveCount(1);
		await expect(page.locator('.game-join-entry')).toContainText('TestW@@\+');
	});

	test('the first player is the blue player', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.space').locator('nth=0')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=1')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=2')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=3')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=4')).toHaveClass(/red/);
		await expect(page.locator('.space').locator('nth=20')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=21')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=22')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=23')).toHaveClass(/blue/);
		await expect(page.locator('.space').locator('nth=24')).toHaveClass(/blue/);
	});

	test('all starting pawns are in their starting position', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.space').locator('nth=0')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=1')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=2')).toHaveClass(/master/);
		await expect(page.locator('.space').locator('nth=3')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=4')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=20')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=21')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=22')).toHaveClass(/master/);
		await expect(page.locator('.space').locator('nth=23')).toHaveClass(/student/);
		await expect(page.locator('.space').locator('nth=24')).toHaveClass(/student/);
	});

	test('neutral card is in the correct starting position', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);

		const thirdCard = page.locator(".card").locator("nth=0");
		const className = await thirdCard.getAttribute('class');
		if(className?.includes("neutral-card")) {
			await expect(page.locator(".neutral-card").locator(".card-title")).toHaveClass(/bg-red-300/);
		} else {
			await expect(page.locator(".neutral-card").locator(".card-title")).toHaveClass(/bg-blue-300/);
		}
	});

	test('the player name is displayed in the correct color', async ({ page }) => {
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.player-color')).toHaveCount(2);
		await expect(page.locator('.player-color').locator('nth=0')).toHaveClass(/bg-red-900/);
		await expect(page.locator('.player-color').locator('nth=1')).toHaveClass(/bg-blue-900/);
		await expect(page.getByText('TestW@@\+')).toBeVisible();
	});

});