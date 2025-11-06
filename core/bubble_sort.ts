import { swap } from "./swap"

function bubble_sort(arr: Array<number>): Array<number> {
	// Pass through the array over and over, lifting the highest encountered value rightward each time.
	// For every pass, we can stop short one more element than the last pass, since it will be in its rightful place.
	let last_unsorted_index = arr.length - 1
	// If there is a pass where no items are swapped. The sorting is complete.
	let swapped = true
	while (swapped) {
		swapped = false
		for (let i = 1; i <= last_unsorted_index; i++) {
			const right = arr[i]
			const left = arr[i - 1]
			if (left > right) {
				swap(arr, i - 1, i)
				swapped = true
			}
		}
		last_unsorted_index--
	}
	return arr
}

export { bubble_sort }
