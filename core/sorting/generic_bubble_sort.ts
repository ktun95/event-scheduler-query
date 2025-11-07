import { swap } from "@/core/util/swap"

const generic_bubble_sort = <T>(comparator: (first: T, second: T) => -1 | 0 | 1) => (arr: Array<T>) => {
	let sorted = [...arr]

	let last_unsorted_index = sorted.length - 1
	// If there is a pass where no items are swapped. The sorting is complete.
	let swapped = true
	while (swapped) {
		swapped = false
		for (let i = 1; i <= last_unsorted_index; i++) {
			const right = sorted[i]
			const left = sorted[i - 1]
			if (comparator(left, right) === 1) {
				swap(sorted, i - 1, i)
				swapped = true
			}
		}
		last_unsorted_index--
	}
	return sorted
}

export { generic_bubble_sort }
