import Link from "next/link";
import { Title } from "../components/Title";
import { DarkModeToggle } from "../components/DarkThemeToggle";

export const Login = () => {

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-center items-center">
			<header>
				<Title />
			</header>
			<main className="p-4 overflow-scroll flex flex-col items-center my-auto">
				<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Login to Your Account</h2>
				<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
					Enter your email address and password to login
				</p>
				{/* <LoginForm /> */}
			</main>
			<footer className="container absolute bottom-0 w-full h-14 p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/">Cancel</Link></button>
			</footer>
			<DarkModeToggle />
		</div>
	);
}

export default Login
