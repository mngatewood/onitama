import { Session } from 'next-auth';

declare global {
	interface AppendedSession extends Session {
		user: {
			id: string;
			email: string;
		};
	}
};