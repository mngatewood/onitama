"use client";
import React, { FormEvent, useEffect, useCallback, useState } from "react";
import { redirect } from "next/navigation";
import { createGame } from "../helpers/lobby";

export const LobbyForm = (session: AppendedSession) => {

	const handleNewGame = async () => {
		if(session?.user.id) {
			const newGame = await createGame(session?.user.id);
			if(newGame) {
				redirect(`/play/${newGame.id}`);
			}
		} else {
			redirect('/login');
		}
	}

	return (
		<div>
			<h2 className="text-2xl mb-8 font-bold text-neutral-800 dark:text-neutral-200">Game Lobby</h2>
			<button
				className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75"
				onClick={handleNewGame}
			>
				New Game
				<span
					className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
				></span>
				<span
					className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
				></span>
			</button>
		</div>
	)
}