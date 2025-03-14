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
		if (notifications.length > 0) {
			const toast = document.getElementById("toast");
			toast?.classList.replace('left-0', '-left-[350%]')
			setTimeout(() => {
				setNotification(notifications[0]);
			}, 300);
		}
	}, [notifications, setNotification])
	
	useEffect(() => {
		const toast = document.getElementById("toast");
		toast?.classList.replace('-left-[350%]', 'left-0')
		if(notification?.action) {
			const timer = setTimeout(() => {
				redirect(notification.action);
			}, notification.delay);
			return () => clearTimeout(timer);
		} else if (notification?.duration) {
			const timer = setTimeout(() => {
				toast?.classList.replace('left-0', '-left-[350%]')
			}, notification?.duration);
			return () => clearTimeout(timer);
		}
	}, [notification])

	const handleCloseNotification = () => {
		const toast = document.getElementById("toast");
		toast?.classList.replace('left-0', '-left-[350%]')
	}
	
	return (
		<div id="toast" className="absolute top-2 -left-[350%] -translate-x-1 mr-4 transition-all duration-300 flex flex-col justify-center items-start z-50">
			<div className={`${toastClass()} flex justify-between items-start opacity-90 w-full shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-r-2xl p-4`}>
				<p className="mx-4 text-white font-bold">{notification?.message || ""}</p>
				<div onClick={handleCloseNotification}className="h-6 aspect-square text-[0.7rem] bg-white rounded-full flex justify-center items-center cursor-pointer">
					❌
				</div>
			</div>
		</div>
	);
}