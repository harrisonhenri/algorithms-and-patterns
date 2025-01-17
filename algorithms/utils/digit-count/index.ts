/**
 * Returns the number of the digits given a number.
 * @date 21/06/2023 - 00:00:00
 *
 */
export const digitCount = (number: number) => {
  if (number === 0) return 1;
  return Math.floor(Math.log10(Math.abs(number))) + 1;
};
