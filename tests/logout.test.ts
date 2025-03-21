import { expect, test } from '@playwright/test';
import { localhost, getEmail, registerUser, loginUser } from './test-helpers';

const email = getEmail();

test.describe('user can logout', () => {

	test.beforeAll(async ({ page }) => {
		await registerUser({ page }, email);
	});

	test.beforeEach(async ({ page }) => {
		await loginUser({ page }, email);
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
		expect(page.url()).toBe(localhost + "?logged_out=true");
		await expect(page.getByRole('heading', { name: 'Logout', exact: true })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).toBeVisible();
	});

});