"use client";

import { useMemo } from "react";

interface BoardProps {
	board: string[][];
	userColor: string;
	selectPawn: (origin: { row: number, column: number }) => void
}

export const Board = ({ board, userColor, selectPawn }: BoardProps ) => {

	const renderedBoard = useMemo(() => {
		const flatBoard = userColor === "red" ? board.flat().reverse() : board.flat();
		return flatBoard.map((space: string, index: number) => {
			let color, pawn, highlighted, targeted;
			const colorCode = space[0];
			const pawnCode = space[1];
			const highlightedCode = space[2];
			const targetedCode = space[3];

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
				case "h":
					highlighted = "highlighted";
					break
				default:
					highlighted = "not-highlighted";
			}

			switch (targetedCode) {
				case "0":
					targeted = "";
					break
				case "x":
					targeted = "targeted";
					break
				default:
					targeted = "";
			}

			const selectSpace = (e: React.MouseEvent) => {
				e.preventDefault();
				if (e.currentTarget.classList.contains("highlighted")) {
					const index = parseInt(e.currentTarget.id.split("-")[1])-1;
					const spaceData = flatBoard[index];
					if (spaceData[1] === "s" || spaceData[1] === "m") {
						const origin = {
							row: Math.floor(index / 5),
							column: index % 5
						}
						return selectPawn(origin);
					}
				}
				console.log("not a valid space");
			};

			return (
				<div onClick={selectSpace} className={`space aspect-square border border-slate-600 ${color} ${pawn} ${highlighted} ${targeted}`} key={index} id={`space-${index + 1}`}>
				</div>
			)

		})
	}, [board, userColor, selectPawn]);

		return (
		<div id="board" className="grid grid-cols-5 grid-rows-5 aspect-square outline outline-2 outline-offset-1 outline-slate-600 dark:outline-slate-400 h-full landscape:h-40 landscape:xshort:h-48 landscape:short:h-72 landscape:md:short:h-80 landscape:lg:short:h-96 landscape:tall:xl:h-[36rem]">
			{renderedBoard}
		</div>
	)
}