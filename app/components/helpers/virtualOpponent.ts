import { getCardActions, completeTurn, passTurn } from "./action";

const virtualOpponentEmail = process.env.NEXT_PUBLIC_VIRTUAL_OPPONENT_EMAIL || "virtual_opponent@mngatewood.com";

const getPlayerActions = async (userId: string, game: Game, invertActions: boolean = false) => {
	const playerColor = Object.keys(game?.players ?? {}).find((key) => game?.players[key as keyof typeof game.players]?.id === userId);
	const player = game.players[playerColor as keyof typeof game.players];
	const cards = player.cards
	const actions: Action[] = [];
	cards.forEach((card) => {
		const action = getCardActions(game, card.id, userId, invertActions);
		actions.push(...action);
	})
	return actions;
};

const removeDuplicateActions = (actions: Action[]) => {
	const uniqueActions: Action[] = [];
	actions.forEach((action) => {
		if (!uniqueActions.some((a) => a.origin.row === action.origin.row && a.origin.column === action.origin.column && a.target.row === action.target.row && a.target.column === action.target.column)) {
			uniqueActions.push(action);
		}
	})
	return uniqueActions;
}

const getVictoryActions = async (actions: Action[], userId: string, game: Game) => {
	const playerThrone = { row: 4, column: 2 };
	const playerMaster = game.board.map((row, rowIndex) => {
		return row.map((column, columnIndex) => {
			if (column[0] === "b" && column[1] === "m") {
				return { row: rowIndex, column: columnIndex };
			}
		});
	}).flat().filter((space) => space !== undefined)[0];
	const victoryActions: Action[] = [];
	actions.forEach((action) => {
		const attacksThrone = action.target.row === playerThrone.row && action.target.column === playerThrone.column;
		const attacksMaster = action.target.row === playerMaster.row && action.target.column === playerMaster.column;
		if (attacksThrone || attacksMaster) {
			victoryActions.push(action);
		}
	})
	return victoryActions;
}

const getSafeSpaceActions = (virtualOpponentActions: Action[], userActions: Action[]) => {
	// Filter opponent actions that don't match any user action targets
	const safeActions = virtualOpponentActions.filter(opponentAction => {
		// Return true if this opponent action's target doesn't match ANY user action targets
		return !userActions.some(userAction =>
			opponentAction.target.row === userAction.target.row &&
			opponentAction.target.column === userAction.target.column
		);
	});
	return removeDuplicateActions(safeActions);
};

const getMasterPosition = (board: string[][]): Position | undefined => {
	return board.reduce((position, row, rowIndex) => {
		const columnIndex = row.findIndex(space => space.startsWith("rm"));
		return columnIndex !== -1 ? { row: rowIndex, column: columnIndex } : position;
	}, undefined as Position | undefined);
};

const getPreventDefeatActions = async (virtualOpponentActions: Action[], userActions: Action[], userId: string, game: Game) => {
	// are there any user actions that target the virtual opponent's throne?
	const threatenedThroneActions = userActions.filter((action) => action.target.row === 0 && action.target.column === 2)
	// reference position of the virtual opponent's master
	const masterPosition = getMasterPosition(game.board);
	// are there any user actions that target the virtual opponent's master?
	const getThreatenedMasterActions = () => {
		const threatsToMaster = userActions.filter((action) => {
			return action.target.row === masterPosition?.row && action.target.column === masterPosition?.column
		})
		return threatsToMaster;
	}
	const threatenedMasterActions = getThreatenedMasterActions()
	// if both threats exist, determine if master can eliminate threat to throne
	if (threatenedThroneActions.length && threatenedMasterActions.length) {
		const masterActions = virtualOpponentActions.filter((action) => {
			return action.origin.row === masterPosition?.row && action.origin.column === masterPosition?.column
		})
		// find master actions that target pawns that threaten the throne
		const masterActionsThatTargetThreatToThrone = masterActions.filter(action =>
			threatenedThroneActions.some(threatAction =>
				action.target.row === threatAction.origin.row &&
				action.target.column === threatAction.origin.column
			)
		);
		// if master actions that target threatened throne exist, return them
		if (masterActionsThatTargetThreatToThrone.length) {
			return masterActionsThatTargetThreatToThrone
		}	
	}
	// if unable to eliminate threat to throne or only one type of threat exists,identify the player's threatening pawn(s)
	if (threatenedThroneActions.length || threatenedMasterActions.length) {
		const getUserThreateningPawns = () => {
			const defeatActions = [...threatenedThroneActions, ...threatenedMasterActions]
			const defeatingPawns = defeatActions.map((action) => action.origin)
			return defeatingPawns
		}
		const userThreateningPawns = getUserThreateningPawns()
		// determine if any virtual opponent's actions can attack those pawns
		const getActionsThatTargetThreateningPawns = (): Action[] => {
			const actions = virtualOpponentActions.filter(action =>
				userThreateningPawns.some(pawnPosition =>
					action.target.row === pawnPosition.row &&
					action.target.column === pawnPosition.column
				)
			);
			return removeDuplicateActions(actions);
		};
		const actionsThatTargetThreateningPawns = getActionsThatTargetThreateningPawns()
		const safeSpaceActions = getSafeSpaceActions(virtualOpponentActions, userActions);
		const safeAttackActions = actionsThatTargetThreateningPawns.filter(action =>
			safeSpaceActions.some(safeAction =>
				action.target.row === safeAction.target.row &&
				action.target.column === safeAction.target.column
			)
		);
		// if there are any safe actions that target threatening pawns, return them
		if (safeAttackActions.length) {
			return safeAttackActions;
		// if there are no safe attack actions, return actions that target threatening pawns
		} else if (actionsThatTargetThreateningPawns.length) {
			return actionsThatTargetThreateningPawns
		}
		// if unable to attack a threatening pawn, determine if master can move to a safe space
		if (threatenedMasterActions.length) {
			const safeMasterActions = safeSpaceActions.filter((action) => {
				return action.origin.row === masterPosition?.row && action.origin.column === masterPosition?.column
			})
			// if any safe space Master actions exist, return them
			if (safeMasterActions.length) {
				return safeMasterActions
			}
		}
	} 
	// if no defeat threat exists or unable to avoid defeat, return empty array
	return [];
}

