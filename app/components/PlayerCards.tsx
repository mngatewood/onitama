import { PlayerCard } from "./PlayerCard";

interface Player {
	color: string;
	id: string;
	cards: Card[];
}

export const PlayerCards = ({player, neutralCard}: {player: Player, neutralCard: Card | null}) => {
	const playerKanji = player.color === "red" ? "赤" : "青";
	const playerColor = player.color === "red" ? "bg-red-900" : "bg-blue-900";

	// TODO: this will only work for setup; need to track turn order in Game object
	const renderNeutralCard = player.color === neutralCard?.color;
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
						? <PlayerCard card={neutralCard!} player="self" />
						: <PlayerCard card={neutralCardPlaceholder!} player="opponent" />
					}
				</div>
				<PlayerCard card={player.cards[0]!} player={renderNeutralCard ? "self" : "opponent"}/>
				<PlayerCard card={player.cards[1]!} player={renderNeutralCard ? "self" : "opponent"}/>
			</div>
		</div>
	);
}