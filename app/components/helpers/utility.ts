export const shuffleArray = (array: Array<number>) =>{
	let j, x, index;
	for (index = array.length - 1; index > 0; index--) {
		j = Math.floor(Math.random() * (index + 1));
		x = array[index];
		array[index] = array[j];
		array[j] = x;
	}
	return array;
}
