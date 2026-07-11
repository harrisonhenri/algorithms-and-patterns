/**
 * Design Browser History - LeetCode Problem 1472
 *
 * You have a browser of one tab where you start on the homepage
 * and you can visit another URL, get back in the history number
 * of steps or move forward in the history number of steps.
 *
 * Implement the BrowserHistory class:
 *
 * - BrowserHistory(string homepage)
 *   Initializes the object with the homepage.
 *
 * - void visit(string url)
 *   Visits url from the current page.
 *   It clears up all the forward history.
 *
 * - string back(int steps)
 *   Move steps back in history.
 *   If steps exceeds available history,
 *   return the furthest possible page.
 *
 * - string forward(int steps)
 *   Move steps forward in history.
 *   If steps exceeds available future history,
 *   return the furthest possible page.
 *
 * @example
 * Input:
 * ["BrowserHistory","visit","visit","visit","back","back","forward","visit","forward","back","back"]
 *
 * [["leetcode.com"],
 *  ["google.com"],
 *  ["facebook.com"],
 *  ["youtube.com"],
 *  [1],
 *  [1],
 *  [1],
 *  ["linkedin.com"],
 *  [2],
 *  [2],
 *  [7]]
 *
 * Output:
 * [null,null,null,null,"facebook.com","google.com",
 *  "facebook.com",null,"linkedin.com","google.com","leetcode.com"]
 *
 * Explanation:
 *
 * BrowserHistory browserHistory =
 *   new BrowserHistory("leetcode.com");
 *
 * browserHistory.visit("google.com");
 * browserHistory.visit("facebook.com");
 * browserHistory.visit("youtube.com");
 *
 * browserHistory.back(1);
 * // returns "facebook.com"
 *
 * browserHistory.back(1);
 * // returns "google.com"
 *
 * browserHistory.forward(1);
 * // returns "facebook.com"
 *
 * browserHistory.visit("linkedin.com");
 * // forward history cleared
 *
 * browserHistory.forward(2);
 * // returns "linkedin.com"
 *
 * browserHistory.back(2);
 * // returns "google.com"
 *
 * browserHistory.back(7);
 * // returns "leetcode.com"
 *
 * @constraints
 * - 1 <= homepage.length <= 20
 * - 1 <= url.length <= 20
 * - 1 <= steps <= 100
 * - homepage and url consist of '.'
 *   or lowercase English letters
 * - At most 5000 calls will be made
 *   to visit, back, and forward
 *
 * ## Approaches
 *
 * **Approach 1: Two Stacks**
 *
 * Intuition:
 *
 * Browser history behaves similarly
 * to undo/redo operations.
 *
 * We can use:
 *
 * - history stack
 * - future stack
 *
 * Along with:
 *
 * - current page
 *
 * When visiting a new page:
 *
 * - push current page into history
 * - clear future stack
 *
 * When going back:
 *
 * - push current into future
 * - pop previous page from history
 *
 * When going forward:
 *
 * - push current into history
 * - pop page from future
 *
 * Complexity Analysis:
 *
 * @time
 * - visit: O(1)
 * - back: O(min(steps, n))
 * - forward: O(min(steps, n))
 *
 * @space O(n)
 *
 * **Trade-off:** Easy to understand
 * and naturally models undo/redo behavior.
 *
 * ---
 *
 * **Approach 2: Doubly Linked List**
 *
 * Intuition:
 *
 * A doubly linked list allows movement:
 *
 * - backward using prev
 * - forward using next
 *
 * Each node stores:
 *
 * - URL string
 * - prev pointer
 * - next pointer
 *
 * The current pointer always represents
 * the active browser page.
 *
 * When visiting a new page:
 *
 * - disconnect future nodes
 * - attach a new node
 * - move current pointer forward
 *
 * Complexity Analysis:
 *
 * @time
 * - visit: O(1)
 * - back: O(min(steps, n))
 * - forward: O(min(steps, n))
 *
 * @space O(n)
 *
 * **Trade-off:** Natural browser navigation model,
 * but requires pointer manipulation.
 *
 * ---
 *
 * **Approach 3: Dynamic Array (Implemented)**
 *
 * Intuition:
 *
 * We can store browser history inside
 * a dynamic array and track:
 *
 * - current page index
 * - last valid history index
 *
 * Key idea:
 *
 * Going back or forward only changes
 * the current pointer.
 *
 * We do NOT need to physically remove
 * future entries immediately.
 *
 * Instead:
 *
 * - overwrite them when visiting new pages
 * - maintain a right boundary
 *
 * Example:
 *
 * visitedURLs:
 *
 * [leetcode, google, facebook, youtube]
 *
 * current = 3
 *
 * back(1):
 *
 * current = 2
 *
 * visit(linkedin):
 *
 * overwrite next position:
 *
 * [leetcode, google, facebook, linkedin]
 *
 * lastValid = 3
 *
 * Old future pages are ignored.
 *
 * Algorithm:
 *
 * visit(url):
 * - move current pointer forward
 * - insert/overwrite URL
 * - update last valid pointer
 *
 * back(steps):
 * - move current pointer left
 * - stop at index 0
 *
 * forward(steps):
 * - move current pointer right
 * - stop at last valid index
 *
 * Why this works:
 *
 * Browser navigation only needs:
 *
 * - sequential access
 * - current position tracking
 *
 * Dynamic arrays provide:
 *
 * - O(1) indexing
 * - efficient appends
 * - cache-friendly memory layout
 *
 * Complexity Analysis:
 *
 * @time
 * - visit: O(1)
 * - back: O(1)
 * - forward: O(1)
 *
 * @space O(n)
 *
 * **Trade-off:** Simplest optimal solution
 * with excellent practical performance.
 *
 * Pattern:
 * - Dynamic array simulation
 * - Pointer/index tracking
 * - History state management
 *
 * @date 09/07/2026
 */

