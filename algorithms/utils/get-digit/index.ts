/**
 * Get digit using some index.
 * @date 21/06/2023 - 00:01:00
 *
 */
export const getDigit = (number: number, index: number) => {
  return Math.floor(Math.abs(number) / Math.pow(10, index)) % 10;
};
