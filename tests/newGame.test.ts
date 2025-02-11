import { expect, test } from '@playwright/test';
import { localhost, getEmail, registerUser, loginUser } from './test-helpers';

const email = getEmail();

test.describe('user can create a new game', () => {

	test.beforeAll(async ({ page }) => {
		await registerUser({ page }, email);
	});

	test.beforeEach(async ({ page }) => {
		await loginUser({ page }, email);
	});

	test('when the user is in the game lobby, a New Game button is displayed', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
	})

	test('when a game is created, the game page is displayed with a modal', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByText('Waiting for another player to join...')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Exit Game' })).toBeVisible();
	})

	test('when a game is created, the starting board is displayed', async ({ page }) => {
		await page.goto('/');
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
	})

	test('when a game is created, card placeholders are displayed', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.player')).toHaveCount(2);
		await expect(page.locator('.player-color')).toHaveCount(2);
		await expect(page.locator('.card')).toHaveCount(6);
		await expect(page.locator('.player-card')).toHaveCount(4);
		await expect(page.locator('.neutral-card')).toHaveCount(2);
	})

	test('when a game is created, defeated pawns placeholders are displayed', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('#defeated-pawns')).toBeVisible();
		await expect(page.locator('.defeated-pawn')).toHaveCount(8);
	})

	test('when a game is created, player colors are displayed', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await expect(page.locator('.player-color')).toHaveCount(2);
		await expect(page.locator('.player-color.bg-red-900')).toHaveCount(1);
		await expect(page.locator('.player-color.bg-blue-900')).toHaveCount(1);
	})

	test('when the user clicks the Exit Game button, they are redirected to the game lobby', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New Game' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: 'Exit Game' }).click();
		await page.waitForTimeout(500);
		expect(page.url()).toBe(localhost);
	})

	test('when a user joins the game lobby, all pending games older than 15 minutes are deleted', async ({ page }) => {
		// TODO
	});

	test('if the user is the red player, the board is reversed', async ({ page }) => {
		// TODO
	});

});