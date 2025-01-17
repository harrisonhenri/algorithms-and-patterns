/**
 * Allows the system to pass the request along the chain of potential handlers until one of them handles the request.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

interface Handler {
  handle(fruit: string): void;
}

abstract class AbstractHandler implements Handler {
  constructor(protected nextHandler?: Handler) {}

  public handle(fruit: string): string | void {
    if (this.nextHandler) {
      this.nextHandler.handle(fruit);
    }
  }
}

class MonkeyHandler extends AbstractHandler {
  constructor(nextHandler?: Handler) {
    super(nextHandler);
  }

  public handle(fruit: string): string | void {
    if (fruit === "Banana") {
      return `Monkey: I'll eat the ${fruit}.`;
    }
    console.log(`Monkey: I won't eat the ${fruit}.`);

    if (this.nextHandler) {
      this.nextHandler.handle(fruit);
    }
  }
}

class SquirrelHandler extends AbstractHandler {
  constructor(nextHandler?: Handler) {
    super(nextHandler);
  }

  public handle(fruit: string): string | void {
    if (fruit === "Nut") {
      return `Squirrel: I'll eat the ${fruit}.`;
    }
    console.log(`Squirrel: I won't eat the ${fruit}.`);

    if (this.nextHandler) {
      return this.nextHandler.handle(fruit);
    }
  }
}

(() => {
  const monkey = new MonkeyHandler();
  const squirrel = new SquirrelHandler(monkey);

  console.log(squirrel.handle("Banana"));
})();
