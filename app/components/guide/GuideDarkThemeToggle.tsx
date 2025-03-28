"use client";

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';


export const GuideDarkModeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);
	
	if (!mounted) return null; // Avoid hydration mismatch

	const handleToggle = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	const tooltipText = theme==="light" ? 'Switch to dark mode' : 'Switch to light mode';

	return (
		<div key="dark-mode-toggle" id="data-dark-mode-toggle" className="guide absolute top-4 right-4">
			<div className="relative group">
				<button onClick={handleToggle} className="border border-gray-400 rounded-full p-0 bg-gray-200 hover:scale-125 transition-all duration-300 group hover:bg-slate-400 hover:border-gray-200"
					title="Toggle dark mode"
					onMouseOver={(event) => event.currentTarget.title = ""}
					onMouseOut={(event) => event.currentTarget.title = "Toggle dark mode"}
				>
					<div className="flex flex-col justify-center">
						<input type="checkbox" name="light-switch" className="light-switch sr-only" />
						<label className="relative cursor-pointer p-2" htmlFor="light-switch">
							<svg className={theme === 'light' ? 'block' : 'hidden'} width="16" height="16" xmlns="http://www.w3.org/2000/svg">
								<path className="fill-slate-500 group-hover:fill-gray-200" d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z" />
								<path className="fill-slate-500 group-hover:fill-gray-200" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
							</svg>
							<svg className={theme === 'light' ? 'hidden' : 'block'} width="16" height="16" xmlns="http://www.w3.org/2000/svg">
								<path className="fill-slate-500 group-hover:fill-gray-200" d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z" />
								<path className="fill-slate-500 group-hover:fill-gray-200" d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z" />
							</svg>
							<span className="sr-only">Switch to light / dark version</span>
						</label>
					</div>
				</button>	
				<div className='absolute top-12 px-4 py-2 bg-slate-500 rounded-md text-purple border-gray-500 border right-0 text-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-0 group-hover:scale-100'>
					<span className="h-0 w-0 absolute -top-2 right-2 border-x-8 border-x-transparent border-b-8 border-b-gray-500"></span>
					<span className="whitespace-nowrap">{tooltipText}</span>
				</div>
			</div>
		</div>
	);
}
