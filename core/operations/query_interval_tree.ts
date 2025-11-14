import { type Interval } from "./types"
import { IntervalTreeNode } from "./IntervalTreeNode"

// Given a query value, return all intervals that contain that value.
function query_interval_tree_naive(tree: IntervalTreeNode, query: number): Array<Interval> {
	const overlaps = []
	const [m_selected, subtree_selected] = query < tree.key ? [tree.ml, tree.left] : [tree.mr, tree.right]


	// if query is less than the node's median, that means if there are any more matching intervals, they would be in the left subtree.
	for (let i = 0; i < m_selected.length; i++) {
		if (query >= m_selected[i][0] && query <= m_selected[i][1]) {
			overlaps.push(m_selected[i])
		}
	}

	if (!subtree_selected) return overlaps

	return [...overlaps, ...query_interval_tree_naive(subtree_selected, query)]
}

function query_interval_tree(tree: IntervalTreeNode, query: number): Array<Interval> {
	const overlaps = []

	return overlaps
}

export { query_interval_tree, query_interval_tree_naive }
