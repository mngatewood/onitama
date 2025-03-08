import { expect, test } from '@playwright/test';
import {
	getEmail,
	registerUser,
	loginUser,
	logoutUser,
	clearTestData,
	startTestGame,
	updateVictoryGame
} from './test-helpers';

const email = getEmail();

test.describe('user can play a solo game', () => {

	test.afterEach(async ({ page }) => {
		await logoutUser({ page });
		await page.waitForTimeout(500);
	});

	test.describe('user starts a new solo game', () => {

		test.beforeEach(async ({ page }) => {
			await clearTestData();
			await registerUser({ page }, email);
			await loginUser({ page }, email);
		});

		test('take a screenshot', async ({ page }, workerInfo) => {
			await page.screenshot({ path: `./test-results/soloGame.${workerInfo.project.name}.png` });
		});

		test('The new game menu displays a Solo, Multiplayer, and Cancel buttons', async ({ page }) => {
			await expect (page.getByRole('button', { name: 'Solo' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Multiplayer' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
		});	

		test('when the user clicks the Solo button, a new game is created', async ({ page }) => {
			await page.getByRole('button', { name: 'New Game' }).click();
			await page.getByRole('button', { name: 'Solo' }).click();
			await page.waitForTimeout(500);

			await expect(page.getByText('Virtual Opponent')).toBeVisible();
			await expect(page.getByRole('button', { name: 'Exit Game' })).toBeVisible();
			await expect(page.locator(".opponent-card")).toHaveCount(2);
			await expect(page.locator(".self-card")).toHaveCount(2);
			await expect(page.locator(".neutral-card")).toHaveCount(1);
			await expect(page.locator(".placeholder-card")).toHaveCount(1);
			await expect(page.locator(".opponent-card").locator("nth=0").locator(".card-title")).not.toBeEmpty();
			await expect(page.locator(".opponent-card").locator("nth=1").locator(".card-title")).not.toBeEmpty();
			await expect(page.locator(".self-card").locator("nth=0").locator(".card-title")).not.toBeEmpty();
			await expect(page.locator(".self-card").locator("nth=1").locator(".card-title")).not.toBeEmpty();
			await expect(page.locator(".neutral-card").locator(".card-title")).not.toBeEmpty();
			await expect(page.locator(".placeholder-card")).toBeEmpty();
		});

	});

	test.describe('the game will complete its turns', () => {

		test.beforeEach(async ({ page }) => {
			await clearTestData();
			await startTestGame({ page }, email);
			updateVictoryGame();
			await page.waitForTimeout(500);
			await page.reload();
		});

		test.describe('a victory is possible', () => {

			test('the game will select a card, pawn, and move that will result in a victory', async ({ page }) => {
				// TODO: notification that the virtual opponent has completed their turn
				// await expect(page.getByText("The Virtual Opponent has won the game.  Please click Exit Game to return to the lobby."))
				// player cards should have amber shadow
				await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
				// space-13 should have red master
				await expect(page.locator("#space-13")).toHaveClass(/red master/);
				// no spaces should have blue master
				await expect(page.locator(".space").locator(".blue").locator(".master")).toHaveCount(0)
				// origin and target spaces should be highlighted red
				await expect(page.locator("#space-3")).toHaveClass(/highlighted/);
				await expect(page.locator("#space-13")).toHaveClass(/highlighted/);
				// one bottom defeated pawn should be blue
				await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(1)
				// three bottom defeated pawns should be gray
				await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(7)
				// both thrones should be visible
				const redThroneContent = await page.locator('#space-3').evaluate(el => window.getComputedStyle(el, ':after').content);
				const blueThroneContent = await page.locator('#space-23').evaluate(el => window.getComputedStyle(el, ':after').content);
				expect(redThroneContent).toBe("\"赤\"");
				expect(blueThroneContent).toBe("\"青\"");
			});

		});

		test.describe('a defeated pawn is possible', () => {

			test('the game will select a card that will result in a defeated pawn', async ({ page }) => {
				
			});

			test('the game will select a pawn that will result in a defeated pawn', async ({ page }) => {
				
			});

			test('the game will select a move that will result in a defeated pawn', async ({ page }) => {
				
			});

		});

		test.describe('one or more of the games pawns are threatened', () => {

			test('the game will select a card that will allow a threatened pawn to move', async ({ page }) => {
				
			});

			test('the game will select a pawn that will allow a threatened pawn to move', async ({ page }) => {
				
			});

			test('the game will select a move that will allow a threatened pawn to move', async ({ page }) => {
				
			});

		});

		test.describe('only one of the two actions are valid', () => {

			test('the game will select the card that is valid', async ({ page }) => {
				
			});

			test('the game will select a valid pawn', async ({ page }) => {
				
			});

			test('the game will select a valid move', async ({ page }) => {
				
			});

		});

		test.describe('neither of the two actions are valid', () => {

			test('the game will select the card at random', async ({ page }) => {
				
			});

			test('the game will pass and the game will proceed to the player', async ({ page }) => {
				
			});

		});

		test.describe('both of the two actions are valid', () => {

			test('the game will select a card at random', async ({ page }) => {
				
			});

			test('the game will select a valid pawn', async ({ page }) => {

			});

			test('the game will select a valid move', async ({ page }) => {

			});

		});

	});

});