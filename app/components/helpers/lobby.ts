import { prisma } from "@/app/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as utility from "./utility";
// import { useSession } from "next-auth/react";
import { Card, Prisma } from "@prisma/client";

// const session = await getServerSession(authOptions);

const startingBoard = [
	["RS0", "RS0", "RM0", "RS0", "RS0"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["BS0", "BS0", "BM0", "BS0", "BS0"],
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
		status: status
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