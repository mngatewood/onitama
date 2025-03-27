"use client"

import { useState, useEffect } from "react";
import { Board } from "../Board";
import { DefeatedPawns } from "../DefeatedPawns";
import { allCards, game } from "../guide/guideData";
import { GuideModal } from "./GuideModal";
import { GuideTooltip } from "./GuideTooltip";
import { GuideDarkModeToggle } from "./GuideDarkThemeToggle";
import { GuidePlayerCards } from "./GuidePlayerCards";
import { NotificationsToggle } from "../NotificationsToggle";
import * as data from "../guide/guideData";

interface GuideGameProps {
	modal: {
		position: {
			x: number;
			y: number;
		};
		moveable: boolean;
		headline: string;
		body: string;
	};
	tooltip: {
		elementId: string;
		child: number[];
		position: {
			top: number | null;
			right: number | null;
			bottom: number | null;
			left: number | null;
		};
		text: string;
		arrowPosition: {
			x: string;
			y: string;
		};
	};
	stage: number;
	page: number;
	updateStage: (newStage: number) => void;
}

export const GuideGame = ({ modal, tooltip, stage, page, updateStage }: GuideGameProps) => {

	const [board, setBoard] = useState<string[][]>(game.board);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	const userId = "1";
	const neutralCard = allCards[0];
	const selectedPawn = null;

	const userColor = ["red", "blue"].find((key) => {
		return game?.players && game?.players[key as keyof typeof game.players]?.id === userId;
	}) || "";

	useEffect(() => {
		// get updated board, if applicable
		if (page === 4 && stage > 1) {
			setBoard(data.pageFourStageTwoBoard)
		} else if (page === 5 && stage === 1) {
			setBoard(data.pageFourStageTwoBoard)
		} else if (page === 5 && [2, 3].includes(stage)) {
			setBoard(data.pageFiveStageTwoBoard)
		} else if (page === 5 && [4, 5].includes(stage)) {
			setBoard(data.pageFiveStageThreeBoard)
		} else if (page === 5 && stage > 5) {
			setBoard(data.pageFiveStageSixBoard)
		} else if (page === 6 && stage === 1) {
			setBoard(data.pageFiveStageTwoBoard)
		} else (
			setBoard(game?.board)
		)

		// get selected card, if applicable
		if (page === 4 && stage > 1) {
			setSelectedCard(game.cards[4])
		} else if (page === 5 && stage < 4) {
			setSelectedCard(game.cards[4])
		} else if (page === 5 && [4, 5].includes(stage)) {
			setSelectedCard(game.cards[2])
		} else if (page === 5 && stage > 5) {
			setSelectedCard(game.cards[4])
		}
	}, [page, stage])
	
	const blurBoard = () => {
		if (page === 3 && [4, 5].includes(stage)) {
			return "";
		} else if (page === 4 && stage > 5) {
			return "";
		} else if (page === 5) {
			return "";
		} else {
			return "guide";
		}
	};

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

	const selectCard = (cardId: string) => {
		return cardId;
	};

	const selectPawn = (origin: Position) => {
		return origin;
	}

	const selectTarget = (target: Position) => {
		return target;
	};

	const toggleNotifications = () => {
		return;
	};

	return (
		<>
			{game && game.board &&
				<div className="game w-full flex flex-col justify-evenly items-center h-screen landscape:h-[calc(100vh-140px)] landscape:flex-wrap">
					<div id="opponent-cards"className="player-top order-1 landscape:w-1/2 flex justify-center flex-grow">
						{getPlayerData("opponent") &&
							<GuidePlayerCards 
								player={getPlayerData("opponent") ?? null} 
								neutralCard={neutralCard} 
								userColor={userColor} 
								selectCard={selectCard}
								selectedCard={selectedCard}
								stage={stage}
								page={page}
							/>
						}
					</div>
					<div className="flex flow-row justify-start order-2 w-full h-56 sm:h-auto landscape:w-1/2 my-2 landscape:order-last landscape:items-center">
						<div className={`${stage !== 6 && "guide"} basis-[20%] landscape:tall:xl:basis-[10%] flex justify-center items-center h-full`}>
							<DefeatedPawns board={game.board}/>
						</div>
						<div id="data-board" className={`${blurBoard()} basis-[60%] landscape:basis-[80%] flex justify-center items-center h-full`}>
							<Board 
								board={board} 
								userColor={userColor} 
								selectPawn={selectPawn} 
								selectedPawn={selectedPawn} 
								selectTarget={selectTarget}
							/>
						</div>
					</div>
					<div id="player-cards" className="player-bottom order-3 landscape:order-2 landscape:w-1/2 flex justify-center flex-grow">
						{getPlayerData("self") && 
							<GuidePlayerCards 
								player={getPlayerData("self") ?? null} 
								neutralCard={neutralCard} 
								userColor={userColor} 
								selectCard={selectCard} 
								selectedCard={selectedCard}
								stage={stage}
								page={page}
							/>
						}
					</div>
					{page === 3 && stage === 1 &&
						<div id="toast" className="absolute top-2 -left-0 -translate-x-1 mr-4 transition-all duration-[600ms] flex flex-col justify-center items-start z-50">
							<div className="bg-blue-900 flex justify-between items-start opacity-90 w-full shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-r-2xl p-4">
								<p className="mx-4 text-white font-bold">{data.pageThreeStageOneNotification.message}</p>
								<div className="h-6 aspect-square text-[0.8rem] bg-white rounded-full flex justify-center items-center cursor-pointer">
									❌
								</div>
							</div>
						</div>
					}
					<GuideDarkModeToggle />
					<NotificationsToggle enabled={true} toggleNotifications={toggleNotifications}/>
				</div>
			}
			{/* <div className={`${game ? "hidden" : "flex"} absolute top-0 left-0 right-0 bottom-0 items-center`}>
				<WaitingModal text="Loading game..." isVisible={!game}/>
			</div>
			<div className={`${waiting ? "flex" : "hidden"} absolute top-0 left-0 right-0 bottom-0 items-center`}>
				<WaitingModal text="Waiting for another player to join..." isVisible={!!waiting} />
			</div>
			{game && !waiting && otherPlayersTurn &&
				<div onClick={waitForYourTurn} className="absolute top-0 left-0 right-0 bottom-0">
				</div>
			}
			<div className={`${winner ? "flex" : "hidden"} absolute top-0 left-0 right-0 bottom-0 items-center`}>
				<WinnerModal userColor={userColor} winner={winner ?? ""} playAgain={playAgain} isVisible={!!winner}/>
			</div>
			<NotificationsToggle enabled={notificationsEnabled} toggleNotifications={toggleNotifications} /> */}
			<GuideModal modal={modal} stage={stage} updateStage={updateStage}/>
			<GuideTooltip tooltip={tooltip} />
		</>
	)
}

