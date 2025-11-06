import { IntervalTreeNode } from "./IntervalTreeNode"
import { get_median } from "./get_median"

function createIntervalTree(intervals: Set<[number, number]>): IntervalTreeNode {
	// 1. Get median value
	const median = get_median(intervals)
	// 2. Get L, R, and M

	// L: Set of intervals whose higher value is < median
	// R: Set of intervals whose lower value is > median
}
