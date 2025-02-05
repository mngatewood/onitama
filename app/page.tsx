import Image from "next/image";
import spirit from "../public/spirit.png";
import { Title } from "./components/Title";
import { DarkModeToggle } from "./components/DarkThemeToggle";
import Link from "next/link";

export default function Home() {

	return (
		<div>
			<main className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex justify-center z-10">
				<Title />
				<footer className="container absolute bottom-0 w-full h-14 p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
					<button className="w-1/3"><Link href="/login">Login</Link></button>
					<button className="w-1/3"><Link href="/register">Register</Link></button>
					<button className="w-1/3"><Link href="/demo">Guide</Link></button>
				</footer>
			</main>
			<div className="absolute flex w-full h-screen items-center justify-center z-0">
				<Image src={spirit} width={640} height={640} alt="Spirit" className="w-full max-w-[640px]" priority />
			</div>
			<DarkModeToggle />
		</div>
	);
}