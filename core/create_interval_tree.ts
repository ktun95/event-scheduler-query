import { IntervalTreeNode } from "./IntervalTreeNode"
import { get_median } from "./get_median"
import { generic_bubble_sort } from "./sorting/generic_bubble_sort"
import { lower_interval_comparator } from "./comparators/lower_interval_comparator"
import { upper_interval_comparator } from "./comparators/upper_interval_comparator"

function createIntervalTree(intervals: Set<[number, number]>): IntervalTreeNode {
	// 1. Get median value
	const median = get_median(intervals)
	// 2. Get L, R, and M

	// L: Set of intervals whose higher value is < median
	let L = []
	// R: Set of intervals whose lower value is > median
	let R = []
	// M: Set of intervals that are intersected by median
	let M = []

	for (const interval of intervals) {
		if (interval[1] < median) {
			// L: Set of intervals whose higher value is < median
			L.push(interval)
		} else if (interval[0] > median) {
			// R: Set of intervals whose lower value is > median
			R.push(interval)
		} else {
			M.push(interval)
		}

		const MR = generic_bubble_sort(upper_interval_comparator)(M)
		const ML = generic_bubble_sort(lower_interval_comparator)(M)
	}


	// How do we know when an interval should be stored on a node?
	//
}
