type CurriedFunction<T extends any[], R> = T extends [
  infer First,
  ...infer Rest
]
  ? (arg: First) => CurriedFunction<Rest, R>
  : R;

export function curry<T extends any[], R>(
  fn: (...args: T) => R
): CurriedFunction<T, R> {
  const arity = fn.length;

  function $curry(...args: any[]): any {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn(...(args as T));
  }

  return $curry as CurriedFunction<T, R>;
}
