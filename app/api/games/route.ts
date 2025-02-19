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
	} else {
		return NextResponse.json({ message: "No valid action parameter provided" }, { status: 400 });
	}
}

export const PUT = async (request: NextRequest) => {
	try {
		const data = await request.json();
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
};

export const GET = async (request: NextRequest) => {
	const url = new URL(request.url);
	const id = url.searchParams.get("id");
	const status = url.searchParams.get("status");
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
			const oldPendingGameIds = await getOldPendingGameIds();
			// delete old pending games, if any
			if(oldPendingGameIds.length) {
				const deletedGameIds = await deleteGames(oldPendingGameIds);
				if(deletedGameIds.count === oldPendingGameIds.length) {
					socket.emit("games_deleted", oldPendingGameIds);
				}
			}
			const response = await getPendingGames();
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

const getOldPendingGameIds = async () => {
	try {
		const games = await prisma.game.findMany({
			where: {
				status: "waiting_for_players",
				createdAt: {
					lt: new Date(Date.now() - 2 * 60 * 1000)
				}
			}
		})

		const response = games.map(game => game.id);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
		return NextResponse.json(error);
	}
}

const deleteGames = async (gameIds: string[]) => {
	try {
		const response = await prisma.game.deleteMany({
			where: {
				id: {
					in: gameIds
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

const getPendingGames = async () => {
	try {
		const response = await prisma.game.findMany({
			where: {
				status: "waiting_for_players"
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