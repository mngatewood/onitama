import Link from "next/link";
import { Title } from "../components/Title";
import { RegisterForm } from "../components/forms/RegisterForm";
import { DarkModeToggle } from "../components/DarkThemeToggle";

export const Register = () => {

	return (
		<main className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex justify-center items-center">
			<Title />
			<div
				className="mx-auto w-full max-w-md rounded-none border border-gray-300 bg-amber-50 p-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:p-8 h-[600px]"
			>
				<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Onitama</h2>
				<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
					Fill out the form below to create your account
				</p>
				<RegisterForm />
			</div>
			<DarkModeToggle />
			<footer className="container absolute bottom-0 w-full h-14 p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/">Cancel</Link></button>
			</footer>

		</main>
	);
}

export default Register
