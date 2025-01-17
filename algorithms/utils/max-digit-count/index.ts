import { digitCount } from "../digit-count";

/**
 * Given an array, finds the number of digits of the largest number.
 * @date 21/06/2023 - 00:00:00
 *
 */
export const maxDigitCount = (array: number[]) => {
  let maxDigits = 0;

  for (let i = 0; i < array.length; i++) {
    maxDigits = Math.max(maxDigits, digitCount(array[i]));
  }

  return maxDigits;
};
