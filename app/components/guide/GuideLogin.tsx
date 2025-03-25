import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import { DarkModeToggle } from "../DarkThemeToggle";
import { GuideModal } from "./GuideModal";
import { GuideTooltip } from "./GuideTooltip";

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
			<form method="post" className="guide mt-8">
				<div className={'mb-4 flex w-full flex-col space-y-2'}>
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
				<div className={'mb-4 flex w-full flex-col space-y-2'}>
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
				<div className="mb-8">
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
				<div className="flex justify-center items-center h-12">
					<span className="text-sm text-red-500"></span>
				</div>
				<DarkModeToggle />
			</form>
			<GuideModal modal={modal} stage={stage} updateStage={updateStage}/>
			<GuideTooltip tooltip={tooltip} />
		</>
	);
}
