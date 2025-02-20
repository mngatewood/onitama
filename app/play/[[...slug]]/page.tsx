import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/config";
import PageProps from "next/app";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/DarkThemeToggle";
import { Game } from "../../components/Game";

interface ParamsObject {
	slug: string;
}

const Play = async ({ params }: PageProps) => {
	const session = await getServerSession(authOptions) as AppendedSession;
	// const userId = (session?.user as AppendedSession['user']).id;
	const paramsObject:ParamsObject = await params;
	const gameId = paramsObject.slug[0];

	if (!paramsObject.slug) {
		redirect('/');
	}

	if (!session) {
		redirect('/login');
	}

	// // TODO: If game has been pending with only one player for longer than 15 minutes, delete the game
	// const handleExitGame = async () => {
	// 	// TODO: Render a modal to confirm the user wants to exit the game
	// 	// TODO: Emit 
	// }

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="w-full max-w-screen-lg min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col items-center">
				<Game gameId={gameId} userId={(session?.user as AppendedSession['user']).id}/>
			</main>
			<footer className="w-full h-14 p-4 flex justify-center text-sky-700 dark:text-sky-300 z-50">
				<button className="w-1/3"><Link href="/logout">Logout</Link></button>
				<button className="w-1/3"><Link href="/demo">Guide</Link></button>
				<button className="w-1/3"><Link href={`/exit/${gameId}`}>Exit Game</Link></button>
			</footer>
			<DarkModeToggle />
		</div>
	)
}

export default Play