import { bubble_sort } from "./bubble_sort"

function get_median(intervals: Set<[number, number]>): number {
	const points = []
	for (const interval of intervals) {
		points.push(interval[0])
		points.push(interval[1])
	}
	bubble_sort(points)
	const median_index = Math.floor(points.length / 2)
	return points[median_index]
}

export { get_median }
