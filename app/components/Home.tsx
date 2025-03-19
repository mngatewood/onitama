"use client";

import Image from "next/image";
import spirit from "../../public/spirit.png";
import { Title } from "./Title";
import { DarkModeToggle } from "./DarkThemeToggle";
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
				<div className="relative h-auto w-screen max-w-2xl overflow-scroll px-4 text-blue-1 text-justify font-reggae dark:text-neutral-200 scroll-no-bars bg-neutral-200/80 dark:bg-blue-1/80 md:rounded-2xl md:px-8 md:pt-8">
					<p className="my-4">In the mist-shrouded valley of Onitama, two master martial artists lead their students in a sacred duel of wits and skill. The temple grounds serve as both battlefield and proving ground, where each move is guided by ancient teachings passed down through generations.</p>
					<p className="my-4">With each step, the masters draw upon the wisdom of the ancestors, channeling the grace of the mantis, the unyielding strength of the dragon, or the swift precision of the tiger. Their students, disciplined and eager, mirror these teachings, moving in harmony with their master’s guidance.</p>
					<p className="my-4">Victory is achieved not through brute force, but through foresight and adaptability. To claim the title of supreme master, one must either strike down the rival master with a decisive blow or traverse the battlefield with the serenity of a flowing stream, reaching the heart of the opposing temple.</p>
					<p className="my-4">As the duel unfolds, strategy and patience shape destiny, reminding all who play that mastery is not merely about movement—it is about understanding the ever-changing rhythm of the fight.</p>
				</div>
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
					<Image src={spirit} width={640} height={640} alt="Spirit" priority />
				</div>
			</main>
			<footer className="container w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/login" className="relative">
						<span>Login</span>
						<span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/register" className="relative">
						<span>Register</span>
						<span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
						<span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
					</Link>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/guide" className="relative">
						<span>Guide</span>
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