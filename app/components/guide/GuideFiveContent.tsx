"use client"

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GuideGame } from "./GuideGame";
import { TransitionLink } from "../utils/TransitionLink";
import * as data from "./guideData";

export function GuideFiveContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const gameId = searchParams?.get("gameId");
	const [stage, setStage] = useState<number>(1);

	const previousLink = gameId ? `/guide/4?gameId=${gameId}` : "/guide/4";
	const nextLink = gameId ? `/guide/6?gameId=${gameId}` : "/guide/6";
	const homeLink = gameId ? `/play/${gameId}` : "/";

	const updateStage = (newStage: number) => {
		if (newStage === 0) {
			router.push(`/guide/4${gameId ? `?gameId=${gameId}` : ''}`);
		} else if (newStage > 6) {
			router.push(`/guide/6${gameId ? `?gameId=${gameId}` : ''}`);
		} else {
			setStage(newStage);
		}
	}

	return (
		<>
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
				<button className="w-2/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={previousLink} className="relative">
						<span className="whitespace-nowrap">&lt;&lt;&nbsp;Choose a Scroll</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-1/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={homeLink} className="relative">
						<span>{gameId ? "Game" : "Home"}</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-2/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={nextLink} className="relative">
						<span className="whitespace-nowrap">Choose a Target&nbsp;&gt;&gt;</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
			</footer>
		</>
	);
}