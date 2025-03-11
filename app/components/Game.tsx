"use client"

import { useEffect, useState, useRef } from "react";
import { WaitingModal } from "./WaitingModal";
import { Board } from "./Board";
import { DefeatedPawns } from "./DefeatedPawns";
import { PlayerCards } from "./PlayerCards";
import { socket } from "../lib/socketClient";
import { ToastMessage } from "./ToastMessage";
import { getCardActions, getUpdatedBoard, passTurn, completeTurn } from "../components/helpers/action";
import { PassButton } from "./PassButton";
import { ConfirmButton } from "./ConfirmButton";
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
	const [selectedTarget, setSelectedTarget] = useState< Position | null>(null);
	const [waiting, setWaiting] = useState(true);
	const [otherPlayersTurn, setOtherPlayersTurn] = useState(false);
	const [notifications, setNotifications] = useState<ToastNotification[]>([]);
	const [renderPassButton, setRenderPassButton] = useState(false);
	const [renderConfirmButton, setRenderConfirmButton] = useState(false);
	const [neutralCard, setNeutralCard] = useState<Card | null>(null);
	const [actions, setActions] = useState<Action[] | null>(null);
	const previousTurnRef = useRef<string | null>(null);
	const userColor = ["red", "blue"].find((key) => {
		return game?.players && game?.players[key as keyof typeof game.players]?.id === userId;
	}) || "";

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
			if((game.players.red.id === userId && identifier === "self") || (game.players.blue.id === userId && identifier === "opponent")) {
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
		if(gameData) {
			setGame(gameData);
			setBoard(gameData.board);
			const allPlayerCards = [...gameData?.players.red.cards ?? [], ...gameData?.players.blue.cards ?? []];
			const allPlayerCardsIds = allPlayerCards.map((card: Card) => card.id);
			setNeutralCard(gameData.cards?.find((card: Card) => !allPlayerCardsIds.includes(card.id)) ?? null);
			if (gameData.users?.length === 2) {
				setWaiting(false);
			} else {
				setWaiting(true);
			}
		}
	};

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

		return () => {
			socket.off("user_joined");
		}
	}, [gameId]);

	// Refresh game when turn changes
	useEffect(() => {
		const updateTurn = async () => {
			if(game && game.turn !== previousTurnRef.current) {
				setSelectedCard(null);
				setBoard(game?.board);
				setRenderPassButton(false);
				updateNeutralCard(game);
				if (game.turn === userColor) {
					setOtherPlayersTurn(false);
				} else {
					setOtherPlayersTurn(true);
					const updatedGame = await resolveVirtualTurn(game, userId);
					if (updatedGame) {
						console.log("game was updated in Game!", updatedGame)
						setGame(updatedGame);
						setBoard(updatedGame.board);
						const allPlayerCards = [...updatedGame?.players.red.cards ?? [], ...updatedGame?.players.blue.cards ?? []];
						const allPlayerCardsIds = allPlayerCards.map((card: Card) => card.id);
						setNeutralCard(updatedGame.cards?.find((card: Card) => !allPlayerCardsIds.includes(card.id)) ?? null);
						const notification = {
							type: "success",
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
	}, [game, userId, userColor]);

	const selectCard = (cardId: string) => {
		if(game !== null) {
			setSelectedCard(game.cards?.find((card: Card) => card.id === cardId) ?? null);
			const cardActions = getCardActions(game, cardId, userId);
			if (cardActions?.length) {
				const updatedBoard = getUpdatedBoard(game, cardActions);
				setSelectedPawn(null);
				setSelectedTarget(null);
				setActions(cardActions);
				setBoard(updatedBoard);
				setRenderPassButton(false);
				const notification = {
					type: "success",
					message: "Card selected.  Please select a highlighted pawn or click a card to see other available pawns and targets.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			} else {
				const updatedBoard = JSON.parse(JSON.stringify(game.board));
				setSelectedPawn(null);
				setSelectedTarget(null);
				setActions(null);
				setBoard(updatedBoard);
				setRenderPassButton(true);
				const notification = {
					type: "error",
					message: "The selected card contains no valid actions. Select another card or click Pass to skip your turn and pass the selected card to your opponent.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			}
			// socket.emit("update_board", gameId, board);
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
			} else {
				const updatedBoard = JSON.parse(JSON.stringify(game.board));
				setBoard(updatedBoard);
				setSelectedCard(null);
				setSelectedPawn(null);
				setSelectedTarget(null);
				setActions(null);
				setRenderPassButton(true);
				const notification = {
					type: "error",
					message: "The selected pawn has no valid actions. Select a card to see available pawns and targets.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			}
		}
	}

	const selectTarget = (target: Position) => {
		if(game && selectedPawn) {
			const updatedBoard = JSON.parse(JSON.stringify(game.board));
			updatedBoard[target.row][target.column] = updatedBoard[target.row][target.column].substring(0, 3) + "o";
			updatedBoard[selectedPawn.row][selectedPawn.column] = updatedBoard[selectedPawn.row][selectedPawn.column].substring(0, 2) + "h" + updatedBoard[selectedPawn.row][selectedPawn.column].substring(3);
			setBoard(updatedBoard);
			setSelectedTarget(target);
			const notification = {
				type: "success",
				message: "Target selected. Click Confirm to end your turn or Cancel to reset the board.",
				duration: 0,
				delay: 0,
				action: ""
			};
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			setRenderConfirmButton(true);
			// socket.emit("update_board", gameId, board);
		}
	};

	const clickPass = async () => {
		console.log("clicked pass");
		console.log(game, selectedCard);
		if(game !== null) {
			const nextTurn = game.turn === "red" ? "blue" : "red";
			if (selectedCard) {
				const updateGame = await passTurn(gameId, nextTurn, selectedCard?.id, neutralCard?.id ?? '');
				if(updateGame) {
					console.log("updateGame", updateGame);
				}
				setGame(updateGame);
				setSelectedCard(null);
				setSelectedPawn(null);
				setSelectedTarget(null);
				setActions(null);
				const notification = {
						type: "system",
						message: "Your turn has ended. Please wait for your opponent to take their turn.",
						duration: 0,
						delay: 0,
						action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				setRenderPassButton(false);
				// socket.emit("update_board", gameId, board);
			}
		}
	}

	const clickConfirm = async () => {
		setRenderConfirmButton(false);
		if (game && selectedCard && selectedPawn && selectedTarget) {
			const updatedGame = await completeTurn(game, selectedCard, selectedPawn, selectedTarget);
			if(updatedGame) {
				fetchGame(updatedGame.id)
				const notification = {
					type: "success",
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
			setSelectedTarget(null);
			setActions(null);
			// socket.emit("update_game", gameId, game);
		}
	}

	const clickCancel = async () => {
		setRenderConfirmButton(false);
		if (game) {
			const updatedBoard = JSON.parse(JSON.stringify(game.board));
			setBoard(updatedBoard);
			setSelectedCard(null);
			setSelectedPawn(null);
			setSelectedTarget(null);
			setActions(null);
			const notification = {
				type: "success",
				message: "The board has been reset.  Please select a card.",
				duration: 0,
				delay: 0,
				action: ""
			}
			setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			// socket.emit("update_board", gameId, board);
		}
	}

	const updateNeutralCard = (gameData: Game) => {
		const allPlayerCards = [...gameData?.players.red.cards ?? [], ...gameData?.players.blue.cards ?? []];
		const allPlayerCardsIds = allPlayerCards.map((card: Card) => card.id);
		setNeutralCard(gameData.cards?.find((card: Card) => !allPlayerCardsIds.includes(card.id)) ?? null);
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
						<div className="absolute top-1/2 left-1/2 landscape:left-1/4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300">
							<div className={`${renderPassButton ? "visible opacity-100" : "invisible opacity-0"} absolute top-1/2 left-1/2 landscape:left-1/4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}>
								<PassButton clickPass={clickPass} />
							</div>
							<div className={`${renderConfirmButton ? "visible opacity-100" : "invisible opacity-0"} absolute top-1/2 left-1/2 landscape:left-1/4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}>
								<ConfirmButton clickConfirm={clickConfirm} clickCancel={clickCancel} />
							</div>
						</div>
						<div className={`${renderConfirmButton ? "visible opacity-100" : "invisible opacity-0"} absolute top-1/2 left-1/2 landscape:left-1/4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}>
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
			{game && otherPlayersTurn &&
				<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
					<WaitingModal text="Waiting for your opponent to complete their turn..." />
				</div>
			}
			<ToastMessage notifications={notifications} />
		</>
	)
}

