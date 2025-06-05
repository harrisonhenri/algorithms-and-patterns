/**
 * Allows adding new behaviors to objects dynamically by placing them inside special wrapper objects, called decorators.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost() {
    return 5;
  }
  description() {
    return "Simple Coffee";
  }
}

class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  cost() {
    return this.coffee.cost();
  }

  description() {
    return this.coffee.description();
  }
}

class MilkDecorator extends CoffeeDecorator {
  cost() {
    return super.cost() + 1.5;
  }

  description() {
    return super.description() + ", Milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return super.cost() + 0.5;
  }

  description() {
    return super.description() + ", Sugar";
  }
}

let coffee: Coffee = new SimpleCoffee();
console.log(coffee.description(), coffee.cost());
coffee = new MilkDecorator(coffee);
console.log(coffee.description(), coffee.cost());

coffee = new SugarDecorator(coffee);
console.log(coffee.description(), coffee.cost());
