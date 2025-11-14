import { expect, test, describe } from "vitest"
import { AugmentedIntervalTree } from "@/core/classes/AugmentedIntervalTree"
import { create_augmented_interval_tree } from "@/core/operations/create_augmented_interval_tree"
import { type Interval } from "@/core/types"

describe("AugmentedIntervalTree", () => {
	describe("insert and basic operations", () => {
		test("should create empty tree", () => {
			const tree = new AugmentedIntervalTree()
			expect(tree.root).toBeNull()
			expect(tree.getHeight()).toBe(0)
		})

		test("should insert single interval", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([5, 10])

			expect(tree.root).not.toBeNull()
			expect(tree.root?.interval).toEqual([5, 10])
			expect(tree.root?.max).toBe(10)
			expect(tree.getHeight()).toBe(1)
		})

		test("should insert multiple intervals and maintain BST property", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([5, 10])
			tree.insert([2, 6])
			tree.insert([8, 12])

			expect(tree.root?.interval).toEqual([5, 10])
			expect(tree.root?.left?.interval).toEqual([2, 6])
			expect(tree.root?.right?.interval).toEqual([8, 12])
		})

		test("should update max values correctly", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([5, 10])
			tree.insert([2, 15]) // Left child with larger endpoint
			tree.insert([8, 12])

			expect(tree.root?.max).toBe(15) // Should propagate from left child
			expect(tree.root?.left?.max).toBe(15)
			expect(tree.root?.right?.max).toBe(12)
		})

		test("should get all intervals in sorted order", () => {
			const tree = new AugmentedIntervalTree()
			const intervals: Array<Interval> = [[5, 10], [2, 6], [8, 12], [1, 3]]

			intervals.forEach((interval) => tree.insert(interval))

			const result = tree.getAllIntervals()
			expect(result).toEqual([[1, 3], [2, 6], [5, 10], [8, 12]])
		})
	})

	describe("queryPoint", () => {
		test("should find intervals overlapping a point", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([4, 11])
			tree.insert([2, 4])
			tree.insert([0, 19])
			tree.insert([1, 2])
			tree.insert([7, 11])

			const result = tree.queryPoint(5)
			expect(result).toHaveLength(2)
			expect(result).toContainEqual([4, 11])
			expect(result).toContainEqual([0, 19])
		})

		test("should return empty array when no overlaps", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([1, 3])
			tree.insert([5, 7])
			tree.insert([10, 15])

			const result = tree.queryPoint(4)
			expect(result).toEqual([])
		})

		test("should find interval when point is at boundary", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([5, 10])

			expect(tree.queryPoint(5)).toContainEqual([5, 10])
			expect(tree.queryPoint(10)).toContainEqual([5, 10])
		})

		test("should handle point outside all intervals", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([1, 3])
			tree.insert([5, 7])

			expect(tree.queryPoint(0)).toEqual([])
			expect(tree.queryPoint(100)).toEqual([])
		})

		test("should find all overlapping intervals at a point", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([0, 10])
			tree.insert([2, 8])
			tree.insert([4, 6])
			tree.insert([5, 15])

			const result = tree.queryPoint(5)
			expect(result).toHaveLength(4)
		})
	})

	describe("queryInterval", () => {
		test("should find intervals overlapping with query interval", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([1, 3])
			tree.insert([2, 5])
			tree.insert([4, 7])
			tree.insert([8, 10])

			const result = tree.queryInterval([3, 6])
			expect(result).toHaveLength(3) // [1,3], [2,5], and [4,7] all overlap [3,6]
			expect(result).toContainEqual([1, 3]) // Touches at 3
			expect(result).toContainEqual([2, 5])
			expect(result).toContainEqual([4, 7])
		})

		test("should handle non-overlapping query interval", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([1, 3])
			tree.insert([5, 7])
			tree.insert([10, 15])

			const result = tree.queryInterval([8, 9])
			expect(result).toEqual([])
		})

		test("should find intervals when query completely contains them", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([2, 3])
			tree.insert([4, 5])
			tree.insert([6, 7])

			const result = tree.queryInterval([0, 10])
			expect(result).toHaveLength(3)
		})

		test("should find intervals that completely contain query", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([0, 100])
			tree.insert([10, 20])

			const result = tree.queryInterval([15, 18])
			expect(result).toContainEqual([0, 100])
			expect(result).toContainEqual([10, 20])
		})

		test("should handle touching intervals", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([1, 5])
			tree.insert([5, 10])

			const result = tree.queryInterval([3, 7])
			expect(result).toHaveLength(2)
		})
	})

	describe("create_augmented_interval_tree", () => {
		test("should create tree from empty array", () => {
			const tree = create_augmented_interval_tree([])
			expect(tree.root).toBeNull()
		})

		test("should create balanced tree from intervals", () => {
			const intervals: Array<Interval> = [[4, 11], [2, 4], [0, 19], [1, 2], [7, 11]]
			const tree = create_augmented_interval_tree(intervals)

			expect(tree.root).not.toBeNull()
			expect(tree.getAllIntervals()).toHaveLength(5)
		})

		test("should create tree with better balance than sequential insert", () => {
			const intervals: Array<Interval> = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]

			// Sequential insertion
			const sequentialTree = new AugmentedIntervalTree()
			intervals.forEach((interval) => sequentialTree.insert(interval))

			// Balanced creation
			const balancedTree = create_augmented_interval_tree(intervals)

			// Balanced tree should have smaller height
			expect(balancedTree.getHeight()).toBeLessThanOrEqual(
				sequentialTree.getHeight(),
			)
		})

		test("should produce tree that answers queries correctly", () => {
			const intervals: Array<Interval> = [[4, 11], [2, 4], [0, 19], [1, 2], [7, 11]]
			const tree = create_augmented_interval_tree(intervals)

			const result = tree.queryPoint(5)
			expect(result).toContainEqual([4, 11])
			expect(result).toContainEqual([0, 19])
		})
	})

	describe("dynamic insertions", () => {
		test("should support inserting into existing tree", () => {
			const tree = create_augmented_interval_tree([[1, 5], [10, 15]])

			tree.insert([7, 12])

			const result = tree.queryPoint(11)
			expect(result).toContainEqual([10, 15])
			expect(result).toContainEqual([7, 12])
		})

		test("should maintain max values after dynamic insert", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([5, 10])
			tree.insert([2, 7])

			expect(tree.root?.max).toBe(10)

			tree.insert([1, 20]) // Insert left child with large endpoint

			expect(tree.root?.max).toBe(20) // Should update to 20
		})

		test("should handle many sequential inserts", () => {
			const tree = new AugmentedIntervalTree()

			for (let i = 0; i < 100; i++) {
				tree.insert([i, i + 10])
			}

			expect(tree.getAllIntervals()).toHaveLength(100)

			const result = tree.queryPoint(50)
			expect(result.length).toBeGreaterThan(0)
		})
	})

	describe("edge cases", () => {
		test("should handle zero-length intervals (points)", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([5, 5])

			expect(tree.queryPoint(5)).toContainEqual([5, 5])
			expect(tree.queryPoint(4)).toEqual([])
			expect(tree.queryPoint(6)).toEqual([])
		})

		test("should handle negative intervals", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([-10, -5])
			tree.insert([-3, 3])
			tree.insert([5, 10])

			expect(tree.queryPoint(-7)).toContainEqual([-10, -5])
			expect(tree.queryPoint(0)).toContainEqual([-3, 3])
		})

		test("should handle duplicate intervals", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([5, 10])
			tree.insert([5, 10])
			tree.insert([5, 10])

			const result = tree.queryPoint(7)
			expect(result).toHaveLength(3)
		})

		test("should handle very large intervals", () => {
			const tree = new AugmentedIntervalTree()
			tree.insert([0, 1000000])
			tree.insert([100, 200])

			const result = tree.queryPoint(150)
			expect(result).toHaveLength(2)
		})
	})
})
