import { PlayerCard } from "../PlayerCard";

interface Player {
	color: string;
	turn: string;
	userId: string;
	firstName: string | undefined;
	id: string;
	cards: Card[];
}

interface GuidePlayerCardsProps {
	player: Player | null;
	neutralCard: Card | null;
	userColor: string;
	selectCard: (cardId: string) => void;
	selectedCard: Card | null;
	stage: number;
	page: number;
}

export const GuidePlayerCards = ({ player, neutralCard, userColor, selectCard, selectedCard, stage, page }: GuidePlayerCardsProps) => {
	const playerKanji = player?.color === "red" ? "赤" : "青";
	const playerCardsColor = player?.color === "red" ? "bg-red-900" : "bg-blue-900";
	const renderNeutralCard = player?.color === player?.turn;
	const playerIdentifier = player?.id === player?.userId ? "self" : "opponent";
	const playerFlex = playerIdentifier === "self" ? "flex-col-reverse" : "flex-col";
	const clickable = (renderNeutralCard && playerIdentifier === "self") ? true : false;
	const usersTurn = userColor === player?.turn;
	const neutralCardPlaceholder = {
		id: "",
		title: "",
		kanji: "",
		moves: [],
		color: "",
		createdAt: new Date(),
		updatedAt: new Date()
	}

	const getPlayerTurnClass = () => {
		if (usersTurn && playerIdentifier === "self") {
			return userColor === "red" ? "bg-red-500 text-amber-200 !shadow-amber-300 !shadow-md border-black [text-shadow:_1px_1px_2px_black]" : "bg-blue-500 text-amber-200 !shadow-amber-300 !shadow-md border-black [text-shadow:_1px_1px_2px_black]";
		} else if (!usersTurn && playerIdentifier === "opponent") {
			return userColor === "red" ? "bg-blue-500 text-amber-200 !shadow-amber-300 !shadow-md border-black [text-shadow:_1px_1px_2px_black]" : "bg-red-500 text-amber-200 !shadow-amber-300 !shadow-md border-black [text-shadow:_1px_1px_2px_black]";
		} else {
			return "";
		}
	}

	const playerTurnClass = getPlayerTurnClass();

	const blurPlayerCards = () => {
		if (page === 3 && stage === 7 && playerIdentifier === "self") {
			return "";
		} else if (page === 4 && stage === 1 && playerIdentifier === "self") {
			return "";
		} else if (page === 3 && stage === 8 && playerIdentifier === "opponent") {
			return "";
		} else {
			return "guide";
		}
	};

	const focusSecondCard = () => {
		if (page === 4 && stage > 1 && stage < 6 && playerIdentifier === "self") {
			return "!blur-none !brightness-100";
		}
	};

	return (
		<div className={`${playerFlex} player w-full flex justify-evenly items-center`}>
			<div className={`${playerCardsColor} ${playerTurnClass} guide player-color flex w-1/2 text-xs xs:text-sm sm:text-base md:text-lg landscape:text-sm border rounded-xl border-neutral-400 items-center text-gray-300`}>
				<div className="flex flex-col items-center w-1/6">
					{playerKanji}
				</div>
				<div className="text-center w-4/6">
					{player?.firstName}
				</div>
				<div className="flex flex-col items-center w-1/6">
					{playerKanji}
				</div>
			</div>
			<div className={`
				${playerIdentifier === "self" ? "landscape:flex-wrap-reverse tall:flex-wrap" : "landscape:flex-wrap tall:flex-wrap-reverse"} 
				w-full flex justify-around my-2 gap-2 landscape:flex-wrap tall:flex-wrap`}>
				<div className={`${playerIdentifier === "self" ? "landscape:order-2" : "landscape:order-last"} ${!(page === 3 && stage === 9) && "guide"} opacity-50 landscape:basis-0 landscape:xshort:basis-full landscape:sm:basis-0 landscape:md:xshort:basis-0 landscape:lg:xshort:basis-full landscape:lg:basis-full tall:sm:basis-0 2xtall:basis-full [&>*:first-child]:mx-auto [&>*:first-child]:tall:sm:my-0 [&>*:first-child]:landscape:xshort:my-4  [[&>*:first-child]:landscape:md:xshort:my-0 [[&>*:first-child]:landscape:lg:my-4 [&>*:first-child]:2xtall:my-4`}>
					{ renderNeutralCard
						? <PlayerCard 
							card={neutralCard!} 
							player={playerIdentifier} 
							clickable={false} 
							cardClass="neutral-card" 
							selectCard={selectCard}
							selectedCard={selectedCard}
						/>
						: <PlayerCard 
							card={neutralCardPlaceholder!} 
							player={playerIdentifier} 
							clickable={false} 
							cardClass="placeholder-card" 
							selectCard={selectCard}
							selectedCard={selectedCard}
						/>
					}
				</div>
				{ player &&
					<>
						<div className={`${blurPlayerCards()} `}>
							<PlayerCard 
								card={player.cards[0]!} 
								player={playerIdentifier} 
								clickable={clickable} 
								cardClass={`${playerIdentifier}-card ${playerTurnClass}`} 
								selectCard={selectCard}
								selectedCard={selectedCard}
							/>
						</div>
					<div className={`${blurPlayerCards()} ${focusSecondCard()}`}>
							<PlayerCard 
								card={player.cards[1]!} 
								player={playerIdentifier} 
								clickable={clickable} 
								cardClass={`${playerIdentifier}-card ${playerTurnClass}`} 
								selectCard={selectCard}
								selectedCard={selectedCard}
							/>
						</div>
					</>
				}
			</div>
		</div>
	);
}