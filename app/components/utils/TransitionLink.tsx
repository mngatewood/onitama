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
			"/logout": {
				"/": "transition-left",
			},
		};

		if (origin.startsWith("/guide/") && destination === "/") {
			return "transition-down";
		}

		if (origin.startsWith("/play/")) {
			if (destination.startsWith("/logout/")) {
				return "transition-right";
			} else if (destination.startsWith("/exit/")) {
				return "transition-left";
			} else if (destination.startsWith("/guide/")) {
				return "transition-up";
			}
		};

		if (origin.startsWith("/exit/") && destination.startsWith("/play/")) {
			return "transition-right";
		}

		if (origin.startsWith("/login/") && destination.startsWith("/play/")) {
			return "transition-left";
		}

		if (origin.startsWith("/logout/") && destination.startsWith("/play/")) {
			return "transition-left";
		}



		return transitions[origin]?.[destination] || "false";
	};

	const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const transition = document.querySelector(".transition");
		const transitionClass = getTransitionClass(pathname, href) ?? "false";
		console.log("href: ", href);
		console.log("pathname: ", pathname);
		console.log("transitionClass: ", transitionClass);
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