import { type Interval } from "@/core/types";
import { AugmentedIntervalTree } from "@/core/classes/AugmentedIntervalTree";

/**
 * In-memory interval tree service for fast range queries.
 *
 * This service maintains an augmented interval tree in memory, which is built from
 * flat interval data (e.g., loaded from a database). It provides O(log n + k)
 * query performance where k is the number of results.
 *
 * Uses the AugmentedIntervalTree (augmented BST) for efficient interval queries.
 *
 * @example
 * ```ts
 * const service = new IntervalTreeService();
 *
 * // Initialize with intervals (e.g., loaded from database)
 * service.initialize(intervals);
 *
 * // Query for overlapping intervals
 * const results = service.queryRange(startTimestamp, endTimestamp);
 * ```
 */
export class IntervalTreeService {
	private tree: AugmentedIntervalTree;
	private isInitialized = false;

	constructor() {
		this.tree = new AugmentedIntervalTree();
	}

	/**
	 * Initializes the interval tree from flat interval data.
	 * This would typically be called on application startup with data from the database.
	 *
	 * @param intervals - Array of [start, end] timestamp tuples
	 */
	initialize(intervals: Array<Interval>): void {
		if (intervals.length === 0) {
			this.tree = new AugmentedIntervalTree();
			this.isInitialized = false;
			return;
		}

		// Create a new tree and insert all intervals
		this.tree = new AugmentedIntervalTree();
		for (const interval of intervals) {
			this.tree.insert(interval);
		}
		console.log(this.tree.getHeight())
		this.isInitialized = true;
	}

	/**
	 * Queries the interval tree for all intervals that overlap with the given range.
	 *
	 * Uses the augmented interval tree's queryInterval method for O(log n + k) performance.
	 *
	 * @param startTime - Start of the query range (unix timestamp)
	 * @param endTime - End of the query range (unix timestamp)
	 * @returns Array of intervals that overlap with the query range
	 * @throws Error if the service hasn't been initialized
	 */
	queryRange(startTime: number, endTime: number): Array<Interval> {
		if (!this.isInitialized) {
			throw new Error("IntervalTreeService not initialized. Call initialize() first.");
		}

		if (startTime > endTime) {
			throw new Error("Start time must be less than or equal to end time.");
		}

		// Use the tree's built-in interval query method
		// This finds all intervals that overlap with [startTime, endTime]
		return this.tree.queryInterval([startTime, endTime]);
	}

	/**
	 * Queries for all intervals that contain a specific point in time.
	 *
	 * @param timestamp - The point in time to query (unix timestamp)
	 * @returns Array of intervals that contain the given timestamp
	 * @throws Error if the service hasn't been initialized
	 */
	queryPoint(timestamp: number): Array<Interval> {
		if (!this.isInitialized) {
			throw new Error("IntervalTreeService not initialized. Call initialize() first.");
		}

		return this.tree.queryPoint(timestamp);
	}

	/**
	 * Rebuilds the interval tree. Call this after the underlying data changes.
	 *
	 * @param newIntervals - Updated array of intervals
	 */
	rebuild(newIntervals: Array<Interval>): void {
		this.initialize(newIntervals);
	}

	/**
	 * Returns whether the service has been initialized.
	 */
	getIsInitialized(): boolean {
		return this.isInitialized;
	}

	/**
	 * Returns the total number of intervals in the tree.
	 */
	getIntervalCount(): number {
		return this.tree.getAllIntervals().length;
	}

	/**
	 * Returns the height of the tree (useful for checking balance).
	 * A balanced tree should have height around log2(n).
	 */
	getTreeHeight(): number {
		return this.tree.getHeight();
	}
}
