interface NewGameModalProps {
	handleNewSoloGame: () => void;
	handleNewMultiplayerGame: () => void;
	handleCancelNewGame: () => void;
	isVisible: boolean;
}
export const NewGameModal: React.FC<NewGameModalProps> = ({ handleNewSoloGame, handleNewMultiplayerGame, handleCancelNewGame, isVisible }) => {

	const visibility = isVisible ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95";

	return (
		<div className={`${visibility} absolute flex flex-col justify-center items-center mx-auto p-8 text-neutral-800 bg-gray-200 shadow-[0px_0px_100px_0px_rgba(0,0,0,0.7)] dark:shadow-[0px_0px_100px_0px_rgba(255,255,255,0.7)] rounded-2xl transition-all duration-500 ease-in-out`}>
			<h2 className="text-xl font-bold">New Game</h2>
			<p className="mt-2 max-w-sm text-sm">Select solo or multiplayer game.</p>
			<button onClick={handleNewSoloGame} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">
				Solo
			</button>
			<button onClick={handleNewMultiplayerGame} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">
				Multiplayer
			</button>
			<button onClick={handleCancelNewGame} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">
				Cancel
			</button>
		</div>
	);
}