import { type Interval } from "../types"
import { AugmentedBSTNode } from "./AugmentedBSTNode"

class AugmentedIntervalTree {
	root: AugmentedBSTNode | null

	constructor() {
		this.root = null
	}

	/**
	 * Inserts an interval into the tree
	 * Time complexity: O(log n) average case, O(n) worst case (unbalanced)
	 */
	insert(interval: Interval): void {
		if (this.root === null) {
			this.root = new AugmentedBSTNode(interval)
			return
		}

		this._insertHelper(this.root, interval)
	}

	private _insertHelper(node: AugmentedBSTNode, interval: Interval): void {
		const start = interval[0]

		if (start < node.start) {
			// Go left
			if (node.left === null) {
				node.left = new AugmentedBSTNode(interval)
			} else {
				this._insertHelper(node.left, interval)
			}
		} else {
			// Go right (including equal starts - arbitrary choice)
			if (node.right === null) {
				node.right = new AugmentedBSTNode(interval)
			} else {
				this._insertHelper(node.right, interval)
			}
		}

		// Update max value after insertion
		node.updateMax()
	}

	/**
	 * Finds all intervals that overlap with the given point
	 * Time complexity: O(log n + k) where k is the number of overlapping intervals
	 */
	queryPoint(point: number): Array<Interval> {
		const results: Array<Interval> = []
		this._queryPointHelper(this.root, point, results)
		return results
	}

	private _queryPointHelper(
		node: AugmentedBSTNode | null,
		point: number,
		results: Array<Interval>,
	): void {
		if (node === null) {
			return
		}

		// Check if current interval overlaps the point
		if (node.start <= point && point <= node.end) {
			results.push(node.interval)
		}

		// Search left subtree if it could contain overlapping intervals
		// The left subtree can contain overlaps only if left.max >= point
		if (node.left !== null && node.left.max >= point) {
			this._queryPointHelper(node.left, point, results)
		}

		// Search right subtree if it could contain overlapping intervals
		// The right subtree can contain overlaps only if some interval starts before point
		// Since intervals in right subtree have start >= node.start,
		// and node.start might be > point, we need to check
		if (node.right !== null && node.start <= point) {
			this._queryPointHelper(node.right, point, results)
		}
	}

	/**
	 * Finds all intervals that overlap with the given interval
	 * Time complexity: O(log n + k) where k is the number of overlapping intervals
	 */
	queryInterval(interval: Interval): Array<Interval> {
		const results: Array<Interval> = []
		this._queryIntervalHelper(this.root, interval, results)
		return results
	}

	private _queryIntervalHelper(
		node: AugmentedBSTNode | null,
		interval: Interval,
		results: Array<Interval>,
	): void {
		if (node === null) {
			return
		}

		const [queryStart, queryEnd] = interval

		// Check if current interval overlaps the query interval
		// Two intervals [a,b] and [c,d] overlap if: a <= d AND c <= b
		if (node.start <= queryEnd && queryStart <= node.end) {
			results.push(node.interval)
		}

		// Search left subtree if it could contain overlapping intervals
		// Left subtree can overlap only if left.max >= queryStart
		if (node.left !== null && node.left.max >= queryStart) {
			this._queryIntervalHelper(node.left, interval, results)
		}

		// Search right subtree if it could contain overlapping intervals
		// Right subtree can overlap only if some interval starts before queryEnd
		if (node.right !== null && node.start <= queryEnd) {
			this._queryIntervalHelper(node.right, interval, results)
		}
	}

	/**
	 * Returns the height of the tree (useful for checking balance)
	 */
	getHeight(): number {
		return this._getHeightHelper(this.root)
	}

	private _getHeightHelper(node: AugmentedBSTNode | null): number {
		if (node === null) {
			return 0
		}

		const leftHeight = this._getHeightHelper(node.left)
		const rightHeight = this._getHeightHelper(node.right)

		return 1 + Math.max(leftHeight, rightHeight)
	}

	/**
	 * Returns all intervals in the tree (in-order traversal)
	 */
	getAllIntervals(): Array<Interval> {
		const results: Array<Interval> = []
		this._inOrderTraversal(this.root, results)
		return results
	}

	private _inOrderTraversal(
		node: AugmentedBSTNode | null,
		results: Array<Interval>,
	): void {
		if (node === null) {
			return
		}

		this._inOrderTraversal(node.left, results)
		results.push(node.interval)
		this._inOrderTraversal(node.right, results)
	}
}

export { AugmentedIntervalTree }
