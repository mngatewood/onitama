import seedData from './seedData.json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const seed = await prisma.card.createMany({
		data: seedData.cards,
	})
	console.log(seed);
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})