/**
 * Given a list of airline tickets where tickets[i] = [from, to] represents
 * a flight from one airport to another, reconstruct the itinerary in order
 * and return it.
 *
 * Requirements:
 * - All tickets belong to a person departing from "JFK"
 * - The itinerary must begin with "JFK"
 * - If multiple valid itineraries exist, return the one with the smallest
 *   lexical order when read as a single string
 * - All tickets must be used exactly once
 * - All tickets form at least one valid itinerary
 *
 * **Mathematical Foundation: Eulerian Path/Circuit**
 *
 * This problem is solved using Hierholzer's algorithm, which finds Eulerian paths/circuits.
 * The relationship between graph conditions and existence of Eulerian paths:
 *
 * | Graph Type | Eulerian Circuit | Eulerian Path |
 * |---|---|---|
 * | **Undirected** | Every vertex has an even degree. | Either every vertex has even degree or exactly two vertices have odd degree. |
 * | **Directed** | Every vertex has equal indegree and outdegree | At most one vertex has (outdegree) - (indegree) = 1 and at most one vertex has (indegree) - (outdegree) = 1 and all other vertices have equal in and out degrees. |
 *
 * In this problem:
 * - We're finding an Eulerian path in a directed graph (flights between airports)
 * - Each ticket is an edge that must be used exactly once
 * - Starting from "JFK" ensures we begin at the correct source
 *
 * Approach: Use Hierholzer's algorithm with DFS to find an Eulerian path.
 * By sorting destinations at each airport, we ensure lexical ordering.
 *
 * Time Complexity: O(E log E) where E is the number of tickets
 * Space Complexity: O(V + E) where V is the number of airports
 *
 */

import { MinHeap } from "../../../structures/heap/min-heap";

function findItinerary(tickets: string[][]): string[] {
  // Build the graph: airport -> sorted list of destinations
  const graph: Map<string, string[]> = new Map();

  // Initialize graph with all airports from tickets
  for (const [from, to] of tickets) {
    if (!graph.has(from)) {
      graph.set(from, []);
    }
    if (!graph.has(to)) {
      graph.set(to, []);
    }
    graph.get(from)!.push(to);
  }

  // Sort destinations for each airport to ensure lexical order
  for (const destinations of graph.values()) {
    destinations.sort();
  }

  const result: string[] = [];

  /**
   * DFS helper function that traverses the graph using Hierholzer's algorithm.
   * Processes all outgoing edges from the current airport before adding it to result.
   * This ensures we find a valid Eulerian path.
   */
  function dfs(airport: string): void {
    const destinations = graph.get(airport);
    // Visit all destinations in sorted order
    while (destinations && destinations.length > 0) {
      const nextAirport = destinations.shift() as string;
      dfs(nextAirport);
    }
    // Add airport to result after all outgoing edges are processed
    result.push(airport);
  }

  dfs("JFK");
  // Reverse to get the correct order (we built it backwards)
  return result.reverse();
}

/**
 * Alternative Approach: Using the MinHeap from structures/heap with DFS.
 *
 * This approach leverages the project's MinHeap data structure to maintain
 * destinations in lexical order. By using the actual MinHeap class, we can
 * efficiently extract destinations in sorted order while consuming each ticket
 * exactly once.
 *
 * Time Complexity: O(E log E) where E is the number of tickets
 * Space Complexity: O(V + E) where V is the number of airports
 *
 * @param {string[][]} tickets - Array of tickets where tickets[i] = [from, to]
 * @returns {string[]} The reconstructed itinerary starting from "JFK"
 */
function findItineraryWithProjectHeap(tickets: string[][]): string[] {
  // Build the graph: airport -> MinHeap of destinations
  const graph: Map<string, MinHeap<string>> = new Map();

  // Initialize graph with all airports from tickets
  for (const [from, to] of tickets) {
    if (!graph.has(from)) {
      graph.set(from, new MinHeap<string>());
    }
    if (!graph.has(to)) {
      graph.set(to, new MinHeap<string>());
    }
    graph.get(from)!.add(to);
  }

  const result: string[] = [];

  /**
   * DFS helper that uses the MinHeap to greedily extract destinations
   * in lexicographically smallest order.
   */
  function dfs(airport: string): void {
    const destinations = graph.get(airport)!;
    // Poll destinations from MinHeap - extracts smallest lexically
    while (destinations.size() > 0) {
      const nextAirport = destinations.poll();
      if (nextAirport !== undefined) {
        dfs(nextAirport);
      }
    }
    result.push(airport);
  }

  dfs("JFK");
  return result.reverse();
}

// Examples
if (require.main === module) {
  const tickets = [
    ["MUC", "LHR"],
    ["JFK", "MUC"],
    ["SFO", "SJC"],
    ["LHR", "SFO"],
  ];
  console.log("Approach 1 (DFS with sorted list):", findItinerary(tickets));
  // Output: ["JFK","MUC","LHR","SFO","SJC"]

  console.log(
    "Approach 2 (DFS with MinHeap):",
    findItineraryWithProjectHeap(tickets)
  );
  // Output: ["JFK","MUC","LHR","SFO","SJC"]

  const tickets2 = [
    ["JFK", "SFO"],
    ["JFK", "ATL"],
    ["SFO", "ATL"],
    ["ATL", "JFK"],
    ["ATL", "SFO"],
  ];
  console.log("Approach 1 (DFS with sorted list):", findItinerary(tickets2));
  // Output: ["JFK","ATL","JFK","SFO","ATL","SFO"]

  console.log(
    "Approach 2 (DFS with MinHeap):",
    findItineraryWithProjectHeap(tickets2)
  );
  // Output: ["JFK","ATL","JFK","SFO","ATL","SFO"]
}
