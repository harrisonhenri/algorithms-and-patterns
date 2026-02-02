import { Queue } from "../../../structures/queue/index";
import { Edge } from "../../../common/types/edge";

/**
 * Kahn's Algorithm - Topological Sort using BFS (In-Degree Method)
 *
 * **Problem:**
 * Topologically sort a Directed Acyclic Graph (DAG) by processing vertices
 * in order of their dependencies. Useful for task scheduling, compilation, etc.
 *
 * **Algorithm:**
 * Kahn's algorithm uses BFS with in-degree counting to find topological order:
 * 1. Calculate in-degree for all vertices
 * 2. Enqueue all vertices with in-degree 0 (no dependencies)
 * 3. For each dequeued vertex:
 *    - Add to topological order
 *    - Decrease in-degree of adjacent vertices
 *    - Enqueue vertices that reach in-degree 0
 * 4. If all vertices processed, return order; else cycle detected
 *
 * **When to use Kahn's vs DFS-based Topological Sort:**
 * - **Kahn's (BFS):** Better for explicit dependency tracking; easier cycle detection
 * - **DFS:** Alternative approach; both solve topological sort equally well
 * - Key advantages of Kahn's:
 *   - More intuitive: Process vertices in order of their dependencies
 *   - Easier cycle detection: If queue empties before all vertices processed
 *   - Better for explicit dependency tracking in real-world applications
 *
 * **Time Complexity:** O(V + E)
 * - Calculate in-degrees: O(V + E)
 * - BFS traversal: O(V + E)
 *
 * **Space Complexity:** O(V + E)
 * - In-degree array: O(V) for tracking in-degree of each vertex
 * - Queue: O(V) maximum, storing vertices with in-degree 0
 * - Adjacency list: O(V + E) total space for the graph representation
 *
 * **When to use:**
 * - Course prerequisites validation
 * - Compiler task scheduling
 * - Build system dependency resolution
 * - Job scheduling with dependencies
 * - Detecting cycles in directed graphs
 *
 * @date 19/01/2026
 */

/**
 * Performs topological sort using Kahn's algorithm (BFS with in-degree).
 *
 * **Algorithm Steps:**
 * 1. Build adjacency list and calculate in-degree for each vertex
 * 2. Enqueue all vertices with in-degree 0
 * 3. Process vertices level by level (BFS)
 * 4. Detect cycle if any vertex remains unprocessed
 *
 * @param {number} numVertices - Number of vertices (0 to numVertices-1)
 * @param {Edge[]} edges - Array of edges {source, target}
 * @returns {number[]} Topological order of vertices, or empty array if cycle detected
 * @time O(V + E) - Linear time complexity
 *
 * @example
 * const edges = [{source: 0, target: 1}, {source: 0, target: 2}, {source: 1, target: 2}];
 * const order = kahnTopologicalSort(3, edges);
 * console.log(order); // [0, 1, 2]
 */
export function kahnTopologicalSort(
  numVertices: number,
  edges: Edge[]
): number[] {
  // Build adjacency list and calculate in-degrees
  const adjacencyList: number[][] = Array.from(
    { length: numVertices },
    () => []
  );
  const inDegree = Array(numVertices).fill(0);

  for (const edge of edges) {
    adjacencyList[edge.source].push(edge.target);
    inDegree[edge.target]++;
  }

  // Enqueue all vertices with in-degree 0
  const queue = new Queue<number>();
  for (let i = 0; i < numVertices; i++) {
    if (inDegree[i] === 0) {
      queue.enqueue(i);
    }
  }

  // Process vertices in topological order
  const result: number[] = [];
  while (!queue.isEmpty()) {
    const vertex = queue.dequeue()!;
    result.push(vertex);

    // Reduce in-degree for adjacent vertices
    for (const adjacent of adjacencyList[vertex]) {
      inDegree[adjacent]--;
      if (inDegree[adjacent] === 0) {
        queue.enqueue(adjacent);
      }
    }
  }

  // Check for cycle: if not all vertices are processed, there's a cycle
  if (result.length !== numVertices) {
    return []; // Cycle detected
  }

  return result;
}

/**
 * Detects if a directed graph contains a cycle using Kahn's algorithm.
 *
 * **Algorithm:**
 * Run topological sort and check if all vertices are processed.
 * If any vertex remains unprocessed, a cycle exists.
 *
 * @param {number} numVertices - Number of vertices
 * @param {Edge[]} edges - Array of edges
 * @returns {boolean} True if cycle detected, false if DAG
 * @time O(V + E)
 *
 * @example
 * const edges = [{source: 0, target: 1}, {source: 1, target: 0}]; // Cycle!
 * const hasCycle = hasCycleKahn(2, edges);
 * console.log(hasCycle); // true
 */
export function hasCycleKahn(numVertices: number, edges: Edge[]): boolean {
  const result = kahnTopologicalSort(numVertices, edges);
  return result.length !== numVertices; // Incomplete sort means cycle
}

