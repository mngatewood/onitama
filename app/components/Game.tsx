"use client"

import { useEffect, useState } from "react";
import { WaitingModal } from "./WaitingModal";
import { Board } from "./Board";

interface Game {
	id: string;
	users: string[];
	board: string[][];
}

export const Game = ({ gameId }: { gameId: string }) => {
	const [game, setGame] = useState<Game | null>(null);
	const [waiting, setWaiting] = useState(true);

	
	
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
			{game && game.board && <Board board={game.board} />}
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

