import Link from "next/link";
import { Title } from "../components/Title";
import { RegisterForm } from "../components/forms/RegisterForm";
import { DarkModeToggle } from "../components/DarkThemeToggle";

const Register = () => {

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-hidden flex flex-col items-center my-auto">
				<div
					className="mx-auto overflow-y-scroll scroll-no-bars w-full max-w-md rounded-none border border-gray-300 bg-amber-50 px-4 pt-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:px-8 md:pt-8"
				>
					<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Onitama</h2>
					<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
						Fill out the form below to create your account
					</p>
					<RegisterForm />
				</div>
			</main>
			<footer className="w-full h-14 p-4 flex justify-center text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/">Cancel</Link></button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Register
