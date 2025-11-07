import { test, expect } from "vitest"
import { generic_bubble_sort } from "@/core/sorting/generic_bubble_sort"
import { number_comparator } from "@/core/comparators/number_comparator"
import { lower_interval_comparator } from "@/core/comparators/lower_interval_comparator"

test("Generic bubble sort", () => {
	const test_array = [4, 11, 7, 20, 5, 6, 32, 19]
	const expected_array = [4, 5, 6, 7, 11, 19, 20, 32]

	const test_interval_array: Array<[number, number]> = [[9, 24], [0, 14], [3, 4], [1, 5]]
	const expected_interval_array = [[0, 14], [1, 5], [3, 4], [9, 24]]

	const sorted_array = generic_bubble_sort(number_comparator)(test_array)
	const lower_sorted_interval_array = generic_bubble_sort(lower_interval_comparator)(test_interval_array)

	expect(sorted_array).toEqual(expected_array)
	expect(lower_sorted_interval_array).toEqual(expected_interval_array)
})
