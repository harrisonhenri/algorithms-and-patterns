/**
 * Course Schedule II (LeetCode 210)
 *
 * **Problem:**
 * There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
 * You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you
 * must take course bi first if you want to take course ai.
 *
 * Return the ordering of courses you should take to finish all courses.
 * If there are many valid answers, return any of them.
 * If it is impossible to finish all courses (circular dependency), return an empty array.
 *
 * **Algorithm:**
 * This is a topological sorting problem. We use Kahn's algorithm (BFS with in-degree):
 * 1. Build a directed graph where prerequisite → dependent course
 * 2. Calculate in-degree (number of prerequisites) for each course
 * 3. Use BFS to process courses in dependency order
 * 4. If all courses can be processed, return the order; else return empty array
 *
 * **Time Complexity:** O(n + p) where n = numCourses, p = prerequisites.length
 * **Space Complexity:** O(n + p) for adjacency list and in-degree array
 *
 * **Similar Problems in Project:**
 * - algorithms/graph/kahn/index.ts - Kahn's algorithm with courseOrder() function
 * - leetcode/graph/network-delay-time.ts - Dijkstra's shortest path variant
 * - algorithms/graph/dijkstra/index.ts - Shortest path algorithms
 *
 * @date 19/01/2026
 */

import { kahnTopologicalSort } from "../../../algorithms/graph/kahn";

/**
 * Finds valid course order respecting prerequisites.
 *
 * **Algorithm Steps:**
 * 1. Convert prerequisites to dependency graph (bi → ai)
 * 2. Run topological sort using Kahn's algorithm
 * 3. Return courses in order or empty array if cycle detected
 *
 * @param {number} numCourses - Number of courses (0 to numCourses-1)
 * @param {number[][]} prerequisites - Array of [course, prerequisite] pairs
 *   prerequisites[i] = [ai, bi] means take bi before ai
 * @returns {number[]} Valid course order, or empty array if impossible
 * @time O(n + p) - Linear with courses and prerequisites
 *
 * @example
 * const result = courseSchedule(4, [[1,0],[2,0],[3,1],[3,2]]);
 * console.log(result); // [0, 1, 2, 3] or [0, 2, 1, 3]
 * // Take course 0 first, then 1 and 2, then 3
 *
 * @example
 * const result = courseSchedule(2, [[1,0]]);
 * console.log(result); // [0, 1]
 * // Take course 0, then course 1
 *
 * @example
 * const result = courseSchedule(2, [[1,0],[0,1]]);
 * console.log(result); // []
 * // Circular dependency: impossible
 */
export function courseSchedule(
  numCourses: number,
  prerequisites: number[][]
): number[] {
  const edges = prerequisites.map(([course, prerequisite]) => ({
    source: prerequisite,
    target: course,
  }));
  return kahnTopologicalSort(numCourses, edges);
}

// ============================================================================
// EXAMPLES AND TEST CASES
// ============================================================================

if (require.main === module) {
  console.log("=== Course Schedule Examples ===\n");

  // Example 1: Simple linear dependency
  console.log("Example 1: Simple linear dependency");
  const result1 = courseSchedule(2, [[1, 0]]);
  console.log("numCourses = 2, prerequisites = [[1,0]]");
  console.log("Course order:", result1); // [0, 1]
  console.log("Explanation: To take course 1, finish course 0 first\n");

  // Example 2: Multiple prerequisites for one course
  console.log("Example 2: Multiple prerequisites");
  const result2 = courseSchedule(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]);
  console.log("numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]");
  console.log("Course order:", result2); // [0, 1, 2, 3] or [0, 2, 1, 3]
  console.log(
    "Explanation: 0 has no prereqs, 1 and 2 depend on 0, 3 depends on 1 and 2\n"
  );

  // Example 3: Circular dependency
  console.log("Example 3: Circular dependency (impossible)");
  const result3 = courseSchedule(2, [
    [1, 0],
    [0, 1],
  ]);
  console.log("numCourses = 2, prerequisites = [[1,0],[0,1]]");
  console.log("Course order:", result3); // []
  console.log(
    "Explanation: Course 1 requires 0, and 0 requires 1 - circular!\n"
  );

  // Example 4: No prerequisites
  console.log("Example 4: No prerequisites");
  const result4 = courseSchedule(3, []);
  console.log("numCourses = 3, prerequisites = []");
  console.log("Course order:", result4); // [0, 1, 2]
  console.log("Explanation: No dependencies, any order is valid\n");

  // Example 5: Complex DAG
  console.log("Example 5: Complex DAG");
  const result5 = courseSchedule(6, [
    [1, 0],
    [2, 0],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 4],
  ]);
  console.log("numCourses = 6");
  console.log("Prerequisites: 1←0, 2←0, 2←1, 3←2, 4←3, 5←4");
  console.log("Course order:", result5); // [0, 1, 2, 3, 4, 5]
  console.log("Explanation: Linear chain of dependencies\n");

  // Example 6: Multiple independent chains
  console.log("Example 6: Multiple independent chains");
  const result6 = courseSchedule(6, [
    [1, 0],
    [2, 1],
    [4, 3],
    [5, 4],
  ]);
  console.log("numCourses = 6");
  console.log("Prerequisites: 1←0, 2←1, 4←3, 5←4");
  console.log("Course order:", result6); // [0, 3, 1, 4, 2, 5]
  console.log("Explanation: Two independent chains: 0→1→2 and 3→4→5\n");

  // Example 7: Single course
  console.log("Example 7: Single course");
  const result7 = courseSchedule(1, []);
  console.log("numCourses = 1, prerequisites = []");
  console.log("Course order:", result7); // [0]
  console.log("Explanation: Only one course, no dependencies\n");

  // Example 8: Large cycle
  console.log("Example 8: Large cycle (5-course circle)");
  const result8 = courseSchedule(5, [
    [1, 0],
    [2, 1],
    [3, 2],
    [4, 3],
    [0, 4], // Completes the cycle
  ]);
  console.log("numCourses = 5");
  console.log("Prerequisites: 0←1←2←3←4←0 (cycle)");
  console.log("Course order:", result8); // []
  console.log("Explanation: All courses in circular dependency\n");

  // Example 9: Diamond dependency
  console.log("Example 9: Diamond dependency pattern");
  const result9 = courseSchedule(4, [
    [2, 0],
    [2, 1],
    [3, 2],
  ]);
  console.log("numCourses = 4");
  console.log("Prerequisites: 2←0, 2←1, 3←2");
  console.log("Course order:", result9); // [0, 1, 2, 3] or [1, 0, 2, 3]
  console.log("Explanation: Both 0 and 1 lead to 2, then 2 leads to 3\n");
}
