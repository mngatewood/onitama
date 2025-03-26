import Image from "next/image";
import spirit from "../../../public/spirit.png";
import { GuideModal } from "../../components/guide/GuideModal";
import { GuideTooltip } from "../../components/guide/GuideTooltip";
import { GuideDarkModeToggle } from "../../components/guide/GuideDarkThemeToggle";

interface GuideHomeProps {
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

export const GuideHome = ({modal, tooltip, stage, updateStage}: GuideHomeProps) => {

	return (
		<>
			<div className="relative bg-neutral-300 dark:bg-blue-2 border-slate-600 border-solid border-4 w-[90vw] h-[90vh] rounded-3xl p-24">
				<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
					<div>
						<h1 className="guide relative text-4xl text-center text-blue-1 dark:text-yellow-1 mx-8 mt-8 mb-3 font-reggae landscape:text-xl landscape:m-2 landscape:md:short:m-8">Onitama</h1>
					</div>
					<main className="guide p-4 overflow-hidden flex flex-col justify-center items-center my-auto w-full">
						<div className="relative h-auto w-11/12 max-w-2xl overflow-scroll px-4 text-blue-1 text-justify font-reggae dark:text-neutral-200 scroll-no-bars bg-neutral-200/80 dark:bg-blue-1/80 md:rounded-2xl md:px-8 md:pt-8">
							<p className="my-4">In the mist-shrouded valley of Onitama, two master martial artists lead their students in a sacred duel of wits and skill. The temple grounds serve as both battlefield and proving ground, where each move is guided by ancient teachings passed down through generations.</p>
							<p className="my-4">With each step, the masters draw upon the wisdom of the ancestors, channeling the grace of the mantis, the unyielding strength of the dragon, or the swift precision of the tiger. Their students, disciplined and eager, mirror these teachings, moving in harmony with their master’s guidance.</p>
							<p className="my-4">Victory is achieved not through brute force, but through foresight and adaptability. To claim the title of supreme master, one must either strike down the rival master with a decisive blow or traverse the battlefield with the serenity of a flowing stream, reaching the heart of the opposing temple.</p>
							<p className="my-4">As the duel unfolds, strategy and patience shape destiny, reminding all who play that mastery is not merely about movement—it is about understanding the ever-changing rhythm of the fight.</p>
						</div>
						<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
							<Image src={spirit} width={640} height={640} alt="Spirit" priority />
						</div>
					</main>
					<div className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300  z-50 rounded-full">
						<button className="guide w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
							<div id="login-button" className="relative">
								<span>Login</span>
							</div>
						</button>
						<button className="guide w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
							<div className="relative">
								<span>Guide</span>
							</div>
						</button>
						<button id="register-button" className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
							<div className="relative">
								<span>Register</span>
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
