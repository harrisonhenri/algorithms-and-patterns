import { swap } from "../swap";

/**
 * Return the pivot in a array partition.
 * @date 21/06/2023 - 00:01:00
 *
 */
export const partition = (array: number[], p: number, r: number) => {
  const pivot = r;

  let dividerPosition = p;

  for (let i = p; i < r; i++) {
    if (array[i] < array[pivot]) {
      swap(array, i, dividerPosition);
      dividerPosition++;
    }
  }

  swap(array, dividerPosition, pivot);

  return dividerPosition;
};
