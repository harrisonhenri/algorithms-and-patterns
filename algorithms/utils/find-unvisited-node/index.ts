/**
 * Function to check if any unvisited neighour vertex exist for current vertex
 * @date 21/06/2023 - 00:01:00
 *
 */
export const findUnvisitedNode = (
  graph: number[][],
  visitedNodes: { [key in number]: boolean },
  currentNode?: number
) => {
  if (!currentNode) return 0;

  const currentConnectedNodes = graph[currentNode];
  let neighborIdx = -1;

  currentConnectedNodes.forEach((element, idx) => {
    if (element == 1 && !visitedNodes[idx] && neighborIdx == -1) {
      neighborIdx = idx;
    }
  });

  return neighborIdx;
};
