import { expect, test } from '@playwright/test';

const localhost = 'http://localhost:3000/';
const getEmail = () => `${Date.now()}@tested.com`
const email = getEmail();

test.describe('user can logout', () => {

	test.beforeAll(async ({ page }) => {
		// Register a user
		await page.goto('/register');
		await page.waitForTimeout(500);
		await page.locator('#firstName').fill('Test');
		await page.locator('#lastName').fill('User');
		await page.locator('#email').fill(email);
		await page.locator('#password').fill('password');
		await page.locator('#confirmPassword').fill('password');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(1000);
		await page.getByRole('button', { name: 'Proceed' }).click();
	});

	test.beforeEach(async ({ page }) => {
		// Login the user
		await page.goto('/login');
		await page.waitForTimeout(500);
		await page.locator('#email').fill(email);
		await page.locator('#password').fill('password');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(1000);
		await page.getByRole('button', { name: 'Proceed' }).click();
		await page.goto('/');

	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/logout.${workerInfo.project.name}.png` });
	});

	test('logout icon is visible from the home page when the user is logged in', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Onitama' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Switch to light / dark version' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Register' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Login' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
	});

	test('when the user clicks the Logout button from the home page, a modal appears', async ({ page }) => {
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByRole('heading', { name: 'Logout', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).not.toBeVisible();
	});
	
	test('when the user clicks the Cancel button from the logout modal, the logout modal closes', async ({ page }) => {
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: 'Cancel' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByRole('heading', { name: 'Logout', exact: true })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).toBeVisible();
	});

	test('when the user clicks the Logout button from the logout modal, the user is logged out', async ({ page }) => {
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.waitForTimeout(500);
		await page.goto('/login');
		expect(page.url()).toBe(localhost + 'login');
		await page.goto('/register');
		expect(page.url()).toBe(localhost + 'register');
		await page.goto('/logout');
		expect(page.url()).toBe(localhost);
	});

	test('when the user is logged out, they are redirected to the home page', async ({ page }) => {
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.waitForTimeout(500);
		expect(page.url()).toBe(localhost);
		await expect(page.getByRole('heading', { name: 'Logout', exact: true })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).toBeVisible();
	});

});