import { test, expect } from "vitest"
import { swap } from "@/core/swap"

test("swap", () => {
	const test_array = [1, 3, 2]
	const expected_array = [1, 2, 3]
	swap(test_array, 1, 2)

	expect(test_array).toEqual(expected_array)
})
