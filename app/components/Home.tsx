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
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center my-auto">
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
					<Image src={spirit} width={640} height={640} alt="Spirit" priority />
				</div>
			</main>
			<footer className="container w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
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
					<Link href="/demo" className="relative">
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