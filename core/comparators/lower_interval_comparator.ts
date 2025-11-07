function lower_interval_comparator(first: [number, number], second: [number, number]): -1 | 0 | 1 {
	if (first[0] > second[0]) return 1
	if (first[0] < second[0]) return -1
	return 0
}

export { lower_interval_comparator }
