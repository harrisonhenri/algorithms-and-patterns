import { MaxHeap } from "../../structures/heap/max-heap";

/**
 * K Closest Points to Origin - LeetCode Problem 973
 *
 * Problem Statement:
 * Given an array of points where points[i] = [xi, yi] represents a point on
 * the X-Y plane and an integer k, return the k closest points to the origin (0, 0).
 *
 * The distance between two points on the X-Y plane is the Euclidean distance
 * (i.e., √((x1 - x2)² + (y1 - y2)²)).
 *
 * You may return the answer in any order. The answer is guaranteed to be
 * unique (except for the order that it is in).
 *
 * @example
 * Input: points = [[1,3],[-2,2]], k = 1
 * Output: [[-2,2]]
 * Explanation:
 * The distance between (1, 3) and the origin is sqrt(10) ≈ 3.16.
 * The distance between (-2, 2) and the origin is sqrt(8) ≈ 2.83.
 * Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
 *
 * @example
 * Input: points = [[3,3],[5,-1],[-2,4]], k = 2
 * Output: [[3,3],[-2,4]]
 *
 * @constraints
 * - 1 <= k <= points.length <= 10^4
 * - -10^4 <= xi, yi <= 10^4
 * - All points are unique (and unique in k)
 *
 * ## Approaches
 *
 * **Approach 1: Max-Heap (Filtering, Optimal Time-Space)**
 *
 * Keep a max-heap of size k containing the k closest points.
 * The root is the farthest of the k closest (the candidate for eviction).
 *
 * Algorithm:
 * 1. For each point:
 *    - Calculate squared distance (avoid sqrt for comparison)
 *    - If heap size < k: add point
 *    - Else if distance < root distance: remove root, add point
 * 2. Return all k points from heap
 *
 * Why max-heap? Because we want to keep small distances and discard large ones.
 * Root (max of k smallest) is the first to go if new point is closer.
 *
 * @time O(n log k) - process n points, each log k for heap operations
 * @space O(k) - heap stores exactly k points
 * **Trade-off:** Best practical solution. Space efficient, early filtering.
 *
 * **Approach 2: Binary Search on Distance (Space-Optimal)**
 *
 * Binary search on distance range to find the boundary where exactly k points
 * have distance ≤ boundary.
 *
 * Algorithm:
 * 1. Sort all points by squared distance
 * 2. Binary search on distance value [0, max_distance]:
 *    - For each mid distance, count points with distance ≤ mid
 *    - If count < k: search higher (need more points)
 *    - If count >= k: search lower (can find tighter boundary)
 * 3. Collect all points with distance ≤ boundary
 *
 * Why binary search? Monotonic property: more distance = more points within it.
 *
 * @time O(n + n log(max_distance)) = O(n log D) where D = max squared distance
 * @space O(n) - store sorted distances
 * **Trade-off:** Space optimal. Similar time to heap, but always does full sort first.
 *
 * **Approach 3: Sort by Distance (Simple Alternative)**
 *
 * Create array of [distance, point] pairs, sort, return first k.
 *
 * @time O(n log n) - full sort dominates
 * @space O(n) - store all distances
 * **Trade-off:** Simplest code, but worst time for small k.
 *
 * **Approach 4: QuickSelect on Distance (Alternative)**
 *
 * Use quickselect to find kth smallest distance in O(n) average time.
 * Then collect all points with distance ≤ kth distance.
 *
 * @time O(n) average, O(n²) worst - quickselect on distance array
 * @space O(1) if in-place, or O(n) for distance array
 * **Trade-off:** Fastest average time, harder to implement correctly.
 *
 * @date 27/01/2026
 */

/**
 * Represents a point and its squared distance from origin
 */
interface PointDistance {
  point: [number, number];
  distanceSquared: number;
}

/**
 * Helper function to calculate squared Euclidean distance from origin
 * We use squared distance to avoid sqrt (which is slower and doesn't change order)
 *
 * @param point - [x, y] coordinates
 * @returns Squared distance: x² + y²
 */
function getSquaredDistance(point: [number, number]): number {
  return point[0] * point[0] + point[1] * point[1];
}

/**
 * **Approach 1: Max-Heap (Optimal - Filtering Pattern)**
 *
 * Time: O(n log k), Space: O(k)
 *
 * Keep a max-heap of exactly k closest points.
 * Root is the farthest of k closest (candidate for eviction).
 * If new point is closer than root, replace it.
 *
 * This is a **filtering pattern**: we keep small distances, discard large ones.
 * Max-heap root tells us immediately if a new point is worth keeping.
 *
 * @param points - Array of [x, y] coordinates
 * @param k - Number of closest points to return
 * @returns k closest points to origin in any order
 */
function kClosestMaxHeap(
  points: [number, number][],
  k: number,
): [number, number][] {
  // Max-heap comparator: larger distanceSquared goes to root (easy to evict)
  const maxHeap = new MaxHeap<PointDistance>(
    (a, b) => a.distanceSquared - b.distanceSquared,
    k, // Optional: set capacity to k for memory efficiency
  );

  for (const point of points) {
    const distanceSquared = getSquaredDistance(point);
    const pointData: PointDistance = { point, distanceSquared };

    if (maxHeap.size() < k) {
      // Heap not full, always add
      maxHeap.add(pointData);
    } else {
      // Heap full, check if this point is closer than the farthest in heap
      const farthest = maxHeap.peek()!;
      if (distanceSquared < farthest.distanceSquared) {
        // New point is closer, evict the farthest
        maxHeap.poll();
        maxHeap.add(pointData);
      }
      // Else: new point is farther, skip it (don't add to heap)
    }
  }

  // Extract all k points from heap
  const result: [number, number][] = [];
  while (maxHeap.size() > 0) {
    const pd = maxHeap.poll();
    if (pd) {
      result.push(pd.point);
    }
  }

  return result;
}

