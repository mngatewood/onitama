import { PlayerCard } from "./PlayerCard";

interface Player {
	color: string;
	turn: string;
	userId: string;
	id: string;
	cards: Card[];
}

export const PlayerCards = ({player, neutralCard}: {player: Player, neutralCard: Card | null}) => {
	const playerKanji = player.color === "red" ? "赤" : "青";
	const playerColor = player.color === "red" ? "bg-red-900" : "bg-blue-900";
	const renderNeutralCard = player.color === player.turn;
	const playerIdentifier = player.id === player.userId ? "self" : "opponent";
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
		<div className="player w-full h-full flex justify-between">
			<div className={`${playerColor} player-color w-6 h-10 border rounded-xl border-neutral-400 justify-center items-center text-lg text-gray-300 ml-1 mr-3 hidden xs:flex`}>
				{playerKanji}
			</div>
			<div className="w-full flex justify-between h-10">
				<div className="opacity-50 h-full">
					{ renderNeutralCard
						? <PlayerCard card={neutralCard!} player={playerIdentifier} />
						: <PlayerCard card={neutralCardPlaceholder!} player={playerIdentifier} />
					}
				</div>
				<PlayerCard card={player.cards[0]!} player={playerIdentifier}/>
				<PlayerCard card={player.cards[1]!} player={playerIdentifier}/>
			</div>
		</div>
	);
}