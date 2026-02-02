/**
 * Graph data structure for modeling relationships between entities.
 *
 * **Typical use cases / strengths:**
 * - Modeling relationships (social networks, road maps)
 * - Shortest path algorithms (Dijkstra, Bellman-Ford)
 * - Dependency resolution
 * - Topological sorting
 * - Network flow problems
 *
 * **Key Concept:** Graphs are about relationships, not ordering.
 * They can be directed or undirected, weighted or unweighted.
 *
 * **Graph Types:**
 *
 * | Type | Description | Properties | Use Cases |
 * |------|-------------|-----------|-----------|
 * | **Directed Graph (Digraph)** | Edges have direction (one-way) | A→B ≠ B→A | Social follows, task dependencies, road direction |
 * | **Undirected Graph** | Edges have no direction (two-way) | A—B = B—A | Friendships, road networks, protein interactions |
 * | **Weighted Graph** | Edges have associated weights/costs | Each edge has a value | GPS navigation (distances), network routing (delays) |
 * | **Unweighted Graph** | All edges have equal weight (1) | Binary connections | Social networks, web crawling |
 * | **Directed Acyclic Graph (DAG)** | Directed with no cycles | No circular paths | Compiler dependencies, job scheduling, version control |
 * | **Cyclic Graph** | Contains one or more cycles | A→B→C→A possible | Most real-world graphs, circular dependencies |
 * | **Connected Graph** | All vertices reachable from each other | Path exists between any two nodes | Social networks, connected road maps |
 * | **Disconnected Graph** | Some vertices unreachable from others | Isolated components exist | Multiple networks, scattered data |
 * | **Complete Graph** | Every vertex connected to every other | Max edges: V(V-1)/2 | Fully connected networks, reference comparisons |
 * | **Bipartite Graph** | Vertices split into two groups, edges only between groups | No edges within groups | Job matching, recommendation systems |
 *
 * **Graph Terminology Note:**
 * In some contexts (particularly in Bellman-Ford algorithms), directed acyclic graphs (DAGs)
 * may be informally called "regular" graphs. However, in formal graph theory, a "regular graph"
 * specifically means a graph where every node has the same number of neighbors. Use **DAG**
 * for directed acyclic graphs to avoid ambiguity.
 *
 * **Traversal Strategies:**
 *
 * | Traversal | Type | Strategy | Time | Typical Use Cases |
 * |-----------|------|----------|------|-------------------|
 * | **BFS** (Level order) | Graph Traversal | Level by level (Queue) | O(V + E) | Shortest path, search wide |
 * | **DFS** | Graph Traversal | Deep before backtracking (Stack/Recursion) | O(V + E) | Path finding, topological sort |
 *
 * **Interview intuition:** "Model relationships"
 * @date 13/01/2026 - 00:00:00
 *
 */
class UndirectedGraph {
  private edges: { [vertex: string]: { [adjacent: string]: number } } = {};

  addVertex(vertex: string | number) {
    this.edges[vertex] = {};
  }

  addEdge(
    vertex1: string | number,
    vertex2: string | number,
    weight: number = 0
  ) {
    if (!this.edges[vertex1]) {
      this.addVertex(vertex1);
    }
    if (!this.edges[vertex2]) {
      this.addVertex(vertex2);
    }
    this.edges[vertex1][vertex2] = weight;
    this.edges[vertex2][vertex1] = weight;
  }

  removeEdge(vertex1: string | number, vertex2: string | number) {
    if (vertex1 in this.edges && vertex2 in this.edges[vertex1]) {
      delete this.edges[vertex1][vertex2];
    }
    if (vertex2 in this.edges && vertex1 in this.edges[vertex2]) {
      delete this.edges[vertex2][vertex1];
    }
  }

  removeVertex(vertex: string | number) {
    if (!this.edges[vertex]) return;
    for (const adjacentVertex in this.edges[vertex]) {
      this.removeEdge(adjacentVertex, vertex);
    }
    delete this.edges[vertex];
  }

  traverseBFS(vertex: string | number) {
    const queue: (string | number)[] = [];
    const visited: { [vertex: string]: boolean } = {};

    queue.push(vertex);

    while (queue.length) {
      const currentVertex = queue.shift()!;
      if (!visited[currentVertex]) {
        visited[currentVertex] = true;
        console.log(currentVertex);

        for (const adjacentVertex in this.edges[currentVertex]) {
          queue.push(adjacentVertex);
        }
      }
    }
  }
}

const graph = new UndirectedGraph();
graph.addVertex(1);
graph.addVertex(2);
graph.addEdge(1, 2, 1);
graph.addVertex(3);
graph.addVertex(4);
graph.addVertex(5);
graph.addEdge(2, 3, 8);
graph.addEdge(3, 4, 10);
graph.addEdge(4, 5, 100);
graph.addEdge(1, 5, 88);

console.log(graph);
graph.traverseBFS(1);
