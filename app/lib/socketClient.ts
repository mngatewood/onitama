"use client"

import { io } from "socket.io-client";

const socketHost = process.env.NEXT_PUBLIC_BASE_URL

export const socket = io(socketHost, {
	withCredentials: true,
	transports: ["websocket"],
});
