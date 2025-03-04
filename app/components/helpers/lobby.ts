// import { prisma } from "@/app/lib/prisma";
import * as utility from "./utility";
import { Card } from "@prisma/client";

export const apiUrl = typeof window !== 'undefined'
	? `${window.location.origin}/api`  // This will use the actual deployed URL
	: process.env.NEXT_PUBLIC_BASE_URL + "/api";

const startingBoard = [
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bs00", "bs00", "bm00", "bs00", "bs00"],
];

export const getAllCards = async (): Promise<Card[]> => {
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

export const createSoloGame = async (playerId: string) => {
	try {
		const gameData = await getNewGameData(playerId);
		const url = `${apiUrl}/games?action=solo`;
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(gameData),
		});
		if (response.ok) {
			return response.json();
		} else {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error('Error creating the game:', error);
		throw error;
	}
}

export const createMultiplayerGame = async (playerId: string) => {
	try {
		const gameData = await getNewGameData(playerId);
		const url = `${apiUrl}/games?action=multiplayer`;
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(gameData),
		})
	
		if (response.ok) {
			return response.json();
		} else {
			console.log(response)
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error('Error creating game:', error);
		throw error;
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
			status: "in_progress",
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

export const endGame = async (gameId: string) => {
	try {
		const url = `${apiUrl}/games?id=${gameId}&action=change_status`;
		const update = {
			gameId: gameId,
			status: "ended"
		}
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
		return data;
	} catch (error) {
		console.error('Error ending the game:', error);
		throw error;
	}
}

const getNewGameData = async (playerId: string) => {
	const allCards = await getAllCards();
	const randomIndexes = utility.shuffleArray([...Array(allCards.length).keys()]).slice(0, 5);
	const randomCards = allCards.filter((_: Card, index: number) => randomIndexes.includes(index));
	const shuffledCards = utility.shuffleArray(randomCards);
	const neutralCard: Card = shuffledCards[4];
	const players = {
		"blue": {
			id: playerId,
			cards: [shuffledCards[0], shuffledCards[1]],
		},
		"red": {
			id: "",
			cards: [shuffledCards[2], shuffledCards[3]],
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
		turn: neutralCard.color,
		players: players,
	}

	return data;
};