import { GuideModal } from "../../components/guide/GuideModal";
import { GuideTooltip } from "../../components/guide/GuideTooltip";
import { GuideDarkModeToggle } from "./GuideDarkThemeToggle";

interface GuideLobbyProps {
	modal: {
		position: {
			x: number;
			y: number;
		};
		moveable: boolean;
		headline: string;
		body: string;
	};
	tooltip: {
		elementId: string;
		position: {
			top: number | null;
			right: number | null;
			bottom: number | null;
			left: number | null;
		};
		text: string;
		arrowPosition: {
			x: string;
			y: string;
		};
	};
	stage: number;
	updateStage: (newStage: number) => void;
}

export const GuideLobby = ({ modal, tooltip, stage, updateStage }: GuideLobbyProps) => {

	const pendingGames = [
		{
			id: "1",
			name: "David",
			time: "3:53",
		},
		{
			id: "2",
			name: "Linda",
			time: "3:48",
		},
		{
			id: "3",
			name: "Ashley",
			time: "3:42",
		},
	]

	return (
		<>
			<div className="relative bg-neutral-300 dark:bg-blue-2 border-slate-600 border-solid border-4 w-[90vw] h-[90vh] rounded-3xl p-24">
				<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center m-8">
					<div>
						<h1 className="guide relative text-4xl text-center text-blue-1 dark:text-yellow-1 mx-8 mt-8 mb-3 font-reggae landscape:text-xl landscape:m-2 landscape:md:short:m-8">Onitama</h1>
					</div>
					<div className="mx-auto overflow-y-scroll scroll-no-bars w-full max-w-md rounded-none border border-gray-300 bg-amber-50 px-4 pt-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:px-8 md:pt-8">
						<h2 className="guide text-xl font-bold text-neutral-800 dark:text-neutral-200">Game Lobby</h2>
						<p className="guide my-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
							Create a new game or join an existing one
						</p>
						<button
							className={`${stage !== 4 && "guide"} group/btn relative block h-10 my-6 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75`}
							id="new-game-button"
						>
							New Game
							<span
								className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
							></span>
							<span
								className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
							></span>
						</button>
						<div className="flex justify-center items-center min-h-28">
							{stage === 6 ? (
								<div id="join-game-container" className="game-join-list flex flex-col gap-2 w-full mb-4 py-2 max-h-48 overflow-y-scroll scroll-no-bars">
									{pendingGames.map((game) => (
										<button key={game.id} className="game-join-entry group/btn flex justify-between items-center shrink-0 h-10 w-full rounded-md border border-gray-300 bg-amber-50 px-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-neutral-300 text-gray-800 font-bold dark:hover:bg-neutral-100 hover:text-gray-900 cursor-pointer">
											<div className="game-host-name w-1/3 text-left group-hover/btn:opacity-50">
												{game.name}
											</div>
											<div className="w-1/3 text-center hidden group-hover/btn:block">
												Join
											</div>
											<div className="game-created-at w-1/3 text-right group-hover/btn:opacity-50">
												{game.time}
											</div>
										</button>
									))}
								</div>
							) : (
								<div>
										<p className="text-slate-700 dark:text-gray-400">No pending games to display.</p>
								</div>
							)}
						</div>
					</div>
					<div className="guide w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 rounded-full">
						<button className="w-1/3 group cursor-default">
							<div id="login-button" className="relative">
								<span>Logout</span>
							</div>
						</button>
						<button id="register-button" className="w-1/3 group cursor-default">
							<div className="relative">
								<span>Guide</span>
							</div>
						</button>
					</div>
				</div>
				{ stage === 5 &&			
					<div id="new-game-container" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-3/4 max-w-xs p-8 text-neutral-800 bg-gray-300 shadow-[0px_0px_100px_0px_rgba(0,0,0,0.7)] dark:shadow-[0px_0px_100px_0px_rgba(255,255,255,0.7)] rounded-2xl transition-all duration-500 ease-in-out">
						<h2 className="text-xl font-bold">New Game</h2>
						<p className="mt-2 max-w-sm text-sm">Select solo or multiplayer game.</p>
						<button className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
							Solo
						</button>
						<button className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
							Multiplayer
						</button>
						<button className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
							Cancel
						</button>
					</div>
				}
				<GuideDarkModeToggle />
			</div>
			<GuideModal modal={modal} stage={stage} updateStage={updateStage}/>
			<GuideTooltip tooltip={tooltip} />
		</>
	)
}
