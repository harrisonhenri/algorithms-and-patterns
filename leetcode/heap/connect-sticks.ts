import { MinHeap } from "../../structures/heap/min-heap";

/**
 * Minimum Cost to Connect Sticks - LeetCode Problem
 *
 * You have some number of sticks with positive integer lengths. These lengths are given as
 * an array sticks, where sticks[i] is the length of the ith stick.
 *
 * You can connect any two sticks of lengths x and y into one stick by paying a cost of x + y.
 * You must connect all the sticks until there is only one stick remaining.
 *
 * **Return the minimum cost of connecting all the given sticks into one stick.**
 *
 * @example
 * Input: sticks = [2,4,3]
 * Output: 14
 *
 * Explanation:
 * - Connect sticks 2 and 3 → cost 5, remaining [5, 4]
 * - Connect sticks 5 and 4 → cost 9, total cost = 5 + 9 = 14
 *
 * @example
 * Input: sticks = [1,8,3,5]
 * Output: 30
 *
 * Explanation:
 * - Connect sticks 1 and 3 → cost 4, remaining [4, 8, 5]
 * - Connect sticks 4 and 5 → cost 9, remaining [9, 8], total = 13
 * - Connect sticks 9 and 8 → cost 17, total = 13 + 17 = 30
 *
 * @constraints
 * - n == sticks.length
 * - 1 <= n <= 10^4
 * - 1 <= sticks[i] <= 10^4
 */

/**
 * **Approach 1: Min-Heap (Optimal - Huffman Coding)**
 *
 * Always connect the two shortest sticks to minimize cost. This greedy approach is optimal
 * because each connection cost contributes to all future connections.
 *
 * Algorithm:
 * 1. Put all sticks in a min-heap
 * 2. While more than one stick remains:
 *    - Extract the two shortest sticks (x, y)
 *    - Combine them with cost x + y
 *    - Add the combined stick back to the heap
 * 3. Sum all costs
 *
 * **Why it works (Huffman Coding):**
 * - Combining smallest sticks first minimizes their "contribution depth"
 * - Shorter sticks get combined early and don't accumulate costs from many operations
 * - Longer sticks are combined later, minimizing their overall multiplication factor
 *
 * **Example trace for [2,4,3]:**
 * - heap=[2,3,4], cost=0
 * - pop 2,3 → combine=5, cost=5, heap=[4,5]
 * - pop 4,5 → combine=9, cost=5+9=14, heap=[9]
 * - Return 14
 *
 * @time O(N log N) - Heapify O(N) + (N-1) extractions/insertions each O(log N)
 * @space O(N) - Heap storage
 */
function connectSticks(sticks: number[]): number {
  // Build min-heap with all stick lengths
  const heap = MinHeap.from(sticks);

  let totalCost = 0;

  // Connect sticks until only one remains
  while (heap.size() > 1) {
    // Extract two shortest sticks
    const stick1 = heap.poll();
    const stick2 = heap.poll();

    // Cost to connect these two sticks
    const combinedLength = stick1 + stick2;
    totalCost += combinedLength;

    // Add the combined stick back to heap
    heap.add(combinedLength);
  }

  return totalCost;
}

/**
 * **Approach 2: Brute Force (For comparison)**
 *
 * Uses array operations to find minimums repeatedly.
 * Demonstrates why heap is optimal for this problem.
 *
 * @time O(N²) - Inefficient for large N
 * @space O(N)
 */
function connectSticksArray(sticks: number[]): number {
  const remaining = [...sticks];
  let totalCost = 0;

  while (remaining.length > 1) {
    // Find and remove the minimum
    const min1Index = remaining.indexOf(Math.min(...remaining));
    const min1 = remaining.splice(min1Index, 1)[0];

    // Find and remove the second minimum
    const min2Index = remaining.indexOf(Math.min(...remaining));
    const min2 = remaining.splice(min2Index, 1)[0];

    // Combine and add cost
    const combined = min1 + min2;
    totalCost += combined;
    remaining.push(combined);
  }

  return totalCost;
}

// Example usage
if (require.main === module) {
  // Example 1
  console.log("=== Example 1: Min-Heap Approach ===");
  const sticks1 = [2, 4, 3];
  console.log("Input:", sticks1);
  console.log("Output:", connectSticks([...sticks1])); // 14
  console.log("Explanation: (2+3) + (5+4) = 5 + 9 = 14");

  // Example 2
  console.log("\n=== Example 2: Multiple Sticks ===");
  const sticks2 = [1, 8, 3, 5];
  console.log("Input:", sticks2);
  console.log("Output:", connectSticks([...sticks2])); // 30
  console.log("Explanation: (1+3) + (4+5) + (9+8) = 4 + 9 + 17 = 30");

  // Example 3: Single stick
  console.log("\n=== Example 3: Single Stick ===");
  const sticks3 = [5];
  console.log("Input:", sticks3);
  console.log("Output:", connectSticks([...sticks3])); // 0
  console.log("Explanation: Only one stick, no connections needed");

  // Example 4: Two sticks
  console.log("\n=== Example 4: Two Sticks ===");
  const sticks4 = [3, 7];
  console.log("Input:", sticks4);
  console.log("Output:", connectSticks([...sticks4])); // 10
  console.log("Explanation: Only one connection: 3 + 7 = 10");

  // Example 5: Equal length sticks
  console.log("\n=== Example 5: Equal Length Sticks ===");
  const sticks5 = [2, 2, 2, 2];
  console.log("Input:", sticks5);
  console.log("Output:", connectSticks([...sticks5])); // 20
  console.log("Explanation: (2+2) + (4+2) + (6+2) = 4 + 6 + 8 = 18");

  // Comparison with brute force
  console.log("\n=== Approach Comparison ===");
  const testSticks = [2, 4, 3];
  console.log("Input:", testSticks);
  console.log("Min-Heap (optimal):", connectSticks([...testSticks]));
  console.log(
    "Brute Force (for comparison):",
    connectSticksArray([...testSticks]),
  );
}
