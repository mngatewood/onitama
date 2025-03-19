"use client";

import { useState, useEffect } from 'react';

interface NotificationsToggleProps {
	enabled: boolean;
	toggleNotifications: () => void;
}

export const NotificationsToggle = ({ enabled, toggleNotifications }: NotificationsToggleProps) => {
	const [ mounted, setMounted ] = useState(false);
	
	useEffect(() => {
		setMounted(true);
	}, []);
	
	if (!mounted) return null; // Avoid hydration mismatch

	const handleToggle = () => {
		toggleNotifications();
	};

	return (
		<div key="notifications-toggle" className="absolute top-4 left-4">
			<button onClick={handleToggle}
				className="border border-gray-400 rounded-full p-0 bg-gray-200 hover:scale-125 transition-all duration-300 group hover:bg-slate-400 hover:border-gray-200"
				title="Toggle notifications"
				>
				<div className="flex flex-col justify-center">
					<input type="checkbox" name="light-switch" className="light-switch sr-only" />
					<label className="relative cursor-pointer p-2" htmlFor="light-switch">
						<svg className={enabled ? 'block' : 'hidden'} width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
							<path className="fill-slate-500 group-hover:fill-gray-200" d="M8 2C7.47258 2 6.9403 2.09991 6.43198 2.29385C6.47187 2.19498 6.49416 2.09027 6.49416 1.98208C6.49416 1.43978 6.04437 1 5.49083 1C4.93729 1 4.4875 1.43978 4.4875 1.98208C4.4875 2.09027 4.50979 2.19498 4.54968 2.29385C3.08262 2.88633 2 4.31304 2 6V10L1 11V12H15V11L14 10V6C14 4.31304 12.9174 2.88633 11.4503 2.29385C11.4902 2.19498 11.5125 2.09027 11.5125 1.98208C11.5125 1.43978 11.0627 1 10.5092 1C9.95563 1 9.50584 1.43978 9.50584 1.98208C9.50584 2.09027 9.52813 2.19498 9.56802 2.29385C9.0597 2.09991 8.52742 2 8 2ZM5.5 13C5.5 14.1046 6.62254 15 8 15C9.37746 15 10.5 14.1046 10.5 13H5.5Z" fill="currentColor" />
						</svg>

						<svg className={enabled ? 'hidden' : 'block'} width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
							<path className="fill-slate-500 group-hover:fill-gray-200" d="M8 2C7.47258 2 6.9403 2.09991 6.43198 2.29385C6.47187 2.19498 6.49416 2.09027 6.49416 1.98208C6.49416 1.43978 6.04437 1 5.49083 1C4.93729 1 4.4875 1.43978 4.4875 1.98208C4.4875 2.09027 4.50979 2.19498 4.54968 2.29385C3.08262 2.88633 2 4.31304 2 6V10L1 11V12H15V11L14 10V6C14 4.31304 12.9174 2.88633 11.4503 2.29385C11.4902 2.19498 11.5125 2.09027 11.5125 1.98208C11.5125 1.43978 11.0627 1 10.5092 1C9.95563 1 9.50584 1.43978 9.50584 1.98208C9.50584 2.09027 9.52813 2.19498 9.56802 2.29385C9.0597 2.09991 8.52742 2 8 2ZM5.5 13C5.5 14.1046 6.62254 15 8 15C9.37746 15 10.5 14.1046 10.5 13H5.5Z" fill="currentColor" />
							<path className="fill-red-400" d="M13.7071 2.29289C14.0976 2.68342 14.0976 3.31658 13.7071 3.70711L3.70711 13.7071C3.31658 14.0976 2.68342 14.0976 2.29289 13.7071C1.90237 13.3166 1.90237 12.6834 2.29289 12.2929L12.2929 2.29289C12.6834 1.90237 13.3166 1.90237 13.7071 2.29289Z" fill="currentColor" />
						</svg>
					</label>
				</div>
			</button>	
		</div>
	);
}
