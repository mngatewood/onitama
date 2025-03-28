export const apiUrl = typeof window !== 'undefined'
	? `${window.location.origin}/api`  // This will use the actual deployed URL
	: process.env.NEXT_PUBLIC_BASE_URL + "/api";

interface Position {
	row: number;
	column: number;
}

interface MovesMatrix {
	[key: number]: {
		column: number;
		row: number;
	};
}

export const getCardActions = (game: Game, cardId: string, userId: string, invertActions: boolean = false) => {
	const board = game?.board;
	const card = game?.cards?.find((card) => card.id === cardId);
	const playerColor = Object.keys(game?.players ?? {}).find((key) => game?.players[key as keyof typeof game.players]?.id === userId);
	const pawnPositions = getPawnPositions(board, playerColor ?? "");
	const pawnTargets = card?.moves && getPawnTargetsOnBoard(pawnPositions, card.moves, invertActions);
	const validTargets = removeFriendlyOccupiedTargets(pawnTargets ?? [], board, playerColor ?? "");

	return validTargets;
};

// Convert "moves" to position deltas
const movesMatrix: MovesMatrix = {
	1: { row: -2, column: -2 },
	2: { row: -2, column: -1 },
	3: { row: -2, column: 0 },
	4: { row: -2, column: 1 },
	5: { row: -2, column: 2 },
	6: { row: -1, column: -2 },
	7: { row: -1, column: -1 },
	8: { row: -1, column: 0 },
	9: { row: -1, column: 1 },
	10: { row: -1, column: 2 },
	11: { row: 0, column: -2 },
	12: { row: 0, column: -1 },
	13: { row: 0, column: 0 },
	14: { row: 0, column: 1 },
	15: { row: 0, column: 2 },
	16: { row: 1, column: -2 },
	17: { row: 1, column: -1 },
	18: { row: 1, column: 0 },
	19: { row: 1, column: 1 },
	20: { row: 1, column: 2 },
	21: { row: 2, column: -2 },
	22: { row: 2, column: -1 },
	23: { row: 2, column: 0 },
	24: { row: 2, column: 1 },
	25: { row: 2, column: 2 },
};


export const getSpacePositionFromOrigin = (origin: Position) => {
	const move = Object.keys(movesMatrix).find((key) => {
		return (
			movesMatrix[key as unknown as keyof typeof movesMatrix].row === origin.row &&
			movesMatrix[key as unknown as keyof typeof movesMatrix].column === origin.column
		);
	});
	return move ? parseInt(move) : null;
}

const getPawnPositions = (board: string[][], playerColor: string) => {
	const pawnPositions: Array<Position> = [];
	board.forEach((row, rowIndex) => {
		row.forEach((pawn, columnIndex) => {
			if (pawn[0] === playerColor[0]) {
				pawnPositions.push({ row: rowIndex, column: columnIndex });
			}
		});
	});
	return pawnPositions;
};

const getPawnTargetsOnBoard = (pawns: Position[], moves: number[], invertActions: boolean = false) => {
	const actions: Action[] = [];
	pawns.forEach(pawn => {
		const origin: Position = {
			row: pawn.row,
			column: pawn.column,
		}
		moves.forEach(move => {
			const moveRow = invertActions ? movesMatrix[move].row * -1 : movesMatrix[move].row;
			const moveColumn = invertActions ? movesMatrix[move].column * -1 : movesMatrix[move].column;
			const target: Position = {
				row: pawn.row + moveRow,
				column: pawn.column + moveColumn,
			};
			if (
				target.row >= 0 &&
				target.row < 5 &&
				target.column >= 0 &&
				target.column < 5
			) {
				actions.push({
					origin,
					target,
				} as Action);
			}
		});
	})
	return actions;
}

const removeFriendlyOccupiedTargets = (actions: Action[], board: string[][], playerColor: string) => {
	const updatedTargets =actions.filter(action => {
		return board[action.target.row][action.target.column][0] !== playerColor[0];
	})

	return updatedTargets;
}

export const getUpdatedBoard = (game: Game, cardActions: Action[]) => {
	const board = JSON.parse(JSON.stringify(game.board));

	cardActions.forEach(action => {
		board[action.origin.row][action.origin.column] = 
			board[action.origin.row][action.origin.column].substring(0, 2) + "h" + 
			board[action.origin.row][action.origin.column].substring(3);
		board[action.target.row][action.target.column] = 
			board[action.target.row][action.target.column].substring(0, 3) + "x";
	})

	return board;
}

export const completeTurn = async (game: Game, selectedCard: Card, selectedPawn: Position, selectedTarget: Position ) => {
	try {
		const board = getEndTurnBoard(game, selectedPawn, selectedTarget);

		const url = `${apiUrl}/games?id=${game.id}&action=complete_turn`;
		const update = {
			gameId: game.id,
			board,
			turn: game.turn,
			selectedCardId: selectedCard.id,
		}
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(update),
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error completing the turn:', error);
		throw error;
	}
}

const getEndTurnBoard = (game: Game, selectedPawn: Position, selectedTarget: Position) => {
	const board = JSON.parse(JSON.stringify(game.board));
	const selectedPawnType = board[selectedPawn.row][selectedPawn.column][1];
	const playerColor = game.turn[0];

	const updatedBoard = board.map((row: string[]) => {
		return row.map((space: string) => {

			let updatedSpace = space;

			// if space has pawn and action, remove action but leave pawn and color
			if (updatedSpace.slice(1, 3) === "sa" || updatedSpace.slice(1, 3) === "ma") {
				updatedSpace = updatedSpace.slice(0, 2) + "0" + updatedSpace.charAt(3);

			// else if space has action only, remove action and color
			} else if (updatedSpace.charAt(2) === "a") {
				updatedSpace = "000" + updatedSpace.charAt(3);
			}

			return updatedSpace;
		});
	});
	updatedBoard[selectedPawn.row][selectedPawn.column] = playerColor + "0a0"
	updatedBoard[selectedTarget.row][selectedTarget.column] = playerColor + selectedPawnType + "a0"

	return updatedBoard;

}

export const getGameWinner = (game: Game) => {
	const blueMaster = game.board.flat().find(space => space[0] === "b" && space[1] === "m");
	const redMaster = game.board.flat().find(space => space[0] === "r" && space[1] === "m");
	const blueThrone = game.board[4][2];
	const redThrone = game.board[0][2];
	const blueThroneDefeated = blueThrone[0] === "r" && blueThrone[1] === "m";
	const redThroneDefeated = redThrone[0] === "b" && redThrone[1] === "m";

	if (!blueMaster || blueThroneDefeated) {
		return "red";
	} else if (!redMaster || redThroneDefeated) {
		return "blue";
	} else {
		return "";
	}
}