const getPawnPositions = (board: string[][], color: string): Position[] => {
	const positions: Position[] = [];
	board.forEach((row, rowIndex) => {
		row.forEach((space, columnIndex) => {
			const colorCode = color === "red" ? "r" : "b";
			if (space.charAt(0) === colorCode && ["s", "m"].includes(space.charAt(1))) {
				positions.push({ row: rowIndex, column: columnIndex });
			}
		});
	})
	return positions
};

const getThreatenedPawns = (virtualOpponentActions: Action[], userActions: Action[], game: Game) => {
	const threatenedPawns: Position[] = [];
	const pawnPositions = getPawnPositions(game.board, "red");
	pawnPositions.forEach((position) => {
		userActions.forEach((userAction) => {
			if (userAction.target.row === position.row && userAction.target.column === position.column) {
				threatenedPawns.push(position)
			}
		})
	})
	return threatenedPawns
}

const getThreateningPawns = (virtualOpponentActions: Action[], userActions: Action[], game: Game) => {
	const threatenedPawns = getThreatenedPawns(virtualOpponentActions, userActions, game);
	const pawnActions = userActions.filter((action) =>
		threatenedPawns.some((pawnPosition) =>
			action.target.row === pawnPosition.row &&
			action.target.column === pawnPosition.column
		)
	);	
	const pawnPositions = pawnActions.map(action => action.origin);
	// remove duplicates
	return [...new Map(pawnPositions.map(position =>
		[JSON.stringify(position), position]
	)).values()];
};

const getPreventAttackActions = (virtualOpponentActions: Action[], userActions: Action[], userId: string, game: Game) => {
	const threateningPawns = getThreateningPawns(virtualOpponentActions, userActions, game);
	// determine if any virtual opponent's actions can attack those pawns
	const getActionsThatTargetThreateningPawns = (): Action[] => {
		const actions = virtualOpponentActions.filter(action =>
			threateningPawns.some(pawnPosition =>
				action.target.row === pawnPosition.row &&
				action.target.column === pawnPosition.column
			)
		);
		return removeDuplicateActions(actions);
	};
	const actionsThatTargetThreateningPawns = getActionsThatTargetThreateningPawns()
	if (actionsThatTargetThreateningPawns.length) {
		return actionsThatTargetThreateningPawns
	}
	// if unable to attack a threatening pawn, determine if any threatened pawns can move to a safe space
	const threatenedPawns = getThreatenedPawns(virtualOpponentActions, userActions, game);
	const threatenedPawnActions = virtualOpponentActions.filter((action) =>
		threatenedPawns.some((pawnLocation) =>
			action.origin.row === pawnLocation.row &&
			action.origin.column === pawnLocation.column
		)
	);
	const safeSpaceActions = getSafeSpaceActions(virtualOpponentActions, userActions);
	const safeThreatenedPawnActions = threatenedPawnActions.filter((pawnAction) => {
		if (!pawnAction) return false
		// return pawnActions that have targets that are included in safe space actions
		return safeSpaceActions.some((safeAction) =>
			pawnAction.target.row === safeAction.target.row && pawnAction.target.column === safeAction.target.column
		);
	});
	if (safeThreatenedPawnActions.length) {
		return removeDuplicateActions(safeThreatenedPawnActions);
	}
	// if no prevent attack actions exist, return empty array
	return [];
}

const getAttackActions = async (virtualOpponentActions: Action[], playerActions: Action[], userId: string, game: Game) => {
	const enemyPawnLocations = getPawnPositions(game.board, "blue");
	const attackActions = virtualOpponentActions.filter((action) =>
		enemyPawnLocations.some((pawnLocation) =>
			action.target.row === pawnLocation.row &&
			action.target.column === pawnLocation.column
		)
	);
	return removeDuplicateActions(attackActions);
}

