import Link from "next/link";
import { Title } from "../components/Title";
import { DarkModeToggle } from "../components/DarkThemeToggle";
import { LogoutForm } from "../components/forms/LogoutForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import spirit from "../../public/spirit.png";

const Logout = async () => {
	const session = await getServerSession();

	if (!session) {
		redirect('/');
	}
	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-center items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col items-center my-auto">
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1] top-0 left-0 bottom-0 right-0">
					<Image src={spirit} width={640} height={640} alt="Spirit" className="absolute opacity-20 z-[-1]" priority />
				</div>
				<div className="mx-auto overflow-y-scroll scroll-no-bars w-full max-w-md rounded-none border border-gray-300 bg-amber-50 px-4 pt-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:px-8 md:pt-8">
					<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Logout</h2>
					<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
						Are you sure you want to logout?
					</p>
					<LogoutForm />
				</div>
			</main>
			<footer className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/">Cancel</Link></button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Logout