// Example usage
if (require.main === module) {
  console.log("=== K Closest Points to Origin ===\n");

  // Example 1: Basic case
  console.log("Example 1: Basic Case");
  const points1: [number, number][] = [
    [1, 3],
    [-2, 2],
  ];
  const k1 = 1;
  console.log(`Points: ${JSON.stringify(points1)}`);
  console.log(`k = ${k1}`);
  console.log("Distances from origin:");
  points1.forEach((p) => {
    const dist = Math.sqrt(getSquaredDistance(p));
    console.log(
      `  ${JSON.stringify(p)}: √${getSquaredDistance(p)} ≈ ${dist.toFixed(2)}`,
    );
  });
  console.log("Max-Heap:", JSON.stringify(kClosestMaxHeap(points1, k1)));
  console.log("Expected: [[-2,2]] (distance √8 ≈ 2.83)");
  console.log();

  // Example 2: Multiple points
  console.log("Example 2: Multiple Points");
  const points2: [number, number][] = [
    [3, 3],
    [5, -1],
    [-2, 4],
  ];
  const k2 = 2;
  console.log(`Points: ${JSON.stringify(points2)}`);
  console.log(`k = ${k2}`);
  console.log("Distances from origin:");
  points2.forEach((p) => {
    const dist = Math.sqrt(getSquaredDistance(p));
    console.log(
      `  ${JSON.stringify(p)}: √${getSquaredDistance(p)} ≈ ${dist.toFixed(2)}`,
    );
  });
  const result2Heap = kClosestMaxHeap(points2, k2);
  console.log("Max-Heap:", JSON.stringify(result2Heap));
  console.log(
    "Expected: [[3,3],[-2,4]] (or [[-2,4],[3,3]] - any order acceptable)",
  );
  console.log();

  // Example 3: All points on same distance circle
  console.log("Example 3: Points on Same Distance Circle");
  const points3: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const k3 = 2;
  console.log(`Points: ${JSON.stringify(points3)}`);
  console.log(`k = ${k3}`);
  console.log("All points are at distance 1 from origin");
  const result3Heap = kClosestMaxHeap(points3, k3);
  console.log("Max-Heap:", JSON.stringify(result3Heap));
  console.log("Expected: Any 2 of the 4 points (all same distance)");
  console.log();

  // Example 4: Origin is closest
  console.log("Example 4: Including Origin");
  const points4: [number, number][] = [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ];
  const k4 = 2;
  console.log(`Points: ${JSON.stringify(points4)}`);
  console.log(`k = ${k4}`);
  console.log("Distances from origin:");
  points4.forEach((p) => {
    const dist = Math.sqrt(getSquaredDistance(p));
    console.log(
      `  ${JSON.stringify(p)}: √${getSquaredDistance(p)} ≈ ${dist.toFixed(2)}`,
    );
  });
  const result4Heap = kClosestMaxHeap(points4, k4);
  console.log("Max-Heap:", JSON.stringify(result4Heap));
  console.log("Expected: [[0,0],[1,1]] (closest 2)");
  console.log();

  // Example 5: Negative coordinates
  console.log("Example 5: Negative Coordinates");
  const points5: [number, number][] = [
    [-4, -3],
    [2, 3],
    [1, -1],
    [-1, 2],
  ];
  const k5 = 3;
  console.log(`Points: ${JSON.stringify(points5)}`);
  console.log(`k = ${k5}`);
  console.log("Distances from origin:");
  points5.forEach((p) => {
    const dist = Math.sqrt(getSquaredDistance(p));
    console.log(
      `  ${JSON.stringify(p)}: √${getSquaredDistance(p)} ≈ ${dist.toFixed(2)}`,
    );
  });
  const result5Heap = kClosestMaxHeap(points5, k5);
  console.log("Max-Heap:", JSON.stringify(result5Heap));
  console.log();

  // Performance analysis
  console.log("=== Performance Analysis ===");
  console.log("Approach 1 - Max-Heap (Filtering Pattern):");
  console.log(
    "  - Time: O(n log k) - process n points, each log k for heap ops",
  );
  console.log("  - Space: O(k) - keep exactly k closest points");
  console.log("  - Best for: filtering pattern, early rejection of far points");
  console.log(
    "  - Advantage: k << n makes huge difference (e.g., k=10, n=10000)",
  );
  console.log();
  console.log("Approach 2 - Binary Search on Distance (Space consideration):");
  console.log("  - Time: O(n log D) where D = max squared distance");
  console.log("  - Space: O(n) - must pre-compute all distances");
  console.log("  - Trade-off: Always needs full distance computation first");
  console.log("  - Advantage: No heap overhead, pure algorithmic approach");
  console.log();
  console.log("Approach 3 - Sort by Distance (Alternative):");
  console.log("  - Time: O(n log n) - full sort");
  console.log("  - Space: O(n) - store all distances");
  console.log("  - Trade-off: Simplest code but always full sort");
  console.log();
  console.log("Approach 4 - QuickSelect (Alternative):");
  console.log("  - Time: O(n) average - quickselect on distance array");
  console.log("  - Space: O(n) for distance array");
  console.log("  - Trade-off: Fastest average, but more complex to implement");
}
