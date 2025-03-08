"use client";

import { useMemo } from "react";

interface BoardProps {
	board: string[][];
	userColor: string;
	selectedPawn: Position | null;
	selectPawn: (origin: Position) => void;
	selectTarget: (target: Position) => void;
}

export const Board = ({ board, userColor, selectedPawn, selectPawn, selectTarget }: BoardProps ) => {

	const selectedPawnPosition = selectedPawn ? (selectedPawn?.row * 5 + selectedPawn?.column + 1) : 0;

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
					pawn = "empty";
			}

			switch (highlightedCode) {
				case "0":
					highlighted = "not-highlighted";
					break
				case "h":
					highlighted = "highlighted";
					break
				case "a":
					highlighted = "action";
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
				case "o":
					targeted = "targeted selected-target";
					break
				default:
					targeted = "";
			}

			const selectSpace = (e: React.MouseEvent) => {
				e.preventDefault();
				const index = parseInt(e.currentTarget.id.split("-")[1])-1;
				const spaceData = flatBoard[index];
				if (e.currentTarget.classList.contains("highlighted") && !e.currentTarget.classList.contains("pawn-selected")) {
					if (spaceData[1] === "s" || spaceData[1] === "m") {
						const origin = {
							row: Math.floor(index / 5),
							column: index % 5
						}
						return selectPawn(origin);
					}
				} else if (e.currentTarget.classList.contains("clickable-target")) {
					if (spaceData[3] === "x") {
						const target = {
							row: Math.floor(index / 5),
							column: index % 5
						}
						return selectTarget(target);
					}
				}
				console.log("not a valid space");
			};

			const clickableTarget = selectedPawn && targetedCode === "x" ? "clickable-target" : "";

			const renderThrone = () => {
				if (index === 2) {
					return "red-throne"
				} else if (index === 22) {
					return "blue-throne"
				} else {
					return ""
				}
			}
			const throne = renderThrone();

			return (
				<div onClick={selectSpace} className={`${(selectedPawnPosition === index + 1) && "pawn-selected"} space aspect-square border border-slate-600 text-xl md:text-2xl lg:text-3xl xl:text-5xl ${color} ${pawn} ${highlighted} ${targeted} ${throne} ${clickableTarget}`} key={index} id={`space-${index + 1}`}>
				</div>
			)

		})
	}, [board, userColor, selectedPawn, selectedPawnPosition, selectPawn, selectTarget ]);

		return (
		<div id="board" className="grid grid-cols-5 grid-rows-5 aspect-square outline outline-2 outline-offset-1 outline-slate-600 dark:outline-slate-400 h-full landscape:h-40 landscape:xshort:h-48 landscape:short:h-72 landscape:md:short:h-80 landscape:lg:short:h-96 landscape:tall:xl:h-[36rem]">
			{renderedBoard}
		</div>
	)
}