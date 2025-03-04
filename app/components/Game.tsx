"use client"

import { useEffect, useState, useRef } from "react";
import { WaitingModal } from "./WaitingModal";
import { Board } from "./Board";
import { DefeatedPawns } from "./DefeatedPawns";
import { PlayerCards } from "./PlayerCards";
import { socket } from "../lib/socketClient";
import { ToastMessage } from "./ToastMessage";
import { getCardActions, getUpdatedBoard, passTurn } from "../components/helpers/action";
import { PassButton } from "./PassButton";

interface GameProps {
	gameId: string;
	userId: string;
}

export const Game = ({ gameId, userId }: GameProps) => {
	const [game, setGame] = useState<Game | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [board, setBoard] = useState<string[][] | null>(null);
	const [waiting, setWaiting] = useState(true);
	const [notifications, setNotifications] = useState<ToastNotification[]>([]);
	const [renderPassButton, setRenderPassButton] = useState(false);
	const [neutralCard, setNeutralCard] = useState<Card | null>(null);
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
		if(game && game.turn !== previousTurnRef.current) {
			setSelectedCard(null);
			setBoard(game?.board);
			setRenderPassButton(false);
			updateNeutralCard(game);
			previousTurnRef.current = game.turn;
		}
	}, [game]);

	const selectCard = (cardId: string) => {
		if(game !== null) {
			setSelectedCard(game.cards?.find((card: Card) => card.id === cardId) ?? null);
			const cardActions = getCardActions(game, cardId, userId);
			if (cardActions?.length) {
				const updatedBoard = getUpdatedBoard(game, cardActions);
				setBoard(updatedBoard);
				setRenderPassButton(false);
				const notification = {
					type: "system",
					message: "Action card selected.  Next, select a highlighted pawn.",
					duration: 0,
					delay: 0,
					action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			} else {
				const updatedBoard = JSON.parse(JSON.stringify(game.board));
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
			// socket.emit("select_card", gameId, cardId);
		}
	};

	const clickPass = async () => {
		if(game !== null) {
			const nextTurn = game.turn === "red" ? "blue" : "red";
			if (selectedCard) {
				const updateGame = await passTurn(gameId, nextTurn, selectedCard?.id, neutralCard?.id ?? '');
				setGame(updateGame);
				const notification = {
						type: "system",
						message: "Your turn has ended. Please wait for your opponent to take their turn.",
						duration: 0,
						delay: 0,
						action: ""
				}
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
				setRenderPassButton(false);
				// socket.emit("pass", gameId);
			}
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
						{getPlayerData("opponent") && <PlayerCards player={getPlayerData("opponent") ?? null} neutralCard={neutralCard} userColor={userColor} selectCard={selectCard} />}
					</div>
					<div className="flex flow-row justify-start order-2 w-full h-56 sm:h-auto landscape:w-1/2 my-2 landscape:order-last landscape:items-center">
						<div className="basis-[20%] landscape:tall:xl:basis-[10%] flex justify-center items-center h-full">
							<DefeatedPawns />
						</div>
						<div className="basis-[60%] landscape:basis-[80%] flex justify-center items-center h-full">
							<Board board={board || game.board} userColor={userColor} />
						</div>
						<div className={`renderPassButton ${renderPassButton ? "visible opacity-100" : "invisible opacity-0"} absolute top-1/2 left-1/2 landscape:left-1/4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}>
							<PassButton clickPass={clickPass} />
						</div>
					</div>
					<div className="player-bottom order-3 landscape:order-2 landscape:w-1/2 flex justify-center flex-grow">
						{getPlayerData("self") && <PlayerCards player={getPlayerData("self") ?? null} neutralCard={neutralCard} userColor={userColor} selectCard={selectCard} />}
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

