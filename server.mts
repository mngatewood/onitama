import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000" , 10);

const app = next({ dev, hostname, port });

app.prepare()
	.then(() => {
		const httpServer = createServer(app.getRequestHandler());
		const io = new Server(httpServer);

		io.on("connection", (socket) => {

			console.log(`A user connected: ${socket.id}`);
			
			socket.on("game_created", (game) => {
				console.log("socket.on: game created");
				io.emit("game_created", game);
			});

			socket.on("join", (gameId) => {
				socket.join(gameId);
			})
			
			socket.on("user_joined", (gameId, firstName) => {
				console.log(`${firstName} joined game ${gameId}`);
				socket.to(gameId).emit("user_joined", `${firstName} joined game`);
			});

			socket.on("disconnect", () => {
				console.log("A user disconnected");
			});	

		});


		httpServer.listen(port, () => {
			console.log(`Server running on http://${hostname}:${port}`);

		});
	})

