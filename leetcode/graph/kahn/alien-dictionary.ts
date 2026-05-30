import { kahnTopologicalSort } from "../../../algorithms/graph/kahn/index";
import { Edge } from "../../../common/types/edge";

/**
 * Verify Alien Dictionary Order using Kahn's Algorithm (Topological Sort)
 *
 * **Problem:**
 * Given a list of words from an alien language where the ordering of characters is unknown,
 * determine if the words are sorted according to some valid character ordering.
 * If valid, return the character order; if invalid, return an empty string.
 *
 * **Approach:**
 * This is a topological sorting problem:
 * 1. Extract ordering constraints from consecutive words
 * 2. Build a directed graph where edge A→B means character A comes before B
 * 3. Use Kahn's algorithm to find topological order
 * 4. If a cycle is detected (cannot sort all characters), return ""
 *
 * **Algorithm Steps:**
 * 1. Extract constraints: Compare adjacent words to find first differing character
 *    - If word[i] is longer than word[i+1] and all chars match, it's invalid
 * 2. Build graph:
 *    - Track all unique characters and map them to indices
 *    - Add directed edge from char u to char v (u comes before v)
 * 3. Apply Kahn's Algorithm (BFS with in-degree):
 *    - Enqueue all vertices with in-degree 0
 *    - Process vertices, reducing in-degree of neighbors
 *    - Enqueue neighbors when their in-degree becomes 0
 * 4. If result length equals unique character count, return result; else return ""
 *
 * **Example 1:**
 * Input: ["wrt","wrf","er","ett","rftt"]
 * Constraints: w→e, e→r, r→t, t→f
 * Output: "wertf"
 *
 * **Example 2:**
 * Input: ["z","x"]
 * Constraints: z→x
 * Output: "zx"
 *
 * **Example 3:**
 * Input: ["z","x","z"]
 * Invalid: "z" comes before "x", but then "x" comes before "z" (contradiction)
 * Output: ""
 *
 * **Time Complexity:** O(N * L + C + E)
 * - N: number of words
 * - L: average word length (for comparing adjacent words)
 * - C: number of unique characters (~26 for English)
 * - E: number of edges between characters
 *
 * **Space Complexity:** O(C + E)
 * - Graph adjacency list: O(C + E)
 * - In-degree array: O(C)
 * - Queue: O(C) in worst case
 *
 * @param words - Array of strings from the alien language dictionary
 * @returns Character order string, or empty string if invalid order
 *
 * @date 20/01/2026
 */

/**
 * Builds a character index map from all unique characters in words
 *
 * @param words - Array of words
 * @returns Map of character to index
 */
function extractCharacterIndex(words: string[]): Map<string, number> {
  const charIndex = new Map<string, number>();
  for (const word of words) {
    for (const char of word) {
      if (!charIndex.has(char)) {
        charIndex.set(char, charIndex.size);
      }
    }
  }
  return charIndex;
}

/**
 * Finds the first differing character between two words
 * Also detects invalid orderings (longer word before shorter)
 *
 * @param word1 - First word
 * @param word2 - Second word
 * @returns Object with index of first difference and invalid flag
 */
function findFirstDifference(
  word1: string,
  word2: string
): { index: number; isInvalid: boolean } {
  const minLen = Math.min(word1.length, word2.length);
  let i = 0;
  while (i < minLen && word1[i] === word2[i]) i++;

  // Invalid if word1 is longer and all shared chars match
  const isInvalid = i === word2.length && word1.length > word2.length;
  return { index: i, isInvalid };
}

/**
 * Extracts ordering constraints from adjacent words and builds edges
 *
 * @param words - Array of sorted words
 * @param charIndex - Character to index mapping
 * @returns Edge array or null if invalid ordering detected
 */
function extractEdges(
  words: string[],
  charIndex: Map<string, number>
): Edge[] | null {
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];

  for (let i = 0; i < words.length - 1; i++) {
    const { index: diffIdx, isInvalid } = findFirstDifference(
      words[i],
      words[i + 1]
    );

    if (isInvalid) return null;

    // If there's a differing character, add edge
    if (diffIdx < Math.min(words[i].length, words[i + 1].length)) {
      const from = words[i][diffIdx];
      const to = words[i + 1][diffIdx];
      const edgeKey = `${from}->${to}`;

      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        edges.push({
          source: charIndex.get(from)!,
          target: charIndex.get(to)!,
        });
      }
    }
  }

  return edges;
}

/**
 * Extracts ordering constraints from adjacent words and builds character graph
 * Compares each word with the next to find the first differing character
 *
 * @param words - Array of sorted words
 * @returns Character index mapping and edges array, or null if invalid
 */
function buildCharacterGraph(words: string[]): {
  charIndex: Map<string, number>;
  edges: Edge[];
  charCount: number;
} | null {
  const charIndex = extractCharacterIndex(words);
  const edges = extractEdges(words, charIndex);

  return edges === null
    ? null
    : {
        charIndex,
        edges,
        charCount: charIndex.size,
      };
}

/**
 * Main function: Determine alien dictionary order
 *
 * @param words - Array of words from alien dictionary
 * @returns Valid character order or empty string if invalid
 */
export function alienOrder(words: string[]): string {
  // Build character graph with ordering constraints
  const graphData = buildCharacterGraph(words);

  // If building graph failed, ordering is invalid
  if (graphData === null) {
    return "";
  }

  // Apply Kahn's algorithm to find topological order
  const topoOrder = kahnTopologicalSort(graphData.charCount, graphData.edges);

  // If cycle detected (incomplete topological sort), return empty string
  if (topoOrder.length !== graphData.charCount) {
    return "";
  }

  // Map indices back to characters
  const indexToChar = Array.from(graphData.charIndex.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([char]) => char);

  return topoOrder.map((idx) => indexToChar[idx]).join("");
}

// Test cases
if (require.main === module) {
  console.log("Example 1:");
  console.log('Input: ["wrt","wrf","er","ett","rftt"]');
  console.log("Output:", alienOrder(["wrt", "wrf", "er", "ett", "rftt"]));
  console.log("Expected: wertf\n");

  console.log("Example 2:");
  console.log('Input: ["z","x"]');
  console.log("Output:", alienOrder(["z", "x"]));
  console.log("Expected: zx\n");

  console.log("Example 3:");
  console.log('Input: ["z","x","z"]');
  console.log("Output:", alienOrder(["z", "x", "z"]));
  console.log("Expected: (empty string)\n");

  console.log("Example 4:");
  console.log('Input: ["z","x","z"]');
  console.log("Output:", alienOrder(["z", "x", "z"]));
  console.log("Expected: (empty string)");
}
