/**
 * Closure pattern - functions that remember variables from outer scope
 * @date 26/05/2026
 */

// Counter factory - creates independent counters via closure
export function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count,
    reset: () => {
      count = start;
    },
  };
}

// Memoizer - cache function results via closure
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Factory function - creates specialized functions with closure
export function createMultiplier(factor: number) {
  return (num: number) => num * factor;
}

// Private state via closure
export function createUser(name: string) {
  let _email = "";

  return {
    getName: () => name,
    setEmail: (email: string) => {
      _email = email;
    },
    getEmail: () => _email,
    getInfo: () => `${name} <${_email}>`,
  };
}

// Partial application via closure
export function partial<T extends (...args: any[]) => any>(
  fn: T,
  ...fixedArgs: any[]
) {
  return ((...args: any[]) => fn(...fixedArgs, ...args)) as T;
}
