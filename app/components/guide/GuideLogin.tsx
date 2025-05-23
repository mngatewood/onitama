import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { GuideModal } from "./GuideModal";
import { GuideTooltip } from "./GuideTooltip";
import { GuideDarkModeToggle } from "../../components/guide/GuideDarkThemeToggle";


interface GuideLoginProps {
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
		child: number[];
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
	updateStage: ( newStage: number ) => void;
	}

export const GuideLogin = ({ modal, tooltip, stage, updateStage }: GuideLoginProps) => {

	return (
		<>
			<div className="relative bg-neutral-300 dark:bg-blue-2 border-slate-600 border-solid border-4 w-[90vw] h-[90vh] rounded-3xl p-24">
				<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
					<div>
						<h1 className="guide relative text-4xl text-center text-blue-1 dark:text-yellow-1 mx-8 mt-8 mb-3 font-reggae landscape:text-xl landscape:m-2 landscape:md:short:m-8">Onitama</h1>
					</div>
					<form method="post" className="mt-8">
						<div className={'guide mb-4 flex w-full flex-col space-y-2'}>
							<Label htmlFor="email">Email Address *</Label>
							<Input
								id="email"
								name="email"
								type="email"
								role="textbox"
								autoComplete="email"
								required
							/>
						</div>
						<div className={'guide mb-4 flex w-full flex-col space-y-2'}>
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								name="password"
								type="password"
								role="textbox"
								autoComplete="new-password"
								required
							/>
						</div>
						<div className="guide mb-8">
							<span className="text-sm text-gray-500 dark:text-gray-400">* required</span>
						</div>
						<button
							className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75"
							type="submit"
							id="submit-login"
						>
							Submit
							<span
								className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
							></span>
							<span
								className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
							></span>
						</button>
						<div className="guide flex justify-center items-center h-12">
							<span className="text-sm text-red-500"></span>
						</div>
					</form>
					<div className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 z-50 rounded-full">
						<button className="guide w-1/3 cursor-default">
							<div className="relative">
								<span>Cancel</span>
							</div>
						</button>
					</div>
					<GuideDarkModeToggle />
				</div>
			</div>
			<GuideModal modal={modal} stage={stage} updateStage={updateStage}/>
			<GuideTooltip tooltip={tooltip} />
		</>
	);
}
