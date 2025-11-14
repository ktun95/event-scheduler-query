import { describe, it, expect } from "vitest"
import { IntervalTreeService } from "@/services/IntervalTreeService"
import { AugmentedIntervalTree } from "@/core/classes/AugmentedIntervalTree"
import type { Interval } from "@/core/types"

describe("AVL Balancing", () => {
	it("should maintain O(log n) height with 10,000 sorted intervals", () => {
		const tree = new AugmentedIntervalTree()
		const count = 10000

		// Insert sorted intervals (worst case for unbalanced BST)
		for (let i = 0; i < count; i++) {
			const start = i * 1000
			const end = start + 500
			tree.insert([start, end])
		}

		const height = tree.getHeight()
		const optimalHeight = Math.ceil(Math.log2(count))

		// AVL tree height should be at most 1.44 * log2(n)
		const maxAllowedHeight = Math.ceil(1.44 * Math.log2(count))

		console.log(`Count: ${count}`)
		console.log(`Actual height: ${height}`)
		console.log(`Optimal height (log2(n)): ${optimalHeight}`)
		console.log(`Max allowed height (1.44*log2(n)): ${maxAllowedHeight}`)

		expect(height).toBeLessThanOrEqual(maxAllowedHeight)
		expect(height).toBeGreaterThan(optimalHeight - 5) // Should be close to optimal
	})

	it("should handle queries on large balanced tree without stack overflow", () => {
		const service = new IntervalTreeService()
		const intervals: Array<Interval> = []

		// Generate 10,000 intervals
		for (let i = 0; i < 10000; i++) {
			const start = i * 1000
			const end = start + 2000 // Some overlap
			intervals.push([start, end])
		}

		// Initialize tree
		service.initialize(intervals)

		const height = service.getTreeHeight()
		console.log(`Tree height for 10,000 intervals: ${height}`)

		// Query should work without stack overflow
		const results = service.queryRange(5000000, 5010000)

		expect(results.length).toBeGreaterThan(0)
		expect(height).toBeLessThan(20) // Should be around 13-14 for balanced tree
	})

	it("should maintain balance with random insertion order", () => {
		const tree = new AugmentedIntervalTree()
		const count = 5000

		// Random intervals
		const intervals: Array<Interval> = []
		for (let i = 0; i < count; i++) {
			const start = Math.floor(Math.random() * 1000000)
			const end = start + Math.floor(Math.random() * 10000)
			intervals.push([start, end])
		}

		// Insert all intervals
		for (const interval of intervals) {
			tree.insert(interval)
		}

		const height = tree.getHeight()
		const maxAllowedHeight = Math.ceil(1.44 * Math.log2(count))

		console.log(
			`Random insert - Count: ${count}, Height: ${height}, Max allowed: ${maxAllowedHeight}`,
		)

		expect(height).toBeLessThanOrEqual(maxAllowedHeight)
	})

	it("should verify balance factor at every node", () => {
		const tree = new AugmentedIntervalTree()

		// Insert 1000 sorted intervals
		for (let i = 0; i < 1000; i++) {
			tree.insert([i, i + 10])
		}

		// Helper to check balance factor recursively
		const checkBalance = (node: any): boolean => {
			if (node === null) return true

			const balance = node.getBalanceFactor()

			// AVL property: balance factor must be -1, 0, or 1
			if (balance < -1 || balance > 1) {
				console.error(`Balance violation at node [${node.start},${node.end}]: ${balance}`)
				return false
			}

			return checkBalance(node.left) && checkBalance(node.right)
		}

		const isBalanced = checkBalance(tree.root)
		expect(isBalanced).toBe(true)
	})

	it("should handle the dummy intervals from the app", () => {
		const service = new IntervalTreeService()

		// Generate similar to dummyIntervals.ts
		const intervals: Array<Interval> = []
		const baseTime = 1704067200000
		const timeSpan = 2 * 365 * 24 * 60 * 60 * 1000

		const durations = [
			1 * 60 * 60 * 1000,
			2 * 60 * 60 * 1000,
			4 * 60 * 60 * 1000,
			8 * 60 * 60 * 1000,
			24 * 60 * 60 * 1000,
			3 * 24 * 60 * 60 * 1000,
			7 * 24 * 60 * 60 * 1000,
		]

		for (let i = 0; i < 10000; i++) {
			const startOffset = Math.floor(Math.random() * timeSpan)
			const start = baseTime + startOffset
			const duration =
				durations[Math.floor(Math.random() * durations.length)]
			const end = start + duration
			intervals.push([start, end])
		}

		// This should not throw stack overflow
		expect(() => service.initialize(intervals)).not.toThrow()

		const height = service.getTreeHeight()
		console.log(`App dummy data - Height: ${height}`)

		// Query should work
		const results = service.queryRange(
			baseTime,
			baseTime + 7 * 24 * 60 * 60 * 1000,
		)
		expect(results.length).toBeGreaterThan(0)
	})
})
