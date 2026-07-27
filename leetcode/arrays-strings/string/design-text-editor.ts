/**
 * Design a Text Editor - LeetCode Problem 2296
 *
 * Design a text editor with a movable cursor.
 *
 * The editor must support:
 * - inserting text
 * - deleting text
 * - moving cursor left
 * - moving cursor right
 *
 * The cursor behaves similarly to a real editor:
 *
 * Example:
 *
 * hello|
 *
 * The vertical bar represents the cursor position.
 *
 * Adding text inserts characters at the cursor.
 *
 * Deleting text removes characters
 * only from the LEFT side of the cursor.
 *
 * The cursor can never move:
 * - below index 0
 * - beyond text length
 *
 * Implement:
 *
 * - TextEditor()
 * - addText(text)
 * - deleteText(k)
 * - cursorLeft(k)
 * - cursorRight(k)
 *
 * @example
 * Input:
 * ["TextEditor","addText","deleteText"]
 * [[],["leetcode"],[4]]
 *
 * Output:
 * [null,null,4]
 *
 * Explanation:
 *
 * Initial:
 * |
 *
 * After addText("leetcode"):
 * leetcode|
 *
 * After deleteText(4):
 * leet|
 *
 * Deleted:
 * "code"
 *
 * @constraints
 * - 1 <= text.length, k <= 40
 * - text consists of lowercase English letters
 * - At most 2 * 10^4 operations
 *
 * ## Approaches
 *
 * **Approach 1: Two Stacks (Implemented)**
 *
 * Intuition:
 *
 * A text editor cursor naturally splits text
 * into two sections:
 *
 * LEFT of cursor
 * RIGHT of cursor
 *
 * Example:
 *
 * hello|world
 *
 * Left side:
 * hello
 *
 * Right side:
 * world
 *
 * Instead of storing one large string,
 * we maintain:
 *
 * - left stack
 * - right stack
 *
 * The cursor exists BETWEEN them.
 *
 * Visual representation:
 *
 * leftStack  |  rightStack
 *
 * [h,e,l,l,o] | [w,o,r,l,d]
 *
 * Key insight:
 *
 * Moving cursor left:
 * - pop from left
 * - push into right
 *
 * Moving cursor right:
 * - pop from right
 * - push into left
 *
 * This mimics cursor movement efficiently.
 *
 * Why stacks work well:
 *
 * Stack operations:
 * - push
 * - pop
 *
 * are O(1).
 *
 * Since constraints limit k <= 40,
 * each operation remains extremely fast.
 *
 * Algorithm:
 *
 * addText(text):
 * - push every character into left stack
 *
 * deleteText(k):
 * - pop up to k characters from left stack
 *
 * cursorLeft(k):
 * - move up to k chars:
 *   left -> right
 *
 * cursorRight(k):
 * - move up to k chars:
 *   right -> left
 *
 * For both cursor operations:
 * return last min(10, left.length)
 * characters from left stack.
 *
 * Example:
 *
 * Initial:
 *
 * left = [l,e,e,t]
 * right = [c,o,d,e]
 *
 * State:
 * leet|code
 *
 * cursorRight(2):
 *
 * Move:
 * c -> left
 * o -> left
 *
 * New state:
 * leetco|de
 *
 * Complexity Analysis:
 *
 * addText(text):
 * @time O(n)
 *
 * deleteText(k):
 * @time O(k)
 *
 * cursorLeft(k):
 * @time O(k)
 *
 * cursorRight(k):
 * @time O(k)
 *
 * Space:
 *
 * @space O(n)
 *
 * where n is total text size.
 *
 * Follow-up:
 *
 * The follow-up asks for:
 * O(k) per operation.
 *
 * This solution satisfies that requirement.
 *
 * Why?
 *
 * Every cursor movement only transfers
 * at most k characters between stacks.
 *
 * Trade-off:
 *
 * Extremely efficient cursor manipulation,
 * but text is distributed across two stacks
 * instead of stored contiguously.
 *
 * Pattern:
 * - Two stacks
 * - Cursor simulation
 * - Text buffer manipulation
 *
 * @date 08/07/2026
 */

/**
 * Text editor implemented using two stacks.
 *
 * Left stack:
 * characters before cursor
 *
 * Right stack:
 * characters after cursor
 */

type UndoOperation =
  | {
      type: "add";
      text: string;
    }
  | {
      type: "delete";
      text: string;
    };

class TextEditor {
  private leftStack: string[];
  private rightStack: string[];
  private undoStack: UndoOperation[];

  constructor() {
    this.leftStack = [];
    this.rightStack = [];
    this.undoStack = [];
  }

  /**
   * Adds text at cursor position.
   *
   * Example:
   * abc|
   *
   * addText("de")
   *
   * abcde|
   */
  addText(text: string): void {
    for (const char of text) {
      this.leftStack.push(char);
    }

    // To undo an insertion, delete the same text.
    this.undoStack.push({
      type: "delete",
      text,
    });
  }

