import { Queue } from "../../../structures/queue";
import { buildAdjacencyList } from "../../../algorithms/utils/build-adjacency-list";

/**
 * Minimum Height Trees (LeetCode 310)
 *
 * Problem: Given a tree of n nodes labeled from 0 to n-1, find all minimum height tree roots.
 * The height of a tree is the maximum distance from the root to any leaf.
 *
 * Approach: Leaf Removal (Topological Sort)
 * - Iteratively remove leaf nodes (degree = 1) layer by layer
 * - The last remaining 1-2 nodes are MHT roots
 * - Time: O(n), Space: O(n)
 *
 * @date 20/01/2026
 */

/**
 * Finds all MHT roots using leaf removal strategy
 *
 * @param n - Number of nodes
 * @param adj - Adjacency list representation
 * @returns Array of MHT root nodes
 */
function findMHTRootsTopological(
  n: number,
  adj: Map<number, number[]>
): number[] {
  // Special cases
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  // Track degree (number of neighbors) for each node
  const degree = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    degree[i] = adj.get(i)!.length;
  }

  // Queue stores current leaf nodes
  const queue = new Queue<number>();

  // Add all initial leaf nodes (degree = 1)
  for (let i = 0; i < n; i++) {
    if (degree[i] === 1) {
      queue.enqueue(i);
    }
  }

  // Remaining nodes to process
  let remaining = n;

  // Remove leaves layer by layer until 1 or 2 nodes remain
  while (remaining > 2) {
    // Process all leaves at current level
    const currentLevelSize = queue.size();

    for (let i = 0; i < currentLevelSize; i++) {
      const leaf = queue.dequeue()!;

      // Update degree of all neighbors
      for (const neighbor of adj.get(leaf)!) {
        degree[neighbor]--;

        // If neighbor becomes a leaf, enqueue it for next level
        if (degree[neighbor] === 1) {
          queue.enqueue(neighbor);
        }
      }
    }

    remaining -= currentLevelSize;
  }

  // Remaining 1 or 2 nodes are MHT roots
  const result: number[] = [];
  while (!queue.isEmpty()) {
    result.push(queue.dequeue()!);
  }

  return result;
}

/**
 * Main function: Find all Minimum Height Trees roots
 *
 * @param n - Number of nodes
 * @param edges - Array of edges connecting nodes
 * @returns List of all MHT root labels
 */
function findMinHeightTrees(n: number, edges: number[][]): number[] {
  // Build adjacency list
  const adj = buildAdjacencyList(n, edges);

  // Find MHT roots using topological leaf removal
  return findMHTRootsTopological(n, adj);
}

// Test cases
if (require.main === module) {
  console.log("=== Minimum Height Trees Examples ===\n");

  // Example 1: Star graph (single center)
  console.log("Example 1: Star graph with single center");
  const n1 = 4;
  const edges1 = [
    [1, 0],
    [1, 2],
    [1, 3],
  ];
  const result1 = findMinHeightTrees(n1, edges1);
  console.log(`n = ${n1}, edges = ${JSON.stringify(edges1)}`);
  console.log("Tree structure:");
  console.log("    0");
  console.log("    |");
  console.log("    1");
  console.log("   / \\");
  console.log("  2   3");
  console.log("Output:", result1);
  console.log("Expected: [1]\n");

  // Example 2: Linear graph (two centers)
  console.log("Example 2: Linear graph with two centers");
  const n2 = 6;
  const edges2 = [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 4],
    [5, 4],
  ];
  const result2 = findMinHeightTrees(n2, edges2);
  console.log(`n = ${n2}, edges = ${JSON.stringify(edges2)}`);
  console.log("Tree structure:");
  console.log("    0 1 2");
  console.log("     \\|/");
  console.log("      3");
  console.log("      |");
  console.log("      4");
  console.log("      |");
  console.log("      5");
  console.log("Output:", result2);
  console.log("Expected: [3, 4]\n");

  // Example 3: Single node
  console.log("Example 3: Single node");
  const n3 = 1;
  const edges3: number[][] = [];
  const result3 = findMinHeightTrees(n3, edges3);
  console.log(`n = ${n3}, edges = ${JSON.stringify(edges3)}`);
  console.log("Output:", result3);
  console.log("Expected: [0]\n");

  // Example 4: Two nodes
  console.log("Example 4: Two nodes");
  const n4 = 2;
  const edges4 = [[0, 1]];
  const result4 = findMinHeightTrees(n4, edges4);
  console.log(`n = ${n4}, edges = ${JSON.stringify(edges4)}`);
  console.log("Output:", result4);
  console.log("Expected: [0, 1]\n");

  // Example 5: Linear chain (4 nodes)
  console.log("Example 5: Linear chain");
  const n5 = 4;
  const edges5 = [
    [0, 1],
    [1, 2],
    [2, 3],
  ];
  const result5 = findMinHeightTrees(n5, edges5);
  console.log(`n = ${n5}, edges = ${JSON.stringify(edges5)}`);
  console.log("Tree structure: 0 - 1 - 2 - 3");
  console.log("Output:", result5);
  console.log("Expected: [1, 2]\n");

  // Example 6: Perfect binary tree
  console.log("Example 6: Perfect binary tree");
  const n6 = 7;
  const edges6 = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
  ];
  const result6 = findMinHeightTrees(n6, edges6);
  console.log(`n = ${n6}`);
  console.log("Tree structure:");
  console.log("        0");
  console.log("       / \\");
  console.log("      1   2");
  console.log("     / \\ / \\");
  console.log("    3  4 5  6");
  console.log("Output:", result6);
  console.log("Expected: [0]\n");
}
