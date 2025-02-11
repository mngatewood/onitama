"use client"

import { useEffect, useState } from "react";
import { WaitingModal } from "./WaitingModal";
import { Board } from "./Board";
import { DefeatedPawns } from "./DefeatedPawns";
import { PlayerCards } from "./PlayerCards";

interface GameProps {
	gameId: string;
	userId: string;
}

interface Game {
	id: string;
	board: string[][];
	players: { 
		"blue": { 
			id: string,
			cards: string[] 
		}; 
		"red": { 
			id: string, 
			cards: string[] 
		}
	};
	users: string[];
	cards: string[];
	status: string;
	createdAt: Date;
	updatedAt: Date;
}

export const Game = ({ gameId, userId }: GameProps) => {
	const [game, setGame] = useState<Game | null>(null);
	const [waiting, setWaiting] = useState(true);

	const getPlayerData = (identifier: string) => {
		if (game?.players) {
			if(game.players.red.id === userId) {
				return identifier === "self" ? { color: "red", ...game.players.red } : { color: "blue", ...game.players.blue }
			} else if(game.players.blue.id === userId) {
				return identifier === "self" ? { color: "blue", ...game.players.blue } : { color: "red", ...game.players.red }
			} else {
				return { color: "", id: "", cards: [] }
			}
		} else {
			return { color: "", id: "", cards: [] }
		}
	}
	
	useEffect(() => {
		const fetchGame = async (id: string) => {
			const response = await fetch(`/api/games/?id=${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const gameData: Game = await response.json();
			setGame(gameData);
			if (gameData.users.length === 2) {
				setWaiting(false);
			} else {
				// change to false for development until 2nd player is implemented
				setWaiting(true);
			}
		};
		if (gameId) {
			fetchGame(gameId);
		}
	}, [gameId]);
	console.log(game)

	return (
		<>
			{game && game.board &&
				<div className="game w-full">
					<div className="player-top h-10">
						{getPlayerData("opponent") && <PlayerCards player={getPlayerData("opponent")}/>}
					</div>
					<div className="board flex flow-row justify-center my-4">
						<DefeatedPawns />
						<Board board={game.board} />
					</div>
					<div className="player-bottom h-10">
						{getPlayerData("self") && <PlayerCards player={getPlayerData("self")} />}
					</div>
				</div>
			}
			{!game &&
				<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
					<WaitingModal text="Loading game..." />
				</div>
				}
				{game && waiting &&
				<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
					<WaitingModal text="Waiting for another player to join..." />
				</div>
			}
		</>
	)
}

