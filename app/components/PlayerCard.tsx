

export const PlayerCard = ({ card, player }: { card: Card, player: string }) => {
	const renderMoves = () => {
		const moves = [...Array(25).keys()].map((index) => {
			let highlighted = "";
			if (card.moves.includes(index + 1)) {
				highlighted = "highlighted-move";
			} else if (index + 1 === 13) {
				highlighted = "highlighted-center";
			}
			return (
				<div className={`space aspect-square bg-neutral-300 ${highlighted}`} key={index} id={`move-space-${index + 1}`}>
				</div>
			)
		})

		return moves;
	}

	const rotateCard = player === "opponent" ? "rotate-180" : "";

	return (
		<div className="card player-card flex justify-between h-full rounded-sm border border-neutral-400 bg-gray-700 aspect-video">
			{ card.id 
				?
				<>
					<div className="flex flex-col justify-center items-center w-full bg-neutral-300 text-slate-700 min-w-12">
						<div>
							{card.kanji}
						</div>
						<div className="text-2xs font-reggae">
							{card.title}
						</div>
					</div>
					<div className={`${rotateCard} grid grid-cols-5 gap-[1px] grid-rows-5 h-full border border-gray-500 aspect-square bg-gray-700`}>
						{card.id && renderMoves()}
					</div>
				</>
				:
				<div className="flex justify-center items-center bg-gray-500 text-slate-700">
					<div className="h-full min-w-12"></div>
					<div className="h-full aspect-square"></div>
				</div>
			}
		</div>
	);
}