"use client"

import { io } from "socket.io-client";

const socketHost = process.env.NEXT_PUBLIC_BASE_URL

export const socket = io(socketHost, {
	withCredentials: true,
	transports: ["websocket"],
});

socket.on("connect", () => {
	console.log("Connected to socket server");
});

socket.on("connect_error", (err) => {
	console.error("Socket connection error:", err);
});
