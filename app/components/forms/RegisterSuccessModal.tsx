import { redirect } from "next/navigation";

export const RegisterSuccessModal = () => {

	return (
		<div className="flex flex-col justify-center items-center mx-auto p-8 text-neutral-800 bg-gray-200 shadow-[0px_0px_100px_0px_rgba(0,0,0,0.7)] dark:shadow-[0px_0px_100px_0px_rgba(255,255,255,0.7)] rounded-none md:rounded-2xl">
			<h2 className="text-xl font-bold">Success!</h2>
			<p className="mt-2 max-w-sm text-sm">You have successfully registered.  Click Proceed to login.</p>
			<button onClick={() => redirect('/login')} className="mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">Proceed</button>
		</div>
	);
}