/**
 * Swap values between indexA and indexB.
 * @date 21/06/2023 - 00:01:00
 *
 */
export const swap = (array: number[], indexA: number, indexB: number) => {
  const temp = array[indexA];

  array[indexA] = array[indexB];
  array[indexB] = temp;
};
