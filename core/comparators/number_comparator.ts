function number_comparator(first: number, second: number): -1 | 0 | 1 {
	if (first > second) return 1
	if (first < second) return -1
	return 0
}

export { number_comparator }
