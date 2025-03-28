interface WaitingModalProps {
	text: string;
	isVisible: boolean
}

export const WaitingModal = ({ text, isVisible }: WaitingModalProps) => {

	const visibility = isVisible ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95";

	return (
		<div className={`${visibility} flex flex-col justify-center items-center mx-auto p-8 border border-neutral-800 text-neutral-800 bg-gray-200 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-2xl transition-all duration-500 ease-in-out`}>
			<h2 className="text-xl font-bold">Please wait.</h2>
			<p className="mt-2 max-w-sm text-sm">{text}</p>
		</div>
	);
}