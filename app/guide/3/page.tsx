import { Suspense } from "react";
import { Title } from "../../components/Title";
import { DarkModeToggle } from "../../components/ui/DarkThemeToggle";
import { GuideThreeContent } from "../../components/guide/GuideThreeContent";

export default function GuidePageThree() {
	return (
		<div className="transition absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col justify-between items-center">
			<header>
				<Title />
			</header>
			<Suspense fallback={<div>Loading...</div>}>
				<GuideThreeContent />
			</Suspense>
			<DarkModeToggle />
		</div>
	);
}