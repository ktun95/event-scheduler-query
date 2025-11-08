class IntervalTreeNode {
	// The point
	key: number
	mr: Array<[number, number]>
	ml: Array<[number, number]>
	left: IntervalTreeNode
	right: IntervalTreeNode

	constructor(key: number, mr: Array<[number, number]>, ml: Array<[number, number]>) {
		this.key = key
		this.mr = mr
		this.ml = ml
	}
}

export { IntervalTreeNode }

