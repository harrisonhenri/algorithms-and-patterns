/**
 * Problem: Smallest String With Swaps
 * @date 13/01/2026 - 00:00:00
 *
 * You are given a string `s` and an array of index pairs `pairs`.
 *
 * Each pair `[a, b]` indicates that the characters at indices `a` and `b`
 * can be swapped **any number of times**, in any order.
 *
 * **Transitivity:**
 * Swaps are transitive. That means if you can swap `a` with `b` and `b` with `c`,
 * then you can rearrange characters at indices `a`, `b`, and `c` freely among themselves.
 * In other words, indices connected by swaps form a **connected component** where
 * all characters can be permuted arbitrarily.
 *
 * **Goal:**
 * Return the **lexicographically smallest string** that can be obtained
 * after performing any number of allowed swaps.
 *
 * **Example:**
 * ```ts
 * const s = "dcab";
 * const pairs = [[0, 3], [1, 2]];
 * // Connected components: [0,3] and [1,2]
 * // Sort characters in each component:
 * // [0,3] → 'd','b' → 'b','d'
 * // [1,2] → 'c','a' → 'a','c'
 * // Reconstruct string → "bacd"
 * ```
 *
 * **Intuition / Approach:**
 * 1. Treat indices as nodes in a graph and each pair as an undirected edge.
 * 2. Find all connected components (indices that can swap among themselves).
 * 3. For each component:
 *    - Collect all characters at those indices
 *    - Sort them in ascending order
 *    - Put them back at the original indices
 * 4. Join the result and return.
 *
 * This ensures the **lexicographically smallest string** is achieved.
 *
 */

import { DisjointSet } from "../../../structures/disjoint-set";

function smallestStringWithSwaps(s: string, pairs: number[][]): string {
  const n = s.length;
  const ds = new DisjointSet(n);

  // 1. Union all connected indices
  for (const [a, b] of pairs) {
    ds.union(a, b);
  }

  // 2. Group indices by root
  const groups = ds.getComponents();

  // 3. Prepare result array
  const result = Array.from(s);

  // 4. Sort characters inside each component
  for (const indices of groups.values()) {
    const chars = indices.map((i) => s[i]).sort();

    indices.sort((a, b) => a - b);

    for (let i = 0; i < indices.length; i++) {
      result[indices[i]] = chars[i];
    }
  }

  return result.join("");
}

if (require.main === module) {
  console.log(
    smallestStringWithSwaps("dcab", [
      [0, 3],
      [1, 2],
    ])
  );
}
