/**
 * Pointfree utilities - compose functions without explicitly mentioning data
 * @date 26/05/2026
 */

export const compose = <T>(...fns: Array<(arg: T) => T>): ((arg: T) => T) => {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
};

export const pipe = <T>(...fns: Array<(arg: T) => T>): ((arg: T) => T) => {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
};

// String utilities for pointfree composition
export const toUpperCase = (str: string): string => str.toUpperCase();
export const toLowerCase = (str: string): string => str.toLowerCase();
export const trim = (str: string): string => str.trim();
export const replace =
  (pattern: RegExp, replacement: string) =>
  (str: string): string =>
    str.replace(pattern, replacement);

// Array utilities for pointfree composition
export const map =
  <T, U>(fn: (x: T) => U) =>
  (arr: T[]): U[] =>
    arr.map(fn);
export const filter =
  <T>(predicate: (x: T) => boolean) =>
  (arr: T[]): T[] =>
    arr.filter(predicate);
export const reverse = <T>(arr: T[]): T[] => [...arr].reverse();
export const sort =
  <T>(compareFn?: (a: T, b: T) => number) =>
  (arr: T[]): T[] =>
    [...arr].sort(compareFn);
