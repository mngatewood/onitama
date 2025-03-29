import Link from "next/link";
import { Title } from "../components/Title";
import { RegisterForm } from "../components/forms/RegisterForm";
import { DarkModeToggle } from "../components/ui/DarkThemeToggle";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import spirit from "../../public/spirit.png";
import { TransitionLink } from "../components/utils/TransitionLink";

const Register = async () => {
	const session = await getServerSession();

	if (!!session) {
		redirect('/');
	}

	return (
		<div className="transition absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col justify-center items-center my-auto">
				<div className="flex items-center justify-center absolute w-screen h-screen z-[-1]">
					<Image src={spirit} width={640} height={640} alt="Spirit" className="absolute opacity-20 z-[-1]" priority />
				</div>
				<div className="mx-auto overflow-y-scroll scroll-no-bars w-full max-w-md rounded-none border border-gray-300 bg-amber-50 px-4 pt-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:px-8 md:pt-8">
					<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Onitama</h2>
					<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
						Fill out the form below to create your account
					</p>
					<RegisterForm />
				</div>
			</main>
			<footer className="w-full h-10 portrait:h-14 landscape:short:h-14 p-2 portrait:p-4 landscape:short:p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300 bg-neutral-200 dark:bg-blue-1 z-50">
				<button className="w-1/3 group hover:font-bold hover:scale-125 transition-all duration-500">
					<TransitionLink href="/" className="relative">
						<span>Cancel</span>
						<span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
						<span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-sky-700 dark:bg-sky-300 group-hover:w-1/2"></span>
					</TransitionLink>
				</button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Register
