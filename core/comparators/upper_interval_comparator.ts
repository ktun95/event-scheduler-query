function upper_interval_comparator(first: [number, number], second: [number, number]): -1 | 0 | 1 {
	if (first[1] > second[1]) return 1
	if (first[1] < second[1]) return -1
	return 0
}

export { upper_interval_comparator }
