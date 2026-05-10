---
tags: [javascript, theory]
title: "JavaScript scopes"
---
# Javascript scopes

Scopes determines how and where variables are accessible.

## Lexical scope

A function can access variables from its outer scope because the important is where the function is defined rather than where it's called.:

```jsx
function outerFunction() {
  let outerVar = "I'm from outer scope";

  function innerFunction() {
    console.log(outerVar); // ✅ Accessible
  }

  innerFunction();
}

outerFunction();
```

This also works because there's a **scope chaining**: when a variable isn’t found in the current scope, JavaScript looks up the chain until it finds it or reaches the global scope.
