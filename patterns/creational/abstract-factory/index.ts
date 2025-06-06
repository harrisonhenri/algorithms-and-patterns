/**
 * Customize an object construction of a determinated class hiding its type using an interface.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

interface AbstractProductA {
  usefulFunctionA(): string;
}

interface AbstractProductB {
  usefulFunctionB(): string;

  anotherUsefulFunctionB(collaborator: AbstractProductA): string;
}

interface AbstractFactory {
  createProductA(): AbstractProductA;

  createProductB(): AbstractProductB;
}

class ConcreteProductA1 implements AbstractProductA {
  public usefulFunctionA(): string {
    return "The result of the product A1.";
  }
}

class ConcreteProductA2 implements AbstractProductA {
  public usefulFunctionA(): string {
    return "The result of the product A2.";
  }
}

class ConcreteProductB1 implements AbstractProductB {
  public usefulFunctionB(): string {
    return "The result of the product B1.";
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA();
    return `The result of the B1 collaborating with the (${result})`;
  }
}

class ConcreteProductB2 implements AbstractProductB {
  public usefulFunctionB(): string {
    return "The result of the product B2.";
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA();
    return `The result of the B2 collaborating with the (${result})`;
  }
}

class ConcreteFactory1 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA1();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB1();
  }
}

class ConcreteFactory2 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA2();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB2();
  }
}

const factory1 = new ConcreteFactory1();
const productA1 = factory1.createProductA();
const productB1 = factory1.createProductB();
console.log(productB1.usefulFunctionB());
console.log(productB1.anotherUsefulFunctionB(productA1));
