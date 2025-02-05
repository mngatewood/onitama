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

	try {
		const { firstName, lastName, email, password, confirmPassword } = await request.json();
		if (!validateFormData(firstName, lastName, email, password, confirmPassword)) {
			throw new Error("Form data is invalid");
		}
		if (await emailExists(email)) {
			throw new Error("Email already exists");
		}
		console.log(firstName, lastName, email, password, confirmPassword);
		const hashedPassword = await hash(password, 10);
		const response = await sql`
			INSERT INTO users (first_name, last_name, email, password) 
			VALUES (${firstName}, ${lastName || null}, ${email}, ${hashedPassword})
		`;
		return NextResponse.json(response);

	} catch (error) {
		console.log(error);
		// TODO: send error message to RegisterForm component and update state
		return NextResponse.json({ message: "error" }, { status: 500 });
	}
}