import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { neon } from "@neondatabase/serverless"
import { validateFormData } from "../../../components/helpers/auth";

const sql = neon(`${process.env.DATABASE_URL}`);

export const emailExists = async (email: string) => {
	const response = await sql`
		SELECT * FROM users WHERE email = ${email}
	`;
	return response.length > 0
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
		const response = await sql`
			INSERT INTO users (first_name, last_name, email, password) 
			VALUES (${firstName}, ${lastName || null}, ${email}, ${hashedPassword})
		`;
		return NextResponse.json(response);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "An error occurred while registering" }, { status: 500 });
	}
}