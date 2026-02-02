/**
 * Clone Graph - Deep Copy of an Undirected Graph
 *
 * **Problem Statement:**
 * Given a reference of a node in a connected undirected graph, return a deep copy
 * (clone) of the graph.
 *
 * Each node in the graph contains a value (int) and a list of its neighbors.
 *
 * **Node Definition:**
 * ```ts
 * class Node {
 *   val: number;
 *   neighbors: Node[];
 * }
 * ```
 *
 * **Test Case Format:**
 * - Each node's value is the same as the node's index (1-indexed)
 * - The graph is represented as an adjacency list
 * - The given node will always be the first node with val = 1
 * - You must return the copy of the given node as a reference to the cloned graph
 *
 * **Example 1:**
 * ```
 * Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
 * Output: [[2,4],[1,3],[2,4],[1,3]]
 *
 * Explanation:
 * - 1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4)
 * - 2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3)
 * - 3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4)
 * - 4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3)
 * ```
 *
 * **Approaches:**
 * 1. **DFS with HashMap** - Recursive traversal with memoization
 * 2. **DFS Iterative with Stack** - Iterative traversal using Stack from project structures
 * 3. **BFS with Queue** - Level-order traversal (alternative)
 *
 * **Constraints:**
 * - 1 <= Node.val <= n
 * - n is the number of nodes in the graph
 * - 1 <= Number of edges <= 2n
 * - Graph is connected and undirected
 * - No self-loops or multiple edges between the same two nodes
 *
 * **Time Complexity:** O(N + E) where N is nodes and E is edges
 * **Space Complexity:** O(N) for the map/visited set and recursion stack
 *
 * @date 14/01/2026 - 00:00:00
 */

import { Stack } from "../../../structures/stack/index";
import { GraphNode } from "../../../structures/graph/node";

/**
 * **Approach 1: DFS with HashMap (Recursive)**
 *
 * Uses a HashMap to store already cloned nodes and recursively clones all neighbors.
 * This prevents infinite loops in the undirected graph.
 *
 * **Algorithm:**
 * 1. Use a map to track visited/cloned nodes
 * 2. For each unvisited node, create a clone
 * 3. Recursively clone all neighbors
 * 4. Return the cloned node
 */
function cloneGraphDFS(
  node: GraphNode<number> | null
): GraphNode<number> | null {
  if (!node) return null;

  const clonedNodes = new Map<number, GraphNode<number>>();

  function dfs(originalNode: GraphNode<number>): GraphNode<number> {
    // If already cloned, return the clone
    if (clonedNodes.has(originalNode.val)) {
      return clonedNodes.get(originalNode.val)!;
    }

    // Create clone of current node
    const clonedNode = new GraphNode<number>(originalNode.val);
    clonedNodes.set(originalNode.val, clonedNode);

    // Clone all neighbors recursively
    for (const neighbor of originalNode.neighbors) {
      clonedNode.neighbors.push(dfs(neighbor));
    }

    return clonedNode;
  }

  return dfs(node);
}

/**
 * **Approach 2: DFS with Stack (Iterative)**
 *
 * Uses the Stack data structure from project structures to manage the traversal,
 * avoiding recursion depth issues. Each stack element contains a node to process.
 *
 * **Algorithm:**
 * 1. Initialize stack with the source node
 * 2. While stack is not empty, pop a node
 * 3. Clone the node if not already cloned
 * 4. Add unvisited neighbors to the stack
 * 5. Connect cloned node to cloned neighbors
 */
function cloneGraphIterativeDFS(
  node: GraphNode<number> | null
): GraphNode<number> | null {
  if (!node) return null;

  const clonedNodes = new Map<number, GraphNode<number>>();
  const stack = new Stack<GraphNode<number>>();
  stack.push(node);

  // First pass: clone all nodes
  const visited = new Set<number>();

  while (!stack.isEmpty()) {
    const currentNode = stack.pop()!;

    if (visited.has(currentNode.val)) continue;
    visited.add(currentNode.val);

    if (!clonedNodes.has(currentNode.val)) {
      clonedNodes.set(currentNode.val, new GraphNode<number>(currentNode.val));
    }

    for (const neighbor of currentNode.neighbors) {
      if (!clonedNodes.has(neighbor.val)) {
        clonedNodes.set(neighbor.val, new GraphNode<number>(neighbor.val));
      }
      stack.push(neighbor);
    }
  }

  // Second pass: connect cloned nodes
  visited.clear();
  stack.push(node);

  while (!stack.isEmpty()) {
    const currentNode = stack.pop()!;

    if (visited.has(currentNode.val)) continue;
    visited.add(currentNode.val);

    const clonedCurrent = clonedNodes.get(currentNode.val)!;

    for (const neighbor of currentNode.neighbors) {
      clonedCurrent.neighbors.push(clonedNodes.get(neighbor.val)!);
      stack.push(neighbor);
    }
  }

  return clonedNodes.get(node.val)!;
}

