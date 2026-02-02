/**
 * Problem: Earliest Time to All People Become Friends
 * @date 13/01/2026 - 00:00:00
 *
 * Determines the earliest time at which every person in a social group becomes
 * acquainted with every other person based on friendship logs.
 *
 * There are `n` people in a social group labeled from `0` to `n - 1`. You are
 * given an array `logs` where `logs[i] = [timestampi, xi, yi]` indicates that
 * `xi` and `yi` will be friends at the time `timestampi`.
 *
 * Friendship is symmetric:
 * - If `a` is friends with `b`, then `b` is friends with `a`.
 * - Person `a` is acquainted with person `b` if `a` is friends with `b`,
 *   or `a` is a friend of someone acquainted with `b`.
 *
 * **Example:**
 * const logs = [
 *   [20190101, 0, 1],
 *   [20190104, 3, 4],
 *   [20190107, 2, 3],
 *   [20190211, 1, 5],
 *   [20190224, 2, 4],
 *   [20190301, 0, 3],
 *   [20190312, 1, 2],
 *   [20190322, 4, 5]
 * ];
 * const n = 6;
 * earliestAcq(logs, n); // returns 20190301
 */

import { DisjointSet } from "../../../structures/disjoint-set";

function earliestAcq(logs: [number, number, number][], n: number): number {
  const sortedLogs = logs.sort((a, b) => a[0] - b[0]);
  const ds = new DisjointSet(n);

  for (const [timestamp, x, y] of sortedLogs) {
    ds.union(x, y);

    // If all persons are connected, return the current timestamp
    if (ds.getComponents().size === 1) {
      return timestamp;
    }
  }

  return -1; // Not all persons became acquainted
}

if (require.main === module) {
  console.log(
    earliestAcq(
      [
        [20190101, 0, 1],
        [20190104, 3, 4],
        [20190107, 2, 3],
        [20190211, 1, 5],
        [20190224, 2, 4],
        [20190301, 0, 3],
        [20190312, 1, 2],
        [20190322, 4, 5],
      ],
      6
    )
  );
}
