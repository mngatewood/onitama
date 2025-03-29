"use client"

import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/ui/DarkThemeToggle";
import { GuideGame } from "../../components/guide/GuideGame";
import * as data from "../../components/guide/guideData"
import { useState } from "react";
import { TransitionLink } from "@/app/components/utils/TransitionLink";

const GuidePageFive = () => {

	const [stage, setStage] = useState<number>(1);

	const updateStage = ( newStage: number ) => {
		if (newStage === 0) {
			window.location.href = "/guide/4";
		} else if (newStage > 6) {
			window.location.href = "/guide/6";
		} else {
			setStage(newStage);
		}
	}

	return (
		<div className="transition absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="w-full min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col justify-center items-center h-[calc(100vh-140px)] landscape:p-2">
				{stage === 1 && 
					<GuideGame 
						modal={data.pageFiveStageOneModal}
						tooltip={data.pageFiveStageOneTooltip}
						stage={stage}
						updateStage={updateStage}
						page={5}
						/>
				}
				{stage === 2 && 
					<GuideGame 
						modal={data.pageFiveStageTwoModal}
						tooltip={data.pageFiveStageTwoTooltip}
						stage={stage}
						updateStage={updateStage}
						page={5}
						/>
				}
				{stage === 3 && 
					<GuideGame 
						modal={data.pageFiveStageThreeModal}
						tooltip={data.pageFiveStageThreeTooltip}
						stage={stage}
						updateStage={updateStage}
						page={5}
						/>
				}
				{stage === 4 && 
					<GuideGame 
						modal={data.pageFiveStageFourModal}
						tooltip={data.pageFiveStageFourTooltip}
						stage={stage}
						updateStage={updateStage}
						page={5}
						/>
				}
				{stage === 5 && 
					<GuideGame 
						modal={data.pageFiveStageFiveModal}
						tooltip={data.pageFiveStageFiveTooltip}
						stage={stage}
						updateStage={updateStage}
						page={5}
						/>
				}
				{stage === 6 && 
					<GuideGame 
						modal={data.pageFiveStageSixModal}
						tooltip={data.pageFiveStageSixTooltip}
						stage={stage}
						updateStage={updateStage}
						page={5}
						/>
				}
			</main>
			<footer className="w-full h-10 text-sm xxs:text-base portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href="/guide/4" className="relative">
						<span className="whitespace-nowrap">&lt;&lt;&nbsp;Choose a Scroll</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href="/" className="relative">
						<span>Home</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href="/guide/6" className="relative">
						<span className="whitespace-nowrap">Choose a Target&nbsp;&gt;&gt;</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default GuidePageFive;