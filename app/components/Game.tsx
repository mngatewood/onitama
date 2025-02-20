"use client"

import { useEffect, useState } from "react";
import { WaitingModal } from "./WaitingModal";
import { Board } from "./Board";
import { DefeatedPawns } from "./DefeatedPawns";
import { PlayerCards } from "./PlayerCards";
import { socket } from "../lib/socketClient";
import { ToastMessage } from "./ToastMessage";

interface GameProps {
	gameId: string;
	userId: string;
}

// export interface Game {
// 	id: string;
// 	board: string[][];
// 	players: { 
// 		"blue": { 
// 			id: string,
// 			cards: string[] 
// 		}; 
// 		"red": { 
// 			id: string, 
// 			cards: string[] 
// 		}
// 	};
// 	status: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// 	users: {
// 		id: string;
// 		first_name: string;
// 		last_name: string;
// 		email: string;
// 		created_at: Date;
// 		updated_at: Date;
// 	}[];
// 	cards: {
// 		id: string;
// 		title: string;
// 		kanji: string;
// 		color: string;
// 		moves: number[];
// 		createdAt: Date;
// 		updatedAt: Date;
// 	}[];
// }

interface Notification {
	type: string;
	message: string;
	action: string;
	timeout: number;
}

export const Game = ({ gameId, userId }: GameProps) => {
	const [game, setGame] = useState<Game | null>(null);
	const [waiting, setWaiting] = useState(true);
	const [notifications, setNotifications] = useState<Notification[]>([]);

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
	
	// Fetch game data
	useEffect(() => {
		const fetchGame = async (id: string) => {
			const response = await fetch(`/api/games/?id=${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				const notification: Notification = {
					type: "error",
					message: "Game not found.  Redirecting to lobby...",
					timeout: 3000,
					action: "/"
				}
				return setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			}
			const gameData: Game = await response.json();
			setGame(gameData);
			if (gameData.users.length === 2) {
				setWaiting(false);
			} else {
				setWaiting(true);
			}
		};
		if (gameId) {
			fetchGame(gameId);
		}
	}, [gameId]);

	// Socket IO events
	useEffect(() => {

		if (socket.connected) {
			socket.emit("join", gameId);
		} else {
			socket.on("connect", () => {
				socket.emit("join", gameId);
			});
		}

		socket.on("user_joined", (message: string) => {
			const notification: Notification = {
				type: "system",
				message,
				timeout: 3000,
				action: ""
			}
			setWaiting(false);
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
		});

		socket.on("user_left", (message: string) => {
			const notification: Notification = {
				type: "system",
				message,
				timeout: 3000,
				action: "/"
			}
			console.log("User left", message);
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
		});

		return () => {
			socket.off("user_joined");
		}
	}, [gameId]);

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
			<ToastMessage notifications={notifications} />
		</>
	)
}

