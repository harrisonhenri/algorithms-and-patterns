/**
 * Determines whether there exists a valid path between two vertices
 * in a bi-directional (undirected) graph.
 *
 * The graph contains `n` vertices labeled from `0` to `n - 1`.
 * Edges are given as pairs `[u, v]`, indicating an undirected edge
 * between vertices `u` and `v`. There are no self-loops and at most
 * one edge between any pair of vertices.
 *
 * **Problem:** Given `n`, `edges`, `source`, and `destination`, determine
 * if there is a valid path from `source` to `destination`.
 *
 * **Important:** It must track visited nodes whenever the graph can contain cycles.
 * This prevents infinite loops and ensures correct traversal in graphs with cycles.
 *
 * **Example:**
 * ```ts
 * const n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2
 * validPath(n, edges, source, destination) // true
 * ```
 *
 * **Approaches:**
 * 1. **DFS with Stack** - Iterative traversal using explicit stack
 * 2. **Recursive DFS** - Implicit recursion stack (cleaner code)
 * 3. **Disjoint Set (Union-Find)** - Track connected components
 *
 * @date 14/01/2026 - 00:00:00
 */

import { DisjointSet } from "../../../structures/disjoint-set";
import { Stack } from "../../../structures/stack";
import { Queue } from "../../../structures/queue";
import { buildAdjacencyList } from "../../../algorithms/utils/build-adjacency-list";

/**
 * **Approach 1: DFS with Stack (Iterative)**
 *
 * **Time Complexity:** O(V + E) - Visit each vertex and edge once
 * **Space Complexity:** O(V) - Stack + adjacency list + visited set
 *
 * **Algorithm:**
 * 1. Build adjacency list from edges
 * 2. Use stack to explore graph from source
 * 3. Mark vertices as visited
 * 4. Return true if destination is visited
 */
function validPathDFS(
  n: number,
  edges: number[][],
  source: number,
  destination: number
): boolean {
  if (source === destination) return true;

  // Build adjacency list
  const adjacencyList = buildAdjacencyList(n, edges);

  // DFS with stack
  const stack = new Stack<number>();
  stack.push(source);

  const visited: Set<number> = new Set([source]);

  while (!stack.isEmpty()) {
    const node = stack.pop();

    if (node === undefined || node === null) continue;

    if (node === destination) {
      return true;
    }

    for (const neighbor of adjacencyList.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }

  return false;
}

/**
 * **Approach 3: Recursive DFS (Cleaner & More Intuitive)**
 *
 * **Time Complexity:** O(V + E) - Visit each vertex and edge once
 * **Space Complexity:** O(V) - Recursion stack + adjacency list + visited array
 *
 * **Algorithm:**
 * 1. Build adjacency list from edges
 * 2. Use recursion to explore graph depth-first
 * 3. Mark vertices as visited in a boolean array
 * 4. Early return when destination is found
 *
 * **Advantages over iterative:**
 * - More readable and concise
 * - Implicit stack management via call stack
 * - Early termination on finding destination
 */
function validPathRecursiveDFS(
  n: number,
  edges: number[][],
  source: number,
  destination: number
): boolean {
  // Build adjacency list
  const adjacencyList = buildAdjacencyList(n, edges);

  // Visited tracking array (more efficient than Set for dense vertex labels)
  const visited = new Array<boolean>(n).fill(false);

  return dfsHelper(adjacencyList, visited, source, destination);
}

/**
 * Helper function for recursive DFS
 * Returns true if path from currNode to destination exists
 */
function dfsHelper(
  adjacencyList: Map<number, number[]>,
  visited: boolean[],
  currNode: number,
  destination: number
): boolean {
  // Base case: reached destination
  if (currNode === destination) {
    return true;
  }

  // Mark current node as visited
  visited[currNode] = true;

  // Explore all unvisited neighbors
  for (const nextNode of adjacencyList.get(currNode) || []) {
    if (!visited[nextNode]) {
      // Early return if path found through this neighbor
      if (dfsHelper(adjacencyList, visited, nextNode, destination)) {
        return true;
      }
    }
  }

  // No path found from this branch
  return false;
}

/**
 * **Approach 3: BFS (Breadth-First Search)**
 *
 * **Time Complexity:** O(V + E) - Visit each vertex and edge once
 * **Space Complexity:** O(V) - Queue + adjacency list + visited set
 *
 * **Algorithm:**
 * 1. Build adjacency list from edges
 * 2. Use queue to explore graph level-by-level from source
 * 3. Mark vertices as visited
 * 4. Return true if destination is visited
 *
 * **Advantages over DFS for this problem:**
 * - Finds shortest path in unweighted graphs
 * - Often faster in practice for connected vertices
 * - More natural for level-by-level exploration
 */
function validPathBFS(
  n: number,
  edges: number[][],
  source: number,
  destination: number
): boolean {
  if (source === destination) return true;

  // Build adjacency list
  const adjacencyList = buildAdjacencyList(n, edges);

  // BFS with queue
  const queue = new Queue<number>();
  queue.enqueue(source);

  const visited: Set<number> = new Set([source]);

  while (!queue.isEmpty()) {
    const node = queue.dequeue();

    if (!node) continue;

    if (node === destination) {
      return true;
    }

    for (const neighbor of adjacencyList.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.enqueue(neighbor);
      }
    }
  }

  return false;
}

