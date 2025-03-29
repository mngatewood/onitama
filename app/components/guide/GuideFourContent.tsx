"use client"

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GuideGame } from "./GuideGame";
import { TransitionLink } from "../utils/TransitionLink";
import * as data from "./guideData";

export function GuideFourContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const gameId = searchParams?.get("gameId");
	const [stage, setStage] = useState<number>(1);

	const previousLink = gameId ? `/guide/3?gameId=${gameId}` : "/guide/3";
	const nextLink = gameId ? `/guide/5?gameId=${gameId}` : "/guide/5";
	const homeLink = gameId ? `/play/${gameId}` : "/";

	const updateStage = (newStage: number) => {
		if (newStage === 0) {
			router.push(`/guide/3${gameId ? `?gameId=${gameId}` : ''}`);
		} else if (newStage > 9) {
			router.push(`/guide/5${gameId ? `?gameId=${gameId}` : ''}`);
		} else {
			setStage(newStage);
		}
	}

	return (
		<>
			<main className="w-full min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col justify-center items-center h-[calc(100vh-140px)] landscape:p-2">
				{stage === 1 &&
					<GuideGame
						modal={data.pageFourStageOneModal}
						tooltip={data.pageFourStageOneTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 2 &&
					<GuideGame
						modal={data.pageFourStageTwoModal}
						tooltip={data.pageFourStageTwoTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 3 &&
					<GuideGame
						modal={data.pageFourStageThreeModal}
						tooltip={data.pageFourStageThreeTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 4 &&
					<GuideGame
						modal={data.pageFourStageFourModal}
						tooltip={data.pageFourStageFourTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 5 &&
					<GuideGame
						modal={data.pageFourStageFiveModal}
						tooltip={data.pageFourStageFiveTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 6 &&
					<GuideGame
						modal={data.pageFourStageSixModal}
						tooltip={data.pageFourStageSixTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 7 &&
					<GuideGame
						modal={data.pageFourStageSevenModal}
						tooltip={data.pageFourStageSevenTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 8 &&
					<GuideGame
						modal={data.pageFourStageEightModal}
						tooltip={data.pageFourStageEightTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
				{stage === 9 &&
					<GuideGame
						modal={data.pageFourStageNineModal}
						tooltip={data.pageFourStageNineTooltip}
						stage={stage}
						updateStage={updateStage}
						page={4}
					/>
				}
			</main>
			<footer className="w-full h-10 text-sm xxs:text-base portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-2/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={previousLink} className="relative">
						<span className="whitespace-nowrap">&lt;&lt;&nbsp;Game Layout</span>
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
						<span className="whitespace-nowrap">Choose a Pawn&nbsp;&gt;&gt;</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
			</footer>
		</>
	);
}