---
tags: [java, memory, theory]
title: "Heap, stack, call stack"
---
# Heap, Stack and Call stack

```java
class Person {
    String name;

    Person(String name) {
        this.name = name;
    }
}

public class MemoryExample {
    public static void main(String[] args) {
        int a = 10;  // Primitives are stored in Stack
        Person p = new Person("Alice");  // Object stored in Heap (heap can also be used to store data with unknown or variable data size), reference in Stack
        greet(p);
    }

    static void greet(Person person) {
        String message = "Hello, " + person.name;  
        System.out.println(message);
    }
}
```
