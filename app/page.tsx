import { getServerSession } from "next-auth";
import Home from "./components/Home";
import Lobby from "./components/Lobby";

const Index = async () => {
	const session = await getServerSession();

	return (
		<>
			{!!session ? (
				<Lobby />
			) : (
				<Home />
			)}
		</>
	);
}

export default Index;