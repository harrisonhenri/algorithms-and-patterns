# algorithms-and-patterns

## About this Project

_"The objective of this project is to exercise some design patterns and algorithm principles"._

## Why?

This project is part of my personal portfolio, so, I'll be happy if you could provide me any feedback about the project, code, structure or anything that you can report that could make me a better developer!

Email-me: harrisonhenrisn@gmail.com

Connect with me at [LinkedIn](https://linkedin.com/in/harrison-henri-dos-santos-nascimento).

Also, you can use this Project as you wish, be for study, be for make improvements or earn money with it!

It's free!

## Install

Clone the repo using

```
$ git clone https://github.com/harrisonhenri/ds_twitter_elt.git
```

```
$ cd algorithms-and-patterns && npm i
```

## Some theoretical notes

### Heap vs Tree vs Graph

We might prefer to use Heaps when we need:

- Priority queues
- Heap sort
- Efficiently finding the maximum or minimum element (O(1) op)

We might prefer to use [Tree](https://chatgpt.com/share/678a91d8-c6b0-8006-a076-e89325adccd3) when we need:

- Hierarchical data
- Searching and sorting

We might prefer to use Graph when we need:

- To model structures like social networks
- Model shorthest path algorithms

### Linked lists vs Array

We might prefer to use Linked lists when we need:

- Dynamic Size
- Frequent Insertions/Deletions (O(1) op)
- Memory efficiency
- Create: Stacks, Queues, Dubly Linked Lists, Hash Tables, Graphs, Matrices and Polynomials

We might prefer to use arrays when we need:

- Fast access by index
- Fixed size

### Association vs Aggregation vs Composition

- https://stackoverflow.com/questions/885937/what-is-the-difference-between-association-aggregation-and-composition/34069760#34069760

### Adapter vs Bridge vs Proxy vs Decorator

These patterns have very similar structures because they are based on composition.

- The **Bridge** pattern usually is defined up-front to allow parts of the software been developed independently
- The interfaces in **Decorator** are usually the same. **Decorator** also enables recursive composition (used to model hierarchical structures, etc) what is not possible with **Adapter**
- The **Proxy** pattern is used to control or add functionally to an object

### State vs Strategy vs Template Method

- Here one of the main differences is the focus. State focus in state transitions, fsms etc., while Strategy is about choosing algorithms dynamically.
- The template method is based on inheritance (so, static) while strategy is based on composition at object level (switch behaviors dinamically at runtime).

### Command vs Observer

- Command establishes unidirectional connections between senders and receivers
- Observer lets receivers dynamically subscribe to and unsubscribe from receiving requests

### Proxy vs Facade

- Facade is really similar to Proxy, but Proxy has the same interface as its service object, which makes them interchangeable

## Contributing

You can send how many PR's do you want, I'll be glad to analyse and accept them! I am also avaliable if you have any question about the project :).

Email-me: harrisonhenrisn@gmail.com

Connect with me at [LinkedIn](https://linkedin.com/in/harrison-henri-dos-santos-nascimento-a6ba33112).

Thank you!
