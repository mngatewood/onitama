import { Suspense } from "react";
import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/ui/DarkThemeToggle";
import { GuideFourContent } from "../../components/guide/GuideFourContent";

export default function GuidePageFour() {
	return (
		<div className="transition absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<Suspense fallback={
				<div className="flex items-center justify-center h-full">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
				</div>
			}>
				<GuideFourContent />
			</Suspense>
			<DarkModeToggle />
		</div>
	);
}