/**
 * **Approach 4: Disjoint Set (Union-Find)**
 *
 * **Time Complexity:** O(E × α(V)) where α is inverse Ackermann function
 * **Space Complexity:** O(V) - Parent and rank arrays
 *
 * **Algorithm:**
 * 1. Create a disjoint set for all vertices
 * 2. Union vertices connected by edges
 * 3. Check if source and destination are in the same set
 * 4. Return true if they're connected
 */
function validPathDisjointSet(
  n: number,
  edges: number[][],
  source: number,
  destination: number
): boolean {
  if (source === destination) return true;

  const disjointSet = new DisjointSet(n);

  // Union all connected vertices
  for (const [u, v] of edges) {
    disjointSet.union(u, v);
  }

  // Check if source and destination are connected
  return disjointSet.connected(source, destination);
}

// Example usage
if (require.main === module) {
  const n = 3;
  const edges = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];
  const source = 0;
  const destination = 2;

  console.log("=== DFS Approach ===");
  console.log(
    `Path exists (DFS): ${validPathDFS(n, edges, source, destination)}`
  );

  console.log("\n=== Recursive DFS Approach ===");
  console.log(
    `Path exists (Recursive DFS): ${validPathRecursiveDFS(
      n,
      edges,
      source,
      destination
    )}`
  );

  console.log("\n=== BFS Approach ===");
  console.log(
    `Path exists (BFS): ${validPathBFS(n, edges, source, destination)}`
  );

  console.log("\n=== Disjoint Set Approach ===");
  console.log(
    `Path exists (Disjoint Set): ${validPathDisjointSet(
      n,
      edges,
      source,
      destination
    )}`
  );

  // Additional test case
  const n2 = 6;
  const edges2 = [
    [0, 1],
    [0, 2],
    [3, 5],
    [5, 4],
    [4, 3],
  ];
  const source2 = 0;
  const destination2 = 5;

  console.log("\n=== Test Case 2 (No Path) ===");
  console.log(
    `Path exists (DFS): ${validPathDFS(n2, edges2, source2, destination2)}`
  );
  console.log(
    `Path exists (Recursive DFS): ${validPathRecursiveDFS(
      n2,
      edges2,
      source2,
      destination2
    )}`
  );
  console.log(
    `Path exists (BFS): ${validPathBFS(n2, edges2, source2, destination2)}`
  );
  console.log(
    `Path exists (Disjoint Set): ${validPathDisjointSet(
      n2,
      edges2,
      source2,
      destination2
    )}`
  );
}
