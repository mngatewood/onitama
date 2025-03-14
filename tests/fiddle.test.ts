import { expect, test } from '@playwright/test';
import { prisma } from "../app/lib/prisma";

const deleteAllGames = async () => {
	await prisma.game.deleteMany({});
}


test.describe('fiddle', () => {

	test('delete all the games', async ({ page }) => {
		await deleteAllGames();
		await page.waitForTimeout(100);
	});

});