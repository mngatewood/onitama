'use client';

import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({
	children
}: {
	children: React.ReactNode
}) {
	console.log("SessionProvider rendering");
	return <SessionProvider>{children}</SessionProvider>;
}