import { Queue } from "../../../structures/queue";
import { buildAdjacencyList } from "../../../algorithms/utils/build-adjacency-list";

/**
 * Minimum Number of Semesters to Complete All Courses (LeetCode 1136)
 *
 * Problem: Given n courses and prerequisite relations, find the minimum number
 * of semesters needed to complete all courses. In each semester, you can take
 * any number of courses as long as you've completed all their prerequisites
 * in previous semesters.
 *
 * Key Insight: This is finding the **maximum depth/longest path** in a DAG.
 * Each course has a "level" based on its prerequisite chain:
 * - Level 1: Courses with no prerequisites
 * - Level 2: Courses that depend only on level 1 courses
 * - Level k: Courses where max prerequisite depth is k-1
 *
 * Approach: Topological Sort with Level Tracking (Kahn's Algorithm)
 * 1. Build adjacency list and calculate in-degrees
 * 2. Initialize all courses with no prerequisites at level 1
 * 3. Process courses level by level using BFS
 * 4. For each course processed, update dependents' levels
 * 5. The maximum level reached is the answer
 *
 * **Time Complexity:** O(n + e) where n = courses, e = relations
 * **Space Complexity:** O(n + e) for adjacency list and level tracking
 *
 * **Example:**
 * n = 3, relations = [[1,3],[2,3]]
 * - Course 1: level 1 (no prereq)
 * - Course 2: level 1 (no prereq)
 * - Course 3: level 2 (depends on 1 and 2, both at level 1)
 * - Answer: 2
 *
 * @date 20/01/2026
 */

/**
 * Finds minimum number of semesters using topological sort with levels
 *
 * @param n - Number of courses (1 to n)
 * @param relations - Array of [prevCourse, nextCourse] prerequisites
 * @returns Minimum semesters needed, or -1 if impossible
 */
function minimumSemestersTopological(n: number, relations: number[][]): number {
  // Build adjacency list using project utility
  // Relations are [prevCourse, nextCourse] in 1-indexed format
  const graph = buildAdjacencyList(n, relations, true);

  // Calculate in-degrees for each course
  const inDegree = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (const next of graph.get(i) || []) {
      inDegree[next]++;
    }
  }

  // Check for cycles: if any course still has dependencies, it's impossible
  const queue = new Queue<number>();

  // Start with courses that have no prerequisites
  for (let i = 1; i <= n; i++) {
    if (inDegree[i] === 0) {
      queue.enqueue(i);
    }
  }

  const level = new Array(n + 1).fill(0);
  let maxLevel = 0;
  let processedCount = 0;

  // BFS level by level
  while (!queue.isEmpty()) {
    const course = queue.dequeue()!;
    level[course] = (level[course] || 0) + 1;
    maxLevel = Math.max(maxLevel, level[course]);
    processedCount++;

    // Process all courses that depend on current course
    for (const dependent of graph.get(course)!) {
      // Set the dependent's level to max of its current level and current course's level + 1
      level[dependent] = Math.max(level[dependent], level[course] + 1);

      inDegree[dependent]--;

      // If all prerequisites satisfied, add to queue
      if (inDegree[dependent] === 0) {
        queue.enqueue(dependent);
      }
    }
  }

  // If not all courses processed, there's a cycle
  if (processedCount !== n) {
    return -1;
  }

  return maxLevel;
}

// Test cases
if (require.main === module) {
  console.log("=== Minimum Number of Semesters Examples ===\n");

  // Example 1: Simple chain
  console.log("Example 1: Simple prerequisite chain");
  const n1 = 3;
  const relations1 = [
    [1, 3],
    [2, 3],
  ];
  const result1 = minimumSemestersTopological(n1, relations1);
  console.log(`n = ${n1}, relations = ${JSON.stringify(relations1)}`);
  console.log("Dependency graph:");
  console.log("  Course 1 → Course 3");
  console.log("  Course 2 → Course 3");
  console.log("Output:", result1);
  console.log("Expected: 2\n");

  // Example 2: Long chain
  console.log("Example 2: Long prerequisite chain");
  const n2 = 4;
  const relations2 = [
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  const result2 = minimumSemestersTopological(n2, relations2);
  console.log(`n = ${n2}, relations = ${JSON.stringify(relations2)}`);
  console.log("Dependency graph: 1 → 2 → 3 → 4");
  console.log("Output:", result2);
  console.log("Expected: 4\n");

  // Example 3: No prerequisites
  console.log("Example 3: No prerequisites");
  const n3 = 3;
  const relations3: number[][] = [];
  const result3 = minimumSemestersTopological(n3, relations3);
  console.log(`n = ${n3}, relations = ${JSON.stringify(relations3)}`);
  console.log("Output:", result3);
  console.log("Expected: 1\n");

  // Example 4: Multiple paths merging
  console.log("Example 4: Multiple paths merging");
  const n4 = 5;
  const relations4 = [
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
  ];
  const result4 = minimumSemestersTopological(n4, relations4);
  console.log(`n = ${n4}, relations = ${JSON.stringify(relations4)}`);
  console.log("Dependency graph:");
  console.log("  Semester 1: 1, 2");
  console.log("  Semester 2: 3");
  console.log("  Semester 3: 4, 5");
  console.log("Output:", result4);
  console.log("Expected: 3\n");

  // Example 5: Cycle (impossible)
  console.log("Example 5: Cycle detected");
  const n5 = 3;
  const relations5 = [
    [1, 2],
    [2, 3],
    [3, 1],
  ];
  const result5 = minimumSemestersTopological(n5, relations5);
  console.log(`n = ${n5}, relations = ${JSON.stringify(relations5)}`);
  console.log("Output:", result5);
  console.log("Expected: -1\n");

  // Example 6: Complex parallel paths
  console.log("Example 6: Complex parallel paths");
  const n6 = 6;
  const relations6 = [
    [1, 4],
    [1, 5],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 6],
  ];
  const result6 = minimumSemestersTopological(n6, relations6);
  console.log(`n = ${n6}, relations = ${JSON.stringify(relations6)}`);
  console.log("Dependency graph:");
  console.log("  Semester 1: 1, 2, 3");
  console.log("  Semester 2: 4, 5");
  console.log("  Semester 3: 6");
  console.log("Output:", result6);
  console.log("Expected: 3\n");
}
