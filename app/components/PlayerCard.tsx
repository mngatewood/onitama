

export const PlayerCard = ({ card, player, clickable }: { card: Card, player: string, clickable: boolean }) => {
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
	const color = card.color === "red" ? "bg-red-300" : "bg-blue-300";
	const pointer = clickable ? "cursor-pointer" : "cursor-not-allowed";

	return (
		<div className={`${pointer} ${card.id && "hover:scale-125"} card player-card flex justify-between h-[15vw] landscape:h-[5vw] landscape:my-2 landscape:md:h-[7vw] landscape:lg:h-[10vw] max-h-[13vh] landscape:xl:h-[8vw] xtall:max-w-screen-xs:h-[20vw] tall:md:h-[10vw] rounded-sm border border-neutral-400 shadow-md shadow-slate-500 bg-gray-700 aspect-video transition-all transition-duration-300 first:basis-full`}>
			{ card.id 
				?
				<>
					<div className={`${color} flex flex-col justify-center items-center w-full text-slate-700 min-w-12 text-shadow-xs`}>
						<div className="text-lg xs:text-2xl sm:text-3xl md:text-4xl landscape:hidden landscape:md:block landscape:md:text-xl landscape:lg:text-2xl landscape:xl:text-3xl">
							{card.kanji}
						</div>
						<div className="text-2xs xs:text-sm sm:text-base md:text-lg font-reggae landscape:text-2xs landscape:md:text-xs">
							{card.title}
						</div>
					</div>
					<div className={`${rotateCard} grid grid-cols-5 gap-[1px] grid-rows-5 h-full border border-gray-500 aspect-square bg-gray-700`}>
						{card.id && renderMoves()}
					</div>
				</>
				:
				<div className="flex justify-center items-center bg-gray-500 text-slate-700 w-full">
					{/* Empty neutral card placeholder */}
				</div>
			}
		</div>
	);
}