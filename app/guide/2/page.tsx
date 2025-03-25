"use client"

import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/DarkThemeToggle";
import Link from "next/link";
import { useState } from "react";
import { GuideHome } from "../../components/guide/GuideHome";
import { GuideRegister } from "../../components/guide/GuideRegister";
import { GuideLogin } from "../../components/guide/GuideLogin";
import { GuideLobby } from "../../components/guide/GuideLobby";
import * as data from "../guideData"

const GuidePageTwo = () => {

	const [stage, setStage] = useState<number>(1);

	const updateStage = ( newStage: number ) => {
		if (newStage === 0) {
			window.location.href = "/guide/1";
		} else if (newStage > 6) {
			window.location.href = "/guide/3";
		} else {
			setStage(newStage);
		}
	}

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="w-full min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col justify-center items-center h-[calc(100vh-140px)] landscape:p-2">
				{stage === 1 && 
					<GuideHome 
						modal={data.stageOneModal}
						tooltip={data.stageOneTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 2 && 
					<GuideRegister 
						modal={data.stageTwoModal}
						tooltip={data.stageTwoTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 3 && 
					<GuideLogin 
						modal={data.stageThreeModal}
						tooltip={data.stageThreeTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 4 && 
					<GuideLobby 
						modal={data.stageFourModal}
						tooltip={data.stageFourTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 5 && 
					<GuideLobby 
						modal={data.stageFiveModal}
						tooltip={data.stageFiveTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
				{stage === 6 && 
					<GuideLobby 
						modal={data.stageSixModal}
						tooltip={data.stageSixTooltip}
						stage={stage}
						updateStage={updateStage}
					/>
				}
			</main>
			<footer className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/guide/1" className="relative">
						<span>&lt;&lt;&nbsp;&nbsp; Page 1</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/" className="relative">
						<span>Exit Guide</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/guide/3" className="relative">
						<span>Page 3 &nbsp;&nbsp;&gt;&gt;</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
			</footer>
			<DarkModeToggle />
		</div>
	);
};

export default GuidePageTwo;