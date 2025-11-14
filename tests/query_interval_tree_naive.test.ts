import { test, expect } from "vitest"
import { create_interval_tree } from "@/core/create_interval_tree"
import { query_interval_tree_naive } from "@/core/query_interval_tree"

test("query_interval_tree_naive", () => {
	const intervals: Array<[number, number]> = [[4, 11], [2, 4], [0, 19], [1, 2], [7, 11], [1, 40], [-4, 3]]
	const tree = create_interval_tree(intervals)

	const query = 2
	const expected_matches = [[2, 4], [0, 19], [1, 2], [-4, 3]]

	const matches = query_interval_tree_naive(tree, query)

	expect(matches).toContainEqual(expected_matches[0])
	expect(matches).toContainEqual(expected_matches[1])
	expect(matches).toContainEqual(expected_matches[2])
})

