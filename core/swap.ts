function swap(arr: Array<number>, firstIndex: number, secondIndex: number): Array<number> {
	const hold = arr[firstIndex]
	arr[firstIndex] = arr[secondIndex]
	arr[secondIndex] = hold
	return arr
}

export { swap }
