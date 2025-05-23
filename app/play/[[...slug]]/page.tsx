import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/config";
import { redirect } from "next/navigation";
import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/ui/DarkThemeToggle";
import { Game } from "../../components/Game";
import { TransitionLink } from "@/app/components/utils/TransitionLink";

const Play = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const session = await getServerSession(authOptions) as AppendedSession;
	const { slug } = await params;
	const gameId = slug[0];

	if (!gameId) {
		redirect('/');
	}

	if (!session) {
		redirect('/login');
	}

	return (
		<div className="transition absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="w-full min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col justify-center items-center h-[calc(100vh-140px)] landscape:p-2">
				<Game gameId={gameId} userId={(session?.user as AppendedSession['user']).id}/>
			</main>
			<footer className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={`/logout?gameId=${gameId}`} className="relative">
						<span>Logout</span>
						<span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={`/guide?gameId=${gameId}`} className="relative">
						<span>Guide</span>
						<span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
						<span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
					</TransitionLink>
				</button>
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href={`/exit?gameId=${gameId}`} className="relative">
						<span>Exit Game</span>
						<span className="absolute -bottom-1 right-0 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-full"></span>
					</TransitionLink>
				</button>
			</footer>
			<DarkModeToggle />
		</div>
	)
}

export default Play