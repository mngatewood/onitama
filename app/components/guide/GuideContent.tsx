"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function GuideContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const gameId = searchParams?.get("gameId");

	useEffect(() => {
		if (gameId) {
			router.push(`/guide/1?gameId=${gameId}`);
		} else {
			router.push("/guide/1");
		}
	}, [gameId, router]);

	return null;
}