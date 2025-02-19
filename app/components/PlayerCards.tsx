interface Player {
	color: string;
	id: string;
	cards: string[];
}

export const PlayerCards = ({player}: {player: Player}) => {
	const playerKanji = player.color === "red" ? "赤" : "青";
	const playerColor = player.color === "red" ? "bg-red-900" : "bg-blue-900";
	return (
		<div className="player w-full h-full flex justify-between">
			<div className={`${playerColor} player-color w-6 h-10 border rounded-xl border-neutral-400 flex justify-center items-center text-lg text-gray-300 ml-1 mr-3`}>
				{playerKanji}
			</div>
			<div className="w-full flex justify-between px-2">
				<div className="card neutral-card w-3/12 rounded-sm border border-neutral-400"></div>
				<div className="card player-card w-3/12 rounded-sm border border-neutral-400 bg-gray-300 dark:bg-gray-600"></div>
				<div className="card player-card w-3/12 rounded-sm border border-neutral-400 bg-gray-300 dark:bg-gray-600"></div>
			</div>
		</div>
	);
}