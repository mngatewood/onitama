"use client";

import Image from "next/image";
import spirit from "../../public/spirit.png";
import { Title } from "./Title";
import { DarkModeToggle } from "./ui/DarkThemeToggle";
import Link from "next/link";
import { ToastMessage } from "../components/ToastMessage";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [notifications, setNotifications] = useState<ToastNotification[]>([]);

	// Evaluate searchParams
	useEffect(() => {
		if (searchParams) {
			// Push success notification if logged_in query parameter is true
			const loggedOut = searchParams.get("logged_out");
			if (loggedOut === "true") {
				const notification = {
					type: "success",
					message: "You have successfully logged out.",
					action: "",
					duration: 3000
				} as ToastNotification;
				setNotifications((prevNotifications) => [notification, ...prevNotifications]);
			}
			// Remove query parameter from URL
			window.history.replaceState(null, "", pathname);
		}
	}, [searchParams, pathname]);
	
	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center my-auto w-full">
				<div className="relative h-auto w-screen max-w-2xl overflow-scroll px-8 text-blue-1 text-justify font-reggae dark:text-neutral-200 scroll-no-bars bg-neutral-200/80 dark:bg-blue-1/80 md:rounded-2xl md:px-8 md:pt-8">
					<p className="my-4">In the valley of Onitama, two masters and their students engage in a sacred duel of wits and skill. Guided by ancient teachings, they move with the grace of the mantis, the strength of the dragon, or the speed of the tiger.</p>
					<p className="my-4">Victory comes through foresight and adaptability—by either striking down the rival master or reaching the heart of the opposing temple. With each move, the duel unfolds as a test of strategy and patience, where true mastery lies in understanding the rhythm of the fight.</p>
				</div>
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
					<Image src={spirit} width={640} height={640} alt="Spirit" priority />
				</div>
			</main>
			<footer className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/login" className="relative">
						<span>Login</span>
						<span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/guide" className="relative">
						<span>Guide</span>
						<span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
						<span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
					</Link>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/register" className="relative">
						<span>Register</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
			</footer>
			<DarkModeToggle />
			<ToastMessage notifications={notifications}/>
		</div>
	);
}

export default Home;