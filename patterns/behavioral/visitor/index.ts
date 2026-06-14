/**
 * This pattern is used to add functionalities without change the classes. It also
 * helps separate algorithms from the objects on which they operate.
 * The visitor pattern is a way of separating an algorithm from an object
 * structure on which it operates.
 * A practical result of this separation is the ability to add new operations
 * to existing object structures without modifying those structures.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */
interface Visitor {
  visit(v: Vehicle): void;
}

abstract class Vehicle {
  constructor(private code: string) {}

  public getCode(): string {
    return this.code;
  }
  abstract accept(v: Visitor): void;
}

class Car extends Vehicle {
  constructor(code: string) {
    super(code);
  }

  override accept(v: Visitor) {
    v.visit(this);
  }
}

class Bus extends Vehicle {
  constructor(code: string) {
    super(code);
  }

  override accept(v: Visitor) {
    v.visit(this);
  }
}

class PrintVisitor implements Visitor {
  public visit(v: Vehicle): void {
    if (v instanceof Car) {
      console.log("Car: " + v.getCode());
    }

    if (v instanceof Bus) {
      console.log("Bus: " + v.getCode());
    }
  }
}

const list = [new Car("C1"), new Bus("B1")];
const visitor = new PrintVisitor();

for (const vehicle of list) {
  vehicle.accept(visitor);
}
