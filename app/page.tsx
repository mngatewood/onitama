import Image from "next/image";
import spirit from "../public/spirit.png";

export default function Home() {
	return (
		<div>
			<main className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden flex justify-center z-10">
				<h1 className="dark text-4xl text-center m-8 font-reggae">Onitama</h1>
				<footer className="container absolute bottom-0 w-full h-14 p-4 flex justify-center gap-4">
					<button className="dark w-1/3"><a href="/login">Login</a></button>
					<button className="dark w-1/3"><a href="/register">Register</a></button>
					<button className="dark w-1/3"><a href="/demo">Guide</a></button>
				</footer>
			</main>
			<div className="absolute flex w-full h-screen items-center justify-center z-0">
				<Image src={spirit} width={640} height={640} alt="Spirit" className="w-full max-w-[640px]" />
			</div>
		</div>
	);
}