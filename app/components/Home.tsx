import Image from "next/image";
import spirit from "../../public/spirit.png";
import { Title } from "./Title";
import { DarkModeToggle } from "./DarkThemeToggle";
import Link from "next/link";

const Home = async () => {

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center">
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1] top-0 left-0 bottom-0 right-0">
					<Image src={spirit} width={640} height={640} alt="Spirit" priority />
				</div>
			</main>
			<footer className="container w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/login">Login</Link></button>
				<button className="w-1/3"><Link href="/register">Register</Link></button>
				<button className="w-1/3"><Link href="/demo">Guide</Link></button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Home;