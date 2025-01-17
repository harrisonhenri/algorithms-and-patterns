/**
 * Lets you save and restore the previous state of an object without revealing the details of its implementation.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

class Originator {
  constructor(private state: string) {
    console.log(`Originator: My initial state is: ${state}`);
  }

  public doSomething(): void {
    console.log("Originator: I'm doing something important.");
    this.state = this.generateRandomString(30);
    console.log(`Originator: and my state has changed to: ${this.state}`);
  }

  private generateRandomString(length: number = 10): string {
    const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return Array.apply(null, { length } as any)
      .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
      .join("");
  }

  public save(): Memento {
    return new ConcreteMemento(this.state);
  }

  public restore(memento: Memento): void {
    this.state = memento.getState();
    console.log(`Originator: My state has changed to: ${this.state}`);
  }
}

interface Memento {
  getState(): string;

  getName(): string;

  getDate(): string;
}

class ConcreteMemento implements Memento {
  private date: string;

  constructor(private state: string) {
    this.date = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  public getState(): string {
    return this.state;
  }

  public getName(): string {
    return `${this.date} / (${this.state.substring(0, 9)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

class Caretaker {
  private mementos: Memento[] = [];

  constructor(private originator: Originator) {}

  public backup(): void {
    console.log("\nCaretaker: Saving Originator's state...");
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (!this.mementos.length) {
      return;
    }
    const memento = this.mementos.pop();

    if (!memento) return;

    console.log(`Caretaker: Restoring state to: ${memento.getName()}`);
    this.originator.restore(memento);
  }

  public showHistory(): void {
    console.log("Caretaker: Here's the list of mementos:");
    for (const memento of this.mementos) {
      console.log(memento.getName());
    }
  }
}

(() => {
  const originator = new Originator("Super-duper-super-puper-super.");
  const caretaker = new Caretaker(originator);

  caretaker.backup();
  originator.doSomething();

  caretaker.backup();
  originator.doSomething();

  caretaker.backup();
  originator.doSomething();
  caretaker.backup();

  console.log("");
  caretaker.showHistory();

  console.log("\nClient: Now, let's rollback!\n");
  caretaker.undo();

  console.log("\nClient: Once more!\n");
  caretaker.undo();

  console.log("\nClient: Once more!\n");
  caretaker.undo();

  console.log("\nClient: Finally my original state!\n");
  caretaker.undo();
})();
