import { MinHeap } from "../../structures/heap/min-heap";

/**
 * Meeting Rooms II - LeetCode Problem
 *
 * Given an array of meeting time intervals intervals where intervals[i] = [starti, endi],
 * return the minimum number of conference rooms required.
 *
 * @example
 * Input: intervals = [[0,30],[5,10],[15,20]]
 * Output: 2
 *
 * Explanation:
 * - Meeting 1: [0,30]
 * - Meeting 2: [5,10] - overlaps with Meeting 1, need another room
 * - Meeting 3: [15,20] - Meeting 1 ends at 30, so we can reuse its room
 * - Maximum concurrent meetings at any point: 2 (at time 5, meetings 1 and 2 are both ongoing)
 *
 * @example
 * Input: intervals = [[1,5],[1,10],[1,15]]
 * Output: 3
 *
 * Explanation:
 * All three meetings overlap completely, requiring 3 separate rooms.
 *
 * @constraints
 * - 1 <= intervals.length <= 10^4
 * - 0 <= start_i < end_i <= 10^6
 *
 * **Approach 1: Min-Heap (Optimal)**
 * 1. Sort all intervals by start time
 * 2. Use a min-heap to track the end times of active meetings (rooms in use)
 * 3. For each meeting:
 *    - If the earliest ending meeting has ended (min <= current start), remove it (reuse room)
 *    - Add the current meeting's end time to the heap (occupy a room)
 * 4. The maximum heap size is the minimum number of rooms needed
 * - **Time:** O(N log N) - Sorting O(N log N) + heap operations (N) each O(log N)
 * - **Space:** O(N) - Heap storage for at most N meetings
 * - **Intuition:** Efficiently find which room becomes available first
 *
 * **Approach 2: Event Sorting (Alternative)**
 * 1. Create separate arrays for all start and end times
 * 2. Sort both arrays independently
 * 3. Use two pointers to process events in chronological order
 * 4. Track concurrent meetings with a counter
 * - **Time:** O(N log N) - Sorting both arrays
 * - **Space:** O(N) - Two arrays of size N
 * - **Advantage:** No heap needed, easier to implement
 *
 * **Approach 3: Sweep Line Algorithm**
 * 1. Create events with (time, type) where type = 1 for start, -1 for end
 * 2. Sort events by time, breaking ties with end events before start events
 * 3. Process events in order, tracking the maximum concurrent meetings
 * - **Time:** O(N log N) - Sorting events
 * - **Space:** O(N) - Events array
 * - **Trade-off:** Requires careful tie-breaking (ends before starts at same time)
 *
 * @date 25/01/2026
 */
/**
 * **Approach 1: Min-Heap**
 *
 * Maintains a min-heap of end times. For each meeting sorted by start time,
 * reuse the room with the earliest end time if available; otherwise book a new room.
 *
 * @time O(N log N) - Sort O(N log N) + heap ops O(N log N)
 * @space O(N) - Heap storage
 *
 */
function minMeetingRooms(intervals: number[][]): number {
  // Handle edge case: no meetings require no rooms
  if (intervals.length === 0) return 0;

  // Sort intervals by start time
  intervals.sort((a, b) => a[0] - b[0]);

  // Min-heap to track end times of meetings in active rooms
  const endTimes = new MinHeap<number>();
  let maxRooms = 0;

  for (const [start, end] of intervals) {
    // If the earliest ending meeting has finished, we can reuse that room
    if (endTimes.size() > 0 && endTimes.peek() <= start) {
      endTimes.poll(); // Remove the meeting that ended
    }

    // Add the current meeting's end time to track room usage
    endTimes.add(end);

    // Track the maximum number of rooms needed
    maxRooms = Math.max(maxRooms, endTimes.size());
  }

  return maxRooms;
}

/**
 * **Approach 2: Event Sorting (Two Pointers)**
 *
 * Separates start/end times into sorted arrays. Uses two pointers to process events
 * chronologically: increment rooms when meeting starts, decrement when it ends.
 *
 * @time O(N log N) - Sort both arrays O(N log N) + merge O(N)
 * @space O(N) - Two separate arrays
 *
 * **Pros:** No heap, simpler logic
 * **Cons:** Separate array extraction
 *
 */
function minMeetingRoomsEventSort(intervals: number[][]): number {
  const events: [number, number][] = [];

  // Create events: 1 for start, -1 for end
  // Using 1 and -1 allows sorting to handle simultaneous start/end correctly
  for (const [start, end] of intervals) {
    events.push([start, 1]); // Meeting starts
    events.push([end, -1]); // Meeting ends
  }

  // Sort by time, with end events (-1) before start events (1) at same time
  // This ensures a meeting ending at time T is processed before one starting at T
  events.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1]; // End events (-1) come before start events (1)
  });

  let concurrent = 0;
  let maxRooms = 0;

  for (const [time, type] of events) {
    concurrent += type;
    maxRooms = Math.max(maxRooms, concurrent);
  }

  return maxRooms;
}

// Example usage
if (require.main === module) {
  // Example 1
  console.log("=== Example 1: Min-Heap Approach ===");
  const intervals1 = [
    [0, 30],
    [5, 10],
    [15, 20],
  ];
  console.log("Input:", JSON.stringify(intervals1));
  console.log("Output:", minMeetingRooms([...intervals1])); // 2
  console.log("Explanation: At time 5-10, both meeting 1 and 2 are active");

  // Example 2
  console.log("\n=== Example 2: All Overlapping ===");
  const intervals2 = [
    [1, 5],
    [1, 10],
    [1, 15],
  ];
  console.log("Input:", JSON.stringify(intervals2));
  console.log("Output:", minMeetingRooms([...intervals2])); // 3
  console.log("Explanation: All three meetings overlap completely");

  // Example 3: No Overlap
  console.log("\n=== Example 3: No Overlap ===");
  const intervals3 = [
    [0, 5],
    [5, 10],
    [10, 15],
  ];
  console.log("Input:", JSON.stringify(intervals3));
  console.log("Output:", minMeetingRooms([...intervals3])); // 1
  console.log("Explanation: Meetings are sequential, one room sufficient");

  // Example 4: Complex Scenario
  console.log("\n=== Example 4: Complex Overlaps ===");
  const intervals4 = [
    [0, 30],
    [5, 10],
    [15, 20],
    [2, 7],
    [8, 12],
  ];
  console.log("Input:", JSON.stringify(intervals4));
  console.log("Output:", minMeetingRooms([...intervals4])); // 3
  console.log("Explanation: Maximum overlap is 3 concurrent meetings");

  // Example 5: Same meeting times
  console.log("\n=== Example 5: Simultaneous Start/End ===");
  const intervals5 = [
    [0, 5],
    [5, 10],
    [5, 10],
  ];
  console.log("Input:", JSON.stringify(intervals5));
  console.log("Output:", minMeetingRooms([...intervals5])); // 2
  console.log("Explanation: Two meetings start at 5, need 2 rooms");

  // Comparison with Event Sort approach
  console.log("\n=== Comparison with Event Sort Approach ===");
  const testIntervals = [
    [0, 30],
    [5, 10],
    [15, 20],
  ];
  console.log("Input:", JSON.stringify(testIntervals));
  console.log("Heap approach:", minMeetingRooms([...testIntervals]));
  console.log(
    "Event sort approach:",
    minMeetingRoomsEventSort([...testIntervals]),
  );
}
