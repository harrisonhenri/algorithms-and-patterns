/**
 * Command is a design pattern that converts requests or simple operations into objects.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

interface Command {
  execute(): void;
}

class ConcreteCommand implements Command {
  private payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }

  public execute(): void {
    console.log(
      `ConcreteCommand: See, I can do things like printing (${this.payload})`
    );
  }
}

class Invoker {
  constructor(private command: Command) {}

  /**
   * The Invoker does not depend on concrete command or receiver classes. The
   * Invoker passes a request to a receiver indirectly, by executing a
   * command.
   */
  public doSomethingImportant(): void {
    console.log("Invoker: Owwwwww");
    if (this.isCommand(this.command)) {
      this.command.execute();
    }
  }

  private isCommand(object: Command): object is Command {
    return typeof object.execute === "function";
  }
}

(() => {
  const invoker = new Invoker(new ConcreteCommand("Say Hi!"));
  invoker.doSomethingImportant();
})();
