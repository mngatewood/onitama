import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { validateFormData } from "../../../components/helpers/auth";
import { prisma } from "../../../lib/prisma";

const emailExists = async (email: string) => {
	const response = await prisma.user.findUnique({
		where: {
			email: email
		}
	})
	return response !== null
}

export const POST = async (request: Request) => {
	const { firstName, lastName, email, password, confirmPassword } = await request.json();
	try {
		if (!validateFormData(firstName, lastName, email, password, confirmPassword)) {
			return NextResponse.json({message: "Form data is invalid"}, {status: 400});
		}
		if (await emailExists(email)) {
			return NextResponse.json({message: "Email already exists"}, {status: 400});
		}
		const hashedPassword = await hash(password, 10);
		const response = await prisma.user.create({
			data: {
				first_name: firstName,
				last_name: lastName || null,
				email: email,
				password: hashedPassword
			}
		})
		return NextResponse.json(response);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "An error occurred while registering" }, { status: 500 });
	}
}