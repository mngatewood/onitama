'use client';

import { signOut } from "next-auth/react";

export const LogoutForm = () => {

	const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		signOut({ callbackUrl: '/?logged_out=true', redirect: true })
	};
		
	return (
		<form className="mt-8">
			<button onClick={handleSignOut} className="group/btn relative block h-10 mb-8 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75">
				Logout
			</button>
		</form>
	);
}