import { type Interval } from "../types"
import { AugmentedIntervalTree } from "../classes/AugmentedIntervalTree"

/**
 * Creates an augmented BST interval tree from an array of intervals
 * For better balance, intervals are sorted by their midpoint before insertion
 *
 * Time complexity: O(n log n)
 *
 * @param intervals - Array of intervals to insert into the tree
 * @returns An AugmentedIntervalTree containing all intervals
 */
function create_augmented_interval_tree(
	intervals: Array<Interval>,
): AugmentedIntervalTree {
	const tree = new AugmentedIntervalTree()

	if (intervals.length === 0) {
		return tree
	}

	// Sort by interval midpoint to get better initial balance
	// This creates a more balanced tree than inserting in arbitrary order
	const sortedIntervals = [...intervals].sort((a, b) => {
		const midA = (a[0] + a[1]) / 2
		const midB = (b[0] + b[1]) / 2
		return midA - midB
	})

	// Build tree using a balanced insertion order (median-based recursion)
	_insertBalanced(tree, sortedIntervals, 0, sortedIntervals.length - 1)

	return tree
}

/**
 * Inserts intervals in a balanced manner using divide-and-conquer
 * This creates a more balanced initial tree structure
 */
function _insertBalanced(
	tree: AugmentedIntervalTree,
	intervals: Array<Interval>,
	start: number,
	end: number,
): void {
	if (start > end) {
		return
	}

	// Insert the middle element first
	const mid = Math.floor((start + end) / 2)
	tree.insert(intervals[mid])

	// Recursively insert left and right halves
	_insertBalanced(tree, intervals, start, mid - 1)
	_insertBalanced(tree, intervals, mid + 1, end)
}

export { create_augmented_interval_tree }
