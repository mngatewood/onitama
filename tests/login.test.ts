import { expect, test } from '@playwright/test';
import { localhost, getEmail, registerUser } from './test-helpers';

const email = getEmail();

test.describe('user can login', () => {

	test.beforeAll(async ({ page }) => {
		await registerUser({ page }, email);
	});

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('take a screenshot', async ({ page }, workerInfo) => {
		await page.screenshot({ path: `./test-results/login.${workerInfo.project.name}.png` });
	});

	test('when the user clicks the Login button, the Login page is displayed', async ({ page }) => {
		await page.getByRole('button', { name: 'Login' }).click();
		await page.waitForTimeout(500);
		expect(page.url()).toBe(localhost + 'login');
	});

	test('login page has expected h1, inputs and buttons', async ({ page }) => {
		await page.getByRole('button', { name: 'Login' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByRole('heading', { name: 'Onitama', exact: true })).toBeVisible();
		await expect(page.getByText('Email Address *')).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Password *', exact: true })).toBeVisible();
		await expect(page.locator('#email')).toBeVisible();
		await expect(page.locator('#password')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
	});

	test('when the user clicks Cancel, they are redirected to the home page', async ({ page }) => {
		await page.getByRole('button', { name: 'Login' }).click();
		await page.waitForTimeout(500);
		await page.getByRole('button', { name: 'Cancel' }).click();
		await page.waitForTimeout(500);
		expect(page.url()).toBe(localhost);
		await expect(page.getByRole('heading', { name: 'Onitama' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Switch to light / dark version' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).toBeVisible();
	});

	test('email is required and must be valid', async ({ page }) => {
		await page.getByRole('button', { name: 'Login' }).click();
		await page.waitForTimeout(500);
		await page.locator('#password').fill('password');
		await expect(page.getByText('Please fill in all the required fields')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#email').fill('testusergmail.com');
		await expect(page.getByText('Email address is invalid')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#email').fill('testuser@gmail.com');
		await expect(page.getByText('Email address is invalid')).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
	});

	test('password is required and must be at least 8 characters', async ({ page }) => {
		await page.getByRole('button', { name: 'Login' }).click();
		await page.waitForTimeout(500);
		await page.locator('#email').fill('testuser@gmail.com');
		await expect(page.getByText('Please fill in all the required fields')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#password').fill('pass');
		await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#password').fill('password');
		await expect(page.getByText('Password must be at least 8 characters')).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
	});

	test('submit button is inactive until all required fields pass validation', async ({ page }) => {
		await page.getByRole('button', { name: 'Login' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#email').fill('testuser@gmail.com');
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#password').fill('password');
		await expect(page.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
	});

	test('when the user submits an invalid email address, a message is displayed', async ({ page }) => {
		await page.goto('/login');
		await page.waitForTimeout(500);
		await page.locator('#email').fill('wrongemail@gmail.com');
		await page.locator('#password').fill('password');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(1000);
		await expect(page.getByText('Incorrect email or password')).toBeVisible();
	});

	test('when the user submits an incorrect password, a message is displayed', async ({ page }) => {
		await page.goto('/login');
		await page.waitForTimeout(500);
		await page.locator('#email').fill('testuser@gmail.com');
		await page.locator('#password').fill('wrongpassword');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(1000);
		await expect(page.getByText('Incorrect email or password')).toBeVisible();
	});

	test('when the user submits valid credentials, they are redirected to the home page', async ({ page }) => {
		await page.goto('/login');
		await page.waitForTimeout(500);
		await page.locator('#email').fill(email);
		await page.locator('#password').fill('password');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(500);
		await expect(page).toHaveURL(localhost);
		await expect(page.getByRole('heading', { name: 'Onitama' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Switch to light / dark version' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Register' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Login' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Guide' })).toBeVisible();
	});

	test('an authenticated user cannot access the login or register pages', async ({ page }) => {
		await page.goto('/login');
		await page.waitForTimeout(500);
		await page.locator('#email').fill(email);
		await page.locator('#password').fill('password');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(500);
		await page.goto('/register');
		expect(page.url()).toBe(localhost);
		await page.goto('/login');
		expect(page.url()).toBe(localhost);
	});
});