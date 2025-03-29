"use client"

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GuideHome } from "./GuideHome";
import { GuideRegister } from "./GuideRegister";
import { GuideLogin } from "./GuideLogin";
import { GuideLobby } from "./GuideLobby";
import { TransitionLink } from "../utils/TransitionLink";
import * as data from "./guideData";

export function GuideTwoContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const gameId = searchParams?.get("gameId");
	const [stage, setStage] = useState<number>(1);

	const previousLink = gameId ? `/guide/1?gameId=${gameId}` : "/guide/1";
	const nextLink = gameId ? `/guide/3?gameId=${gameId}` : "/guide/3";
	const homeLink = gameId ? `/play/${gameId}` : "/";

	const updateStage = (newStage: number) => {
		if (newStage === 0) {
			router.push(`/guide/1${gameId ? `?gameId=${gameId}` : ''}`);
		} else if (newStage > 6) {
			router.push(`/guide/3${gameId ? `?gameId=${gameId}` : ''}`);
		} else {
			setStage(newStage);
		}
	}

	return (
		<>
			<main className="w-full min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col justify-center items-center h-[calc(100vh-140px)] landscape:p-2">
				{stage === 1 &&
					<GuideHome
						modal={data.pageTwoStageOneModal}
						tooltip={data.pageTwoStageOneTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 2 &&
					<GuideRegister
						modal={data.pageTwoStageTwoModal}
						tooltip={data.pageTwoStageTwoTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 3 &&
					<GuideLogin
						modal={data.pageTwoStageThreeModal}
						tooltip={data.pageTwoStageThreeTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 4 &&
					<GuideLobby
						modal={data.pageTwoStageFourModal}
						tooltip={data.pageTwoStageFourTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 5 &&
					<GuideLobby
						modal={data.pageTwoStageFiveModal}
						tooltip={data.pageTwoStageFiveTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 6 &&
					<GuideLobby
						modal={data.pageTwoStageSixModal}
						tooltip={data.pageTwoStageSixTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
			</main>
			<footer className="w-full h-10 text-sm xxs:text-base portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-2/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={previousLink} className="relative">
						<span className="whitespace-nowrap">&lt;&lt;&nbsp; Game Overview</span>
						<span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-1/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={homeLink} className="relative">
						<span>{gameId ? "Game" : "Home"}</span>
						<span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
						<span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
					</TransitionLink>
				</button>
				<button className="w-2/5 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={nextLink} className="relative">
						<span className="whitespace-nowrap">Game Layout &nbsp;&gt;&gt;</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
			</footer>
		</>
	);
}