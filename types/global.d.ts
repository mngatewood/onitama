import { Session } from 'next-auth';

declare global {
	interface Game {
		id: string;
		players: Players;
		board: string[][];
		status: string;
		turn: string;
		createdAt: Date;
		updatedAt: Date;
		users?: User[];
		cards?: Card[];
	}

	interface Players {
		red: {
			id: string;
			cards: Card[];
		};
		blue: {
			id: string;
			cards: Card[];
		};
	}

	interface User {
		id: string;
		first_name: string;
		last_name: string;
		email: string;
		created_at: Date;
		updated_at: Date;
		password?: string;
	}

	interface Card {
		id: string;
		title: string;
		kanji: string;
		color: string;
		moves: number[];
		createdAt: Date;
		updatedAt: Date;
	}

	interface AppendedSession extends Session {
		user: {
			id: string;
			email: string;
		};
	}

	interface ToastNotification {
		type: string; /* system (blue), error (red), success (green) */
		message: string;
		action: string; /* path to redirect to after the delay */
		duration: number; /* how long to show the notification (0 to stay rendered until next notification is added) */
		delay: number; /* how long to wait before redirecting to the action path */
	}

	interface Target {
		origin: Position;
		target: Position;
	}

};