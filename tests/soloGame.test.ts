import { expect, test } from '@playwright/test';
import {
	getEmail,
	registerUser,
	loginUser,
	logoutUser,
	clearTestData,
	startTestGame,
	updateGameVictoryCondition,
	updateGameAvoidDefeatGameThroneAndMaster,
	updateGameAvoidDefeatGameThrone,
	updateGameAvoidDefeatGameMasterCanAttackThreat,
	updateGameAvoidDefeatGameMasterCannotAttackThreat,
	updateGameAttackThreateningPawn,
	updateGameEvadeThreateningPawn,
	updateGameAttackPawn,
	updateGameMovePawnToSafeLocation
	
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
			await page.getByRole('button', { name: 'New Game' }).click();

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

		test.describe('a victory is possible', () => {

			test.beforeEach(async ({ page }) => {
				await clearTestData();
				await startTestGame({ page }, email);
				updateGameVictoryCondition();
				await page.waitForTimeout(500);
				await page.reload();
			});

			test('the game will select an action that will result in a victory', async ({ page }) => {
				// TODO: notification that the virtual opponent has won the game (need to add victory conditions logic)
				// await expect(page.getByText("The Virtual Opponent has won the game.  Please click Exit Game to return to the lobby."))
				// player cards should have amber shadow
				await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
				// space-3 or space-13 should have red master
				await expect(page.locator("#space-13.red.master, #space-3.red.master")).toHaveCount(1);
				// origin and target spaces should be highlighted red
				await expect(page.locator("#space-3.action, #space-17.action")).toHaveCount(1);
			});

		});

		test.describe('a defeat is possible', () => {

			test.describe('both the throne and the master are threatened', () => {
				
				test.beforeEach(async ({ page }) => {
					await clearTestData();
					await startTestGame({ page }, email);
					updateGameAvoidDefeatGameThroneAndMaster();
					await page.waitForTimeout(500);
					await page.reload();
				});

				test('the game will select an action that will move the master and attack the threat to the throne', async ({ page }) => {
					await expect(page.locator("#space-9")).toHaveClass(/red master/);
					await expect(page.locator("#space-9")).toHaveClass(/action/);
					await expect(page.locator("#space-13")).toHaveClass(/action/);
					await expect(page.locator(".space.blue.student")).toHaveCount(3);
					await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(1);
					await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(7);
					await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
					// expect blue cards highlighted
					await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					// expect neutral card to be monkey and be on blue side
					await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
					await expect(page.locator(".card").locator("nth=3").locator(".card-title")).toContainText("Monkey");
					// expect red cards to be horse and goose
					await expect(page.locator(".card").locator("nth=1").locator(".card-title")).toContainText("Horse");
					await expect(page.locator(".card").locator("nth=2").locator(".card-title")).toContainText("Goose");
				});

			});	

			test.describe('only the throne is threatened', () => {
				
				test.beforeEach(async ({ page }) => {
					await clearTestData();
					await startTestGame({ page }, email);
					updateGameAvoidDefeatGameThrone();
					await page.waitForTimeout(500);
					await page.reload();
				});

				test('the game will select an action that will attack the threat to the throne', async ({ page }) => {
					await expect(page.locator("#space-9.red.student, #space-9.red.master")).toHaveCount(1);
					await expect(page.locator("#space-5.action, #space-8.action")).toHaveCount(1);
					await expect(page.locator(".space.blue.student")).toHaveCount(3);
					await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(1);
					await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(7);
					await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
					// expect blue cards highlighted
					await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					// expect neutral card to be on blue side
					await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
				});
			});	

			test.describe('only the master is threatened', () => {
				
				test.describe('the threatening pawn can be attacked', () => {

					test.beforeEach(async ({ page }) => {
						await clearTestData();
						await startTestGame({ page }, email);
						updateGameAvoidDefeatGameMasterCanAttackThreat();
						await page.waitForTimeout(500);
						await page.reload();
					});

					test('the game will select an action that will attack the threat to the master', async ({ page }) => {
						await expect(page.locator("#space-19")).toHaveClass(/red master/);
						await expect(page.locator("#space-19")).toHaveClass(/action/);
						await expect(page.locator("#space-13")).toHaveClass(/action/);
						await expect(page.locator(".space.blue.student")).toHaveCount(3);
						await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(1);
						await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(7);
						await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
						// expect blue cards highlighted
						await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
						// expect neutral card to be monkey and be on blue side
						await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
						await expect(page.locator(".card").locator("nth=3").locator(".card-title")).toContainText("Monkey");
						// expect red cards to be horse and goose
						await expect(page.locator(".card").locator("nth=1").locator(".card-title")).toContainText("Horse");
						await expect(page.locator(".card").locator("nth=2").locator(".card-title")).toContainText("Goose");
					});

				})	

				test.describe('the threatening pawn cannot be attacked', () => {

					test.beforeEach(async ({ page }) => {
						await clearTestData();
						await startTestGame({ page }, email);
						updateGameAvoidDefeatGameMasterCannotAttackThreat();
						await page.waitForTimeout(500);
						await page.reload();
					});

					test('the game will select an action that will move the master to a safe location', async ({ page }) => {
						// expect master to move to either of the two safe locations
						await expect(page.locator("#space-7.red.master.action, #space-9.red.master.action")).toHaveCount(1);
						await expect(page.locator("#space-12.red.master.action, #space-14.red.master.action, #space-17.red.master.action, #space-19.red.master.action")).toHaveCount(0);
						await expect(page.locator("#space-13")).toHaveClass(/action/);
						await expect(page.locator(".space.blue.student")).toHaveCount(4);
						await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(0);
						await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(8);
						await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
						// expect blue cards highlighted
						await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
						await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
						// expect neutral card to be monkey and be on blue side
						await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
						await expect(page.locator(".card").locator("nth=3").locator(".card-title")).toContainText("Monkey");
						// expect red cards to be horse and goose
						await expect(page.locator(".card").locator("nth=1").locator(".card-title")).toContainText("Horse");
						await expect(page.locator(".card").locator("nth=2").locator(".card-title")).toContainText("Goose");
					});

				})	

			});	

		});

		test.describe('one or more of the virtual opponents pawns are threatened', () => {

			test.describe('one of the threatening pawns can be attacked', () => {
				
				test.beforeEach(async ({ page }) => {
					await clearTestData();
					await startTestGame({ page }, email);
					updateGameAttackThreateningPawn();
					await page.waitForTimeout(500);
					await page.reload();
				});

				test('the game will select an action that will attack a threatening pawn', async ({ page }) => {
					await expect(page.locator("#space-15")).toHaveClass(/red student/);
					await expect(page.locator("#space-9")).toHaveClass(/action/);
					await expect(page.locator("#space-15")).toHaveClass(/action/);
					await expect(page.locator(".space.blue.student")).toHaveCount(3);
					await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(1);
					await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(7);
					await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
					// expect blue cards highlighted
					await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					// expect neutral card to be monkey and be on blue side
					await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
					await expect(page.locator(".card").locator("nth=3").locator(".card-title")).toContainText("Monkey");
					// expect red cards to be horse and goose
					await expect(page.locator(".card").locator("nth=1").locator(".card-title")).toContainText("Horse");
					await expect(page.locator(".card").locator("nth=2").locator(".card-title")).toContainText("Goose");
				});

			});

			test.describe('none of the threatening pawns can be attacked', () => {
				
				test.beforeEach(async ({ page }) => {
					await clearTestData();
					await startTestGame({ page }, email);
					updateGameEvadeThreateningPawn();
					await page.waitForTimeout(500);
					await page.reload();
				});

				test('the game will select an action that will move a threatened pawn to a safe location', async ({ page }) => {
					await page.waitForTimeout(500);

					// expect pawn to move to to a save location
					await expect(page.locator("#space-8.red.student.action, #space-10.red.student.action, #space-20.red.student.action")).toHaveCount(1);
					await expect(page.locator("#space-13.red.student.action, #space-15.red.student.action, #space-18.red.student.action")).toHaveCount(0);
					await expect(page.locator("#space-14")).toHaveClass(/action/);
					await expect(page.locator(".space.blue.student")).toHaveCount(4);
					await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(0);
					await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(8);
					await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
					// expect blue cards highlighted
					await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					// expect neutral card to be monkey and be on blue side
					await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
					await expect(page.locator(".card").locator("nth=3").locator(".card-title")).toContainText("Monkey");
					// expect red cards to be horse and goose
					await expect(page.locator(".card").locator("nth=1").locator(".card-title")).toContainText("Horse");
					await expect(page.locator(".card").locator("nth=2").locator(".card-title")).toContainText("Goose");
				});

			});

		});

		test.describe('one or more of the players student pawns can be attacked', () => {

			test.beforeEach(async ({ page }) => {
				await clearTestData();
				await startTestGame({ page }, email);
				updateGameAttackPawn();
				await page.waitForTimeout(500);
				await page.reload();
			});

			test('the game will select an action that will result in a defeated pawn', async ({ page }) => {
				await expect(page.locator("#space-6.red.student, #space-6.red.master")).toHaveCount(1);
				await expect(page.locator("#space-1.action, #space-2.action, #space-7.action")).toHaveCount(1);
				await expect(page.locator(".space.blue.student")).toHaveCount(3);
				await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(1);
				await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(7);
				await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
				// expect blue cards highlighted
				await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
				await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
				// expect neutral card to be on blue side
				await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
			});

			test('the game will prioritize moving a student pawn over a master pawn', async ({ page }) => {
				await expect(page.locator("#space-7")).toHaveClass(/red master/);
				await expect(page.locator("#space-7")).not.toHaveClass(/action/);
			});

		});

		test.describe('none of the players student pawns can be attacked', () => {

			test.describe('the game has a valid action that moves a pawn to a safe location', () => {

				test.beforeEach(async ({ page }) => {
					await clearTestData();
					await startTestGame({ page }, email);
					updateGameMovePawnToSafeLocation();
					await page.waitForTimeout(500);
					await page.reload();
				});

				test('the game will select an action that moves a pawn to a safe location', async ({ page }) => {
					// expect pawn to move to to a save location
					await expect(page.locator("#space-1.red.action, #space-2.red.action, #space-3.red.action, #space-4.red.action, #space-5.red.action")).toHaveCount(1);
					await expect(page.locator("#space-1.red.action, #space-2.red.action, #space-3.red.action, #space-4.red.action, #space-5.red.action")).toHaveCount(1);
					await expect(page.locator(".space.blue.student")).toHaveCount(4);
					await expect(page.locator(".space.blue.master")).toHaveCount(1);
					await expect(page.locator("#defeated-pawns").locator(".blue")).toHaveCount(0);
					await expect(page.locator("#defeated-pawns").locator(".sil")).toHaveCount(8);
					await expect(page.getByText("Your opponent has completed their turn. Please select a card.")).toBeVisible();
					// expect blue cards highlighted
					await expect(page.locator(".player-color").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".player-color").locator("nth=1")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=0")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=1")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=2")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=3")).not.toHaveClass(/!shadow-amber-300 !shadow-md/);
					await expect(page.locator(".card").locator("nth=4")).toHaveClass(/!shadow-amber-300 !shadow-md/);
					// expect neutral card to be monkey and be on blue side
					await expect(page.locator(".card").locator("nth=0")).toHaveClass(/placeholder-card/);
					await expect(page.locator(".card").locator("nth=3").locator(".card-title")).toContainText("Monkey");
					// expect red cards to be horse and goose
					await expect(page.locator(".card").locator("nth=1").locator(".card-title")).toContainText("Horse");
					await expect(page.locator(".card").locator("nth=2").locator(".card-title")).toContainText("Goose");
				});

			})

		});

	});

});