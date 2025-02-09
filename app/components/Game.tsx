"use client"

import { useEffect, useState } from "react";
import { WaitingModal } from "./WaitingModal";

export const Game = ({ gameId }: { gameId: string }) => {
	const [game, setGame] = useState(null);
	const [waiting, setWaiting] = useState(true);

	const fetchGame = async (id: string) => {
		const response = await fetch(`/api/games/?id=${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		setGame(await response.json());
	};

	useEffect(() => {
		if (gameId) {
			fetchGame(gameId);
		}
	}, [gameId]);
	console.log(game)

	if (!game) {
		return (
			<WaitingModal text="Loading..." />
		)
	}

	return (
		<>
			{!game &&
				 <WaitingModal text="Waiting for another player to join..." />
			}
			{game && waiting &&
				<WaitingModal text="Waiting for another player to join..." />
			}
			{game && !waiting &&
				<h1>Game</h1>
			}
		</>
	)
}

