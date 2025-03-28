import { Page } from '@playwright/test';
import { prisma } from "../app/lib/prisma";
import { Prisma } from "@prisma/client";

export const localhost = 'http://localhost:3000/';

export const getEmail = () => `${Date.now()}@tested.com`

const startingBoard = [
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "bs00"],
];

const getAllCards = async () => {
	const cardsArray = await prisma.card.findMany({
		orderBy: [{
			title: "asc"
		}, {
			color: "asc"
		}]
	})
	const cards: Record<string, Card> = {};
	for await (const card of cardsArray) {
		cards[card.title.toLowerCase()] = card;
	}
	return cards
}

const getStartingTestCards = async (cardColor: string) => {
	if (cardColor === "blue") {
		return await prisma.card.findMany({
			where: {
				title: {
					in: ["Boar", "Cobra", "Dragon", "Mantis", "Rabbit"]
				},
			},
			orderBy: {
				title: "asc"
			}
		})
	} else if (cardColor === "red") {
		return await prisma.card.findMany({
			where: {
				title: {
					in: ["Frog", "Goose", "Horse", "Monkey", "Tiger"]
				},
			},
			orderBy: {
				title: "asc"
			}
		})
	}
};

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

export const createNewGame = async (firstPlayerColor: string = "red") => {
	const email = getEmail();
	const cardIds = await prisma.card.findMany({
		take: 5,
		where: {
			color: firstPlayerColor,
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
		turn: firstPlayerColor,
		players: {
			red: {
				id: user.id,
				cards: [cardIds[1].id, cardIds[2].id]
			},
			blue: {
				id: "",
				cards: [cardIds[0].id, cardIds[4].id]
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

export const startTestGame = async ({page}: {page: Page}, email: string, firstPlayerColor: string = "blue") => {
	await registerUser({page}, email);
	await loginUser({page}, email);
	await page.getByRole('button', { name: 'New Game' }).click();
	await page.getByRole('button', { name: 'Solo' }).click();
	await page.waitForTimeout(2000);
	
	// get 5 cards of the desired color (blue for first player, red for second player)
	const cards = await getStartingTestCards(firstPlayerColor);

	if (cards?.length !== 5) {
		throw new Error('Failed to get starting test cards');
	}

	// get the game
	const game = await getTestGame();
	const secondPlayerColor = firstPlayerColor === "red" ? "blue" : "red";

	// redistribute cards
	const playersData = {
		[firstPlayerColor]: {
			id: game?.users?.find((user) => user.first_name === "TestW@@+")?.id,
			cards: [cards[0], cards[4]],
		},
		[secondPlayerColor]: {
			id: game?.users?.find((user) => user.email === "virtual_opponent@mngatewood.com")?.id,
			cards: [cards[2], cards[3]],
		}
	}

	// remove existing cards, update status, and add new cards
	const updatedGame = await prisma.$transaction([
		prisma.game.update({
			where: {
				id: game?.id,
			},
			data: {
				cards: {
					set: []
				},
				players: playersData,
				status: "in_progress",
				turn: firstPlayerColor
			},
		}),
		prisma.game.update({
			where: {
				id: game?.id,
			},
			data: {
				cards: {
					connect: cards.map(card => ({ id: card.id }))
				}
			}
		})
	])

	if (updatedGame) {
		await page.reload();
		await page.waitForTimeout(500);
	};
}

const getTestGame = async () => {
	const game = await prisma.game.findFirst({
		where: {
			users: {
				some: {
					first_name: {
						equals: "TestW@@+"
					}
				}
			},
			status: {
				equals: "in_progress"
			}
		},
		include: {
			users: {
				omit: {
					password: true
				}
			},
			cards: true
		}
	})
	return game;
}

export const updateGame = async (updatedBoard: string[][], cards: Card[]) => {
	const game = await getTestGame();
	if (!game) {
		throw new Error('Game not found');
	}
	const players: Players = game.players as unknown as Players;

	const updatedPlayers = {
		red: {
			...players?.red,
			cards: [cards[0], cards[1]]
		},
		blue: {
			...players?.blue,
			cards: [cards[3], cards[4]]
		}
	}

	const update = await prisma.game.update({
		where: {
			id: game?.id,
		},
		data: {
			board: updatedBoard,
			players: updatedPlayers as unknown as Prisma.JsonObject,
			turn: cards[2].color,
			cards: {
				set: [],
				connect: cards.map(card => ({ id: card.id }))
			}
		}
	});

	return update;

}

const invalidActionBoard = [
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "bm00"],
];

const invalidActionCards = async () => {
	const cards = await getAllCards();
	return [ cards.boar, cards.dragon, cards.cobra, cards.rabbit, cards.mantis ];
}

export const updateInvalidActionGame = async () => { 
	return updateGame(invalidActionBoard, await invalidActionCards());
}
	
const invalidPawnBoard = [
	["rs00", "rs00", "rm00", "0000", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "rs00", "0000"],
	["0000", "0000", "bm00", "bs00", "bs00"],
]

const invalidPawnCards = async () => {
	const allCards = await getAllCards();
	return [allCards.boar, allCards.dragon, allCards.mantis, allCards.rabbit, allCards.cobra];
}

export const updateInvalidPawnGame = async () => {
	return updateGame(invalidPawnBoard, await invalidPawnCards());
}	

const victoryMasterBoard = [
	["rs00", "rs00", "rm00", "rs00", "0000"],
	["0000", "bs00", "0000", "0000", "0000"],
	["0000", "0000", "bm00", "0000", "0000"],
	["0000", "rs00", "0000", "0000", "0000"],
	["bs00", "0000", "0000", "bs00", "bs00"],
]

const victoryMasterCards = async () => {
	const allCards = await getAllCards();
	return [allCards.tiger, allCards.goose, allCards.horse, allCards.monkey, allCards.frog];
}

export const updateGameVictoryMaster = async () => {
	return updateGame(victoryMasterBoard, await victoryMasterCards());
}

const victoryTempleBoard = [
	["rs00", "rs00", "0000", "rs00", "0000"],
	["0000", "bs00", "0000", "0000", "0000"],
	["0000", "0000", "rm00", "0000", "bm00"],
	["0000", "rs00", "0000", "0000", "0000"],
	["bs00", "0000", "0000", "bs00", "bs00"],
]

const victoryTempleCards = async () => {
	const allCards = await getAllCards();
	return [allCards.tiger, allCards.goose, allCards.horse, allCards.monkey, allCards.frog];
}

export const updateGameVictoryTemple = async () => {
	return updateGame(victoryTempleBoard, await victoryTempleCards());
}

const avoidDefeatBoardThroneAndMaster = [
	["rs00", "rs00", "0000", "rs00", "rs00"],
	["0000", "0000", "0000", "bs00", "0000"],
	["0000", "0000", "rm00", "0000", "0000"],
	["0000", "0000", "0000", "bs00", "0000"],
	["bs00", "bs00", "bm00", "0000", "0000"],
]

const avoidDefeatCardsThroneAndMaster = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameAvoidDefeatGameThroneAndMaster = async () => {
	return updateGame(avoidDefeatBoardThroneAndMaster, await avoidDefeatCardsThroneAndMaster());
}

const avoidDefeatBoardThrone = [
	["rs00", "rs00", "0000", "rs00", "rs00"],
	["0000", "0000", "rm00", "bs00", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "bs00", "0000"],
	["bs00", "bs00", "bm00", "0000", "0000"],
]

const avoidDefeatCardsThrone = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameAvoidDefeatGameThrone = async () => {
	return updateGame(avoidDefeatBoardThrone, await avoidDefeatCardsThrone());
}

const avoidDefeatBoardMasterCanAttackThreat = [
	["rs00", "rs00", "0000", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "rm00", "0000", "0000"],
	["0000", "0000", "0000", "bs00", "0000"],
	["bs00", "bs00", "bm00", "0000", "bs00"],
]

const avoidDefeatCardsMasterCanAttackThreat = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameAvoidDefeatGameMasterCanAttackThreat = async () => {
	return updateGame(avoidDefeatBoardMasterCanAttackThreat, await avoidDefeatCardsMasterCanAttackThreat());
}

const avoidDefeatBoardMasterCannotAttackThreat = [
	["rs00", "rs00", "0000", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "rm00", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "bs00"],
]

const avoidDefeatCardsMasterCannotAttackThreat = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameAvoidDefeatGameMasterCannotAttackThreat = async () => {
	return updateGame(avoidDefeatBoardMasterCannotAttackThreat, await avoidDefeatCardsMasterCannotAttackThreat());
}

const attackThreateningPawnBoard = [
	["rs00", "rs00", "rm00", "0000", "rs00"],
	["0000", "0000", "0000", "rs00", "0000"],
	["0000", "0000", "0000", "0000", "bs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "0000"],
]

const attackThreateningPawnCards = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameAttackThreateningPawn = async () => {
	return updateGame(attackThreateningPawnBoard, await attackThreateningPawnCards());
}

const evadeThreateningPawnBoard = [
	["rs00", "rs00", "rm00", "0000", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "rs00", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "bs00"],
]

const evadeThreateningPawnCards = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameEvadeThreateningPawn = async () => {
	return updateGame(evadeThreateningPawnBoard, await evadeThreateningPawnCards());
}

const attackPawnBoard = [
	["rs00", "rs00", "0000", "rs00", "rs00"],
	["bs00", "rm00", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "bs00", "bm00", "bs00", "bs00"],
]

const attackPawnCards = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameAttackPawn = async () => {
	return updateGame(attackPawnBoard, await attackPawnCards());
}

const movePawnToSafeLocationBoard = [
	["0000", "0000", "0000", "0000", "0000"],
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "bs00"],
]

const movePawnToSafeLocationCards = async () => {
	const allCards = await getAllCards();
	return [allCards.monkey, allCards.goose, allCards.horse, allCards.tiger, allCards.frog];
}

export const updateGameMovePawnToSafeLocation = async () => {
	return updateGame(movePawnToSafeLocationBoard, await movePawnToSafeLocationCards());
}

const updateGameVictoryActionBoard = [
	["rm00", "0000", "0000", "0000", "0000"],
	["0000", "bs00", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "0000"],
]

const updateGameVictoryActionCards = async () => {
	const allCards = await getAllCards();
	return [allCards.rabbit, allCards.boar, allCards.cobra, allCards.mantis, allCards.dragon];
}

export const updateGameVictoryAction = async () => {
	return updateGame(updateGameVictoryActionBoard, await updateGameVictoryActionCards());
}

const updateGameStartBoard = [
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "bs00"],
]

const updateGameStartCards = async () => {
	const allCards = await getAllCards();
	return [allCards.rabbit, allCards.boar, allCards.cobra, allCards.mantis, allCards.dragon];
}

export const updateGameStart = async () => {
	return updateGame(updateGameStartBoard, await updateGameStartCards());
}