/**
 * Resolves build order with dependencies using topological sort.
 *
 * **Problem:**
 * Given build tasks and their dependencies, find a valid build order.
 *
 * @param {string[]} tasks - Task names
 * @param {[string, string][]} dependencies - Array of [task, dependsOn] pairs
 * @returns {string[]} Valid build order, or empty array if circular dependency
 * @time O(t + d) where t = tasks, d = dependencies
 *
 * @example
 * const tasks = ['a', 'b', 'c', 'd'];
 * const deps = [['a', 'b'], ['c', 'a'], ['d', 'c']];
 * const order = buildOrder(tasks, deps);
 * console.log(order); // ['b', 'a', 'c', 'd']
 */
export function buildOrder(
  tasks: string[],
  dependencies: [string, string][]
): string[] {
  // Create task index mapping
  const taskIndex: { [task: string]: number } = {};
  tasks.forEach((task, idx) => (taskIndex[task] = idx));

  // Convert to edges
  const edges = dependencies.map(([task, dependsOn]) => ({
    source: taskIndex[dependsOn],
    target: taskIndex[task],
  }));

  // Get topological order
  const result = kahnTopologicalSort(tasks.length, edges);
  if (result.length === 0) return []; // Cycle detected

  // Map back to task names
  return result.map((idx) => tasks[idx]);
}

// ============================================================================
// EXAMPLES AND TEST CASES
// ============================================================================

if (require.main === module) {
  console.log("=== Kahn's Algorithm (Topological Sort) Examples ===\n");

  // Example 1: Basic topological sort
  console.log("Example 1: Simple DAG");
  const edges1 = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
  ];
  const result1 = kahnTopologicalSort(4, edges1);
  console.log("Edges: 0→1, 0→2, 1→2, 2→3");
  console.log("Topological Order:", result1); // [0, 1, 2, 3]
  console.log("Explanation: 0 has no dependencies, then 1, then 2, then 3\n");

  // Example 2: Cycle detection
  console.log("Example 2: Graph with cycle");
  const edges2 = [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 0 }, // Creates cycle
  ];
  const result2 = kahnTopologicalSort(3, edges2);
  console.log("Edges: 0→1, 1→2, 2→0 (cycle)");
  console.log("Topological Order:", result2); // []
  console.log("Explanation: Cycle detected, impossible to sort\n");

  // Example 3: Multiple independent chains
  console.log("Example 3: Multiple independent chains");
  const edges3 = [
    { source: 0, target: 1 },
    { source: 2, target: 3 },
  ];
  const result3 = kahnTopologicalSort(4, edges3);
  console.log("Edges: 0→1 (chain 1), 2→3 (chain 2)");
  console.log("Topological Order:", result3); // [0, 2, 1, 3] or [2, 0, 3, 1]
  console.log(
    "Explanation: Multiple valid orders for independent components\n"
  );

  // Example 4: Cycle detection function
  console.log("Example 4: Cycle detection with hasCycleKahn()");
  const cycleTest1 = hasCycleKahn(3, [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
  ]);
  const cycleTest2 = hasCycleKahn(3, [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 0 },
  ]);
  console.log("DAG (0→1→2) has cycle:", cycleTest1); // false
  console.log("Cyclic (0→1→2→0) has cycle:", cycleTest2); // true
  console.log();

  // Example 5: Build order
  console.log("Example 5: Build task ordering");
  const tasks = ["a", "b", "c", "d"];
  const buildDeps: [string, string][] = [
    ["a", "b"], // a depends on b
    ["c", "a"], // c depends on a
    ["d", "c"], // d depends on c
  ];
  const buildOrder1 = buildOrder(tasks, buildDeps);
  console.log("Tasks:", tasks);
  console.log("Dependencies: [a→b], [c→a], [d→c]");
  console.log("Build order:", buildOrder1); // [b, a, c, d]
  console.log();

  // Example 6: Build order with cycle
  console.log("Example 6: Build order with circular dependency");
  const tasks2 = ["a", "b", "c"];
  const cyclicDeps: [string, string][] = [
    ["a", "b"],
    ["b", "c"],
    ["c", "a"], // Creates cycle
  ];
  const buildOrder2 = buildOrder(tasks2, cyclicDeps);
  console.log("Tasks:", tasks2);
  console.log("Dependencies: [a→b], [b→c], [c→a] (circular)");
  console.log("Build order:", buildOrder2); // []
  console.log("Explanation: Circular dependency detected\n");

  // Example 7: Complex DAG
  console.log("Example 7: Complex DAG with multiple starting points");
  const edges7 = [
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 1, target: 3 },
    { source: 2, target: 4 },
    { source: 3, target: 4 },
  ];
  const result7 = kahnTopologicalSort(5, edges7);
  console.log("Edges: 0→2, 0→3, 1→3, 2→4, 3→4");
  console.log("Topological Order:", result7); // [0, 1, 2, 3, 4]
  console.log();

  // Example 10: All independent vertices
  console.log("Example 10: Completely disconnected graph");
  const result10 = kahnTopologicalSort(4, []);
  console.log("Edges: (none)");
  console.log("Topological Order:", result10); // [0, 1, 2, 3] (any order valid)
  console.log(
    "Explanation: All vertices have in-degree 0, processed in order\n"
  );
}
