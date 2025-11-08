import { IntervalTreeNode } from "./IntervalTreeNode"
import { type Interval } from "./types"
import { get_median } from "./get_median"
import { generic_bubble_sort } from "./sorting/generic_bubble_sort"
import { lower_interval_comparator } from "./comparators/lower_interval_comparator"
import { upper_interval_comparator } from "./comparators/upper_interval_comparator"

function create_interval_tree(intervals: Array<Interval>): IntervalTreeNode {
	if (intervals.length === 0) return null
	// 1. Get median value
	const median = get_median(intervals)
	// 2. Get L, R, and M

	// L: Set of intervals whose higher value is < median
	let L: Array<Interval> = []
	// R: Set of intervals whose lower value is > median
	let R: Array<Interval> = []
	// M: Set of intervals that are intersected by median
	let M: Array<Interval> = []

	for (let i = 0; i < intervals.length; i++) {
		if (intervals[i][1] < median) {
			// L: Set of intervals whose higher value is < median
			L.push(intervals[i])
		} else if (intervals[i][0] > median) {
			// R: Set of intervals whose lower value is > median
			R.push(intervals[i])
		} else {
			M.push(intervals[i])
		}
	}
	const MR = generic_bubble_sort(upper_interval_comparator)(M)
	const ML = generic_bubble_sort(lower_interval_comparator)(M)

	const node = new IntervalTreeNode(median, MR, ML)

	node.left = create_interval_tree(L)
	node.right = create_interval_tree(R)

	return node
}

export { create_interval_tree }
