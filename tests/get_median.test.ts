import { test, expect } from "vitest"
import { get_median } from "@/core/get_median"

test("Get median", () => {
	const test_interval_set_one: Set<[number, number]> = new Set([[1, 2], [3, 4], [5, 6]])
	const expected_one = 4
	const test_interval_set_two: Set<[number, number]> = new Set([[7, 14], [1, 8], [2, 9]])
	const expected_two = 8

	const median_one = get_median(test_interval_set_one)
	const median_two = get_median(test_interval_set_two)

	expect(median_one).toEqual(expected_one)
	expect(median_two).toEqual(expected_two)
})
