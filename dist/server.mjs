"use strict";
import { createServer } from "http";
import * as next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next.default({ dev, hostname, port });
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
        });
        socket.on("user_joined", (gameId, firstName) => {
            console.log(`${firstName} joined the game`);
            socket.to(gameId).emit("user_joined", `${firstName} joined the game`);
        });
        socket.on("leave", (gameId) => {
            socket.leave(gameId);
        });
        socket.on("user_left", (gameId, firstName) => {
            console.log(`${firstName} left the game`);
            socket.to(gameId).emit("user_left", `${firstName} left the game. Returning to the lobby...`);
        });
        socket.on("game_full", (gameId) => {
            console.log(`Game now has two players: ${gameId}`);
            io.emit("game_full", gameId);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
    httpServer.listen(port, () => {
        console.log(`Server running on http://${hostname}:${port}`);
    });
});
