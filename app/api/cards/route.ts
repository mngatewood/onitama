import { NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

export const GET = async () => {
	try {
		const response = await prisma.card.findMany();
		return NextResponse.json(response);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "An error occurred while fetching cards" }, { status: 500 });
	}
};
