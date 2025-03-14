import { createServer } from "http";
import * as next from "next";
import { Server } from "socket.io";
import { getToken } from "next-auth/jwt"; 
import { NextApiRequest } from "next";
import { parse } from "cookie";
import dotenv from 'dotenv';

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000" , 10);
const app = next.default({ dev, hostname, port });
const apiUrl = process.env.BASE_URL + "/api";

app.prepare()
	.then(() => {
		const httpServer = createServer(app.getRequestHandler());
		const io = new Server(httpServer, {
			cors: {
				origin: process.env.BASE_URL,
				credentials: true,
			},
		});

		// Middleware to attach user data to the socket
		io.use(async (socket, next) => {
			try {
				const cookies = parse(socket.handshake.headers.cookie || "");
				const token = await getToken({
					req: {
						headers: { cookie: socket.handshake.headers.cookie || "" },
						cookies,
					} as NextApiRequest,
					secret: process.env.NEXTAUTH_SECRET,
				});

				if (!token) {
					return next(new Error("Authentication error: No session found"));
				}

				socket.data.user = token; // Attach user data to the socket
				next();
			} catch (error) {
				if (error instanceof Error) {
					next(new Error("Authentication error: " + error.message));
				} else {
					next(new Error("Authentication error: An unknown error occurred"));
				}
			}
		});

		io.on("connection", (socket) => {

			console.log("A user connected:", socket.id);
			console.log("Authenticated User Data:", socket.data.user);

			socket.on("game_created", (game) => {
				console.log("[Server] Game created event received:", game);
				io.emit("game_created", game);
			});

			socket.on("game_updated", (game) => {
				console.log("[Server] Game updated event received:", game);
				io.emit("game_updated", game);
			});

			socket.on("join", (gameId) => {
				console.log("[Server] Join event received:", gameId);
				socket.join(gameId);
			})
			
			socket.on("user_joined", (gameId, firstName) => {
				console.log("[Server] User joined event received:", gameId);
				socket.to(gameId).emit("user_joined", `${firstName} joined the game`);
			});

			socket.on("leave", (gameId) => {
				console.log("[Server] Leave event received:", gameId);
				socket.leave(gameId);
				io.emit("game_ended", gameId);
			})
			
			socket.on("user_left", (gameId, firstName) => {
				console.log("[Server] User left event received:", gameId);
				socket.to(gameId).emit("user_left", `${firstName} left the game. Returning to the lobby...`);
			});

			socket.on("game_full", (gameId) => {
				console.log("[Server] Game full event received:", gameId);
				io.emit("game_full", gameId);
			});

			socket.on("disconnect", () => {
				console.log("A user disconnected");
				console.log("Authenticated User Data:", socket.data.user);
				if(socket.data.user.id) {
					const gameIds = getUserPendingGameIds(socket.data.user.id);
					gameIds.then((ids) => {
						if (ids?.length) {
							for (const id of ids) {
								endGame(id);
								io.emit("game_ended", id);
							}
						}
					});
				}
			});

			socket.on("board_updated", (gameId, board) => {	
				console.log("board_updated", gameId, board);
				socket.to(gameId).emit("board_updated", board);
			});

			socket.on("action_cancelled", (gameId) => {
				console.log("action_cancelled", gameId);
				socket.to(gameId).emit("action_cancelled");
			});

			socket.on("turn_completed", (gameId) => {
				console.log("turn_completed", gameId);
				socket.to(gameId).emit("turn_completed", gameId);
			});

			socket.on("game_restarted", (gameId, gameTurn) => {
				console.log("game_restarted", gameId);
				socket.to(gameId).emit("game_restarted", gameId, gameTurn);
			});
		});


		httpServer.listen(port, () => {
			console.log(`Server running on http://${hostname}:${port}`);

		});
	})

const getUserPendingGameIds = async (userId: string) => {
	const userGames = await getUserGames(userId);

	if (!userGames?.length) {
		return
	}
	// For unknown reasons, the userGames array is not iterable with map or filter
	const cleanedUserGames = [];
	for (let i = 0; i < userGames.length; i++) {
		const game = userGames[i];

		if (game && typeof game === "object" && Object.getPrototypeOf(game) === Object.prototype) {
			// Valid object, push it to the cleaned array
			cleanedUserGames.push(game);
		} else {
			// Log problematic elements
			console.error(`Problematic game at index ${i}:`, game);
		}
	}

	// For unknown reasons, the cleanedUserGames array is still not iterable with map or filter
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

	return pendingGames.map((game) => game.id);
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