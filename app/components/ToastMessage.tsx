import { useEffect, useRef, useState } from "react";

export const ToastMessage = ({notifications}: Notification[]) => {

	const [notification, setNotification] = useState<Notification>({ type: "", message: "" });

	const toastClass = () => {
		if (notification.type === "system") {
			return "bg-blue-900"
		} else if (notification.type === "error") {
			return "bg-red-900"
		} else if (notification.type === "success") {
			return "bg-green-900"
		}
	}

	useEffect(() => {
		const toast = document.getElementById("toast");
		if (notifications.length > 0) {
			setNotification(notifications[0]);

			toast?.classList.replace('-left-full', 'left-0')
			const timer = setTimeout(() => {
				toast?.classList.replace('left-0', '-left-full')
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [notifications])
	
	return (
		<div id="toast" className="absolute top-2 -left-full -translate-x-1 mr-4 transition-all duration-300 flex justify-center items-start z-50">
			<div className={`${toastClass()} opacity-90 w-full shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-r-2xl p-4`}>
				<p className="mx-4">{notification.message}</p>
			</div>
		</div>
	);
}