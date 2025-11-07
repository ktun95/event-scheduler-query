import { test, expect } from "vitest"
import { bubble_sort } from "@/core/sorting/bubble_sort"

test("Bubble sort", () => {
	const test_array = [4, 11, 7, 20, 5, 6, 32, 19]
	const expected_array = [4, 5, 6, 7, 11, 19, 20, 32]

	bubble_sort(test_array)

	expect(test_array).toEqual(expected_array)
})