/**
 * **Approach 3: Dynamic Array**
 *
 * Time:
 * - visit: O(1)
 * - back: O(1)
 * - forward: O(1)
 *
 * Space: O(n)
 *
 * Uses:
 * - history array
 * - current index pointer
 * - last valid history pointer
 */
class BrowserHistory {
  // Stores visited URLs
  private visitedURLs: string[];

  // Current active page index
  private currentURL: number;

  // Furthest valid history index
  private lastURL: number;

  constructor(homepage: string) {
    this.visitedURLs = [homepage];

    this.currentURL = 0;

    this.lastURL = 0;
  }

  /**
   * Visit a new page.
   *
   * Forward history becomes invalid.
   */
  visit(url: string): void {
    // Overwrite existing entry if present
    this.visitedURLs[++this.currentURL] = url;

    // Update valid boundary
    this.lastURL = this.currentURL;
  }

  /**
   * Move backward through history.
   */
  back(steps: number): string {
    // Prevent moving before homepage
    this.currentURL = Math.max(0, this.currentURL - steps);

    return this.visitedURLs[this.currentURL];
  }

  /**
   * Move forward through history.
   */
  forward(steps: number): string {
    // Prevent moving beyond valid history
    this.currentURL = Math.min(this.lastURL, this.currentURL + steps);

    return this.visitedURLs[this.currentURL];
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Standard browser navigation ===");

  const browser1 = new BrowserHistory("leetcode.com");

  browser1.visit("google.com");
  browser1.visit("facebook.com");
  browser1.visit("youtube.com");

  console.log("back(1):", browser1.back(1));
  console.log("Expected: facebook.com");

  console.log("back(1):", browser1.back(1));
  console.log("Expected: google.com");

  console.log("forward(1):", browser1.forward(1));
  console.log("Expected: facebook.com");

  browser1.visit("linkedin.com");

  console.log("forward(2):", browser1.forward(2));
  console.log("Expected: linkedin.com");

  console.log("back(2):", browser1.back(2));
  console.log("Expected: google.com");

  console.log("back(7):", browser1.back(7));
  console.log("Expected: leetcode.com");
  console.log();

  console.log("=== Example 2: Forward boundary ===");

  const browser2 = new BrowserHistory("start.com");

  browser2.visit("a.com");
  browser2.visit("b.com");

  console.log("forward(5):", browser2.forward(5));
  console.log("Expected: b.com");
  console.log();

  console.log("=== Example 3: Back boundary ===");

  const browser3 = new BrowserHistory("home.com");

  browser3.visit("page1.com");
  browser3.visit("page2.com");

  console.log("back(10):", browser3.back(10));
  console.log("Expected: home.com");
  console.log();

  console.log("=== Example 4: Future invalidation ===");

  const browser4 = new BrowserHistory("leetcode.com");

  browser4.visit("google.com");
  browser4.visit("facebook.com");

  console.log("back(1):", browser4.back(1));
  console.log("Expected: google.com");

  browser4.visit("linkedin.com");

  console.log("forward(2):", browser4.forward(2));
  console.log("Expected: linkedin.com");
  console.log(`Explanation:
  Visiting linkedin.com clears
  the old future history.`);
  console.log();

  console.log("=== Example 5: No movement possible ===");

  const browser5 = new BrowserHistory("single-page.com");

  console.log("back(1):", browser5.back(1));
  console.log("Expected: single-page.com");

  console.log("forward(1):", browser5.forward(1));
  console.log("Expected: single-page.com");
  console.log();

  console.log("=== Example 6: Multiple navigation cycles ===");

  const browser6 = new BrowserHistory("root.com");

  browser6.visit("a.com");
  browser6.visit("b.com");
  browser6.visit("c.com");

  console.log("back(2):", browser6.back(2));
  console.log("Expected: a.com");

  console.log("forward(1):", browser6.forward(1));
  console.log("Expected: b.com");

  browser6.visit("new.com");

  console.log("forward(5):", browser6.forward(5));
  console.log("Expected: new.com");
}
