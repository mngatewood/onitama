import { prisma } from "@/app/lib/prisma";
import * as utility from "./utility";
import { Card } from "@prisma/client";

const startingBoard = [
	["rs0", "rs0", "rm0", "rs0", "rs0"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["bs0", "bs0", "bm0", "bs0", "bs0"],
];

export const getAllCards = async () => {
	try {
		const response = await fetch('/api/cards');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching cards:', error);
		throw error;
	}
}

export const createGame = async (playerId: string) => {
	const allCards = await getAllCards();
	const randomIndexes = utility.shuffleArray([...Array(allCards.length).keys()]).slice(0, 5);
	const randomCards = allCards.filter((_:Card, index: number) => randomIndexes.includes(index));
	const players = {
		"blue": {
			id: playerId,
			cards: [ randomCards[0], randomCards[1] ],
		},
		"red": {
			id: "",
			cards: [ randomCards[2], randomCards[3] ],
		}
	}
	const status = "waiting_for_players"
	const data = {
		users: {
			connect: [
				{
					id: playerId,
				},
			],
		},
		cards: {
			connect: randomCards.map((card: Card) => ({
				id: card.id,
			}))
		},
		board: startingBoard,
		status: status,
		players: players,
	}
	const response = await fetch('/api/games', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (response.ok) {
		return response.json();
	} else {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}

export const getPendingGames = async () => {
	const games = await prisma.game.findMany();
	return games;
}