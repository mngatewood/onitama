"use client";

import { redirect } from 'next/navigation';
import { useSearchParams } from "next/navigation";

const Guide = () => {
	const searchParams = useSearchParams();
	const gameId = searchParams.get("gameId");
	if (gameId) {
		return redirect(`/guide/1?gameId=${gameId}`);
	} else {
		return redirect("/guide/1");
	}
};

export default Guide;