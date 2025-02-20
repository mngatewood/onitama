// import { prisma } from "@/app/lib/prisma";
import * as utility from "./utility";
import { Card } from "@prisma/client";

const apiUrl = process.env.API_URL || "http://localhost:3000/api/";

const startingBoard = [
	["rs0", "rs0", "rm0", "rs0", "rs0"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["000", "000", "000", "000", "000"],
	["bs0", "bs0", "bm0", "bs0", "bs0"],
];

export const getAllCards = async () => {
	try {
		const url = `${apiUrl}/cards`;
		const response = await fetch(url);
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

export const getGame = async (id: string) => {
	try {
		const url = `${apiUrl}/games?id=${id}`;
		const response = await fetch(url);
		if (!response.ok) {
			return null;
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching game:', error);
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
	const url = `${apiUrl}/games`;
	const response = await fetch(url, {
		method: 'PUT',
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
	try {
		const url = `${apiUrl}/games?status=waiting_for_players`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching pending games:', error);
		throw error;
	}
}

export const joinGame = async (playerId: string, game: Game) => {
	if(game.users?.length !== 1) {
		return
	}
	try {
		const playerColor = game.players.red.id.length ? "blue" : "red";
		const opponentColor = playerColor === "red" ? "blue" : "red";
		const playersUpdate = {
			[playerColor]: {
				id: playerId,
				cards: game.players[playerColor].cards,
			},
			[opponentColor]: {
				id: game.players[opponentColor].id,
				cards: game.players[opponentColor].cards,
			}
		}
		const update = {
			gameId: game.id,
			userId: playerId,
			players: playersUpdate
		}
		const url = `${apiUrl}/games?id=${game.id}&action=join`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(update),
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		const updated = 
			data.players.red.id === playersUpdate.red.id && 
			data.players.blue.id === playersUpdate.blue.id && 
			data.users.length === 2;
		if(!updated) {
			throw new Error(`Update returned ok but the game was not updated!`);
		}
		return data;
	} catch (error) {
		console.error('Error joining the game:', error);
		throw error;
	}
}

export const deleteGame = async (gameId: string) => {
	try {
		const url = `${apiUrl}/games?id=${gameId}&action=delete`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error deleting the game:', error);
		throw error;
	}
}