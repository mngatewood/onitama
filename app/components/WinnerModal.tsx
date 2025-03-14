import React from "react";

interface WinnerModalProps {
	winner: string;
	userColor: string;
	playAgain: () => void
}

export const WinnerModal = ({ winner, userColor, playAgain }: WinnerModalProps) => {

	const heading = userColor === winner ? "Congratulations!" : "Better luck next time!";
	const [position, setPosition] = React.useState<string>("up");
	const positionClass = position === "up" 
		? "absolute top-0 bottom-0 left-1/4 -translate-x-1/2 portrait:top-0 portrait:bottom-0 portrait:left-0 portrait:right-0 portrait:translate-x-0"
		: "absolute top-0 bottom-0 left-1/4 -translate-x-1/2 portrait:top-auto portrait:bottom-16 portrait:left-0 portrait:right-0 portrait:translate-x-0" 

	const handleExit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		window.location.href = "/";
	}

	const handlePlayAgain = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		playAgain();
	}

	const handleTogglePosition = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setPosition(position === "up" ? "down" : "up");
	}

	return (
		<div className={`${positionClass} flex flex-col justify-center items-center mx-auto`}>
			<div className="flex flex-col justify-center items-center mx-auto mt-6 p-8 border border-neutral-800 text-neutral-800 bg-gray-200 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-2xl">
				<div className="relative top-0 left-1/2 w-0 h-0 flex justify-center items-center landscape:hidden">
					<button onClick={handleTogglePosition} className="absolute w-8 h-8 rounded-full bg-red-700">
						<span className="text-white">{position === "up" ? "⏷" : "⏶"}</span>
					</button>
				</div>
				<h2 className="text-xl font-bold">{heading}</h2>
				<p className="mt-2 max-w-sm text-sm">The game is over and {winner.toUpperCase()} has won the game.  Click Play Again to start a new game or Exit to return to the lobby.</p>
				<button onClick={handlePlayAgain} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">Play Again</button>
				<button onClick={handleExit} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">Exit</button>
			</div>
		</div>
	);
}