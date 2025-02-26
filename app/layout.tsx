import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from "./providers/SessionProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const reggaeOne = localFont({
	variable: "--font-reggae-one",
	src: '../public/fonts/ReggaeOne-Regular.ttf',
	display: 'swap',
})

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${reggaeOne.variable} bg-neutral-200 dark:bg-blue-1 text-foreground font-sans antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextAuthProvider>
						{children}
					</NextAuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