const getMoveActions = async (virtualOpponentActions: Action[], playerActions: Action[], game: Game) => {
	const safeSpaceActions = getSafeSpaceActions(virtualOpponentActions, playerActions);
	const moveActions = virtualOpponentActions.filter((action) =>
		safeSpaceActions.some((safeAction) =>
			action.target.row === safeAction.target.row && action.target.column === safeAction.target.column
		)
	);
	const masterPosition = getMasterPosition(game.board);
	if (!masterPosition) {
		return removeDuplicateActions(moveActions);
	}
	const sortedActionsWithMasterPositionLast = moveActions.sort((a, b) => {
		if (a.target.row === masterPosition.row && a.target.column === masterPosition.column) {
			return 1;
		}
		if (b.target.row === masterPosition.row && b.target.column === masterPosition.column) {
			return -1;
		}
		return 0;
	})
	return removeDuplicateActions(sortedActionsWithMasterPositionLast);
};

const getCardFromAction = (action: Action, cards: Card[]) => {
	const columnChange = action.origin.column - action.target.column;
	const rowChange = action.origin.row - action.target.row;
	const move = 13 + (rowChange * 5) + columnChange;
	const card = cards.find((card) => card.moves.includes(move))
	return card
}

const getRandomIndex = (length: number) => {
	return Math.floor(Math.random() * length);
}

const executeAction = async (action: Action, game: Game) => {
	try {
		const selectedCard = getCardFromAction(action, game.players.red.cards)
		const updatedBoard = JSON.parse(JSON.stringify(game.board));
		if (selectedCard && updatedBoard) {
			const updatedGame = await completeTurn(game, selectedCard, action.origin, action.target);
			return updatedGame
		} else {
			return
		}
	} catch (error) {
		console.error('Error executing pass turn:', error);
		throw error;
	}
}

const executePassTurn = async (game: Game): Promise<Game> => {
	try {
		const randomCardIndex = getRandomIndex(2);
		const selectedCard = game.players.red.cards[randomCardIndex];
		const nextTurn = game.turn === "red" ? "blue" : "red";
		const neutralCard = game.cards?.find(card =>
			!game.players.red.cards.some(redCard => redCard.id === card.id) &&
			!game.players.blue.cards.some(blueCard => blueCard.id === card.id)
		);
		if (selectedCard && neutralCard) {
			const updatedGame = await passTurn(
				game.id,
				nextTurn,
				selectedCard.id,
				neutralCard.id
			);
			return updatedGame;
		} else {
			return game;
		}
	} catch (error) {
		console.error('Error executing pass turn:', error);
		throw error;
	}
};

export const resolveVirtualTurn = async (game: Game, userId: string) => {

	// return if neither user has email virtual_opponent@mngatewood.com
	const virtualOpponent = game?.users?.find((user) => user.email === virtualOpponentEmail);
	if (!virtualOpponent) {
		return;
	}
	// get all the actions for the virtual opponent's two cards
	const virtualOpponentActions = await getPlayerActions(virtualOpponent.id, game, true);
	// get all the actions for the player's two cards
	const playerActions = await getPlayerActions(userId, game, false);
	// evaluate virtual opponent actions for victory condition
	const victoryActions = await getVictoryActions(virtualOpponentActions, userId, game);
	if (victoryActions.length) {
		const randomIndex = getRandomIndex(victoryActions.length);
		const updatedGame = executeAction(victoryActions[randomIndex], game);
		if (updatedGame) {
			return updatedGame
		}
	}
	// evaluate the player's actions for defeat condition
	const preventDefeatActions = await getPreventDefeatActions(virtualOpponentActions, playerActions, userId, game);
	if (preventDefeatActions.length) {
		const randomIndex = getRandomIndex(preventDefeatActions.length);
		const updatedGame = executeAction(preventDefeatActions[randomIndex], game);
		if (updatedGame) {
			return updatedGame
		}
	}
	const preventAttackActions = getPreventAttackActions(virtualOpponentActions, playerActions, userId, game);
	if (preventAttackActions.length) {
		const randomIndex = getRandomIndex(preventAttackActions.length);
		const updatedGame = executeAction(preventAttackActions[randomIndex], game);
		if (updatedGame) {
			return updatedGame
		}
	}
	const attackActions = await getAttackActions(virtualOpponentActions, playerActions,userId, game);
	if (attackActions.length) {
		const randomIndex = getRandomIndex(attackActions.length);
		const updatedGame = executeAction(attackActions[randomIndex], game);
		if (updatedGame) {
			return updatedGame
		}
	}
	// determine if there are any valid moves that will not result in a threatened pawn
	const moveActions = await getMoveActions(virtualOpponentActions, playerActions, game);
	if (moveActions.length) {
		// in order to prioritize moving a student, we don't shuffle here
		const updatedGame = executeAction(moveActions[0], game);
		if (updatedGame) {
			return updatedGame
		}
	} else if (virtualOpponentActions.length) {
		const randomIndex = getRandomIndex(virtualOpponentActions.length);
		const updatedGame = executeAction(virtualOpponentActions[randomIndex], game);
		if (updatedGame) {
			return updatedGame
		}
	}
	const passTurn = executePassTurn(game);
	if (passTurn) {
		return passTurn
	}
};
