import { describe, it, expect } from "vitest"
import { IntervalTreeService } from "@/services/IntervalTreeService"
import type { Interval } from "@/core/types"

describe("IntervalTreeService", () => {
	it("should initialize with empty intervals", () => {
		const service = new IntervalTreeService()
		service.initialize([])
		expect(service.getIsInitialized()).toBe(false)
		expect(service.getIntervalCount()).toBe(0)
	})

	it("should initialize with intervals", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = [
			[1, 5],
			[3, 7],
			[6, 10],
		]
		service.initialize(intervals)
		expect(service.getIsInitialized()).toBe(true)
		expect(service.getIntervalCount()).toBe(3)
	})

	it("should query range and find overlapping intervals", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = [
			[1, 5],
			[3, 7],
			[6, 10],
			[12, 15],
		]
		service.initialize(intervals)

		// Query [4, 8] should overlap with [1,5], [3,7], and [6,10]
		const results = service.queryRange(4, 8)
		expect(results.length).toBe(3)
		expect(results).toContainEqual([1, 5])
		expect(results).toContainEqual([3, 7])
		expect(results).toContainEqual([6, 10])
		expect(results).not.toContainEqual([12, 15])
	})

	it("should query range with no overlaps", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = [
			[1, 5],
			[10, 15],
		]
		service.initialize(intervals)

		// Query [6, 9] should find nothing
		const results = service.queryRange(6, 9)
		expect(results.length).toBe(0)
	})

	it("should query point and find containing intervals", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = [
			[1, 5],
			[3, 7],
			[6, 10],
		]
		service.initialize(intervals)

		// Point 4 is in [1,5] and [3,7]
		const results = service.queryPoint(4)
		expect(results.length).toBe(2)
		expect(results).toContainEqual([1, 5])
		expect(results).toContainEqual([3, 7])
	})

	it("should rebuild tree with new intervals", () => {
		const service = new IntervalTreeService()
		const intervals1: Array<Interval> = [[1, 5], [3, 7]]
		service.initialize(intervals1)
		expect(service.getIntervalCount()).toBe(2)

		const intervals2: Array<Interval> = [[10, 15], [20, 25], [30, 35]]
		service.rebuild(intervals2)
		expect(service.getIntervalCount()).toBe(3)

		// Old intervals should not be found
		const results = service.queryRange(1, 7)
		expect(results.length).toBe(0)

		// Query [10, 30] overlaps with [10,15], [20,25], and [30,35] (since 30 <= 30)
		const newResults = service.queryRange(10, 30)
		expect(newResults.length).toBe(3)
	})

	it("should throw error when querying uninitialized service", () => {
		const service = new IntervalTreeService()
		expect(() => service.queryRange(1, 5)).toThrow(
			"IntervalTreeService not initialized",
		)
	})

	it("should throw error when start time > end time", () => {
		const service = new IntervalTreeService()
		service.initialize([[1, 5]])
		expect(() => service.queryRange(10, 5)).toThrow(
			"Start time must be less than or equal to end time",
		)
	})

	it("should work with unix timestamp data", () => {
		const service = new IntervalTreeService()
		// Jan 1, 2024 - Jan 5, 2024
		const intervals: Array<Interval> = [
			[1704067200000, 1704153600000], // Jan 1-2
			[1704153600000, 1704240000000], // Jan 2-3
			[1704240000000, 1704326400000], // Jan 3-4
			[1704326400000, 1704412800000], // Jan 4-5
		]
		service.initialize(intervals)

		// Query for Jan 2-3
		const results = service.queryRange(1704153600000, 1704240000000)
		// Should overlap with Jan 1-2, Jan 2-3, and Jan 3-4
		expect(results.length).toBe(3)
	})

	it("should handle edge case where query range exactly matches an interval", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = [[1, 5], [6, 10]]
		service.initialize(intervals)

		const results = service.queryRange(1, 5)
		expect(results.length).toBe(1)
		expect(results).toContainEqual([1, 5])
	})

	it("should handle single point range query", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = [
			[1, 5],
			[3, 7],
			[8, 10],
		]
		service.initialize(intervals)

		// Query for single point [4, 4]
		const results = service.queryRange(4, 4)
		expect(results.length).toBe(2)
		expect(results).toContainEqual([1, 5])
		expect(results).toContainEqual([3, 7])
	})

	it("should return tree height", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = [
			[1, 5],
			[3, 7],
			[6, 10],
			[8, 12],
		]
		service.initialize(intervals)

		const height = service.getTreeHeight()
		// Height should be reasonable for 4 nodes
		expect(height).toBeGreaterThan(0)
		expect(height).toBeLessThanOrEqual(4)
	})
})
