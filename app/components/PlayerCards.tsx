import { PlayerCard } from "./PlayerCard";

interface Player {
	color: string;
	turn: string;
	userId: string;
	firstName: string | null;
	id: string;
	cards: Card[];
}

export const PlayerCards = ({player, neutralCard}: {player: Player | null, neutralCard: Card | null}) => {
	const playerKanji = player?.color === "red" ? "赤" : "青";
	const playerColor = player?.color === "red" ? "bg-red-900" : "bg-blue-900";
	const renderNeutralCard = player?.color === player?.turn;
	const playerIdentifier = player?.id === player?.userId ? "self" : "opponent";
	const playerFlex = playerIdentifier === "self" ? "short:flex-col-reverse" : "short:flex-col";
	const neutralCardPlaceholder = {
		id: "",
		title: "",
		kanji: "",
		moves: [],
		color: "",
		createdAt: new Date(),
		updatedAt: new Date()
	}

	return (
		<div className={`${playerFlex} player w-full h-full flex justify-between`}>
			<div className={`${playerColor} player-color w-full h-6 border rounded-xl border-neutral-400 items-center text-gray-300 hidden short:flex short:my-2 short:mx-1 xs:flex`}>
				<div className="flex flex-col items-center text-xs w-1/12">
					{playerKanji}
				</div>
				<div className="text-center w-4/5">
					{player?.firstName}
				</div>
			</div>
			<div className="w-full flex justify-between h-10">
				<div className="opacity-50 h-full">
					{ renderNeutralCard
						? <PlayerCard card={neutralCard!} player={playerIdentifier} />
						: <PlayerCard card={neutralCardPlaceholder!} player={playerIdentifier} />
					}
				</div>
				{ player &&
					<>
						<PlayerCard card={player.cards[0]!} player={playerIdentifier}/>
						<PlayerCard card={player.cards[1]!} player={playerIdentifier}/>
					</>
				}
			</div>
		</div>
	);
}