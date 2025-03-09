/**
 * Decrease the number of arguments of a function using closure by returning a function that takes the remaining arguments.
 *
 * @date 23/02/2025 - 00:00:00
 *
 */

import { compose } from "./compose";

const toUpperCase = (x: string) => x.toUpperCase();
const addy = (x: string) => `${x}y`;
const shout = compose(addy, toUpperCase);

(() => {
  console.log(shout("send in the clowns"));
})();
