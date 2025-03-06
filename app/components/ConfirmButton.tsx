interface ConfirmButtonProps {
	clickConfirm: () => void;
	clickCancel: () => void;
}

export const ConfirmButton = ({ clickConfirm, clickCancel }: ConfirmButtonProps) => {

	const handleClickConfirm = () => {
		clickConfirm();
	}

	const handleClickCancel = () => {
		clickCancel();
	}

	return (
		<div className="flex justify-center items-center">
			<button onClick={handleClickConfirm} id="confirm-button" className="bg-green-900 opacity-90 shadow-md shadow-gray-300 hover:bg-red-600 text-gray-100 h-12 w-40 font-bold text-2xl py-2 px-4 mt-6 rounded cursor-pointer">
				Confirm
			</button>
			<button onClick={handleClickCancel} id="cancel-confirm-button" className="bg-red-900 opacity-90 shadow-md shadow-gray-300 hover:bg-red-600 text-gray-100 h-12 w-40 font-bold text-2xl py-2 px-4 mt-6 mx-4 rounded cursor-pointer">
				Cancel
			</button>
		</div>
	);
};