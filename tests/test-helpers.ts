import { Page } from '@playwright/test';
import { prisma } from "../app/lib/prisma";

export const localhost = 'http://localhost:3000/';

export const getEmail = () => `${Date.now()}@tested.com`

const startingBoard = [
	["rs0", "rs0", "rm0", "rs0", "rs0"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["bs0", "bs0", "bm0", "bs0", "bs0"],
];

const deleteOldTestGames = async () => {
	await prisma.game.deleteMany({
		where: {
			users: {
				some: {
					first_name: {
						equals: "TestW@@+"
					}
				}
			},
		}
	});
}

const deleteOldTestUsers = async () => {
	await prisma.user.deleteMany({
		where: {
			first_name: {
				equals: "TestW@@+"
			},
		}
	});
}

export const clearTestData = async () => {
	await deleteOldTestGames();
	await deleteOldTestUsers();
}

export const registerUser = async ( { page }: { page: Page }, email: string) => {
	await page.goto('/register');
	await page.waitForTimeout(500);
	await page.locator('#firstName').fill('TestW@@+');
	await page.locator('#lastName').fill('User');
	await page.locator('#email').fill(email);
	await page.locator('#password').fill('password');
	await page.locator('#confirmPassword').fill('password');
	await page.getByRole('button', { name: 'Submit' }).click();
	await page.waitForTimeout(500);
	return;
}

export const loginUser = async ({ page }: { page: Page }, email: string) => {
	console.log("logging in user", email);
	await page.goto('/login');
	await page.waitForTimeout(1000);
	await page.locator('#email').fill(email);
	await page.locator('#password').fill('password');
	await page.getByRole('button', { name: 'Submit' }).click();
	await page.waitForTimeout(500);
	return;
};

export const createGame = async ({ page }: { page: Page }) => {
	await page.goto('/');
	await page.waitForTimeout(500);
	await page.getByRole('button', { name: 'New Game' }).click();
	await page.waitForTimeout(500);
	return;
};

export const logoutUser = async ({ page }: { page: Page }) => {
	await page.goto('/logout/go');
	await page.waitForTimeout(500);
	return;
};

export const convertTimeStringToDate = (timeString: string) => {
	const date = new Date();
	const [time, modifier] = timeString.split(' ');
	const [hoursString, minutesString] = time.split(':');
	let hours = hoursString === "12" ? 0 : parseInt(hoursString, 10);
	const minutes = parseInt(minutesString, 10);

	if (modifier.toUpperCase() === 'PM') {
		hours = hours + 12;
	}

	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);
	date.setMilliseconds(0);

	return date;
}

export const createNewGame = async () => {
	const email = getEmail();
	const cardIds = await prisma.card.findMany({
		take: 5,
		where: {
			color: "red",
		},
		select: {
			id: true
		}
	})
	const user = await prisma.user.create({
		data: {
			first_name: "TestW@@+",
			last_name: "User",
			email: email,
			password: "password"
		}
	});
	const data = {
		users: {
			connect: [
				{
					id: user.id
				}
			]
		},
		cards: {
			connect: cardIds
		},
		board: startingBoard,
		status: "waiting_for_players",
		turn: "red",
		players: {
			red: {
				id: user.id,
				cards: [cardIds[0].id, cardIds[1].id]
			},
			blue: {
				id: "",
				cards: [cardIds[2].id, cardIds[3].id]
			}
		}
	}
	const game = await prisma.game.create({
		data: data
	});
	return game;
}

export const createOldGame = async () => {
	const game = await createNewGame();
	await prisma.game.update({
		where: {
			id: game.id
		},
		data: {
			createdAt: new Date(Date.now() - 60 * 60 * 1000)
		}
	});
}