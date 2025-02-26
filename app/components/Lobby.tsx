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
import { headers } from "next/headers";
import { ToastMessage } from "./ToastMessage";

const Lobby = async () => {
	const referrer = (await headers()).get('Referer') || '/';
	const session = await getServerSession(authOptions) as AppendedSession;
	
	if (!session) {
		redirect('/login');
	}
	
	const pendingGames = await getPendingGames();

	const notifications = referrer && referrer.split("/").pop() === "login" ? [{
		type: "success",
		message: "You have been logged in.",
		action: "",
		timeout: 5000
	}] : [];

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center">
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
					<Image src={spirit} width={640} height={640} alt="Spirit" className="absolute opacity-20 z-[-1]" priority />
				</div>
				<LobbyForm session={session} initialPendingGames={pendingGames} />
			</main>
			<footer className="container w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/logout">Logout</Link></button>
				<button className="w-1/3"><Link href="/play">Play</Link></button>
				<button className="w-1/3"><Link href="/demo">Guide</Link></button>
			</footer>
			<DarkModeToggle />
			<ToastMessage notifications={notifications} />
		</div>
	);
}

export default Lobby;