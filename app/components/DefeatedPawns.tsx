"use client";

import { useEffect, useState } from "react";

export const DefeatedPawns = ( {board}: { board: string[][] | null } ) => {

	const [ defeatedRedPawns, setDefeatedRedPawns ] = useState<number>(0)
	const [ defeatedBluePawns, setDefeatedBluePawns ] = useState<number>(0)

	useEffect(() => {
		if (!board) return
		const flatBoard = board.flat();
		const redPawns = flatBoard.filter((row) => row.slice(0, 2) === "rs").length;
		const bluePawns = flatBoard.filter((row) => row.slice(0, 2) === "bs").length;
		setDefeatedRedPawns(4 - redPawns);
		setDefeatedBluePawns(4 - bluePawns);
	}, [board])
	

	return (
		<div id="defeated-pawns" className="flex flex-col space-between items-end w-full h-full">
			<div className="flex flex-col justify-evenly w-1/5 min-w-6 short:sm:min-w-8 h-full">
				{/* defeated red pawns */}
				{[...Array(defeatedRedPawns).keys()].map((index) => {
					return (
						<div key={index} className="defeated red defeated-pawn aspect-square"></div>
					)
				})}
				{/* red placeholders */}
				{[...Array(4 - defeatedRedPawns).keys()].map((index) => {
					return (
						<div key={index} className="defeated sil defeated-pawn aspect-square"></div>
					)
				})}
			</div>
			<div className="flex flex-col justify-evenly w-1/5 min-w-6 short:sm:min-w-8 h-full">
				{/* defeated blue pawns */}
				{[...Array(defeatedBluePawns).keys()].map((index) => {
					return (
						<div key={index} className="defeated blue defeated-pawn aspect-square"></div>
					)
				})}
				{/* blue placeholders */}
				{[...Array(4 - defeatedBluePawns).keys()].map((index) => {
					return (
						<div key={index} className="defeated sil defeated-pawn aspect-square"></div>
					)
				})}
			</div>
		</div>
	);
}