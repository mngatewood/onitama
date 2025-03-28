import React from "react";

interface WinnerModalProps {
	winner: string;
	userColor: string;
	playAgain: () => void;
	isVisible: boolean;
}

export const WinnerModal = ({ winner, userColor, playAgain, isVisible }: WinnerModalProps) => {

	const heading = userColor === winner ? "Congratulations!" : "Better luck next time!";
	const [position, setPosition] = React.useState<string>("upOrLeft");
	const positionClass = position === "upOrLeft" 
		? "absolute transition-all duration-500 ease-in-out top-0 bottom-0 left-1/4 -translate-x-1/2 portrait:top-0 portrait:bottom-0 portrait:left-0 portrait:right-0 portrait:translate-x-0 portrait:translate-y-0"
		: "absolute transition-all duration-500 ease-in-out top-0 bottom-0 left-1/2 translate-x-1/4 portrait:top-0 portrait:bottom-0 portrait:left-0 portrait:right-0 portrait:translate-x-0 portrait:translate-y-[50%]"; 
	const visibility = isVisible ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95";

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
		setPosition(position === "upOrLeft" ? "downOrRight" : "upOrLeft");
	}

	return (
		<div className={`${positionClass} ${visibility} flex flex-col justify-center items-center mx-auto landscape:max-w-[50%] transition-all duration-500 ease-in-out`}>
			<div className="flex flex-col justify-center items-center mx-auto mt-6 p-8 border border-neutral-800 text-neutral-800 bg-gray-200 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-2xl">
				<div className="relative top-0 left-1/2 w-0 h-0 flex justify-center items-center">

					<div className="portrait:block landscape:hidden">
						<button onClick={handleTogglePosition} className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
							{position === "upOrLeft" ? (
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[3px]">
									<path d="M8 12L3 4h10L8 12Z" fill="white" /> {/* Downward triangle */}
								</svg>
							) : (
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-[3px]">
									<path d="M8 4L3 12h10L8 4Z" fill="white" /> {/* Upward triangle */}
								</svg>
							)}
						</button>
					</div>

					<div className="portrait:hidden landscape:block">
						<button onClick={handleTogglePosition} className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
							{position === "downOrRight" ? (
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-[3px]">
									<path d="M4 8L12 3v10L4 8Z" fill="white" /> {/* Left-pointing triangle */}
								</svg>
							) : (
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-[3px]">
									<path d="M12 8L4 3v10L12 8Z" fill="white" /> {/* Right-pointing triangle */}
								</svg>
							)}
						</button>
					</div>
				</div>
				<h2 className="text-xl font-bold">{heading}</h2>
				<p className="mt-2 max-w-sm text-sm">The game is over and {winner.toUpperCase()} has won the game.  Click Play Again to start a new game or Exit to return to the lobby.</p>
				<button onClick={handlePlayAgain} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">Play Again</button>
				<button onClick={handleExit} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">Exit</button>
			</div>
		</div>
	);
}