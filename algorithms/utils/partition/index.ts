/**
 * Return the pivot in a array partition.
 * @date 21/06/2023 - 00:00:00
 *
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
