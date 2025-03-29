"use client"

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TransitionLink } from "../utils/TransitionLink";
import { GuideGame } from "./GuideGame";
import * as data from "./guideData";

export function GuideThreeContent() {
	const searchParams = useSearchParams();
	const [stage, setStage] = useState<number>(1);

	if (!searchParams) {
		return null;
	}

	const gameId = searchParams.get("gameId");
	const previousLink = gameId ? `/guide/2?gameId=${gameId}` : "/guide/2";
	const nextLink = gameId ? `/guide/4?gameId=${gameId}` : "/guide/4";
	const homeLink = gameId ? `/play/${gameId}` : "/";

	const updateStage = (newStage: number) => {
		if (newStage === 0) {
			window.location.href = "/guide/2";
		} else if (newStage > 9) {
			window.location.href = "/guide/4";
		} else {
			setStage(newStage);
		}
	}

	return (
		<>
			<main className="w-full min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col justify-center items-center h-[calc(100vh-140px)] landscape:p-2">
				{stage === 1 &&
					<GuideGame
						modal={data.pageThreeStageOneModal}
						tooltip={data.pageThreeStageOneTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 2 &&
					<GuideGame
						modal={data.pageThreeStageTwoModal}
						tooltip={data.pageThreeStageTwoTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 3 &&
					<GuideGame
						modal={data.pageThreeStageThreeModal}
						tooltip={data.pageThreeStageThreeTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 4 &&
					<GuideGame
						modal={data.pageThreeStageFourModal}
						tooltip={data.pageThreeStageFourTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 5 &&
					<GuideGame
						modal={data.pageThreeStageFiveModal}
						tooltip={data.pageThreeStageFiveTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 6 &&
					<GuideGame
						modal={data.pageThreeStageSixModal}
						tooltip={data.pageThreeStageSixTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 7 &&
					<GuideGame
						modal={data.pageThreeStageSevenModal}
						tooltip={data.pageThreeStageSevenTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 8 &&
					<GuideGame
						modal={data.pageThreeStageEightModal}
						tooltip={data.pageThreeStageEightTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
				{stage === 9 &&
					<GuideGame
						modal={data.pageThreeStageNineModal}
						tooltip={data.pageThreeStageNineTooltip}
						stage={stage}
						updateStage={updateStage}
						page={3}
					/>
				}
			</main>
			<footer className="w-full h-10 text-sm xxs:text-base portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={previousLink} className="relative">
						<span className="whitespace-nowrap">&lt;&lt;&nbsp; Start a Game</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={homeLink} className="relative">
						<span>{gameId ? "Game" : "Home"}</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={nextLink} className="relative">
						<span className="whitespace-nowrap">Choose a Scroll &nbsp;&gt;&gt;</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
			</footer>
		</>
	);
}