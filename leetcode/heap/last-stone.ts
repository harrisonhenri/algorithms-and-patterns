import { MaxHeap } from "../../structures/heap/max-heap";

/**
 * Last Stone Weight - LeetCode Problem
 *
 * You are given an array of integers stones where stones[i] is the weight of the ith stone.
 *
 * We are playing a game with the stones. On each turn, we choose the heaviest two stones
 * and smash them together. Suppose the heaviest two stones have weights x and y with x <= y.
 * The result of this smash is:
 *
 * - If x == y, both stones are destroyed, and
 * - If x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x.
 *
 * At the end of the game, there is at most one stone left.
 *
 * **Return the weight of the last remaining stone. If there are no stones left, return 0.**
 *
 * @example
 * Input: stones = [2,7,4,1,8,1]
 * Output: 1
 *
 * Explanation:
 * - We combine 7 and 8 to get 1 so the array converts to [2,4,1,1,1] then,
 * - we combine 2 and 4 to get 2 so the array converts to [2,1,1,1] then,
 * - we combine 2 and 1 to get 1 so the array converts to [1,1,1] then,
 * - we combine 1 and 1 to get 0 so the array converts to [1] then that's the value of the last stone.
 *
 * @example
 * Input: stones = [1]
 * Output: 1
 *
 * @constraints
 * - 1 <= stones.length <= 30
 * - 1 <= stones[i] <= 100
 *
 * **Time Complexity:** O(n log n)
 * - Building the heap from array: O(n)
 * - Each poll/push operation: O(log n)
 * - Worst case: n-1 pairs to process
 *
 * **Space Complexity:** O(n) - For storing stones in the heap
 *
 * **Approach 1: Max-Heap (Optimal)**
 * 1. Use a max-heap to efficiently access the two heaviest stones
 * 2. While there are 2 or more stones in the heap:
 *    - Extract the two heaviest stones (first and second max)
 *    - If they're not equal, push the difference back to the heap
 * 3. Return the weight of the last stone or 0 if no stones remain
 * - **Time:** O(n log n) - Heapify O(n) + n-1 operations O(log n) each
 * - **Space:** O(n) - Heap storage
 *
 * **Approach 2: Unsorted Array**
 * 1. Repeatedly find the two maximum elements in the array
 * 2. Remove them and insert the difference (if any)
 * 3. Continue until one or zero stones remain
 * - **Time:** O(n²) - Finding max takes O(n), done n times
 * - **Space:** O(n) - Array storage
 * - **Drawback:** Inefficient for large datasets due to repeated max searches
 *
 * **Approach 3: Sorted Array**
 * 1. Sort the array in ascending order
 * 2. Use two pointers from the end to access the heaviest stones
 * 3. Remove elements and re-insert differences, re-sorting as needed
 * - **Time:** O(n² log n) - Sorting after each insertion is O(log n), done up to n times with O(n) removals
 * - **Space:** O(n) - Array storage
 * - **Drawback:** Repeated sorting is expensive
 *
 * **Approach 4: Bucket Sort**
 * 1. Create a bucket array of size W+1, where W is the maximum stone weight
 * 2. Bucket "sort" stones in O(N) by incrementing bucket index for each stone weight
 * 3. Process buckets from highest weight downward, simulating the smashing process
 * 4. Track stone differences and update buckets accordingly
 * - **Time:** O(N + W) - Bucketing is O(N), processing buckets is O(W)
 *   - Putting N stones into buckets: O(N), each insertion is O(1)
 *   - Main loop iterates through W bucket indices: O(W), each operation is O(1)
 * - **Space:** O(W) - Bucket array of size W+1
 * - **Classification:** Pseudo-polynomial (time depends on numeric value W, not just input size N)
 * - **Trade-off:** Only faster than O(N log N) approaches for specific inputs with small W
 *   - Better when W << N log N
 *   - Worse when W is large relative to N log N
 * - **Note:** Treating both N and W as unbounded (not constants) gives correct complexity analysis
 *
 * @date 25/01/2026
 */
function lastStoneWeight(stones: number[]): number {
  // Build a max-heap with all stones
  const heap = MaxHeap.from(stones);

  // Keep smashing stones while there are at least 2
  while (heap.size() > 1) {
    // Extract the heaviest stone
    const first = heap.poll();
    // Extract the second heaviest stone
    const second = heap.poll();

    // If they're not equal, the difference goes back to the heap
    if (first !== second) {
      heap.add(first - second);
    }
    // If they're equal, both are destroyed (nothing added back)
  }

  // Return the last remaining stone, or 0 if no stones left
  return heap.size() === 1 ? heap.peek() : 0;
}

// Example usage
if (require.main === module) {
  // Example 1
  console.log("=== Example 1 ===");
  const stones1 = [2, 7, 4, 1, 8, 1];
  console.log("Input:", stones1);
  console.log("Output:", lastStoneWeight(stones1)); // 1
  console.log(
    "Explanation: Smash 8 and 7 -> 1, smash 4 and 2 -> 2, smash 2 and 1 -> 1",
  );

  // Example 2
  console.log("\n=== Example 2 ===");
  const stones2 = [1];
  console.log("Input:", stones2);
  console.log("Output:", lastStoneWeight(stones2)); // 1

  // Example 3
  console.log("\n=== Example 3 ===");
  const stones3 = [1, 3, 5, 4, 2];
  console.log("Input:", stones3);
  console.log("Output:", lastStoneWeight(stones3)); // 1
  console.log(
    "Explanation: Smash 5 and 4 -> 1, smash 3 and 2 -> 1, smash 1 and 1 -> destroyed",
  );

  // Example 4 (all equal)
  console.log("\n=== Example 4 ===");
  const stones4 = [2, 2, 2, 2];
  console.log("Input:", stones4);
  console.log("Output:", lastStoneWeight(stones4)); // 0
  console.log("Explanation: All pairs cancel out");

  // Example 5 (larger dataset)
  console.log("\n=== Example 5 ===");
  const stones5 = [100, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  console.log("Input:", stones5);
  console.log("Output:", lastStoneWeight(stones5)); // 88
}
