/**
 * Finds the maximum element index in an array.
 * @date 21/06/2023 - 00:00:00
 *
 */
export const maxArrayIndex = (array: number[], startPosition = 0) => {
  let max = startPosition;

  for (
    let currentIndex = startPosition;
    currentIndex < array.length;
    currentIndex++
  ) {
    if (array[currentIndex] > array[max]) {
      max = currentIndex;
    }
  }

  return max;
};
