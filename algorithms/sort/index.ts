/**
 * ## Fundamentals of Sorting
 *
 * ### Core Concept
 * Sorting is about rearranging elements in a collection based on a comparison method.
 * The key insight: **different comparison methods lead to different valid sorts**.
 *
 * Example: Given ["hello", "world", "we", "are", "learning", "sorting"]
 * - By string length: ["we", "are", "hello", "world", "sorting", "learning"]
 * - By vowel count: ["we", "world", "are", "hello", "sorting", "learning"]
 *
 * ### Ordering Relation (The Contract)
 * A valid ordering relation must satisfy:
 * 1. **Law of Trichotomy:** For any two elements a, b: exactly one is true: a < b, a = b, or a > b
 * 2. **Law of Transitivity:** If a < b AND b < c, then a < c
 *
 * ### Formal Definition
 * A sort rearranges elements into non-decreasing order based on the ordering relation.
 *
 * ### Important Concepts
 *
 * **Inversions:** Pairs of elements out of order relative to the ordering relation.
 * - The more inversions, the more "out of sort" the list is
 * - A fully sorted list has zero inversions
 * - Alternative definition: Sorting = reducing inversions to 0
 *
 * Example: ["are", "we", "sorting", "hello", "world", "learning"]
 * With string length ordering, inversions include:
 * - ("are", "we"): both length 2-3, "are" at 0 is length 3 (not < 2)
 * - ("sorting", "hello"): length 7 > 5
 * - ("sorting", "world"): length 7 > 5
 *
 * **Stability:** A stable sort preserves the relative order of equal elements.
 * - Stable: ["we", "are", "hello", "world", "sorting", "learning"]
 *   (hello before world in original, stays that way)
 * - Unstable: ["we", "are", "world", "hello", "sorting", "learning"]
 *   (world and hello swapped relative order)
 *
 * Stable sorts matter when sorting objects with multiple attributes.
 * If you sort by last name then by first name, stability ensures first-name order is preserved.
 *
 * ### Stability by Algorithm
 * - **Stable:** Insertion Sort, Merge Sort, Counting Sort, Radix Sort
 * - **Unstable:** Selection Sort, Heap Sort, Quick Sort (unless modified)
 *
 * ### Sorting Algorithm Comparison
 *
 * | Algorithm | Time (Best) | Time (Avg) | Time (Worst) | Space | Stable |
 * |-----------|------------|-----------|-------------|-------|--------|
 * | Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
 * | Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
 * | Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
 * | Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
 * | Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
 * | Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
 * | Counting Sort | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes |
 * | Radix Sort | O(nk) | O(nk) | O(nk) | O(n + k) | Yes |
 *
 * ### Why QuickSort is Fastest for In-Memory Sorting
 *
 * Despite O(n log n) average complexity matching MergeSort and HeapSort, QuickSort is
 * typically fastest in practice due to:
 *
 * **1. Cache Efficiency:** Partitioning accesses contiguous memory, reducing cache misses.
 * MergeSort's merge step requires O(n) extra space and frequent cache-miss-inducing accesses.
 *
 * **2. In-Place:** QuickSort sorts within the original array. MergeSort's O(n) extra space
 * increases memory bandwidth and cache misses.
 *
 * **3. Lower Constants:** Simpler operations (comparisons and swaps) with typically lower
 * overhead than MergeSort.
 *
 * ### External Sorting
 *
 * **External sorting** handles data sets exceeding RAM on slower storage (disks/SSDs).
 * MergeSort dominates here because it requires **sequential access** (efficient for disk I/O),
 * while QuickSort's random access causes excessive disk seeks. MergeSort's merge phase also
 * optimizes disk reads/writes, making it ideal for staged sorting: load memory-sized chunks,
 * sort in-memory, merge with minimal I/O.
 *
 * **Summary:** In-memory = QuickSort (cache + in-place). Disk = MergeSort (sequential access + optimized I/O).
 *
 * ### Choosing a Sorting Algorithm
 *
 * **Insertion Sort:** Small arrays, nearly sorted data, simple implementation
 *
 * **Merge Sort:** Need O(n log n) guaranteed, stability matters, external/disk sorting
 *
 * **Quick Sort:** Average-case performance matters, memory limited, in-place preferred, in-memory data
 *
 * **Heap Sort:** Need O(n log n) guaranteed, O(1) space, stability not needed
 *
 * **Counting/Radix Sort:** Integers/strings with limited range, non-comparison needed
 *
 * @date 28/01/2026
 */
