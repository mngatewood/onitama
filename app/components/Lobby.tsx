import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/config";
import { Title } from "./Title";
import { DarkModeToggle } from "./DarkThemeToggle";
import { LobbyForm } from "./forms/LobbyForm";
import spirit from "../../public/spirit.png";

const Lobby = async () => {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/login');
	}
	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center">
				<div className="flex items-center justify-center h-full max-w-2xl">
					<Image src={spirit} width={640} height={640} alt="Spirit" className="absolute top-[calc(50%-300px)] opacity-20 z-[-1]" priority />
				</div>
					<LobbyForm {...session as AppendedSession} />
			</main>
			<footer className="container w-full h-14 p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/logout">Logout</Link></button>
				<button className="w-1/3"><Link href="/play">Play</Link></button>
				<button className="w-1/3"><Link href="/demo">Guide</Link></button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Lobby;