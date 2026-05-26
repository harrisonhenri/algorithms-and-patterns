import { DisjointSet } from "../../../structures/disjoint-set";

/**
 * Problem: Number of Provinces (Connected Components)
 * @date 13/01/2026 - 00:00:00
 *
 * There are n cities, some of which are directly connected.
 *
 * If city A is directly connected to city B, and city B is directly
 * connected to city C, then city A is indirectly connected to city C.
 *
 * A province is a group of cities that are directly or indirectly
 * connected to each other, and that do not include any cities outside
 * of the group.
 *
 * You are given an n x n adjacency matrix `isConnected`, where:
 * - isConnected[i][j] === 1 means city i is directly connected to city j
 * - isConnected[i][j] === 0 means there is no direct connection
 *
 * Return the total number of provinces (connected components) in the graph.
 *
 * @time O(n² × α(n)) - Two nested loops iterate through the adjacency matrix,
 *       with nearly O(1) union operations using path compression
 * @space O(n) - DisjointSet data structure stores n elements
 */

function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const ds = new DisjointSet(n);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) {
        ds.union(i, j);
      }
    }
  }

  return ds.getComponents().size;
}

if (require.main === module) {
  const isConnected = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
  ];
  console.log(findCircleNum(isConnected));
}
