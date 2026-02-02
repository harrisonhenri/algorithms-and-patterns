/**
 * Prints the time execution of the function.
 * @date 21/06/2023 - 00:00:00
 *
 */

export const timer = (fn: Function): { result: any; time: number } => {
  const startAt = new Date();

  const result = fn();

  const endAt = new Date();

  const time = endAt.getTime() - startAt.getTime();

  return { result, time };
};
