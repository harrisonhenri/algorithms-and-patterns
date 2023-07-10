/**
 * Divides business logic or huge class into separate class hierarchies that can be developed independently.
 *
 * @date 21/06/2023 - 00:01:00
 *
 */

interface Implementation {
  operationImplementation(): string;
}

class Abstraction {
  protected implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `Abstraction: Base operation with:\n${result}`;
  }
}

class ExtendedAbstraction extends Abstraction {
  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `ExtendedAbstraction: Extended operation with:\n${result}`;
  }
}

class ConcreteImplementationA implements Implementation {
  public operationImplementation(): string {
    return "ConcreteImplementationA: Here's the result on the platform A.";
  }
}

(() => {
  let implementation = new ConcreteImplementationA();
  let abstraction = new Abstraction(implementation);
  console.log(abstraction.operation());
})();
