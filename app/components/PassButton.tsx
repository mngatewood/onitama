interface PassButtonProps {
	clickPass: () => void;
}

export const PassButton = ({ clickPass = () => { } }: PassButtonProps) => {

	const handleClickPass = () => {
		clickPass();
	}
	return (
		<button onClick={handleClickPass} id="pass-button" className="bg-red-900 opacity-90 shadow-md shadow-gray-300 hover:bg-red-600 text-gray-100 h-12 w-40 font-bold text-2xl py-2 px-4 mt-6 rounded cursor-pointer">
			Pass
		</button>
	);
};