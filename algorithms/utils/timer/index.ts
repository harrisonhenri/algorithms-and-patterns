/**
 * Prints the time execution of the function.
 * @date 21/06/2023 - 00:00:00
 *
 */
export const timer = (fn: Function) => {
  const startAt = new Date();

  const result = fn();

  const endAt = new Date();

  const executionTimeInSeconds = endAt.getTime() - startAt.getTime();

  console.log(`Executed in ${executionTimeInSeconds} milliseconds.`);

  return result;
};
