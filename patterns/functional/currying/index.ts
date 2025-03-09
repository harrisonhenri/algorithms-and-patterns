/**
 * Decrease the number of arguments of a function using closure by returning a function that takes the remaining arguments.
 *
 * @date 23/02/2025 - 00:00:00
 *
 */

import { curry } from "./curry";

const addCurried = (x: number) => (y: number) => x + y;
const addTen = addCurried(10);
const addFive = curry((x: number, y: number) => x + y)(5);

(() => {
  console.log(addTen(2));
  console.log(addFive(2));
})();
