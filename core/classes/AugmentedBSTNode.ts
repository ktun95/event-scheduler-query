import { type Interval } from "../types"

class AugmentedBSTNode {
	interval: Interval
	start: number
	end: number
	max: number
	height: number // Height of the node for AVL balancing
	left: AugmentedBSTNode | null
	right: AugmentedBSTNode | null

	constructor(interval: Interval) {
		this.interval = interval
		this.start = interval[0]
		this.end = interval[1]
		this.max = interval[1] // Initially, max is just this interval's end
		this.height = 1 // New nodes start with height 1
		this.left = null
		this.right = null
	}

	/**
	 * Updates the max endpoint value based on this node and its children
	 */
	updateMax(): void {
		this.max = this.end

		if (this.left !== null && this.left.max > this.max) {
			this.max = this.left.max
		}

		if (this.right !== null && this.right.max > this.max) {
			this.max = this.right.max
		}
	}

	/**
	 * Updates the height based on children's heights
	 */
	updateHeight(): void {
		const leftHeight = this.left ? this.left.height : 0
		const rightHeight = this.right ? this.right.height : 0
		this.height = 1 + Math.max(leftHeight, rightHeight)
	}

	/**
	 * Gets the balance factor (left height - right height)
	 * Balance factor > 1: left-heavy
	 * Balance factor < -1: right-heavy
	 */
	getBalanceFactor(): number {
		const leftHeight = this.left ? this.left.height : 0
		const rightHeight = this.right ? this.right.height : 0
		return leftHeight - rightHeight
	}
}

export { AugmentedBSTNode }
