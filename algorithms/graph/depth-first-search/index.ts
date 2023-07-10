import { findUnvisitedNode } from "../../utils/find-unvisited-node";
import { timer } from "../../utils/timer";

/**
 * Sorts the array with a O(n) time complexity and O(n) space complexity.
 * The numbers must be integers distributed in a small ranger.
 * @date 21/06/2023 - 00:01:00
 *
 *
 */
const dfs = (graph: number[][], rootNode = 1) => {
  let nodeDistance: { [key in number]: number } = {};

  for (let i = 0; i < graph.length; i++) {
    nodeDistance[i] = Infinity;
  }

  nodeDistance[rootNode] = 0;

  let stack = [rootNode];

  let visitedNodes = { [rootNode]: true };

  while (stack.length) {
    const currentNode = stack.pop();
    const unvisitedNode = findUnvisitedNode(graph, visitedNodes, currentNode);

    if (unvisitedNode >= 0 && currentNode) {
      if (!visitedNodes[unvisitedNode]) {
        if (nodeDistance[unvisitedNode] == Infinity)
          nodeDistance[unvisitedNode] = nodeDistance[currentNode] + 1;

        visitedNodes[unvisitedNode] = true;
        stack.push(...[currentNode, unvisitedNode]);
      }
    } else {
      visitedNodes[unvisitedNode] = true;
    }
  }

  return nodeDistance;
};

console.log(
  timer(() =>
    dfs([
      [0, 1, 1, 0, 0],
      [1, 0, 0, 1, 0],
      [1, 0, 0, 1, 1],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ])
  )
);
