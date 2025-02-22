

export const Board = ({ board, playerColor }: { board: string[][], playerColor: string }) => {

	const renderBoard = () => {
		const flatBoard = playerColor === "red" ? board.flat().reverse() : board.flat();
		return flatBoard.map((space: string, index: number) => {
			let color, pawn, highlighted;
			const colorCode = space[0];
			const pawnCode = space[1];
			const highlightedCode = space[2];

			switch (colorCode) {
				case "r":
					color = "red";
					break
				case "b":
					color = "blue";
					break
				default:
					color = "";
			}

			switch (pawnCode) {
				case "s":
					pawn = "student";
					break
				case "m":
					pawn = "master";
					break
				default:
					pawn = "";
			}

			switch (highlightedCode) {
				case "0":
					highlighted = "not-highlighted";
					break
				case "1":
					highlighted = "highlighted";
					break
				default:
					highlighted = "not-highlighted";
			} 

			return (
				<div className={`space aspect-square border border-slate-600 ${color} ${pawn} ${highlighted}`} key={index} id={`space-${index + 1}`}>
				</div>
			)

		})
	}

	return (
		<div id="board" className="grid grid-cols-5 grid-rows-5 aspect-square my-2 outline outline-2 outline-offset-1 outline-slate-600 dark:outline-slate-400">
			{renderBoard()}
		</div>
	)
}