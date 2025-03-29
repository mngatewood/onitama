import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/utils/ThemeProvider";
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
	title: "Onitama",
	description: "Onitama is a fast-paced, abstract strategy game of martial tactics where players use ever-changing movement cards to outmaneuver their opponent on a 5x5 board.",
	icons: {
		icon: [
			{ url: '/icon.png', type: 'image/png', sizes: '32x32' },
			{ url: '/favicon.ico', sizes: '32x32' },
		],
		apple: [
			{ url: '/apple-icon.png', sizes: '180x180' },
			{ url: '/apple-touch-icon.png', sizes: '180x180' },
		],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Onitama',
	},
	openGraph: {
		images: [
			{
				url: '/opengraph-image.png',
				width: 1200,
				height: 630,
				alt: 'Onitama - A game of martial tactics',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Onitama',
		images: [
			{
				url: '/twitter-image.png',
				width: 1200,
				height: 630,
				alt: 'Onitama - A game of martial tactics',
			}
		],
	},
}; 

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<head>
				<link
					rel="icon"
					href="/favicon.ico"
					sizes="any"
				/>
				<link
					rel="icon"
					href="/icon.png"
					type="image/png"
					sizes="32x32"
				/>
				<link
					rel="apple-touch-icon"
					href="/apple-icon.png"
					sizes="180x180"
				/>
				<title>Onitama</title>
				<meta name="description" content="Onitama is a fast-paced, abstract strategy game of martial tactics where players use ever-changing movement cards to outmaneuver their opponent on a 5x5 board." />
				<meta property="og:url" content="https://onitama-production.up.railway.app" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Onitama" />
				<meta property="og:description" content="Onitama is a fast-paced, abstract strategy game of martial tactics where players use ever-changing movement cards to outmaneuver their opponent on a 5x5 board." />
				<meta property="og:image" content="http://localhost:8080/opengraph-image.png?bdbc8a4c97e5c1e6" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="onitama-production.up.railway.app" />
				<meta property="twitter:url" content="https://onitama-production.up.railway.app" />
				<meta name="twitter:title" content="Onitama" />
				<meta name="twitter:description" content="Onitama is a fast-paced, abstract strategy game of martial tactics where players use ever-changing movement cards to outmaneuver their opponent on a 5x5 board." />
				<meta name="twitter:image" content="http://localhost:8080/opengraph-image.png?bdbc8a4c97e5c1e6" />
			</head>
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
