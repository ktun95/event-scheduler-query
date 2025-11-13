import { type Interval } from "./types"

class IntervalTreeNode {
	// The point
	key: number
	mr: Array<Interval>
	ml: Array<Interval>
	left: IntervalTreeNode
	right: IntervalTreeNode

	constructor(key: number, mr: Array<Interval>, ml: Array<Interval>) {
		this.key = key
		this.mr = mr
		this.ml = ml
	}
}

export { IntervalTreeNode }

