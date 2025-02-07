import { expect, test } from '@playwright/test';

const localhost = 'http://localhost:3000/';
const email = `${Date.now()}@tested.com`

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
		await page.waitForTimeout(500);
		expect(page.url()).toBe(localhost + 'register');
	});

	test('registration page has expected h1, inputs and buttons', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByRole('heading', { name: 'Onitama', exact: true })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Welcome to Onitama' })).toBeVisible();
		await expect(page.getByText('First Name')).toBeVisible();
		await expect(page.getByText('Last Name')).toBeVisible();
		await expect(page.getByText('Email Address')).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Password *', exact: true })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Confirm Password' })).toBeVisible();
		await expect(page.locator('#firstName')).toBeVisible();
		await expect(page.locator('#lastName')).toBeVisible();
		await expect(page.locator('#email')).toBeVisible();
		await expect(page.locator('#password')).toBeVisible();
		await expect(page.locator('#confirmPassword')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
	});

	test('when the user clicks Cancel, they are redirected to the home page', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
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

	test('first name is required', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await page.locator('#lastName').click();
		await page.locator('#lastName').fill('User');
		await page.locator('#email').fill('testuser@gmail.com');
		await page.locator('#password').fill('password');
		await page.locator('#confirmPassword').fill('password');
		await expect(page.getByText('Please fill in all the required fields')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
	});

	test('last name is optional', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await page.locator('#firstName').fill('Test');
		await page.locator('#email').fill('testuser@gmail.com');
		await page.locator('#password').fill('password');
		await page.locator('#confirmPassword').fill('password');
		await expect(page.getByText('Please fill in all the required fields')).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
	});

	test('email is required, must be valid and unique', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await page.locator('#firstName').fill('Test');
		await page.locator('#lastName').fill('User');
		await page.locator('#password').fill('password');
		await page.locator('#confirmPassword').fill('password');
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
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await page.locator('#firstName').fill('Test');
		await page.locator('#lastName').fill('User');
		await page.locator('#email').fill('testuser@gmail.com');
		await page.locator('#confirmPassword').fill('password');
		await expect(page.getByText('Please fill in all the required fields')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#password').fill('pass');
		await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#password').fill('password');
		await expect(page.getByText('Password must be at least 8 characters')).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
	});

	test('confirm password is required and must match password', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await page.locator('#firstName').fill('Test');
		await page.locator('#lastName').fill('User');
		await page.locator('#email').fill('testuser@gmail.com');
		await page.locator('#password').fill('password');
		await expect(page.getByText('Please fill in all the required fields')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#confirmPassword').fill('pass');
		await expect(page.getByText('Passwords do not match')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#confirmPassword').fill('password');
		await expect(page.getByText('Password must be at least 8 characters')).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
	});

	test('submit button is inactive until all required fields pass validation', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#firstName').fill('Test');
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#lastName').fill('User');
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#email').fill('testuser@gmail.com');
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#password').fill('password');
		await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
		await page.locator('#confirmPassword').fill('password');
		await expect(page.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
	});

	test('when the user clicks submit, an account is created and the user is redirected to the login page', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await page.locator('#firstName').fill('Test');
		await page.locator('#lastName').fill('User');
		await page.locator('#email').fill(email);
		await page.locator('#password').fill('password');
		await page.locator('#confirmPassword').fill('password');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(1000);
		await expect(page.getByRole('heading', { name: 'Success!', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
		await page.getByRole('button', { name: 'Proceed' }).click();
		await page.waitForTimeout(1000);
		await expect(page.getByRole('heading', { name: 'Onitama' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Login to Your Account' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Switch to light / dark version' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
	});

	test('if the email is already used, the user is given a message', async ({ page }) => {
		await page.getByRole('button', { name: 'Register' }).click();
		await page.waitForTimeout(500);
		await page.locator('#firstName').fill('Test');
		await page.locator('#lastName').fill('User');
		await page.locator('#email').fill(email);
		await page.locator('#password').fill('password');
		await page.locator('#confirmPassword').fill('password');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.waitForTimeout(500);
		expect(page.url()).toBe(localhost + 'register');
		await expect(page.getByText('Email already exists')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Onitama', exact:true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Switch to light / dark version' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
	});

});