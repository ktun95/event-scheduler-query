● I'll walk you through how an augmented BST with max-endpoint annotation works
   for interval trees.

  Core Concept

  Instead of partitioning intervals by a median point, you:
  1. Store intervals in a BST ordered by their start point (left endpoint)
  2. Augment each node with the maximum endpoint in its subtree
  3. Use this max value to prune searches efficiently

  Example Walkthrough

  Let's use your test data:
  intervals = [[4,11], [2,4], [0,19], [1,2], [7,11]]

  Step 1: Build the BST (ordered by start point)

  After sorting by start point and building a balanced BST:

           [4,11]
          /      \
       [1,2]    [7,11]
       /   \
    [0,19] [2,4]

  Step 2: Augment with max endpoints

  Each node stores max = max(interval.end, left.max, right.max)

           [4,11] max=19
          /            \
       [1,2] max=19   [7,11] max=11
       /        \
    [0,19]    [2,4]
    max=19    max=4

  Let me trace through the max values:
  - [0,19]: max = 19 (its own endpoint)
  - [2,4]: max = 4 (its own endpoint)
  - [1,2]: max = max(2, 19, 4) = 19
  - [7,11]: max = 11 (no children)
  - [4,11]: max = max(11, 19, 11) = 19

  Step 3: Query for overlaps

  Query: Find all intervals overlapping point 5

  Starting at root [4,11]:

  1. Check current node [4,11]
    - Does [4,11] contain 5? Yes! (4 ≤ 5 ≤ 11) ✓
    - Add to results
  2. Check left subtree (if it could contain overlaps)
    - Left child exists and left.max ≥ 5?
    - Yes: [1,2].max = 19 ≥ 5 ✓
    - Recurse left to [1,2]
  3. At node [1,2]
    - Does [1,2] contain 5? No (1 ≤ 5 but 2 < 5)
    - Check left: [0,19].max = 19 ≥ 5 ✓
    - Check right: [2,4].max = 4 ≥ 5? No ✗ (prune!)
  4. At node [0,19]
    - Does [0,19] contain 5? Yes! (0 ≤ 5 ≤ 19) ✓
    - Add to results
    - No children
  5. Back to root, check right subtree
    - Right child [7,11]: Does 5 < 7 (start)? Yes
    - Could any interval starting at ≥7 overlap point 5? No ✗
    - Prune entire right subtree!

  Result: [[4,11], [0,19]]

  The Key Insight

  The max-endpoint annotation lets you prune entire subtrees:

  If node.start > query_point AND left.max < query_point:
      No intervals in this subtree can overlap query_point

  Implementation Structure

  class AugmentedIntervalNode {
      interval: Interval
      start: number          // interval[0] - used for BST ordering
      end: number           // interval[1]
      max: number           // max endpoint in subtree
      left: AugmentedIntervalNode | null
      right: AugmentedIntervalNode | null
  }

  Algorithm Comparison

  | Aspect        | Your Center-Based | Augmented BST            |
  |---------------|-------------------|--------------------------|
  | Query time    | O(log n + k)      | O(log n + k)             |
  | Build time    | O(n log n)        | O(n log n)               |
  | Insert/Delete | Hard (rebuild)    | O(log n) with balancing  |
  | Memory        | 2x (ml + mr)      | 1x + max values          |
  | Complexity    | Medium            | Medium (needs balancing) |
  | Best for      | Static sets       | Dynamic sets             |

  Advantages of Augmented BST

  1. Dynamic operations - Can insert/delete efficiently
  2. Less memory - Don't duplicate intervals in ml/mr lists
  3. Simpler queries - No need to maintain two sorted lists
  4. Industry standard - Used in most production implementations

  Disadvantages

  1. Needs self-balancing - AVL or Red-Black tree to maintain O(log n)
  2. More complex insert/delete - Must update max values up the tree
  3. Slightly more complex query logic - Need to check pruning conditions
