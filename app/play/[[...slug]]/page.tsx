import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { PageProps } from "@/.next/types/app/layout";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/DarkThemeToggle";
import { Game } from "../../components/Game";

interface ParamsObject {
	slug: string;
}

const Play = async ({ params }: PageProps) => {
	const session = await getServerSession(authOptions);
	// const userId = (session?.user as AppendedSession['user']).id;
	const paramsObject:ParamsObject = await params;

	if (!paramsObject.slug) {
		redirect('/');
	}

	if (!session) {
		redirect('/login');
	}

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="w-full max-w-screen-lg min-w-[370px] mx-auto p-4 pr-6 overflow-hidden flex flex-col items-center">
				<Game gameId={paramsObject.slug} userId={(session?.user as AppendedSession['user']).id}/>
			</main>
			<footer className="w-full h-14 p-4 flex justify-center text-sky-700 dark:text-sky-300 z-50">
				<button className="w-1/3"><Link href="/logout">Logout</Link></button>
				<button className="w-1/3"><Link href="/demo">Guide</Link></button>
				<button className="w-1/3"><Link href="/">Exit Game</Link></button>
			</footer>
			<DarkModeToggle />
		</div>
	)
}

export default Play