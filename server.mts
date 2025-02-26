import { createServer } from "http";
import * as next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000" , 10);

const app = next.default({ dev, hostname, port });

const apiUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:3000/api";

app.prepare()
	.then(() => {
		const httpServer = createServer(app.getRequestHandler());
		const io = new Server(httpServer);

		io.on("connection", (socket) => {

			// console.log(`A user connected: ${socket.id}`);

			socket.on("login", (userId) => {
				// console.log("socket.on: login", userId);
				socket.data.userId = userId;
			});

			socket.on("game_created", (game) => {
				// console.log("socket.on: game created");
				io.emit("game_created", game);
			});

			socket.on("join", (gameId) => {
				socket.join(gameId);
			})
			
			socket.on("user_joined", (gameId, firstName) => {
				// console.log(`${firstName} joined the game`);
				socket.to(gameId).emit("user_joined", `${firstName} joined the game`);
			});

			socket.on("leave", (gameId) => {
				socket.leave(gameId);
			})
			
			socket.on("user_left", (gameId, firstName) => {
				// console.log(`${firstName} left the game`);
				socket.to(gameId).emit("user_left", `${firstName} left the game. Returning to the lobby...`);
			});

			socket.on("game_full", (gameId) => {
				// console.log(`Game now has two players: ${gameId}`);
				io.emit("game_full", gameId);
			});

			socket.on("disconnect", () => {
				// console.log("A user disconnected");
				// console.log("socket.data.userId", socket.data);
				if(socket.data.userId) {
					userExit(socket.data.userId);
				}
			});

		});


		httpServer.listen(port, () => {
			console.log(`Server running on http://${hostname}:${port}`);

		});
	})

const userExit = async (userId: string) => {
	const userGames = await getUserGames(userId);

	if (!userGames?.length) {
		return
	}
	const fixedUserGames = JSON.parse(JSON.stringify(userGames));
	const cleanedUserGames = [];

	// Manually add only valid objects with a prototype
	for (let i = 0; i < fixedUserGames.length; i++) {
		const game = fixedUserGames[i];

		if (game && typeof game === "object" && Object.getPrototypeOf(game) === Object.prototype) {
			// Valid object, push it to the cleaned array
			cleanedUserGames.push(game);
		} else {
			// Log problematic elements
			console.error(`Problematic game at index ${i}:`, game);
		}
	}

	console.log("Cleaned User Games:", cleanedUserGames);

	const pendingGames = [];
	for (let i = 0; i < cleanedUserGames.length; i++) {
		try {
			const game = cleanedUserGames[i];

			if (game.status === "waiting_for_players") {
				pendingGames.push(game);
			}
		} catch (error) {
			console.error(`Error at index ${i}:`, error);
		}
	}

	for (const game of pendingGames) {
		await endGame(game.id);
	}
}

const getUserGames = async (userId: string) => {
	try {
		const response = await fetch(`${apiUrl}/games?user_id=${userId}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
		throw error;
	}
};

const endGame = async (gameId: string) => {
	try {
		const url = `${apiUrl}/games?id=${gameId}&action=change_status`;
		const update = {
			gameId: gameId,
			status: "ended"
		}
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(update),
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
		throw error;
	}
};