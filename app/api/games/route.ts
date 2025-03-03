import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

export const POST = async (request: NextRequest ) => {
	const url = new URL(request.url);
	const action = url.searchParams.get("action");

	// join game
	if(action === "join") {
		try {
			const data = await request.json();

			const response = await prisma.game.update({
				include: {
					users: {
						omit: {
							password: true
						}
					}
				},
				where: {
					id: data.gameId
				},
				data: {
					users: {
						connect: {
							id: data.userId
						}
					},
					players: data.players,
					status: "in_progress"
				}
			})
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	// change game status
	} else if (action === "change_status") {
		try {
			const data = await request.json();
			const response = await prisma.game.update({
				where: {
					id: data.gameId
				},
				data: {
					status: data.status
				}
			})
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	} else {
		return NextResponse.json({ message: "No valid action parameter provided" }, { status: 400 });
	}
}

export const PUT = async (request: NextRequest) => {
	const url = new URL(request.url);
	const action = url.searchParams.get("action");
	const data = await request.json();
	if (action === "solo") {
		try {
			const virtualOpponent = await createVirtualOpponent();
			data.players.red.id = virtualOpponent.id;
			data.users.connect.push({
				id: virtualOpponent.id,
			});
			data.status = "in_progress";
			const newGame = await prisma.game.create({ data: data })
			if (!newGame) {
				return NextResponse.json({ message: "Error creating game" }, { status: 500 });
			}
			const response = await getGame(newGame.id);
			if (!response) {
				return NextResponse.json({ message: "Game not found" }, { status: 404 });
			}
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	} else if (action === "multiplayer") {
		try {
			const newGame = await prisma.game.create({ data: data })
			if(!newGame) {
				return NextResponse.json({ message: "Error creating game" }, { status: 500 });
			}
			const response = await getGame(newGame.id);
			if(!response) {
				return NextResponse.json({ message: "Game not found" }, { status: 404 });
			}
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	} else {
		return NextResponse.json({ message: "No valid action parameter provided" }, { status: 400 });
	}
};

export const GET = async (request: NextRequest) => {
	const url = new URL(request.url);
	const id = url.searchParams.get("id");
	const status = url.searchParams.get("status");
	const userId = url.searchParams.get("user_id")
	if (id) {
		// get specific game
		try {
			const response = await getGame(id);
			if (!response) {
				return NextResponse.json({ message: "Game not found" }, { status: 404 });
			}
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	} else if (status && status === "waiting_for_players") {
		// get pending games
		try {
			const response = await getPendingGames();
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	} else if (userId) {
		// get all games for a specific user
		try {
			const response = await getUserGames(userId);
			if (!response) {
				return NextResponse.json({ message: "Game not found" }, { status: 404 });
			}
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	} else {
		try {
			const response = await prisma.game.findMany();
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	}
}

export const DELETE = async (request: NextRequest) => {
	const url = new URL(request.url);
	const id = url.searchParams.get("id");

	// delete all pending games older than 1 hour whenever a game is deleted
	await deleteOldPendingGames();

	if(id) {
		// delete specific game
		try {
			const response = await prisma.game.delete({
				where: {
					id: id
				}
			})
			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error: ", error.stack)
			}
			return NextResponse.json(error);
		}
	} else {
		return NextResponse.json({ message: "Not allowed" }, { status: 400 });
	}
}

const getGame = async (id: string) => {
	try {
		const response = await prisma.game.findUnique({
			where: {
				id: id
			},
			include: {
				users: {
					omit: {
						password: true
					}
				},
				cards: true
			}
		})
		return response;
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
		return NextResponse.json(error);
	}
}

const deleteOldPendingGames = async () => {
	try {
		const response = await prisma.game.deleteMany({
			where: {
				status: "waiting_for_players",
				createdAt: {
					lt: new Date(Date.now() - 1 * 60 * 60 * 1000)
				}
			}
		})
		return response;
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
		throw error;
	}
}

const getPendingGames = async () => {
	try {
		const response = await prisma.game.findMany({
			where: {
				status: "waiting_for_players",
				createdAt: {
					gte: new Date(Date.now() - 1 * 60 * 60 * 1000)
				}

			},
			include: {
				users: {
					omit: {
						password: true
					}
				},
				cards: true
			}
		})
		return response;
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
		return NextResponse.json(error);
	}
}

const getUserGames = async (userId: string) => {
	try {
		const response = await prisma.game.findMany({
			where: {
				users: {
					some: {
						id: userId
					}
				}
			}
		})
		return response;
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
		return NextResponse.json(error);
	}
}

const createVirtualOpponent = async () => {
	const existingUser = await prisma.user.findFirst({
		where: {
			email: "virtual_opponent@mngatewood.com"
		}
	})
	if (!existingUser) {
		const response = await prisma.user.create({
			data: {
				email: "virtual_opponent@mngatewood.com",
				password: process.env.VIRTUAL_OPPONENT_PASSWORD!,
				first_name: "Virtual Opponent"
			}
		})
		return response;
	} else {
		return existingUser;
	}
}