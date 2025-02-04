import { expect, test } from '@playwright/test';
const localhost = 'http://localhost:5173/';

test.describe.configure({ mode: 'parallel' });
test.describe('user can register', () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.goto('/register');
		await page.screenshot({ path: `./test-results/register.${workerInfo.project.name}.png` });
	});

	test('when the user clicks the Register button, the registration page is displayed', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(5000);
		expect(page.url()).toBe(localhost + 'register');
	});

	test('registration page has expected h1, inputs and buttons', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(5000);
		await expect(page.getByRole('heading', { name: 'Welcome to Onitama' })).toBeVisible();
		await expect(page.getByText('First Name')).toBeVisible();
		await expect(page.getByText('Last Name')).toBeVisible();
		await expect(page.getByText('Email Address')).toBeVisible();
		await expect(page.getByText('Password', { exact: true })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Confirm Password' })).toBeVisible();
		await expect(page.locator('#firstName')).toBeVisible();
		await expect(page.locator('#lastName')).toBeVisible();
		await expect(page.locator('#email')).toBeVisible();
		await expect(page.locator('#password')).toBeVisible();
		await expect(page.locator('#confirmPassword')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
	});

	test('when the user clicks Cancel, they are redirected to the home page', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(5000);
		expect(page.url()).toBe(localhost);
		await expect(page.getByRole('heading', { name: 'Onitama' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).toBeVisible();
	});

	test('first name is required', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(5000);
		await page.locator('#lastName').click();
		await page.locator('#lastName').fill('User');
		await page.locator('#lastName').press('Tab');
		await page.locator('#email').fill('testuser@gmail.com');
		await page.locator('#email').press('Tab');
		await page.locator('#password').fill('password');
		await page.locator('#password').press('Tab');
		await page.locator('#confirmPassword').fill('password');
		await page.getByRole('button', { name: 'Sign up →' }).click();
		await expect(page.getByText('First name is required')).toBeVisible();
	});

	test('last name is optional', async ({ page }) => {

	});

	test('email is required, must be valid and unique', async ({ page }) => {

	});

	test('password is required and must be at least 8 characters', async ({ page }) => {

	});

	test('confirm password is required and must match password', async ({ page }) => {

	});

	test('if validation fails, an error message is displayed', async ({ page }) => {

	});

	test('submit button is inactive until all required fields pass validation', async ({ page }) => {

	});

	test('when the user clicks submit, an account is created and the user is redirected to the login page', async ({ page }) => {

	});

	test('the dark mode toggle button is visible on the registration page', async ({ page }) => {
		
	});

});