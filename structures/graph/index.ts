/**
 * Graph.
 * @date 17/12/2025 - 00:00:00
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
