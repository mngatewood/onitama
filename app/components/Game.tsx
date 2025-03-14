"use client"

import { useEffect, useState, useRef } from "react";
import { WaitingModal } from "./WaitingModal";
import { WinnerModal } from "./WinnerModal";
import { Board } from "./Board";
import { DefeatedPawns } from "./DefeatedPawns";
import { PlayerCards } from "./PlayerCards";
import { socket } from "../lib/socketClient";
import { ToastMessage } from "./ToastMessage";
import { getCardActions, getUpdatedBoard, completeTurn, getGameWinner } from "../components/helpers/action";
import { endGame, restartGame } from "../components/helpers/lobby";
import { resolveVirtualTurn } from "./helpers/virtualOpponent";

interface GameProps {
	gameId: string;
	userId: string;
}

export const Game = ({ gameId, userId }: GameProps) => {
	const [game, setGame] = useState<Game | null>(null);
	const [board, setBoard] = useState<string[][] | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [selectedPawn, setSelectedPawn] = useState< Position | null>(null);
	const [waiting, setWaiting] = useState(true);
	const [initialTurn, setInitialTurn] = useState<boolean>(true);
	const [otherPlayersTurn, setOtherPlayersTurn] = useState(false);
	const [notifications, setNotifications] = useState<ToastNotification[]>([]);
	const [neutralCard, setNeutralCard] = useState<Card | null>(null);
	const [actions, setActions] = useState<Action[] | null>(null);
	const [winner, setWinner] = useState<string | null>(null);
	const previousTurnRef = useRef<string | null>(null);
	const userColor = ["red", "blue"].find((key) => {
		return game?.players && game?.players[key as keyof typeof game.players]?.id === userId;
	}) || "";

	// Fetch game data
	useEffect(() => {
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
			const notification: ToastNotification = {
				type: "system",
				message,
				duration: 3000,
				delay: 0,
				action: ""
			}
			fetchGame(gameId);
			setWaiting(false);
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
		});

		socket.on("user_left", (message: string) => {
			const notification: ToastNotification = {
				type: "system",
				message,
				duration: 3000,
				delay: 3000,
				action: "/"
			}
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
		});

		socket.on("board_updated", (updatedBoard: string[][]) => {
			// Trigger on selectCard, selectPawn and selectAction
			setBoard(updatedBoard)
		})

		socket.on("action_cancelled", () => {
			// Trigger on clickCancel
			if (game) {
				setBoard(game.board)
			}
		})

		socket.on("turn_completed", (gameId: string) => {
			// Trigger on clickConfirm and clickPass
			fetchGame(gameId);
			const notification = {
				type: "system",
				message: "Your opponent has completed their turn.  Please select a card.",
				duration: 0,
				delay: 0,
				action: ""
			};
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
		})

		socket.on("game_restarted", async (gameId: string, gameTurn: string) => {
			// Trigger on playAgain
			await fetchGame(gameId);
			setWinner(null);
			const message = userColor === gameTurn 
				? "The game has been restarted.  Please select a card." 
				: "The game has been restarted.  Please wait for your opponent to complete their turn.";
			const notification = {
				type: "system",
				message: message,
				duration: 0,
				delay: 0,
				action: ""
			};
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
		})

		return () => {
			socket.off("user_joined");
			socket.off("board_updated");
			socket.off("action_cancelled");
			socket.off("turn_completed");
			socket.off("game_restarted");
		}
	}, [game, gameId, userColor]);

	// Refresh game when turn changes
	useEffect(() => {
		const startGame = async (gameData: Game) => {
			setWaiting(false);
			const message = userColor === gameData.turn ? "The game has started.  Please select a card." : "The game has started.  Please wait for your opponent to complete their turn.";
			const notification = {
				type: "system",
				message: message,
				duration: 0,
				delay: 0,
				action: ""
			}
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			setInitialTurn(false)
		}
		const updateTurn = async () => {
			if(game && !winner && game.turn !== previousTurnRef.current) {
				const winner = getGameWinner(game);
				if (winner) {
					await endGame(game.id);
					setWinner(winner);
					const notification = {
						type: "system",
						message: `${winner.toUpperCase()} won the game!`,
						duration: 0,
						delay: 0,
						action: ""
					}
					return setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				}
				setSelectedCard(null);
				setBoard(game?.board);
				updateNeutralCard(game);
				if (game.turn === userColor) {
					setOtherPlayersTurn(false);
				} else {
					setOtherPlayersTurn(true);
					const updatedGame = await resolveVirtualTurn(game, userId);
					if (updatedGame) {
						setGame(updatedGame);
						setBoard(updatedGame.board);
						const allPlayerCards = [...updatedGame?.players.red.cards ?? [], ...updatedGame?.players.blue.cards ?? []];
						const allPlayerCardsIds = allPlayerCards.map((card: Card) => card.id);
						setNeutralCard(updatedGame.cards?.find((card: Card) => !allPlayerCardsIds.includes(card.id)) ?? null);
						const notification = {
							type: "system",
							message: "Your opponent has completed their turn.  Please select a card.",
							duration: 0,
							delay: 0,
							action: ""
						}
						setNotifications((prevNotifications) => [notification, ...prevNotifications]);
					}
				}
				previousTurnRef.current = game.turn;
			}
		};
		updateTurn();
		if (initialTurn && (game?.users?.length === 2)) {
			startGame(game);
		}
	}, [game, userId, userColor, winner, initialTurn]);

	const getPlayerData = (identifier: string) => {
		if (game?.players) {
			const data = {
				turn: game.turn,
				userId: userId,
				firstName: "" as string | undefined,
				color: "",
				id: "",
				cards: [] as Card[],
			}
			if ((game.players.red.id === userId && identifier === "self") || (game.players.blue.id === userId && identifier === "opponent")) {
				data.color = "red";
				data.id = game.players.red.id;
				data.cards = game.players.red.cards;
				data.firstName = game.users?.find((user) => user.id === game.players.red.id)?.first_name ?? undefined;
			} else if ((game.players.blue.id === userId && identifier === "self") || (game.players.red.id === userId && identifier === "opponent")) {
				data.color = "blue";
				data.id = game.players.blue.id;
				data.cards = game.players.blue.cards;
				data.firstName = game.users?.find((user) => user.id === game.players.blue.id)?.first_name ?? undefined;
			}
			if (!data) {
				return null;;
			}
			return data;
		};
	};

	const fetchGame = async (id: string) => {
		const response = await fetch(`/api/games/?id=${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			const notification: ToastNotification = {
				type: "error",
				message: "Game not found.  Redirecting to lobby...",
				duration: 3000,
				delay: 3000,
				action: "/"
			}
			return setNotifications((prevNotifications) => [notification, ...prevNotifications]);
		}
		const gameData: Game = await response.json();
		if (gameData) {
			setGame(gameData);
			setBoard(gameData.board);
			const allPlayerCards = [...gameData?.players.red.cards ?? [], ...gameData?.players.blue.cards ?? []];
			const allPlayerCardsIds = allPlayerCards.map((card: Card) => card.id);
			setNeutralCard(gameData.cards?.find((card: Card) => !allPlayerCardsIds.includes(card.id)) ?? null);
			setWaiting(gameData.users?.length !== 2);
		}
	};

	const selectCard = (cardId: string) => {
		if(game !== null) {
			setSelectedCard(game.cards?.find((card: Card) => card.id === cardId) ?? null);
			const invertActions = userColor === "red"
			const cardActions = getCardActions(game, cardId, userId, invertActions);
			if (cardActions?.length) {
				const updatedBoard = getUpdatedBoard(game, cardActions);
				setSelectedPawn(null);
				setActions(cardActions);
				setBoard(updatedBoard);
				const notification = {
					type: "success",
					message: "Card selected.  Please select a highlighted pawn or click a card to see other available pawns and targets.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				socket.emit("board_updated", gameId, updatedBoard);
			} else {
				const updatedBoard = JSON.parse(JSON.stringify(game.board));
				setSelectedPawn(null);
				setActions(null);
				setBoard(updatedBoard);
				const notification = {
					type: "error",
					message: "The selected card contains no valid actions. Select another card or click Pass to skip your turn and pass the selected card to your opponent.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				socket.emit("board_updated", gameId, updatedBoard);
			}
		}
	};

	const selectPawn = (origin: Position) => {
		if(game) {
			const pawnTargets = actions?.filter((action: Action) => action.origin.row === origin.row && action.origin.column === origin.column);
			if (pawnTargets?.length) {
				const updatedBoard = JSON.parse(JSON.stringify(game.board));
				updatedBoard[origin.row][origin.column] = updatedBoard[origin.row][origin.column].substring(0, 2) + "h" + updatedBoard[origin.row][origin.column].substring(3);
				pawnTargets.forEach((action: Action) => {
					updatedBoard[action.target.row][action.target.column] = updatedBoard[action.target.row][action.target.column].substring(0, 3) + "x";
				})
				setSelectedPawn(origin);
				setBoard(updatedBoard);
				const notification = {
					type: "success",
					message: "Pawn selected. Select a target or click a card to see other available pawns and targets.",
					duration: 0,
					delay: 0,
					action: ""
				};
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				socket.emit("board_updated", gameId, updatedBoard);
			} else {
				const updatedBoard = JSON.parse(JSON.stringify(game.board));
				setBoard(updatedBoard);
				setSelectedCard(null);
				setSelectedPawn(null);
				setActions(null);
				const notification = {
					type: "error",
					message: "The selected pawn has no valid actions. Select a card to see available pawns and targets.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				socket.emit("board_updated", gameId, updatedBoard);
			}
		}
	}

	const selectTarget = (target: Position) => {
		if(game && selectedPawn) {
			const updatedBoard = JSON.parse(JSON.stringify(game.board));
			updatedBoard[target.row][target.column] = updatedBoard[target.row][target.column].substring(0, 3) + "o";
			updatedBoard[selectedPawn.row][selectedPawn.column] = updatedBoard[selectedPawn.row][selectedPawn.column].substring(0, 2) + "h" + updatedBoard[selectedPawn.row][selectedPawn.column].substring(3);
			setBoard(updatedBoard);
			const notification = {
				type: "success",
				message: "Target selected. Ending your turn.",
				duration: 0,
				delay: 0,
				action: ""
			};
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			socket.emit("board_updated", gameId, updatedBoard);
			submitAction(target);
		}
	};

	const submitAction = async (target: Position) => {
		if (game && selectedCard && selectedPawn && target) {
			const updatedGame = await completeTurn(game, selectedCard, selectedPawn, target);
			if(updatedGame) {
				fetchGame(updatedGame.id)
				const notification = {
					type: "system",
					message: "Your turn has ended. Please wait for your opponent to take their turn.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			} else {
				const notification = {
					type: "error",
					message: "An error has occurred. Please try again.",
					duration: 3000,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			}
			setSelectedCard(null);
			setSelectedPawn(null);
			setActions(null);
			socket.emit("turn_completed", gameId);
		}
	}

	const updateNeutralCard = (gameData: Game) => {
		const allPlayerCards = [...gameData?.players.red.cards ?? [], ...gameData?.players.blue.cards ?? []];
		const allPlayerCardsIds = allPlayerCards.map((card: Card) => card.id);
		setNeutralCard(gameData.cards?.find((card: Card) => !allPlayerCardsIds.includes(card.id)) ?? null);
	}

	const playAgain = async () => {
		if (game) {
			const updatedGame = await restartGame(JSON.parse(JSON.stringify(game)));
			if(updatedGame) {
				setWinner(null);
				setGame(updatedGame);
				setBoard(updatedGame?.board);
				previousTurnRef.current = null;
				const message = userColor === updatedGame.turn 
				? "The game has been restarted.  Please select a card." 
				: "The game has been restarted.  Please wait for your opponent to complete their turn.";
				const notification = {
					type: "system",
					message: message,
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				socket.emit("game_restarted", gameId, updatedGame.turn);
			}
		}
	}

	const waitForYourTurn = () => {
		const notification = {
			type: "error",
			message: "Please wait for your opponent to complete their turn.",
			duration: 3000,
			delay: 0,
			action: ""
		}
		setNotifications((prevNotifications) => [notification, ...prevNotifications]);
	}

	return (
		<>
			{game && game.board &&
				<div className="game w-full flex flex-col justify-evenly items-center h-screen landscape:h-[calc(100vh-140px)] landscape:flex-wrap">
					<div className="player-top order-1 landscape:w-1/2 flex justify-center flex-grow">
						{getPlayerData("opponent") &&
							<PlayerCards 
								player={getPlayerData("opponent") ?? null} 
								neutralCard={neutralCard} 
								userColor={userColor} 
								selectCard={selectCard}
								selectedCard={selectedCard}
							/>
						}
					</div>
					<div className="flex flow-row justify-start order-2 w-full h-56 sm:h-auto landscape:w-1/2 my-2 landscape:order-last landscape:items-center">
						<div className="basis-[20%] landscape:tall:xl:basis-[10%] flex justify-center items-center h-full">
							<DefeatedPawns board={board}/>
						</div>
						<div className="basis-[60%] landscape:basis-[80%] flex justify-center items-center h-full">
							<Board 
								board={board || game.board} 
								userColor={userColor} 
								selectPawn={selectPawn} 
								selectedPawn={selectedPawn} 
								selectTarget={selectTarget}
							/>
						</div>
					</div>
					<div className="player-bottom order-3 landscape:order-2 landscape:w-1/2 flex justify-center flex-grow">
						{getPlayerData("self") && 
							<PlayerCards 
								player={getPlayerData("self") ?? null} 
								neutralCard={neutralCard} 
								userColor={userColor} 
								selectCard={selectCard} 
								selectedCard={selectedCard}
							/>
						}
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
			{game && !waiting && otherPlayersTurn &&
				<div onClick={waitForYourTurn} className="absolute top-0 left-0 right-0 bottom-0">
				</div>
			}
			{game && winner &&
				<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
					<WinnerModal userColor={userColor} winner={winner} playAgain={playAgain} />
				</div>
			}
			<ToastMessage notifications={notifications} />
		</>
	)
}

