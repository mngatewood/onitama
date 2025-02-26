"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const ToastMessage = ({ notifications }: { notifications: ToastNotification[] }) => {

	const [notification, setNotification] = useState<ToastNotification | null>(null);

	const toastClass = () => {
		if (!notification) {
			return "hidden"
		} else if (notification.type === "system") {
			return "bg-blue-900"
		} else if (notification.type === "error") {
			return "bg-red-900"
		} else if (notification.type === "success") {
			return "bg-green-900"
		}
	}

	useEffect(() => {
		console.log("notifications", notifications.length)
		if (notifications.length > 0) {
			setNotification(notifications[0]);
		}
	}, [notifications])
	
	useEffect(() => {
		const toast = document.getElementById("toast");
		toast?.classList.replace('-left-full', 'left-0')
		if(notification?.action) {
			const timer = setTimeout(() => {
				redirect(notification.action);
			}, notification.timeout);
			return () => clearTimeout(timer);
		} else {
			const timer = setTimeout(() => {
				toast?.classList.replace('left-0', '-left-full')
			}, notification?.timeout);
			return () => clearTimeout(timer);
		}
	}, [notification])
	
	
	return (
		<div id="toast" className="absolute top-2 -left-full -translate-x-1 mr-4 transition-all duration-300 flex justify-center items-start z-50">
			<div className={`${toastClass()} opacity-90 w-full shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-r-2xl p-4`}>
				<p className="mx-4 text-white font-bold">{notification?.message || ""}</p>
			</div>
		</div>
	);
}