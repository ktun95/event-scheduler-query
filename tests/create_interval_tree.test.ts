import { expect, test } from "vitest"
import { create_interval_tree } from "@/core/create_interval_tree"

test("create_interval_tree", () => {
	const intervals: Array<[number, number]> = [[4, 11], [2, 4], [0, 19], [1, 2], [7, 11]]
	const tree = create_interval_tree(intervals)

	console.log(JSON.stringify(tree))
})
