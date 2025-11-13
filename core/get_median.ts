import { type Interval } from "./types"
import { bubble_sort } from "./sorting/bubble_sort"

function get_median(intervals: Array<Interval>): number {
	const points = []
	for (let i = 0; i < intervals.length; i++) {
		points.push(intervals[i][0])
		points.push(intervals[i][1])
	}
	bubble_sort(points)
	console.log(points)
	const median_index = Math.floor(points.length / 2)
	return points[median_index]
}

export { get_median }
