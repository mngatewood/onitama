export const WaitingModal = ({ text }: { text: string }) => {

	return (
		<div className="flex flex-col justify-center items-center mx-auto p-8 border border-neutral-800 text-neutral-800 bg-gray-200 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.7)] dark:shadow-[2px_2px_5px_0px_rgba(255,255,255,0.7)] rounded-2xl">
			<h2 className="text-xl font-bold">Please wait.</h2>
			<p className="mt-2 max-w-sm text-sm">{text}</p>
		</div>
	);
}