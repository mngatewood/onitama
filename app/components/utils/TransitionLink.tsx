"use client";

import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sleep } from "../helpers/utility";

interface TransitionLinkProps extends LinkProps {
	children: React.ReactNode;
	href: string;
	className?: string;
}

export const TransitionLink = ({ href, children, className, ...props }: TransitionLinkProps) => {

	const router = useRouter();
	const pathname = usePathname();

	const getTransitionClass = (origin: string, destination: string) => {
		if (origin.startsWith("/guide/")) { origin = "/guide/" + origin.charAt(7) }
		if (destination.startsWith("/guide/")) { destination = "/guide/" + destination.charAt(7) }
		if (origin.startsWith("/play/")) { origin = "/play" }
		if (destination.startsWith("/play/")) { destination = "/play" }
		if (origin.startsWith("/exit/")) { origin = "/exit" }
		if (destination.startsWith("/exit/")) { destination = "/exit" }
		if (origin.startsWith("/login/")) { origin = "/login" }
		if (destination.startsWith("/login/")) { destination = "/login" }
		if (origin.startsWith("/logout/")) { origin = "/logout" }
		if (destination.startsWith("/logout/")) { destination = "/logout" }

		const transitions: Record<string, Record<string, string>> = {

			"/": {
				"/login": "transition-right",
				"/register": "transition-left",
				"/guide": "transition-up",
				"/logout": "transition-right",
			},
			"/register": {
				"/": "transition-right",
			},
			"/login": {
				"/": "transition-left",
			},
			"/logout": {
				"/": "transition-left",
				"/play": "transition-left",
			},
			"/play": {
				"/logout": "transition-right",
				"/exit": "transition-left",
				"/guide": "transition-up",
			},
			"/exit": {
				"/play": "transition-right",
				"/": "transition-right",
			},
			"/guide/1": {
				"/guide/2": "transition-left",
			},
			"/guide/2": {
				"/guide/1": "transition-right",
				"/guide/3": "transition-left",
			},
			"/guide/3": {
				"/guide/2": "transition-right",
				"/guide/4": "transition-left",
			},
			"/guide/4": {
				"/guide/3": "transition-right",
				"/guide/5": "transition-left",
			},
			"/guide/5": {
				"/guide/4": "transition-right",
				"/guide/6": "transition-left",
			},
			"/guide/6": {
				"/guide/5": "transition-right",
				"/guide/7": "transition-left",
			},
			"/guide/7": {
				"/guide/6": "transition-right",
			},
		};

		return transitions[origin]?.[destination] || "false";
	};

	const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const transition = document.querySelector(".transition");
		const transitionClass = getTransitionClass(pathname, href) ?? "false";
		transition?.classList.add(transitionClass);
		await sleep(300);
		router.push(href);
		await sleep(300);
		transition?.classList.remove(transitionClass);
	}

	return (
		<Link onClick={handleClick} href={href} className={className} {...props}>{children}</Link>
	);
};