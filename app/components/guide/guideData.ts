// MODAL
// position.x: left n%;
// position.y: top n%;
// moveable: render a button to move the modal up and down (portrait) or left and right (landscape)?
// headline: bolded text to display at the top of the modal
// body: text to display in the body of the modal

// TOOLTIP
// elementId: id of the element to attach the tooltip to
// child: array of element children to traverse to find the element to attach the tooltip to
// position: where to position and align the tooltip relative to the element
// -- null: the position is not applicable for this tooltip
// -- 0: the position indicates the alignment of the tooltip relative to the element
// ---- e.g., left:0, right:null means align the left edge of the tooltip with the left edge of the element
// ---- e.g., left:null, right:0 means align the right edge of the tooltip with the right edge of the element
// ---- e.g., left:0, right:0 means align the center of the tooltip with the center of the element
// ---- e.g., top/bottom works the same way
// -- 1+: the position indicates direction and amount of offset from the element
// ---- e.g., top:16 means the tooltip is 16px above the element
// ---- e.g., right:-8 means the tooltip is 8px to the left of the right edge of the element
// ---- e.g., there can only be one non-null, non-0 value and the opposite direction must be null
// text: text to display in the tooltip
// arrowPosition: where to position the arrow relative to the tooltip
// -- x: left, center, right
// -- y: top, center, bottom

export const pageOneStageOneModal = {
	position: {
		x: 0, // percentage of screen
		y: 0 // percentage of screen
	},
	moveable: false,
	headline: "Guided Tutorial",
	body: "The following is a step-by-step tutorial. The screens you will see look like actual pages from the game, but they are not interactive. Use the '<<' (previous) and '>>' (next) buttons to navigate."
}

// No tooltip rendered in this stage
export const pageOneStageOneTooltip = {
	elementId: "",
	child: [],
	position: {
		top: null,
		right: null,
		bottom: null,
		left: null,
	},
	text: "",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageTwoStageOneModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Sign Up",
	body: "To get started, click the Register button at the bottom-right of the home page.  This will take you to the registration page."
}

export const pageTwoStageOneTooltip = {
	elementId: "register-button",
	child: [],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: null,
	},
	text: "Click 'Register' to create an account.",
	arrowPosition: {
		x: "right",
		y: "bottom",
	}
}

export const pageTwoStageTwoModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Sign Up",
	body: "Once at the registration page, enter your name, email, and password and click the Submit button.  After your registration is complete, you will be redirected to the login page."
}

export const pageTwoStageTwoTooltip = {
	elementId: "submit-register",
	child: [],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Fill out the fields and click 'Submit'.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageTwoStageThreeModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Log In",
	body: "Once at the login page, enter your email and password and click the Submit button.  After logging in, you will be redirected to the game lobby."
}

export const pageTwoStageThreeTooltip = {
	elementId: "submit-login",
	child: [],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Enter your email and password and click 'Submit'.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageTwoStageFourModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Start a Game",
	body: "Once on the Lobby page, click the 'New Game' button to start a new game."
}

export const pageTwoStageFourTooltip = {
	elementId: "new-game-button",
	child: [],
	position: {
		top: null,
		right: 0,
		bottom: 16,
		left: 0,
	},
	text: "Click the 'New Game' button to start a new game.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageTwoStageFiveModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Start a Game",
	body: "Choose 'Solo' or 'Multiplayer' mode to start the game."
}

export const pageTwoStageFiveTooltip = {
	elementId: "new-game-container",
	child: [],
	position: {
		top: null,
		right: 0,
		bottom: 16,
		left: 0,
	},
	text: "Choose 'Solo' or 'Multiplayer'.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageTwoStageSixModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Start a Game",
	body: "You may also join an existing game by clicking any of the games listed in the Lobby."
}

