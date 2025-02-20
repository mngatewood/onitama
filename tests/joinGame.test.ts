import { expect, test } from '@playwright/test';
import { 
	localhost, 
	getEmail, 
	registerUser, 
	loginUser, 
	createGame, 
	logoutUser, 
	clearTestData, 
	convertTimeStringToDate 
} from './test-helpers';

const email = getEmail();
const emailTwo = "2" + email
const emailThree = "3" + email
const emailFour = "4" + email

test.describe.configure({ mode: 'parallel' });

test.describe('user can join a game', () => {

	test.beforeEach(async ({ page }) => {
		await clearTestData();
		await registerUser({ page }, email);
		await registerUser({ page }, emailTwo);
		await registerUser({ page }, emailThree);
		await registerUser({ page }, emailFour);
		await page.goto('/');
	});

	test.afterEach(async ({ page }) => {
		await logoutUser({ page });
		await page.waitForTimeout(500);
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await loginUser({ page }, email);
		await page.screenshot({ path: `./test-results/joinGame.${workerInfo.project.name}.png` });
	});

	test('when the first user is in the game lobby, there should not be any test games', async ({ page }) => {
		await loginUser({ page }, email);
		await expect(page.getByText('TestW@@+')).not.toBeVisible();
	});

	test('when the user is in the game lobby, a list of pending games is displayed', async ({ page }) => {
		await loginUser({ page }, email);
		await createGame({ page });
		await logoutUser({ page });
		await loginUser({ page }, emailTwo);
		await page.waitForTimeout(500);
		await expect(page.getByText('TestW@@+')).toBeVisible();
		await expect(page.getByText('TestW@@+')).toHaveCount(1);
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toBeVisible();
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toHaveCount(1);
	});

	test('the list of pending games is sorted from newest to oldest', async ({ page }) => {
		await loginUser({ page }, email);
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toHaveCount(0);
		await createGame({ page });
		await logoutUser({ page });
		await loginUser({ page }, emailTwo);
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toHaveCount(1);
		await createGame({ page });
		await logoutUser({ page });
		await loginUser({ page }, emailThree);
		await expect(page.locator('.game-join-entry').filter({ hasText: "TestW@@+" })).toHaveCount(2);
		await createGame({ page });
		await logoutUser({ page });
		await loginUser({ page }, emailFour);
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
		await loginUser({ page }, email);
		await createGame({ page });
		await logoutUser({ page });
		await loginUser({ page }, emailTwo);
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
		// TODO: cards should be dealt and turn order determined
	});

	test('when another user joins the game, waiting for another player modal closes', async ({ page }) => {
		test.skip();
	});

	test('all pawns are in their starting position', async ({ page }) => {
		await loginUser({ page }, email);
		await createGame({ page });
		await logoutUser({ page });
		await loginUser({ page }, emailTwo);
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

	test('each player is dealt two random action cards', async ({ page }) => {

	});

	test('one neutral card is dealt to the side of the game board', async ({ page }) => {

	});

	test('if the neutral card is blue, the blue player goes first', async ({ page }) => {

	});

	test('if the neutral card is red, the red player goes first', async ({ page }) => {

	});

	test('an Exit Game icon is displayed.', async ({ page }) => {

	});

});