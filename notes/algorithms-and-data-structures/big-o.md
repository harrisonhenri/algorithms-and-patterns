---
tags: [algorithms, complexity, theory]
title: "Big O cheat sheet"
---
# Big O cheat-sheet

## Common ops

| Category | Operation / Pattern | Example | Time Complexity | Notes |
| --- | --- | --- | --- | --- |
| **Basic Ops** | Assignment | `x = 5` | **O(1)** | Constant time |
|  | Arithmetic | `a + b`, `a * b` | **O(1)** |  |
|  | Comparison | `a < b` | **O(1)** |  |
|  | Function call (non-recursive) | `foo()` | **O(1)** |  |
| **Loops** | Single loop | `for i in N` | **O(N)** |  |
|  | Nested loops | `for i` + `for j` | **O(N²)** |  |
| **Recursion** | Linear recursion | `T(n)=T(n-1)` | **O(N)** | Stack grows linearly |
|  | Divide & conquer | `T(n)=T(n/2)` | **O(log N)** | Binary search |
| **Searching** | Linear search | scan array | **O(N)** |  |
|  | Binary search | sorted array | **O(log N)** |  |
| **Sorting** | Comparison sort (avg) | merge / quick sort | **O(N log N)** |  |
|  | Comparison sort (worst) | quick sort | **O(N²)** | Bad pivot |
| **Hashing** | Hash lookup (avg) | `map.get()` | **O(1)** |  |
|  | Hash lookup (worst) | collisions | **O(N)** |  |
| **Fibonacci** | Naive recursion | `fib(n-1)+fib(n-2)` | **O(2ⁿ)** | Exponential |
|  | DP / memoization | top-down / bottom-up | **O(N)** |  |
|  | Matrix exponentiation | math-based | **O(log N)** |  |
|  | Binet formula | `φⁿ / √5` | **O(log N)** | Fast power |
| **Math** | Fast exponentiation | `pow(x, n)` | **O(log N)** |  |
| **JS Arrays** | Access by index | `arr[i]` | **O(1)** |  |
|  | Push (end) | `arr.push(x)` | **O(1)** *(amortized)* |  |
|  | Pop (end) | `arr.pop()` | **O(1)** |  |
|  | Shift (start) | `arr.shift()` | **O(N)** | Reindexing |
|  | Unshift (start) | `arr.unshift(x)` | **O(N)** | Reindexing |
|  | Insert middle | `arr.splice(i,0,x)` | **O(N)** |  |
|  | Remove middle | `arr.splice(i,1)` | **O(N)** |  |
|  | Slice | `arr.slice()` | **O(N)** | Copy |
|  | Concat | `a.concat(b)` | **O(N + M)** | New array |
|  | Reverse | `arr.reverse()` | **O(N)** |  |
|  | Sort | `arr.sort()` | **O(N log N)** | Comparator matters |
|  | Find | `arr.find(x)` | **O(N)** |  |
|  | Includes | `arr.includes(x)` | **O(N)** |  |
|  | Map | `arr.map(fn)` | **O(N)** |  |
|  | Filter | `arr.filter(fn)` | **O(N)** |  |
|  | Reduce | `arr.reduce(fn)` | **O(N)** |  |
| **JS Strings** | Length | `str.length` | **O(1)** |  |
|  | Access char | `str[i]` | **O(1)** |  |
|  | Concatenation | `a + b` | **O(N + M)** | New string |
|  | Slice / Substring | `str.slice()` | **O(N)** |  |
|  | Replace | `str.replace()` | **O(N)** |  |
|  | Split | `str.split()` | **O(N)** |  |
|  | Includes | `str.includes()` | **O(N)** |  |
