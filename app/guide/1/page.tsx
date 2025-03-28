"use client";

import { useState } from "react";
import Image from "next/image";
import spirit from "../../../public/spirit.png";
import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/DarkThemeToggle";
import Link from "next/link";
import { GuideModal } from "../../components/guide/GuideModal";
import * as data from "../../components/guide/guideData";

const GuidePageOne = () => {

	const [stage, setStage] = useState<number>(1);

	const updateStage = ( newStage: number ) => {
		if (newStage === 0) {
			window.location.href = "/";
		} else if (newStage > 2) {
			window.location.href = "/guide/2";
		} else {
			setStage(newStage);
		}
	}
	
	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center my-auto w-full">
				<div className="relative h-auto w-screen max-w-2xl overflow-scroll px-4 text-blue-1 text-justify dark:text-neutral-200 scroll-no-bars bg-neutral-200/80 dark:bg-blue-1/80 md:rounded-2xl md:px-8 md:pt-8">
					<h2 className="text-2xl font-bold underline text-center">Game Overview</h2>
					<p className="my-4">The sacred duel begins with both masters and their students taking their places upon the temple grounds. Each player aligns their five pawns&mdash;four loyal students and one revered master&mdash;on opposite sides of the 5x5 battlefield. Before them, the ancient scrolls of movement are revealed: five techniques, drawn from the archives of martial wisdom. Two are granted to each player, while the final scroll rests beside the board, waiting to shift the tides of battle.</p>
					<p className="my-4">With every turn, a player must choose one of their two available techniques, guiding a pawn across the board in the pattern dictated by the scroll. Once a technique is used, its wisdom is relinquished&mdash;placed aside and replaced with the waiting scroll, ensuring that the flow of combat is ever-changing.</p>
					<p className="my-4">The battle continues as players outmaneuver each other, anticipating strikes and positioning themselves for the final blow. Victory may come in one of two ways:</p>
					<ul className="my-4 list-disc list-inside">
						<li className="my-2 ml-4 list-outside"><strong>The Way of the Stone:</strong> By capturing the opposing master, proving dominance through superior tactics.</li>
						<li className="my-2 ml-4 list-outside"><strong>The Way of the Stream:</strong> By guiding one’s own master into the enemy’s temple, symbolizing the ultimate conquest of space and strategy.</li>
					</ul>
					<p className="my-4">With each passing turn, the duel unfolds like a story of discipline and adaptability. The battlefield is small, but the depth of possibilities is vast, making every match a unique test of foresight and skill. Only one master will emerge victorious, their name forever etched in the annals of Onitama’s sacred tradition.</p>
					<div className="flex flex-col items-center">
						<div className="my-4 px-4 py-2 group hover:bg-slate-600 transition-all duration-500 ease-in-out rounded-lg bg-slate-500 text-neutral-200">
							<button onClick={() =>updateStage(2)} className="relative">
								<span>Continue</span>
							</button>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
					<Image src={spirit} width={640} height={640} alt="Spirit" priority />
				</div>
				{ stage === 2 &&
					<GuideModal 
						modal={data.pageOneStageOneModal}
						stage={stage}
						updateStage={updateStage}
					/>
				}
			</main>
			<footer className="w-full h-10 text-sm xxs:text-base portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<div className="w-2/5">
				</div>
				<button className="w-1/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/" className="relative">
						<span>Home</span>
						<span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
						<span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
					</Link>
				</button>
				<button className="w-2/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/guide/2" className="relative">
						<span className="whitespace-nowrap">Start a Game &nbsp;&gt;&gt;</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default GuidePageOne;