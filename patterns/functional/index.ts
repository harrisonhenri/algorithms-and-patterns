/**
 * Functional Programming Patterns - Collection
 *
 * A comprehensive guide to core functional programming patterns with
 * concrete TypeScript implementations.
 */

// Import all patterns
export {
  compose,
  pipe,
  toUpperCase,
  toLowerCase,
  trim,
  replace,
} from "./pointfree/pointfree";
export {
  createCounter,
  memoize,
  createMultiplier,
  createUser,
  partial,
} from "./closure/closure";
export {
  push,
  pop,
  updateAt,
  removeAt,
  set,
  setNested,
  unset,
  update,
} from "./immutability/immutability";
export { curry } from "./currying/curry";
export { compose as pointfreeCompose } from "./composing/compose";

/**
 * Functional Programming Patterns Overview:
 *
 * 1. POINTFREE - Compose functions without mentioning data
 *    Location: ./pointfree/
 *    Files: pointfree.ts (utilities), index.ts (examples)
 *    Use: Declarative function composition, data transformations
 *
 * 2. CLOSURE - Functions that remember outer scope variables
 *    Location: ./closure/
 *    Files: closure.ts (utilities), index.ts (examples)
 *    Use: Encapsulation, factories, memoization, partial application
 *
 * 3. CURRYING - Convert multi-arg functions to single-arg sequences
 *    Location: ./currying/
 *    Files: curry.ts (utilities), index.ts (examples)
 *    Use: Partial application, function composition, reusability
 *
 * 4. COMPOSING - Function composition utilities
 *    Location: ./composing/
 *    Files: compose.ts (utilities), index.ts (examples)
 *    Use: Build complex operations from simple functions
 *
 * 5. IMMUTABILITY - Create new copies instead of modifying data
 *    Location: ./immutability/
 *    Files: immutability.ts (utilities), index.ts (examples)
 *    Use: Predictable state, no race conditions, time-travel debugging
 */
