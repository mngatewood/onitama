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
		type: string;
		message: string;
		action: string;
		timeout: number;
	}

	interface Target {
		origin: Position;
		target: Position;
	}

};