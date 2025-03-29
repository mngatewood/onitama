import { Suspense } from "react";
import { GuideContent } from "../components/guide/GuideContent";

export default function Guide() {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
			</div>
		}>
			<GuideContent />
		</Suspense>
	);
}