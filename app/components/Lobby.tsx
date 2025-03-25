import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/config";
import { Title } from "./Title";
import { DarkModeToggle } from "./DarkThemeToggle";
import { LobbyForm } from "./forms/LobbyForm";
import spirit from "../../public/spirit.png";
import { getPendingGames } from "./helpers/lobby";

const Lobby = async () => {
	const session = await getServerSession(authOptions) as AppendedSession;
	
	if (!session) {
		redirect('/login');
	}
	
	const pendingGames = await getPendingGames();

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center my-auto">
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
					<Image src={spirit} width={640} height={640} alt="Spirit" className="absolute opacity-20 z-[-1]" priority />
				</div>
				<LobbyForm session={session} initialPendingGames={pendingGames} />
			</main>
			<footer className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/2 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/logout" className="relative">
						<span>Logout</span>
						<span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
				<button className="w-1/2 group hover:font-bold hover:scale-125 transition-all duration-500">
					<Link href="/guide" className="relative">
						<span>Guide</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</Link>
				</button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Lobby;