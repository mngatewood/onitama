import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import { compare } from "bcrypt";

const sql = neon(`${process.env.DATABASE_URL}`);

const handler = NextAuth({
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: {},
				password: {}
			},
			async authorize(credentials) {
				const response = await sql`
					SELECT * FROM users WHERE email = ${credentials?.email || ""}
				`
				const user = response[0];
				const passwordCorrect = await compare(credentials?.password || "", user.password);
				if(passwordCorrect) {
					return {
						id: user.id,
						firstName: user.first_name,
						lastName: user.last_name,
						email: user.email,
					}
				} else {
					return null
				}
			}
		})
	],
});

export { handler as GET, handler as POST };