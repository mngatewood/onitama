import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

export const POST = async (request: NextRequest ) => {
	try {
		const data = await request.json();
		const response = await prisma.game.create({ data: data })
		return NextResponse.json(response);
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error: ", error.stack)
		}
	}
};

export const GET = async (request: NextRequest) => {
	const url = new URL(request.url);
	const id = url.searchParams.get("id");
	if (id) {
		const response = await prisma.game.findUnique({
			where: {
				id: id
			},
			include: {
				users: true,
				cards: true
			}
		})
		return NextResponse.json(response);
	} else {
		const response = await prisma.game.findMany();
		return NextResponse.json(response);
	}
}
