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

interface Action {
	origin: Position;
	target: Position;
}

export const getCardActions = (game: Game, cardId: string, userId: string) => {
	// const player = game?.users?.find((user) => user.id === userId);
	// TODO: Flip board or moves matrix for red player
	const board = game?.board;
	console.log("board in getCardActions", board);
	const card = game?.cards?.find((card) => card.id === cardId);
	const playerColor = Object.keys(game?.players ?? {}).find((key) => game?.players[key as keyof typeof game.players]?.id === userId);
	const pawnPositions = getPawnPositions(board, playerColor ?? "");
	const pawnTargets = card?.moves && getPawnTargetsOnBoard(pawnPositions, card.moves);
	const validTargets = removeFriendlyOccupiedTarts(pawnTargets ?? [], board, playerColor ?? "");

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

const getPawnPositions = (board: string[][], playerColor: string) => {
	const pawnPositions: Array<{ row: number, column: number }> = [];
	board.forEach((row, rowIndex) => {
		row.forEach((pawn, columnIndex) => {
			if (pawn[0] === playerColor[0]) {
				pawnPositions.push({ row: rowIndex, column: columnIndex });
			}
		});
	});
	return pawnPositions;
};

const getPawnTargetsOnBoard = (pawns: Position[], moves: number[]) => {
	const targets: Action[] = [];
	pawns.forEach(pawn => {
		const origin: Position = {
			row: pawn.row,
			column: pawn.column,
		}
		moves.forEach(move => {
			const target: Position = {
				row: pawn.row + movesMatrix[move].row,
				column: pawn.column + movesMatrix[move].column,
			};
			if (
				target.row >= 0 &&
				target.row < 5 &&
				target.column >= 0 &&
				target.column < 5
			) {
				targets.push({
					origin,
					target,
				} as Action);
			}
		});
	})
	return targets;
}

const removeFriendlyOccupiedTarts = (targets: Action[], board: string[][], playerColor: string) => {
	const updatedTargets =targets.filter(target => {
		return board[target.target.row][target.target.column][0] !== playerColor[0];
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

export const passTurn = async (gameId: string, nextTurn: string, selectedCardId: string, neutralCardId: string) => {
	try {
		const url = `${apiUrl}/games?id=${gameId}&action=pass`;
		const update = {
			gameId,
			nextTurn,
			selectedCardId,
			neutralCardId
		}
		console.log("update", update);
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
		console.log("data", data);
		return data;
	} catch (error) {
		console.error('Error ending the game:', error);
		throw error;
	}
};