import { Page } from '@playwright/test';

export const localhost = 'http://localhost:3000/';

export const getEmail = () => `${Date.now()}@tested.com`

export const registerUser = async ( { page }: { page: Page }, email: string) => {
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
	return;
}

export const loginUser = async ({ page }: { page: Page }, email: string) => {
	await page.goto('/login');
	await page.waitForTimeout(500);
	await page.locator('#email').fill(email);
	await page.locator('#password').fill('password');
	await page.getByRole('button', { name: 'Submit' }).click();
	await page.waitForTimeout(1000);
	await page.getByRole('button', { name: 'Proceed' }).click();
	await page.goto('/');
	return;
};
