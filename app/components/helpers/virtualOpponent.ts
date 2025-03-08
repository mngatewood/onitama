import { getCardActions, completeTurn } from "./action";

const virtualOpponentEmail = process.env.NEXT_PUBLIC_VIRTUAL_OPPONENT_EMAIL;

const getPlayerActions = async (userId: string, game: Game, invertActions: boolean = false) => {
	const playerColor = Object.keys(game?.players ?? {}).find((key) => game?.players[key as keyof typeof game.players]?.id === userId);
	const player = game.players[playerColor as keyof typeof game.players];
	const cards = player.cards
	const targets: Target[] = [];
	cards.forEach((card) => {
		const action = getCardActions(game, card.id, userId, invertActions);
		targets.push(...action);
	})
	return targets;
};

const removeDuplicateActions = (actions: Target[]) => {
	const uniqueActions: Target[] = [];
	actions.forEach((action) => {
		if (!uniqueActions.some((a) => a.origin.row === action.origin.row && a.origin.column === action.origin.column && a.target.row === action.target.row && a.target.column === action.target.column)) {
			uniqueActions.push(action);
		}
	})
	return uniqueActions;
}

const getVictoryActions = async (actions: Target[], userId: string, game: Game) => {
	const playerThrone = { row: 4, column: 2 };
	const playerMaster = game.board.map((row, rowIndex) => {
		return row.map((column, columnIndex) => {
			if (column[0] === "b" && column[1] === "m") {
				return { row: rowIndex, column: columnIndex };
			}
		});
	}).flat().filter((space) => space !== undefined)[0];
	const victoryActions: Target[] = [];
	actions.forEach((action) => {
		const attacksThrone = action.target.row === playerThrone.row && action.target.column === playerThrone.column;
		const attacksMaster = action.target.row === playerMaster.row && action.target.column === playerMaster.column;
		if (attacksThrone || attacksMaster) {
			victoryActions.push(action);
		}
	})
	console.log("victory actions", victoryActions)
	return victoryActions;
}

const getCardFromAction = (action: Target, cards: Card[]) => {
	console.log("action", action)
	const columnChange = action.origin.column - action.target.column;
	console.log("column change", columnChange);
	const rowChange = action.origin.row - action.target.row;
	console.log("row change", rowChange);
	const move = 13 + (rowChange * 5) - columnChange;
	console.log("move", move)
	const card = cards.find((card) => card.moves.includes(move))
	return card
}


const executeAction = async (action: Target, game: Game) => {
	const selectedCard = getCardFromAction(action, game.players.red.cards)
	console.log("selected card", selectedCard)
	const updatedBoard = JSON.parse(JSON.stringify(game.board));
	const originColor = updatedBoard[action.origin.row][action.origin.column][0];
	const originPawn = updatedBoard[action.origin.row][action.origin.column][1];
	console.log("originColor", originColor);
	console.log("originPawn", originPawn);
	console.log("target", originColor + originPawn + "h0");
	updatedBoard[action.target.row][action.target.column] = originColor + originPawn + "a0";
	updatedBoard[action.origin.row][action.origin.column] = originColor + "0a0";
	console.log("updatedBoard", updatedBoard);
	if (selectedCard && updatedBoard) {
		const updatedGame = await completeTurn(game, selectedCard, action.origin, action.target, updatedBoard);
		console.log("updated game", updatedGame)
		return updatedGame
	} else {
		console.log("selected card", selectedCard);
		console.log("updated board", updatedBoard);
		return
	}

	
}

export const resolveVirtualTurn = async (game: Game, userId: string) => {
	// return if neither user has email virtual_opponent@mngatewood.com
	const virtualOpponent = game?.users?.find((user) => user.email === virtualOpponentEmail);
	console.log("virtualOpponent", virtualOpponent);

	if (!virtualOpponent) {
		return;
	}

	// get all the actions for the virtual opponent's two cards
	const virtualOpponentActions = await getPlayerActions(virtualOpponent.id, game, true);
	const uniqueOpponentActions = removeDuplicateActions(virtualOpponentActions);

	// get all the actions for the player's two cards
	const playerActions = await getPlayerActions(userId, game, false);
	const uniquePlayerActions = removeDuplicateActions(playerActions);

	console.log("virtualOpponentActions", uniqueOpponentActions);
	console.log("playerActions", uniquePlayerActions);


	// evaluate virtual opponent actions for victory condition
		// are any targets the player's throne?
		// are any targets the player's master?
	const victoryActions = await getVictoryActions(virtualOpponentActions, userId, game);
	if (victoryActions.length) {
		console.log("victoryActions", victoryActions);
		const updatedGame = executeAction(victoryActions[0], game);
		if (updatedGame) {
			return updatedGame
		}
	}

	// evaluate the player's actions for defeat condition
		// are any targets the virtual opponent's throne?
		// are any targets the virtual opponent's master?
		// identify the player's pawn(s) that meet above criteria
		// determine if any virtual opponent's actions can attack those pawns
			// if so, select that action (if more than one, select one at random)
		// if unable to attack a threatening pawn, move a threatened pawn to a safe space
	// const preventDefeatActions = await getPreventDefeatActions(virtualOpponentActions, playerActions, user.id, game);
	// if (preventDefeatActions.length) {
		// return executeAction(preventDefeatActions[0], game);
	// }


	// evaluate the player's actions for attack condition
		// are there any threatening pawns that can be attacked?
		// if so, select that action (if more than one, select one at random)
		// if unable to attack a threatening pawn, move a threatened pawn to a safe space
	// const preventAttackActions = await getPreventAttackActions(virtualOpponentActions, playerActions, user.id, game);
	// if (preventAttackActions.length) {
		// return executeAction(preventAttackActions[0], game);
	// }


	// evaluate the virtual opponent's actions for attack condition
		// if so, select a student pawn and attack at random
		// if no student pawn attacks, select the master pawn and a random attack
	// const attackActions = await getAttackActions(virtualOpponentActions, user.id, game);
	// if (attackActions.length) {
		// return executeAction(attackActions[0], game);
	// }


	// evaluate the virtual opponent's actions for move condition
		// if so, select a student pawn and move at random
		// if no student pawn moves, select the master pawn and a random move
	// const moveActions = await getMoveActions(virtualOpponentActions, user.id, game);
	// if (moveActions.length) {
		// return executeAction(moveActions[0], game);
	// }
};