/**
 * **Approach 3: BFS with Queue (Alternative)**
 *
 * Uses a queue for level-order traversal of the graph.
 * More intuitive for undirected graphs.
 */
function cloneGraphBFS(
  node: GraphNode<number> | null
): GraphNode<number> | null {
  if (!node) return null;

  const clonedNodes = new Map<number, GraphNode<number>>();
  const queue: GraphNode<number>[] = [node];
  clonedNodes.set(node.val, new GraphNode<number>(node.val));

  while (queue.length > 0) {
    const originalNode = queue.shift()!;
    const clonedNode = clonedNodes.get(originalNode.val)!;

    for (const neighbor of originalNode.neighbors) {
      // If neighbor not yet cloned, create it
      if (!clonedNodes.has(neighbor.val)) {
        clonedNodes.set(neighbor.val, new GraphNode<number>(neighbor.val));
        queue.push(neighbor);
      }

      // Connect cloned node to cloned neighbor
      clonedNode.neighbors.push(clonedNodes.get(neighbor.val)!);
    }
  }

  return clonedNodes.get(node.val)!;
}

// Helper function to build graph from adjacency list
function buildGraphFromAdjList(adjList: number[][]): GraphNode<number> | null {
  if (!adjList || adjList.length === 0) return null;

  const nodes = new Map<number, GraphNode<number>>();

  // Create all nodes first
  for (let i = 0; i < adjList.length; i++) {
    nodes.set(i + 1, new GraphNode<number>(i + 1));
  }

  // Connect neighbors
  for (let i = 0; i < adjList.length; i++) {
    const node = nodes.get(i + 1)!;
    for (const neighborIdx of adjList[i]) {
      node.neighbors.push(nodes.get(neighborIdx)!);
    }
  }

  return nodes.get(1)!; // Return first node
}

// Helper function to verify clone is correct
function isCloneValid(
  original: GraphNode<number> | null,
  cloned: GraphNode<number> | null
): boolean {
  if (!original && !cloned) return true;
  if (!original || !cloned) return false;

  const visitedOriginal = new Set<number>();
  const visitedCloned = new Set<number>();

  function dfs(
    orig: GraphNode<number>,
    clonedNode: GraphNode<number>
  ): boolean {
    if (visitedOriginal.has(orig.val)) {
      return visitedCloned.has(clonedNode.val);
    }

    visitedOriginal.add(orig.val);
    visitedCloned.add(clonedNode.val);

    if (orig.val !== clonedNode.val) return false;
    if (orig.neighbors.length !== clonedNode.neighbors.length) return false;
    if (orig === clonedNode) return false; // Must be different objects

    for (let i = 0; i < orig.neighbors.length; i++) {
      if (!dfs(orig.neighbors[i], clonedNode.neighbors[i])) {
        return false;
      }
    }

    return true;
  }

  return dfs(original, cloned);
}

// Example usage
if (require.main === module) {
  console.log("=== Test Case 1: Basic Graph ===");
  const adjList1 = [
    [2, 4],
    [1, 3],
    [2, 4],
    [1, 3],
  ];
  const graphOriginal1 = buildGraphFromAdjList(adjList1);

  console.log("DFS Recursive");
  const clonedDFS = cloneGraphDFS(graphOriginal1);
  console.log("Clone valid:", isCloneValid(graphOriginal1, clonedDFS));

  console.log("\nDFS Iterative:");
  const clonedIterativeDFS = cloneGraphIterativeDFS(graphOriginal1);
  console.log("Clone valid:", isCloneValid(graphOriginal1, clonedIterativeDFS));

  // Test Case 2: Single node
  console.log("\n=== Test Case 2: Single Node ===");
  const adjList2 = [[]];
  const graphOriginal2 = buildGraphFromAdjList(adjList2);

  const clonedDFS2 = cloneGraphDFS(graphOriginal2);
  console.log(
    "Single node clone valid:",
    isCloneValid(graphOriginal2, clonedDFS2)
  );

  // Test Case 3: Empty graph
  console.log("\n=== Test Case 3: Empty Graph ===");
  const clonedEmpty = cloneGraphDFS(null);
  console.log("Empty graph clone valid:", clonedEmpty === null);
}
