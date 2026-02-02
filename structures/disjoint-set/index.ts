/**
 * Union-Find (a.k.a Disjoint-Set) is a data structure that efficiently keeps
 * track of connectivity among elements in a set.
 *
 * With Union-Find, you can quickly determine which group an element belongs to,
 * and efficiently merge the groups of two elements. Below is an implementation
 * with path compression and union by rank. This array-based implementation assumes
 * elements are integers from 0 to size-1.
 *
 * **Typical use cases / strengths:**
 * - Detecting cycles in undirected graphs
 * - Determining connected components
 * - Kruskal's minimum spanning tree algorithm
 * - Network connectivity problems
 * - Equivalence relation problems
 *
 * **Time Complexity (with optimizations, amortized):**
 * - `find()` → O(α(n)) - Nearly constant per operation
 * - `union()` → O(α(n)) - Nearly constant per operation
 * - `connected()` → O(α(n)) - Nearly constant per operation (uses two `find`s)
 *
 * Where α(n) is the inverse Ackermann function, which grows extremely slowly
 * (effectively constant for all practical purposes).
 *
 * **Key optimizations in this implementation:**
 * - **Path compression:** Flattens tree structure during `find()` operations
 * - **Union by rank:** Attaches smaller trees under larger ones
 *
 * **Interview intuition:** "Efficiently track connected components"
 * @date 13/01/2026 - 00:00:00
 *
 */

export class DisjointSet {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  // Find with path compression
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // Union by rank
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    // Already in the same set
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  // Optional: return all components
  getComponents(): Map<number, number[]> {
    const components = new Map<number, number[]>();

    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!components.has(root)) {
        components.set(root, []);
      }
      components.get(root)?.push(i);
    }

    return components;
  }
}

type Edge = [number, number];

// Cycle detection in an undirected graph
function hasCycle(n: number, edges: Edge[]): boolean {
  const ds = new DisjointSet(n);

  for (const [u, v] of edges) {
    // If union fails, u and v were already connected → cycle
    if (!ds.union(u, v)) {
      return true;
    }
  }

  return false;
}

if (require.main === module) {
  const ds = new DisjointSet(5);

  ds.union(0, 1);
  ds.union(1, 2);
  ds.union(1, 3);

  console.log("0 connected to 2:", ds.connected(0, 2)); // true
  console.log("0 connected to 3:", ds.connected(0, 3)); // false

  console.log("\nConnected Components:");
  const components = ds.getComponents();
  for (const [root, nodes] of components.entries()) {
    console.log(`Root ${root}:`, nodes);
  }

  console.log("\n=== Cycle Detection ===");

  const edgesWithCycle: Edge[] = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];

  const edgesWithoutCycle: Edge[] = [
    [0, 1],
    [1, 2],
    [3, 4],
  ];

  console.log("Graph with cycle:", hasCycle(3, edgesWithCycle)); // true

  console.log("Graph without cycle:", hasCycle(5, edgesWithoutCycle)); // false
}
