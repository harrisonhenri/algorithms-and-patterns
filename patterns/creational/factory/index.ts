/**
 * Customize an object construction of a determinated class hiding its type using an interface.
 *
 * @date 21/06/2023 - 00:01:00
 *
 */

interface Product {
  operation(): string;
}

abstract class Creator {
  public abstract factoryMethod(): Product;

  public someOperation(): string {
    // Call the factory method to create a Product object.
    const product = this.factoryMethod();
    // Now, use the product.
    return `Creator: The same creator's code has just worked with ${product.operation()}`;
  }
}

class ConcreteProduct1 implements Product {
  public operation(): string {
    return "{Result of the ConcreteProduct1}";
  }
}

class ConcreteProduct2 implements Product {
  public operation(): string {
    return "{Result of the ConcreteProduct2}";
  }
}

class ConcreteCreator1 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}

class ConcreteCreator2 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct2();
  }
}

(() => {
  console.log("App: Launched with the ConcreteCreator1.");
  const creator1 = new ConcreteCreator1();
  console.log(creator1.someOperation());

  console.log("App: Launched with the ConcreteCreator2.");
  const creator2 = new ConcreteCreator2();
  console.log(creator2.someOperation());
})();
