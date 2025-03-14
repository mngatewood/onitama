"use client";

import React, { useEffect, useState, useRef } from "react";
import { redirect } from "next/navigation";
import { createSoloGame, createMultiplayerGame, joinGame } from "../helpers/lobby";
import { socket } from "../../lib/socketClient";
import { WaitingModal } from "../WaitingModal";
import { ToastMessage } from "../ToastMessage";
import { useSearchParams, usePathname } from "next/navigation";
import { NewGameModal } from "./NewGameModal";

interface LobbyFormProps {
	session: AppendedSession;
	initialPendingGames: Game[];
}

export const LobbyForm = ({session, initialPendingGames}: LobbyFormProps) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [pendingGames, setPendingGames] = React.useState<Game[]>([]);
	const pendingGamesRef = useRef<Game[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [notifications, setNotifications] = useState<ToastNotification[]>([]);
	const [showNewGameModal, setShowNewGameModal] = useState(false);

	// Evaluate searchParams
	useEffect(() => {
		if (searchParams) {
			// Push success notification if logged_in query parameter is true
			const loggedIn = searchParams.get("logged_in");
			if (loggedIn === "true") {
				const notification = {
					type: "success",
					message: "You have successfully logged in.",
					action: "",
					duration: 3000
				} as ToastNotification;
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			}
			// Remove query parameter from URL
			window.history.replaceState(null, "", pathname);
		}
	}, [searchParams, pathname]);

	// Update pending games when initialPendingGames prop changes
	useEffect(() => {
		if (initialPendingGames) {
			setPendingGames(initialPendingGames);
		} else {
			setPendingGames([]);
		}
	}, [initialPendingGames]);

	// Socket.io event listeners
	useEffect(() => {
		const handleGameCreated = (newGame: Game) => {
			// console.log("[Lobby] Game created event received:", newGame);
			setPendingGames(prevGames => {
				// Check if game already exists
				if (prevGames.some(game => game.id === newGame.id)) {
					return prevGames;
				}
				const newGames = [newGame, ...prevGames];
				pendingGamesRef.current = newGames; // Update ref
				// console.log("[Lobby] Updated games after creation:", newGames);
				return newGames;
			});
		};

		const handleGameUpdated = (updatedGame: Game) => {
			// console.log("[Lobby] Game updated event received:", updatedGame);
			setPendingGames(prevGames => {
				const newGames = prevGames.map(game => 
					game.id === updatedGame.id ? updatedGame : game
				);
				pendingGamesRef.current = newGames;
				// console.log("[Lobby] Updated games after update:", newGames);
				return newGames;
			});
		};

		const handleGameFull = (gameId: string) => {
			// console.log("[Lobby] Game full event received:", gameId);
			setPendingGames(prevGames => {
				const newGames = prevGames.filter(game => game.id !== gameId);
				pendingGamesRef.current = newGames;
				// console.log("[Lobby] Updated games after removal:", newGames);
				return newGames;
			});
		};

		const handleGameEnded = (gameId: string) => {
			// console.log("[Lobby] Game ended event received:", gameId);
			setPendingGames(prevGames => {
				const newGames = prevGames.filter(game => game.id !== gameId);
				pendingGamesRef.current = newGames;
				// console.log("[Lobby] Updated games after removal:", newGames);
				return newGames;
			});
		};

		socket.on("game_created", handleGameCreated);
		socket.on("game_updated", handleGameUpdated);
		socket.on("game_full", handleGameFull);
		socket.on("game_ended", handleGameEnded);

		return () => {
			socket.off("game_created", handleGameCreated);
			socket.off("game_updated", handleGameUpdated);
			socket.off("game_full", handleGameFull);
			socket.off("game_ended", handleGameEnded);
		};
	}, []);

	const handleNewSoloGame = async () => {
		if(session?.user.id) {
			setLoading(true);
			setShowNewGameModal(false);
			const newGame = await createSoloGame(session?.user.id);
			if(newGame) {
				console.log("newGame", newGame);
				redirect(`/play/${newGame.id}`);
			}
			setLoading(false);			
		} else {
			redirect('/login');
		}
	}

	const handleNewGame = async () => {
		setShowNewGameModal(true);
	}

	const handleCancelNewGame = () => {
		setShowNewGameModal(false);
	}

	const handleNewMultiplayerGame = async () => {

		if(session?.user.id) {
			setLoading(true);
			setShowNewGameModal(false);

			if (!socket.connected) {
				await new Promise<void>((resolve) => {
					socket.on("connect", () => {
						resolve();
					});
				});
			}

			const newGame = await createMultiplayerGame(session?.user.id);
			if(newGame) {
				await new Promise<void>((resolve) => {
					const checkGameAdded = () => {
						if (pendingGamesRef.current.some(game => game.id === newGame.id)) {
							resolve();
						} 
					}

					socket.emit("game_created", newGame, () => {
						checkGameAdded();
						setTimeout(checkGameAdded, 100);
					});
					// setTimeout(resolve, 500);
				});

				redirect(`/play/${newGame.id}`);
			}
			setLoading(false);
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
				const firstName = updatedGame.users.find((user: User) => user.id === session?.user.id).first_name;
				socket.emit("user_joined", game.id, firstName);
				socket.emit("game_full", game.id, firstName);
				redirect(`/play/${game.id}`);
			} else {
				console.log("Failed to join game");
			}
		}
	};

	return (
		<>
			{ loading 
				?
				<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
					<WaitingModal text="Loading..." />
				</div>
				:
				<div>
					<div className="mx-auto overflow-y-scroll scroll-no-bars w-full max-w-md rounded-none border border-gray-300 bg-amber-50 px-4 pt-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:px-8 md:pt-8">
						<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Game Lobby</h2>
						<p className="my-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
							Create a new game or join an existing one
						</p>
						<button
							className="group/btn relative block h-10 my-6 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75"
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
						<div>
							{/* <h2 className="text-lg mb-4 font-bold text-neutral-800 dark:text-neutral-200">Pending Games</h2> */}
							<div className="flex justify-center items-center min-h-28">
								{pendingGames && pendingGames.length > 0 ? (
									<div className="game-join-list flex flex-col gap-2 w-full mb-4 py-2 max-h-48 overflow-y-scroll scroll-no-bars">
										{pendingGames.map((game) => (
											<button key={game.id} onClick={() => handleJoinGame(game)} className="game-join-entry group/btn flex justify-between items-center shrink-0 h-10 w-full rounded-md border border-gray-300 bg-amber-50 px-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-neutral-300 text-gray-800 font-bold dark:hover:bg-neutral-100 hover:text-gray-900 cursor-pointer">
												<div className="game-host-name w-1/3 text-left group-hover/btn:opacity-50">
													{game.users?.[0].first_name}
												</div>
												<div className="w-1/3 text-center hidden group-hover/btn:block">
													Join
												</div>
												<div className="game-created-at w-1/3 text-right group-hover/btn:opacity-50">
													{ new Date(game.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) }
												</div>
											</button>
										))}
									</div>
								) : (
									<div>
											<p className="text-slate-700 dark:text-gray-400">No pending games to display.</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			}
			<ToastMessage notifications={notifications} />
			{showNewGameModal && <NewGameModal handleNewSoloGame={handleNewSoloGame} handleNewMultiplayerGame={handleNewMultiplayerGame} handleCancelNewGame={handleCancelNewGame} />}
		</>
	)
}
