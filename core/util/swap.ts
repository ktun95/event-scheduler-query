function swap<T>(arr: Array<T>, firstIndex: number, secondIndex: number): Array<T> {
	const hold = arr[firstIndex]
	arr[firstIndex] = arr[secondIndex]
	arr[secondIndex] = hold
	return arr
}

export { swap }
