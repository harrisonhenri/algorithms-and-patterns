/**
 * Immutability utilities - create new copies instead of modifying data
 * @date 26/05/2026
 */

// Array immutability helpers
export const push =
  <T>(item: T) =>
  (arr: T[]): T[] => [...arr, item];
export const pop = <T>(arr: T[]): [T[], T | undefined] => {
  const copy = [...arr];
  const popped = copy.pop();
  return [copy, popped];
};

export const updateAt =
  <T>(index: number, value: T) =>
  (arr: T[]): T[] => [...arr.slice(0, index), value, ...arr.slice(index + 1)];

export const removeAt =
  <T>(index: number) =>
  (arr: T[]): T[] => [...arr.slice(0, index), ...arr.slice(index + 1)];

// Object immutability helpers
export const set =
  <T extends Record<string, any>>(key: keyof T, value: any) =>
  (obj: T): T => ({
    ...obj,
    [key]: value,
  });

export const setNested =
  <T extends Record<string, any>>(path: string[], value: any) =>
  (obj: T): T => {
    if (path.length === 0) return obj;
    if (path.length === 1) {
      return { ...obj, [path[0]]: value };
    }

    const [first, ...rest] = path;
    return {
      ...obj,
      [first]: setNested(rest, value)(obj[first] || {}),
    };
  };

export const unset =
  <T extends Record<string, any>>(key: keyof T) =>
  (obj: T): Partial<T> => {
    const { [key]: _, ...rest } = obj;
    return rest;
  };

// Batch updates
export const update =
  <T extends Record<string, any>>(updates: Partial<T>) =>
  (obj: T): T => ({
    ...obj,
    ...updates,
  });