  /**
   * Deletes up to k characters
   * to the left of cursor.
   *
   * Returns actual number deleted.
   */
  deleteText(k: number): number {
    let deleted = 0;
    let deletedText = "";

    while (k > 0 && this.leftStack.length > 0) {
      const char = this.leftStack.pop();

      if (char !== undefined) {
        deletedText = char + deletedText;
        deleted++;
      }

      k--;
    }

    // To undo a deletion, reinsert the removed text.
    if (deletedText.length > 0) {
      this.undoStack.push({
        type: "add",
        text: deletedText,
      });
    }

    return deleted;
  }

  /**
   * Moves cursor left by k positions.
   *
   * Transfers characters:
   * left -> right
   *
   * Returns last 10 characters
   * to the left of cursor.
   */
  cursorLeft(k: number): string {
    while (k > 0 && this.leftStack.length > 0) {
      const char = this.leftStack.pop();

      if (char !== undefined) {
        this.rightStack.push(char);
      }

      k--;
    }

    return this.getLast10LeftCharacters();
  }

  /**
   * Moves cursor right by k positions.
   *
   * Transfers characters:
   * right -> left
   *
   * Returns last 10 characters
   * to the left of cursor.
   */
  cursorRight(k: number): string {
    while (k > 0 && this.rightStack.length > 0) {
      const char = this.rightStack.pop();

      if (char !== undefined) {
        this.leftStack.push(char);
      }

      k--;
    }

    return this.getLast10LeftCharacters();
  }

  /**
   * Undoes the most recent addText()
   * or deleteText() operation.
   */
  undo(): void {
    const operation = this.undoStack.pop();

    if (!operation) {
      return;
    }

    switch (operation.type) {
      case "add":
        for (const char of operation.text) {
          this.leftStack.push(char);
        }
        break;

      case "delete":
        for (let i = 0; i < operation.text.length; i++) {
          if (this.leftStack.length > 0) {
            this.leftStack.pop();
          }
        }
        break;
    }
  }

  /**
   * Returns last up to 10 characters
   * to the left of cursor.
   */
  private getLast10LeftCharacters(): string {
    const start = Math.max(0, this.leftStack.length - 10);

    return this.leftStack.slice(start).join("");
  }

  /**
   * Helper for debugging.
   * Shows the complete document.
   */
  getText(): string {
    return this.leftStack.join("") + [...this.rightStack].reverse().join("");
  }

  /**
   * Helper for debugging.
   */
  print(): void {
    console.log(
      `${this.leftStack.join("")}|${[...this.rightStack].reverse().join("")}`,
    );
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Basic editor operations ===");

  const editor = new TextEditor();

  console.log("Initial state: |");
  console.log();

  editor.addText("leetcode");

  console.log('After addText("leetcode")');
  console.log("Expected state: leetcode|");
  console.log();

  const deleted1 = editor.deleteText(4);

  console.log("deleteText(4)");
  console.log("Deleted:", deleted1);
  console.log("Expected: 4");
  console.log("Expected state: leet|");
  console.log();

  editor.addText("practice");

  console.log('After addText("practice")');
  console.log("Expected state: leetpractice|");
  console.log();

  const right1 = editor.cursorRight(3);

  console.log("cursorRight(3)");
  console.log("Result:", right1);
  console.log('Expected: "etpractice"');
  console.log();

  const left1 = editor.cursorLeft(8);

  console.log("cursorLeft(8)");
  console.log("Result:", left1);
  console.log('Expected: "leet"');
  console.log();

  const deleted2 = editor.deleteText(10);

  console.log("deleteText(10)");
  console.log("Deleted:", deleted2);
  console.log("Expected: 4");
  console.log();

  const left2 = editor.cursorLeft(2);

  console.log("cursorLeft(2)");
  console.log("Result:", left2);
  console.log('Expected: ""');
  console.log();

  const right2 = editor.cursorRight(6);

  console.log("cursorRight(6)");
  console.log("Result:", right2);
  console.log('Expected: "practi"');
  console.log();

  console.log("=== Example 2: Cursor movement boundaries ===");

  const editor2 = new TextEditor();

  editor2.addText("hello");

  console.log("Move far left:");

  const boundaryLeft = editor2.cursorLeft(100);

  console.log("Result:", boundaryLeft);
  console.log('Expected: ""');
  console.log();

  console.log("Move far right:");

  const boundaryRight = editor2.cursorRight(100);

  console.log("Result:", boundaryRight);
  console.log('Expected: "hello"');
  console.log();

  console.log("=== Example 3: Consecutive deletions ===");

  const editor3 = new TextEditor();

  editor3.addText("abcdef");

  console.log("deleteText(2):", editor3.deleteText(2));
  console.log("Expected: 2");

  console.log("deleteText(10):", editor3.deleteText(10));
  console.log("Expected: 4");
  console.log();

  console.log("=== Example 4: Last 10 character constraint ===");

  const editor4 = new TextEditor();

  editor4.addText("abcdefghijklmnop");

  const result4 = editor4.cursorLeft(0);

  console.log("cursorLeft(0)");
  console.log("Result:", result4);
  console.log('Expected: "ghijklmnop"');
  console.log();
}
