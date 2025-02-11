interface Player {
	id: string;
	cards: string[];
}

export const PlayerCards = ({player}: {player: Player}) => {
	console.log(player);
	return (
		<div className="player w-full h-full flex justify-between">
			<div className="player-color w-1/12 flex justify-center items-center text-2xl mr-2 text-blue-900">赤</div>
			<div className="w-full flex justify-between px-2">
				<div className="card neutral-card w-3/12 rounded-sm border border-neutral-400"></div>
				<div className="card player-card w-3/12 rounded-sm border border-neutral-400 bg-gray-300 dark:bg-gray-600"></div>
				<div className="card player-card w-3/12 rounded-sm border border-neutral-400 bg-gray-300 dark:bg-gray-600"></div>
			</div>
		</div>
	);
}