import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "../../../lib/prisma";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id
			}
			return token
		},

		session({ session, token }) {
			if(session.user) {
				// @ts-expect-error Adding id from token to session
				session.user.id = token.id
			}
			return session
		},
	},
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
				const response = await prisma.user.findUnique({
					where: {
						email: credentials?.email || ""
					}
				})
				const user = response;
				if (!user) {
					return null
				}
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };