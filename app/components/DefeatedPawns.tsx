
export const DefeatedPawns = () => {
	return (
		<div id="defeated-pawns" className="flex flex-col space-between items-center m-2 h-full landscape:h-5/6">
			<div className="w-[6vw] landscape:w-[1.5vw] landscape:md:short:w-[3vw] portrait:xtall:md:w-[4vw] flex flex-col justify-evenly h-full landscape:pb-2 pb-4">
				<div className="defeated sil defeated-pawn aspect-square"></div>
				<div className="defeated sil defeated-pawn aspect-square"></div>
				<div className="defeated sil defeated-pawn aspect-square"></div>
				<div className="defeated sil defeated-pawn aspect-square"></div>
			</div>
			<div className="w-[6vw] landscape:w-[1.5vw] landscape:md:short:w-[3vw] portrait:xtall:md:w-[4vw] flex flex-col justify-evenly h-full landscape:pt-2 pt-4">
				<div className="defeated sil defeated-pawn aspect-square"></div>
				<div className="defeated sil defeated-pawn aspect-square"></div>
				<div className="defeated sil defeated-pawn aspect-square"></div>
				<div className="defeated sil defeated-pawn aspect-square"></div>
			</div>
		</div>
	);
}