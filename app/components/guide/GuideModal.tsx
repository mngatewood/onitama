import React, { useEffect } from "react";

interface GuideModalProps {
	modal: {
		position: {
			x: number;
			y: number;
		};
		moveable: boolean;
		headline: string;
		body: string;
	}
	stage: number;
	updateStage: ( newStage: number ) => void;
}

export const GuideModal = ({ modal, stage, updateStage }: GuideModalProps) => {
	const heading = modal.headline;
	const [position, setPosition] = React.useState<string>("upOrLeft");
	const [positionStyle, setPositionStyle] = React.useState<object>({});
	const [modalReady, setModalReady] = React.useState<boolean>(false);

	let positionClass;

	useEffect(() => {
		if (modal.position.x > 0 && modal.position.y > 0) {
			setPositionStyle({ top: `${modal.position.y}%`, left: `${modal.position.x}%` });
		} else if (modal.position.x > 0) {
			setPositionStyle({ left: `${modal.position.x}%` });
		} else if (modal.position.y > 0) {
			setPositionStyle({ top: `${modal.position.y}%` });
		}
		setModalReady(true);
	}, [modal.position])
	

	if (modal.moveable) {
		positionClass = position === "upOrLeft" 
			? "absolute transition-all duration-500 ease-in-out top-0 bottom-0 left-1/4 -translate-x-1/2 portrait:top-0 portrait:bottom-0 portrait:left-0 portrait:right-0 portrait:translate-x-0 portrait:translate-y-0"
			: "absolute transition-all duration-500 ease-in-out top-0 bottom-0 left-1/2 translate-x-1/4 portrait:top-0 portrait:bottom-0 portrait:left-0 portrait:right-0 portrait:translate-x-0 portrait:translate-y-[50%]"; 
	} else {
		positionClass = "absolute top-0 bottom-0 right-0 left-0"
	}

	const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		updateStage(stage - 1);
	}

	const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		updateStage(stage + 1);
	}

	const handleTogglePosition = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setPosition(position === "upOrLeft" ? "downOrRight" : "upOrLeft");
	}

	return (
		<div className={`${positionClass} h-screen w-screen mx-auto transition-all duration-500 ease-in-out max-w-screen-md`}>
			<div style={positionStyle} className={`${modalReady ? "opacity-1" : "opacity-0"} relative top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center landscape:max-w-[30%] w-5/6 mt-6 p-4 border border-neutral-800 text-neutral-800 bg-gray-200 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-2xl transition-opacity duration-500 ease-in-out z-50`}>
				<div className="relative top-0 left-1/2 w-0 h-0 flex justify-center items-center">

					{modal.moveable &&
						<>
							{/* Toggle position in portrait */}
							<div className="portrait:block landscape:hidden">
								<button onClick={handleTogglePosition} className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
									{position === "upOrLeft" ? (
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[3px]">
											<path d="M8 12L3 4h10L8 12Z" fill="white" /> {/* Downward triangle */}
										</svg>
									) : (
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-[3px]">
											<path d="M8 4L3 12h10L8 4Z" fill="white" /> {/* Upward triangle */}
										</svg>
									)}
								</button>
							</div>

							{/* Toggle position in landscape */}
							<div className="portrait:hidden landscape:block">
								<button onClick={handleTogglePosition} className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
									{position === "downOrRight" ? (
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-[3px]">
											<path d="M4 8L12 3v10L4 8Z" fill="white" /> {/* Left-pointing triangle */}
										</svg>
									) : (
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-[3px]">
											<path d="M12 8L4 3v10L12 8Z" fill="white" /> {/* Right-pointing triangle */}
										</svg>
									)}
								</button>
							</div>
						</>					
					}
				</div>
				<h2 className="text-xl font-bold">{heading}</h2>
				<p className="mt-2 max-w-sm text-sm">{modal.body}</p>
				<div className="flex items-center justify-evenly w-full">
					<button onClick={handlePrevious} className="mt-4 w-16 relative block h-8 rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">&lt;&lt;</button>
					<button onClick={handleNext} className="mt-4 w-16 relative block h-8 rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">&gt;&gt;</button>
				</div>
			</div>
		</div>
	);
}