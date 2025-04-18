import { Title } from "@/app/components/Title";
import { DarkModeToggle } from "@/app/components/ui/DarkThemeToggle";
import { ExitForm } from "@/app/components/forms/ExitForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getGame } from "@/app/components/helpers/lobby";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { ToastMessage } from "@/app/components/ToastMessage";
import { TransitionLink } from "@/app/components/utils/TransitionLink";
import type { PageProps } from "@/.next/types/app/page";

const Exit = async ({ searchParams }: PageProps) => {
	const session = await getServerSession(authOptions) as AppendedSession;

	if (!session) {
		redirect('/login');
		return null;
	}

	const gameId = (await searchParams)?.gameId || "";
	const game = gameId ? await getGame(gameId) : null;
	const user = game?.users && game.users.find((user: User) => user.id === session?.user.id);
	const notification = {
		type: "error",
		message: "Game not found.  Redirecting to the lobby...",
		duration: 3000,
		delay: 3000,
		action: "/"
	};

	return (
		<div className="transition absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-center items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center my-auto">
				{ game ?
					<div className="mx-auto overflow-y-scroll scroll-no-bars w-full max-w-md rounded-none border border-gray-300 bg-amber-50 px-4 pt-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:px-8 md:pt-8">
						<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Exit Game</h2>
						<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
							Are you sure you want to exit the game?  Any progress will be lost.
						</p>
						<ExitForm gameId={gameId ?? ""} firstName={user?.first_name ?? ""}/>
					</div>
					:
						<ToastMessage notifications={[notification]} />
					}
			</main>
			<footer className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3">
					<TransitionLink href={gameId ? `/play/${gameId}` : "/"}>Cancel</TransitionLink>
				</button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Exit;