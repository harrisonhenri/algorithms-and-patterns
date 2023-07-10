/**
 * Finds the minimum element index in an array.
 * @date 21/06/2023 - 00:01:00
 *
 *
 */
export const minArrayIndex = (array: number[], startPosition = 0) => {
  let min = startPosition;

  for (
    let currentIndex = startPosition;
    currentIndex < array.length;
    currentIndex++
  ) {
    if (array[currentIndex] < array[min]) {
      min = currentIndex;
    }
  }

  return min;
};