export const pageTwoStageSixTooltip = {
	elementId: "join-game-container",
	child: [],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Click a pending game to join.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageThreeStageOneModal = {
	position: {
		x: 0, // percentage of screen
		y: 0 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "As the game progresses, you will see notifications that provide updates and helpful tips.  Click the 'X' to dismiss them."
}

export const pageThreeStageOneTooltip = {
	elementId: "toast",
	child: [],
	position: {
		top: null,
		right: 0,
		bottom: 16,
		left: 0,
	},
	text: "Notifications appear here.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageThreeStageTwoModal = {
	position: {
		x: 0, // percentage of screen
		y: 0 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "If you wish, you can disable notifications by clicking the 'Mute Notifications' button."
}

export const pageThreeStageTwoTooltip = {
	elementId: "data-mute-notifications",
	child: [],
	position: {
		top: null,
		right: null,
		bottom: 16,
		left: 0,
	},
	text: "Mute notifications.",
	arrowPosition: {
		x: "left",
		y: "top",
	}
}

export const pageThreeStageThreeModal = {
	position: {
		x: 0, // percentage of screen
		y: 0 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "You can toggle dark mode on or off by clicking the 'Dark Mode' button."
}

export const pageThreeStageThreeTooltip = {
	elementId: "data-dark-mode-toggle",
	child: [],
	position: {
		top: null,
		right: 0,
		bottom: 16,
		left: null,
	},
	text: "Enable or disable dark mode.",
	arrowPosition: {
		x: "right",
		y: "top",
	}
}

export const pageThreeStageFourModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "Your pawns will start at the bottom of the board.  You begin with four students and one (larger) master.  Their color will match your player color where your name is displayed."
}

export const pageThreeStageFourTooltip = {
	elementId: "data-board",
	child: [],
	position: {
		top: null,
		right: 0,
		bottom: 24,
		left: 0,
	},
	text: "These are your pawns.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageThreeStageFiveModal = {
	position: {
		x: 0, // percentage of screen
		y: 65 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "Your opponent's pieces will start at the top of the board.  Their color will match your player color where their name is displayed."
}

export const pageThreeStageFiveTooltip = {
	elementId: "data-board",
	child: [],
	position: {
		top: 12,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "These are your opponent's pawns.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageThreeStageSixModal = {
	position: {
		x: 0, // percentage of screen
		y: 15 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "The small pawns next to the board are for tracking defeated pawns.  When a student pawn is defeated, it will be moved to this area."
}

export const pageThreeStageSixTooltip = {
	elementId: "defeated-pawns",
	child: [],
	position: {
		top: 0,
		right: 4,
		bottom: 0,
		left: null,
	},
	text: "Defeated pawns",
	arrowPosition: {
		x: "left",
		y: "center",
	}
}

export const pageThreeStageSevenModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "Your scrolls will be displayed at the bottom of the screen."
}

export const pageThreeStageSevenTooltip = {
	elementId: "player-cards",
	child: [0, 1],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "These are your scrolls.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageThreeStageEightModal = {
	position: {
		x: 0, // percentage of screen
		y: 70 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "Your opponent's scrolls will be displayed at the top of the screen."
}

export const pageThreeStageEightTooltip = {
	elementId: "opponent-cards",
	child: [0, 1],
	position: {
		top: null,
		right: 0,
		bottom: 16,
		left: 0,
	},
	text: "These are your opponent's scrolls.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageThreeStageNineModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "Notice the dimmed scroll in your player area below. This is a passive scroll.  When it is your turn, the passive scroll will be displayed next to your scrolls, indicating that it will be active on your next turn."
}

export const pageThreeStageNineTooltip = {
	elementId: "player-cards",
	child: [0, 1, 0],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Passive scroll",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageThreeStageTenModal = {
	position: {
		x: 0, // percentage of screen
		y: 0 // percentage of screen
	},
	moveable: false,
	headline: "Game Layout",
	body: "Note the scroll in your player area that is dimmed. This is the passive scroll.  When it is your turn, the passive scroll will be displayed next to your scrolls, indicating that it will be active on your next turn."
}

// No tooltip rendered in this stage
export const pageThreeStageTenTooltip = {
	elementId: "",
	child: [],
	position: {
		top: null,
		right: null,
		bottom: null,
		left: null,
	},
	text: "",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageFourStageOneModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 1: Choose a Scroll",
	body: "When your scrolls and player name are highlighted in amber, it is your turn.  Click one of your scrolls to activate it."
}

export const pageFourStageOneTooltip = {
	elementId: "player-cards",
	child: [0, 1],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Click an active scroll.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageFourStageTwoModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 1: Choose a Scroll",
	body: "The selected scroll will enlarge to indicate it has been activated. Every scroll has a color, title and action grid."
}

export const pageFourStageTwoTooltip = {
	elementId: "player-cards",
	child: [0, 1, 2],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "This is the activated scroll.",
	arrowPosition: {
		x: "right",
		y: "bottom",
	}
}

export const pageFourStageThreeModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Elements of a Scroll: Color",
	body: "The color of the scroll is only used in determining the first player.  When the game starts, if the inactive scroll is red, then the red player goes first.  If the inactive scroll is blue, then the blue player goes first."
}

export const pageFourStageThreeTooltip = {
	elementId: "player-cards",
	child: [0, 1, 0],
	position: {
		top: 16,
		right: null,
		bottom: null,
		left: 0,
	},
	text: "The color of the inactive scroll determines who goes first.",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageFourStageFourModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Elements of a Scroll: Title",
	body: "The title of the scroll is for identification purposes only.  It has no affect on gameplay."
}

export const pageFourStageFourTooltip = {
	elementId: "player-cards",
	child: [0, 1, 2],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "The title of the scroll is for identification purposes only.",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageFourStageFiveModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Elements of a Scroll: Action Grid",
	body: "The action grid depicts the actions available for that scroll.  The black space in the center of the grid represents the position of any pawn and all other highlighted spaces reflect the potential targets relative to its current position."
}

export const pageFourStageFiveTooltip = {
	elementId: "player-cards",
	child: [0, 1, 2],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: null,
	},
	text: "The action grid depicts the actions available for that scroll.",
	arrowPosition: {
		x: "right",
		y: "bottom",
	}
}

export const pageFourStageSixModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Movement Restrictions",
	body: "A pawn cannot move off the board and cannot move to a space occupied by a friendly pawn.  Pawns can jump over any other pawn to end its move on a valid space."
}

// No tooltip rendered in this stage
export const pageFourStageSixTooltip = {
	elementId: "",
	child: [],
	position: {
		top: null,
		right: null,
		bottom: null,
		left: null,
	},
	text: "",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageFourStageSevenModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Movement Restrictions",
	body: "It is possible that no pawns have any valid actions for a selected scroll.  If this is the case, you must select the other scroll to complete your turn."
}

// No tooltip rendered in this stage
export const pageFourStageSevenTooltip = {
	elementId: "",
	child: [],
	position: {
		top: null,
		right: null,
		bottom: null,
		left: null,
	},
	text: "",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageFourStageEightModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Elements of the Board",
	body: "Once you click a scroll, the board will update to show you all eligible pawns and their possible targets."
}

export const pageFourStageEightTooltip = {
	elementId: "board",
	child: [22],
	position: {
		top: 8,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Eligible pawns are highlighted in your player color.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageFourStageNineModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Elements of the Board",
	body: "The crosshair icons indicate spaces that you can move to with the activated scroll."
}

export const pageFourStageNineTooltip = {
	elementId: "board",
	child: [17],
	position: {
		top: null,
		right: 0,
		bottom: 8,
		left: 0,
	},
	text: "These are the spaces you can move to.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageFiveStageOneModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 2: Choose a Pawn",
	body: "After you select a scroll, select a highlighted pawn."
}

export const pageFiveStageOneTooltip = {
	elementId: "board",
	child: [],
	position: {
		top: null,
		right: 0,
		bottom: 12,
		left: 0,
	},
	text: "Click on any highlighted pawn.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageFiveStageTwoModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 2: Choose a Pawn",
	body: "Selecting a pawn will highlight the selected pawn and all eligible targets for the selected pawn."
}

export const pageFiveStageTwoTooltip = {
	elementId: "board",
	child: [21],
	position: {
		top: null,
		right: 0,
		bottom: 12,
		left: 0,
	},
	text: "The selected pawn",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageFiveStageThreeModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 2: Choose a Pawn",
	body: "If a target space is empty, a black crosshair icon will be displayed.  "
}

export const pageFiveStageThreeTooltip = {
	elementId: "board",
	child: [15],
	position: {
		top: null,
		right: 0,
		bottom: 8,
		left: 0,
	},
	text: "Eligible target space",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageFiveStageFourModal = {
	position: {
		x: 0, // percentage of screen
		y: 65 // percentage of screen
	},
	moveable: false,
	headline: "Step 2: Choose a Pawn",
	body: "Enemy pawn targets will display a white crosshair icon.  Moving to these spaces will result in defeating an enemy pawn.  If you defeat the enemy's master pawn, you win the game!"
}

export const pageFiveStageFourTooltip = {
	elementId: "board",
	child: [6],
	position: {
		top: 8,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Enemy pawn space",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageFiveStageFiveModal = {
	position: {
		x: 0, // percentage of screen
		y: 65 // percentage of screen
	},
	moveable: false,
	headline: "Step 2: Choose a Pawn",
	body: "Enemy temple targets also display a white crosshair icon.  If you move the master pawn to this space, you win the game!"
}

export const pageFiveStageFiveTooltip = {
	elementId: "board",
	child: [2],
	position: {
		top: 12,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Enemy temple space",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageFiveStageSixModal = {
	position: {
		x: 0, // percentage of screen
		y: 10 // percentage of screen
	},
	moveable: false,
	headline: "Step 2: Choose a Pawn",
	body: "If you select a pawn then change your mind, you can click either of your scrolls to show all eligible pawns for that scroll."
}

export const pageFiveStageSixTooltip = {
	elementId: "player-cards",
	child: [0, 1, 2],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: null,
	},
	text: "Click a scroll to reset pawns and targets.",
	arrowPosition: {
		x: "right",
		y: "bottom",
	}
}

export const pageSixStageOneModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 3: Choose a Target",
	body: "Once you have selected a valid pawn, click on any valid target space to move the selected pawn to that space."
}

export const pageSixStageOneTooltip = {
	elementId: "board",
	child: [15],
	position: {
		top: 8,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "Click a target space.",
	arrowPosition: {
		x: "center",
		y: "bottom",
	}
}

export const pageSixStageTwoModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 3: Choose a Target",
	body: "Once you select a valid target space, your turn will end.  The origin and destination spaces of your action will be highlighted."
}

export const pageSixStageTwoTooltip = {
	elementId: "board",
	child: [21],
	position: {
		top: null,
		right: 0,
		bottom: 12,
		left: 0,
	},
	text: "Your action is highlighted.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageSixStageThreeModal = {
	position: {
		x: 0, // percentage of screen
		y: 25 // percentage of screen
	},
	moveable: false,
	headline: "Step 3: Choose a Target",
	body: "At the end of your turn, the scroll you activated will become inactive and is now displayed near your opponent's scrolls.  The previously inactive scroll is now part of your hand and can be used on your next turn."
}

export const pageSixStageThreeTooltip = {
	elementId: "player-cards",
	child: [0, 1],
	position: {
		top: 16,
		right: 0,
		bottom: null,
		left: 0,
	},
	text: "The Frog scroll has been replaced with the Ox scroll.",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageSixStageFourModal = {
	position: {
		x: 0, // percentage of screen
		y: 70 // percentage of screen
	},
	moveable: false,
	headline: "Step 3: Choose a Target",
	body: "If you defeated a student pawn, it will be moved to the defeated pawns area."
}

export const pageSixStageFourTooltip = {
	elementId: "defeated-pawns",
	child: [],
	position: {
		top: 0,
		right: 4,
		bottom: null,
		left: null,
	},
	text: "One defeated red pawn",
	arrowPosition: {
		x: "left",
		y: "center",
	}
}

export const pageSixStageFiveModal = {
	position: {
		x: 0, // percentage of screen
		y: 20 // percentage of screen
	},
	moveable: false,
	headline: "Step 3: Choose a Target",
	body: "When your opponent completes their turn, the board will update to show the results of their actions."
}

export const pageSixStageFiveTooltip = {
	elementId: "board",
	child: [13],
	position: {
		top: null,
		right: 0,
		bottom: 16,
		left: 0,
	},
	text: "Your opponent's action is highlighted.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageSevenStageOneModal = {
	position: {
		x: 0, // percentage of screen
		y: 0 // percentage of screen
	},
	moveable: false,
	headline: "Game End",
	body: "Play continues until a master pawn is defeated or a temple space is occupied by any enemy master."
}

// No tooltip rendered in this stage
export const pageSevenStageOneTooltip = {
	elementId: "",
	child: [],
	position: {
		top: null,
		right: null,
		bottom: null,
		left: null,
	},
	text: "",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const pageSevenStageTwoModal = {
	position: {
		x: 0, // percentage of screen
		y: 20 // percentage of screen
	},
	moveable: false,
	headline: "Game End",
	body: "Once the game is completed, you can click 'Play Again' to restart the game with a new set of cards or click 'Exit' to return to the Lobby."
}

export const pageSevenStageTwoTooltip = {
	elementId: "winner-modal",
	child: [0, 0, 4],
	position: {
		top: null,
		right: 0,
		bottom: 16,
		left: 0,
	},
	text: "Click 'Play Again' or 'Exit'.",
	arrowPosition: {
		x: "center",
		y: "top",
	}
}

export const pageSevenStageThreeModal = {
	position: {
		x: 0, // percentage of screen
		y: 0 // percentage of screen
	},
	moveable: false,
	headline: "Game End",
	body: "This concludes the Onitama guide.  We hope you enjoy playing the game!"
}

// No tooltip rendered in this stage
export const pageSevenStageThreeTooltip = {
	elementId: "",
	child: [],
	position: {
		top: null,
		right: null,
		bottom: null,
		left: null,
	},
	text: "",
	arrowPosition: {
		x: "",
		y: "",
	}
}

export const allCards = [
	{
		id: "1",
		title: "Ox",
		kanji: "牛",
		moves: [8, 14, 18],
		color: "blue",
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: "2",
		title: "Rooster",
		kanji: "雞",
		moves: [9, 12, 14, 17],
		color: "blue",
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: "3",
		title: "Horse",
		kanji: "馬",
		moves: [8, 12, 18],
		color: "red",
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: "4",
		title: "Goose",
		kanji: "鹿",
		moves: [7, 12, 14, 19],
		color: "red",
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: "5",
		title: "Frog",
		kanji: "蟲",
		moves: [7, 11, 19],
		color: "red",
		createdAt: new Date(),
		updatedAt: new Date()
	},
]

export const game = {
	players: {
		red: {
			id: "2",
			cards: [allCards[1], allCards[3]]
		},
		blue: {
			id: "1",
			cards: [allCards[2], allCards[4]]
		}
	},
	board: [
		["rs00", "rs00", "rm00", "rs00", "rs00"],
		["0000", "0000", "0000", "0000", "0000"],
		["0000", "0000", "0000", "0000", "0000"],
		["0000", "0000", "0000", "0000", "0000"],
		["bs00", "bs00", "bm00", "bs00", "bs00"],
	],
	turn: "blue",
	status: "in_progress",
	users: [
		{
			id: "1",
			email: "david@example.com",
			first_name: "David",
			last_name: "Doe",
			created_at: new Date(),
			updated_at: new Date()
		},
		{
			id: "2",
			email: "ashley@example.com",
			first_name: "Ashley",
			last_name: "Doe",
			created_at: new Date(),
			updated_at: new Date()
		}
	],
	cards: allCards,
};

export const pageFourStageTwoBoard = [
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["000x", "000x", "000x", "000x", "0000"],
	["bs00", "bsh0", "bmh0", "bsh0", "bsh0"],
]

export const pageFiveStageTwoBoard = [
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["000x", "0000", "0000", "0000", "0000"],
	["bs00", "bsh0", "bm00", "bs00", "bs00"],
]

export const pageFiveStageThreeBoard = [
	["rs00", "0000", "000x", "rs00", "rs00"],
	["0000", "rs0x", "bmh0", "rm00", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "bs00", "0000", "0000", "bs00"],
	["bs00", "0000", "bs00", "0000", "0000"],
]

export const pageFiveStageSixBoard = [
	["rs00", "000x", "0000", "rs00", "rs00"],
	["000x", "rs00", "bsh0", "rm00", "0000"],
	["000x", "0000", "0000", "000x", "0000"],
	["0000", "bsh0", "000x", "0000", "bsh0"],
	["bs00", "000x", "bm00", "0000", "0000"],
]

export const pageSixStageTwoBoard = [
	["rs00", "rs00", "rm00", "rs00", "rs00"],
	["0000", "0000", "0000", "0000", "0000"],
	["0000", "0000", "0000", "0000", "0000"],
	["bsh0", "0000", "0000", "0000", "0000"],
	["bs00", "b0h0", "bm00", "bs00", "bs00"],
]

export const pageSixStageFourBoard = [
	["rs00", "0000", "0000", "0000", "rs00"],
	["0000", "0000", "rm00", "rs00", "0000"],
	["0000", "0000", "0000", "bsh0", "0000"],
	["bs00", "bm00", "0000", "0000", "b0h0"],
	["bs00", "0000", "0000", "bs00", "0000"],
]

export const pageSixStageFiveBoard = [
	["rs00", "0000", "0000", "0000", "rs00"],
	["0000", "0000", "r0h0", "rs00", "0000"],
	["0000", "0000", "0000", "rmh0", "0000"],
	["bs00", "bm00", "0000", "0000", "0000"],
	["bs00", "0000", "0000", "bs00", "0000"],
]

export const pageThreeStageOneNotification = {
	type: "system",
	message: "The game has started.  Please select a card.",
	duration: 0,
	delay: 0,
	action: ""
};

export const pageSixStageTwoPlayers = {
	red: {
		id: "2",
		cards: [allCards[1], allCards[3]]
	},
	blue: {
		id: "1",
		cards: [allCards[2], allCards[0]]
	}
};

export const pageSixStageFivePlayers = {
	red: {
		id: "2",
		cards: [allCards[1], allCards[4]]
	},
	blue: {
		id: "1",
		cards: [allCards[2], allCards[0]]
	}
};
