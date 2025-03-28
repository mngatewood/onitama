import { expect, test } from '@playwright/test';

test.describe('Guide Demo Navigation', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the first guide page before each test
		await page.goto('/');
		await page.locator('button:has-text("Guide")').click();
	});

	test.describe('Guide Page 1', () => {
		test('Verify content and open modal', async ({ page }) => {
			// Verify the page title or content
			await expect(page.locator('h2')).toHaveText('Game Overview');

			// Verify the "Continue" button is displayed
			const continueButton = page.locator('button:has-text("Continue")');
			await expect(continueButton).toBeVisible();

			// Click the "Continue" button
			await continueButton.click();

			// Verify the modal is displayed
			const modal = page.locator('#guide-modal');
			await expect(modal).toBeVisible();

			// Verify the modal contains headline and navigation buttons
			await expect(modal.locator('h2')).toHaveText('Guided Tutorial');
			const nextButton = modal.locator('button:has-text(">>")');
			const prevButton = modal.locator('button:has-text("<<")');
			await expect(nextButton).toBeVisible();
			await expect(prevButton).toBeVisible();
		});
	});

	test.describe('Guide Modal Navigation', () => {
		test('Navigate through all stages in the guide', async ({ page }) => {
			// Open the modal by clicking "Continue"
			await page.locator('button:has-text("Continue")').click();

			// Verify the modal is displayed
			const modal = page.locator('#guide-modal');
			await expect(modal).toBeVisible();

			// Navigate through all stages
			const nextButton = modal.locator('button:has-text(">>")');
			const prevButton = modal.locator('button:has-text("<<")');

			// Navigate to Page 2 Stage 1
			await nextButton.click();
			await page.waitForTimeout(1000);
			await expect(modal.locator('h2')).toHaveText('Sign Up');
			await expect(page.getByText('Click \'Register\' to create an account.', { exact: true })).toBeVisible();

			// Navigate to Page 2 Stage 2
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Sign Up');
			await expect(page.getByText('Fill out the fields and click \'Submit\'.', { exact: true })).toBeVisible();

			// Navigate to Page 2 Stage 3
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Log In');
			await expect(page.getByText('Enter your email and password and click \'Submit\'.', { exact: true })).toBeVisible();

			// Navigate to Page 2 Stage 4
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Start a Game');
			await expect(page.getByText('Click the \'New Game\' button to start a new game.', { exact: true })).toBeVisible();

			// Navigate to Page 2 Stage 5
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Start a Game');
			await expect(page.getByText('Choose \'Solo\' or \'Multiplayer\'.', { exact: true })).toBeVisible();

			// Navigate to Page 2 Stage 6
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Start a Game');
			await expect(page.getByText('Click a pending game to join.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 1
			await nextButton.click();
			await page.waitForTimeout(1000);
			await page.waitForTimeout(1000);
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('Notifications appear here.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 2
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('Mute notifications.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 3
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('Enable or disable dark mode.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 4
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('These are your pawns.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 5
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('These are your opponent\'s pawns.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 6
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('Defeated pawns', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 7
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('These are your scrolls.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 8
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('These are your opponent\'s scrolls.', { exact: true })).toBeVisible();

			// Navigate to Page 3 Stage 9
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game Layout');
			await expect(page.getByText('Passive scroll', { exact: true })).toBeVisible();

			// Navigate to Page 4 Stage 1
			await nextButton.click();
			await page.waitForTimeout(1000);
			await expect(modal.locator('h2')).toHaveText('Step 1: Choose a Scroll');
			await expect(page.getByText('Click an active scroll.', { exact: true })).toBeVisible();

			// Navigate to Page 4 Stage 2
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 1: Choose a Scroll');
			await expect(page.getByText('This is the activated scroll.', { exact: true })).toBeVisible();

			// Navigate to Page 4 Stage 3
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Elements of a Scroll: Color');
			await expect(page.getByText('The color of the inactive scroll determines who goes first.', { exact: true })).toBeVisible();

			// Navigate to Page 4 Stage 4
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Elements of a Scroll: Title');
			await expect(page.getByText('The title of the scroll is for identification purposes only.', { exact: true })).toBeVisible();

			// Navigate to Page 4 Stage 5
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Elements of a Scroll: Action Grid');
			await expect(page.getByText('The action grid depicts the actions available for that scroll.', { exact: true })).toBeVisible();

			// Navigate to Page 4 Stage 6
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Movement Restrictions');

			// Navigate to Page 4 Stage 7
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Movement Restrictions');

			// Navigate to Page 4 Stage 8
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Elements of the Board');
			await expect(page.getByText('Eligible pawns are highlighted in your player color.', { exact: true })).toBeVisible();

			// Navigate to Page 4 Stage 9
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Elements of the Board');
			await expect(page.getByText('These are the spaces you can move to.', { exact: true })).toBeVisible();

			// Navigate to Page 5 Stage 1
			await nextButton.click();
			await page.waitForTimeout(1000);
			await expect(modal.locator('h2')).toHaveText('Step 2: Choose a Pawn');
			await expect(page.getByText('Click on any highlighted pawn.', { exact: true })).toBeVisible();

			// Navigate to Page 5 Stage 2
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 2: Choose a Pawn');
			await expect(page.getByText('The selected pawn', { exact: true })).toBeVisible();

			// Navigate to Page 5 Stage 3
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 2: Choose a Pawn');
			await expect(page.getByText('Eligible target space', { exact: true })).toBeVisible();

			// Navigate to Page 5 Stage 4
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 2: Choose a Pawn');
			await expect(page.getByText('Enemy pawn space', { exact: true })).toBeVisible();

			// Navigate to Page 5 Stage 5
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 2: Choose a Pawn');
			await expect(page.getByText('Enemy temple space', { exact: true })).toBeVisible();

			// Navigate to Page 5 Stage 6
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 2: Choose a Pawn');
			await expect(page.getByText('Click a scroll to reset pawns and targets.', { exact: true })).toBeVisible();

			// Navigate to Page 6 Stage 1
			await nextButton.click();
			await page.waitForTimeout(1000);
			await expect(modal.locator('h2')).toHaveText('Step 3: Choose a Target');
			await expect(page.getByText('Click a target space.', { exact: true })).toBeVisible();

			// Navigate to Page 6 Stage 2
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 3: Choose a Target');
			await expect(page.getByText('Your action is highlighted.', { exact: true })).toBeVisible();

			// Navigate to Page 6 Stage 3
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 3: Choose a Target');
			await expect(page.getByText('The Frog scroll has been replaced with the Ox scroll.', { exact: true })).toBeVisible();

			// Navigate to Page 6 Stage 4
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 3: Choose a Target');
			await expect(page.getByText('One defeated red pawn', { exact: true })).toBeVisible();

			// Navigate to Page 6 Stage 5
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Step 3: Choose a Target');
			await expect(page.getByText('Your opponent\'s action is highlighted.', { exact: true })).toBeVisible();

			// Navigate to Page 7 Stage 1
			await nextButton.click();
			await page.waitForTimeout(1000);
			await expect(modal.locator('h2')).toHaveText('Game End');

			// Navigate to Page 7 Stage 2
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game End');
			await expect(page.getByText('Click \'Play Again\' or \'Exit\'.', { exact: true })).toBeVisible();

			// Navigate to Page 7 Stage 3
			await nextButton.click();
			await expect(modal.locator('h2')).toHaveText('Game End');

			// Exit tutorial
			await nextButton.click();
			await expect(page).toHaveURL('/');

		});

	});

});