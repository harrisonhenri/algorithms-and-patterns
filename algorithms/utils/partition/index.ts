/**
 * Partition utility using **Hoare's Partition Scheme**
 *
 * Divides an array into two partitions around a pivot value.
 * Elements less than pivot move to the left, greater elements to the right.
 *
 * **Hoare's Partition Scheme:**
 * - Two pointers start from opposite ends
 * - Left pointer moves right until finding an element >= pivot
 * - Right pointer moves left until finding an element <= pivot
 * - Elements are swapped when both conditions are met
 * - Pointers converge when left > right
 *
 * **Advantages:**
 * - Fewer swaps than Lomuto's scheme (on average 3x fewer)
 * - Better cache locality
 * - Commonly used in quicksort implementations
 *
 * **Time Complexity:** O(n) - single pass through the array
 * **Space Complexity:** O(1) - in-place partitioning
 *
 * @param array - Array to partition (modified in-place)
 * @param left - Starting index
 * @param right - Ending index
 * @returns Partition boundary index
 *
 * @see https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme
 * @date 21/06/2023 - 00:00:00
 */
export const partition = (array: number[], left: number, right: number) => {
  const pivot = array[Math.floor((right + left) / 2)];

  while (left <= right) {
    while (array[left] < pivot) {
      left++;
    }

    while (array[right] > pivot) {
      right--;
    }

    if (left <= right) {
      [array[left], array[right]] = [array[right], array[left]]; // Swap using destructuring
      left++;
      right--;
    }
  }

  return left;
};
