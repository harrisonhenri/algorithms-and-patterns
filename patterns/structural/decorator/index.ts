/**
 * Allows adding new behaviors to objects dynamically by placing them inside special wrapper objects, called decorators.
 *
 * @date 21/06/2023 - 00:01:00
 *
 */

interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  public operation(): string {
    return "ConcreteComponent";
  }
}

class Decorator implements Component {
  constructor(protected component: Component) {}

  public operation(): string {
    return this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  public operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends Decorator {
  public operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}

(() => {
  const simple = new ConcreteComponent();
  console.log("Client: I've got a simple component:");
  console.log(simple.operation());

  const decorator1 = new ConcreteDecoratorA(simple);
  const decorator2 = new ConcreteDecoratorB(decorator1);
  console.log("Client: Now I've got a decorated component:");
  console.log(decorator2.operation());
})();
