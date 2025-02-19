"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { createGame, joinGame } from "../helpers/lobby";
import { socket } from "../../lib/socketClient";
import { Game } from "../Game";

interface LobbyFormProps {
	session: AppendedSession;
	initialPendingGames: Game[];
}

export const LobbyForm = ({session, initialPendingGames}: LobbyFormProps) => {

	const [pendingGames, setPendingGames] = React.useState<Game[]>([]);

	useEffect(() => {
		if (initialPendingGames) {
			setPendingGames(initialPendingGames);
		} else {
			setPendingGames([]);
		}
	}, [initialPendingGames]);

	const handleNewGame = async () => {

		// TODO: Display loading modal

		if(session?.user.id) {
			const newGame = await createGame(session?.user.id);
			if(newGame) {
				socket.emit("game_created", newGame);
				redirect(`/play/${newGame.id}`);
			}
		} else {
			redirect('/login');
		}
	}

	const handleJoinGame = async (game: Game) => {
		if(!session?.user.id) {
			redirect('/login');
		} else if(session?.user.id && game) {
			const updatedGame = await joinGame(session?.user.id, game);
			if(updatedGame) {
				const firstName = updatedGame.users.find((user) => user.id === session?.user.id).first_name;
				socket.emit("user_joined", game.id, firstName);
				socket.emit("game_full", game.id, firstName);
				redirect(`/play/${game.id}`);
			} else {
				console.log("Failed to join game");
			}
		}
	};

	// Socket.io event listeners
	useEffect(() => {

		console.log("socket connected: ", socket.connected);
		
		// Listen for game_created event to add new games to the list of pending games
		socket.on("game_created", (newGame: Game) => {
			console.log("New game created:", newGame);
			setPendingGames((prevGames) => [newGame, ...prevGames]);
		});
		
		// Listen for game_full event to remove games with two players from the list of pending games
		socket.on("game_full", (filledGameId: string) => {
			// Remove full game from state
			setPendingGames((prevGames) => 
				prevGames.filter(game => 
					game.createdAt > new Date(Date.now() - 2 * 60 * 1000) &&
					game.id !== filledGameId
				)
			);
		});

		// Clean up the event listeners on unmount
		return () => {
			socket.off("game_created");
			socket.off("game_full");
		};
	}, []);

	return (
		<div>
			<h2 className="text-2xl mb-8 font-bold text-neutral-800 dark:text-neutral-200">Game Lobby</h2>
			<button
				className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75"
				onClick={handleNewGame}
			>
				New Game
				<span
					className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
				></span>
				<span
					className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
				></span>
			</button>
			<div className="mt-8">
				<h2 className="text-2xl mb-4 font-bold text-neutral-800 dark:text-neutral-200">Pending Games</h2>
				{pendingGames && pendingGames.length > 0 ? (
					<div className="game-join-list flex flex-col gap-2">
						{pendingGames.map((game) => (
							<div key={game.id} className="game-join-entry flex justify-between items-center">
								<div className="game-host-name">
									{game.users[0].first_name}
								</div>
								<div className="game-created-at">
									{game.createdAt.toLocaleString()}
								</div>
								<button onClick={() => handleJoinGame(game)}>
									Join
								</button>
							</div>
						))}
					</div>
				) : (
					<div>
						<p>No pending games to display.</p>
					</div>
				)}
			</div>
		</div>
	)
}